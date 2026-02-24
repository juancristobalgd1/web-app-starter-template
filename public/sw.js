/**
 * Service Worker – Web App Starter Template
 *
 * Estrategias de caché:
 *  · Assets estáticos (JS/CSS/imágenes/fonts) → Cache-first
 *  · Páginas HTML (navegación)                → Network-first + fallback offline
 *  · API requests                             → Network-first + fallback offline
 *  · Default                                  → Stale-while-revalidate
 *
 * Background sync: procesa la cola de IndexedDB cuando hay conexión.
 * Push notifications: handler básico con soporte Android/iOS.
 */

const APP_VERSION = "v1.0.0";
const STATIC_CACHE = `app-static-${APP_VERSION}`;
const DYNAMIC_CACHE = `app-dynamic-${APP_VERSION}`;
const API_CACHE = `app-api-${APP_VERSION}`;

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/offline.html",
  "/icons/icon.svg",
];

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const isStaticAsset = (url) =>
  url.pathname.match(/\.(js|css|woff2?|ttf|otf|svg|png|jpg|jpeg|gif|webp|avif|ico)$/) ||
  url.pathname.startsWith("/_next/static/");

const isApiRequest = (url) => url.pathname.startsWith("/api/");
const isNavigationRequest = (req) => req.mode === "navigate";

/* ─── Install ─────────────────────────────────────────────────────────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((c) => c.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[SW] Install error:", err))
  );
});

/* ─── Activate ────────────────────────────────────────────────────────── */
self.addEventListener("activate", (event) => {
  const VALID = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !VALID.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* ─── Fetch ───────────────────────────────────────────────────────────── */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }
  if (isApiRequest(url)) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }
  if (isNavigationRequest(event.request)) {
    event.respondWith(handleNavigation(event.request));
    return;
  }
  event.respondWith(staleWhileRevalidate(event.request, DYNAMIC_CACHE));
});

/* ─── Estrategias ─────────────────────────────────────────────────────── */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (isApiRequest(new URL(request.url))) {
      return new Response(
        JSON.stringify({ error: "offline", message: "Sin conexión disponible." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }
    throw new Error("Offline and no cache available");
  }
}

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline: try cached version of this exact URL
    const cached = await caches.match(request);
    if (cached) return cached;

    // Try the root page cache as fallback for SPA-like navigation
    const rootCached = await caches.match("/");
    if (rootCached) return rootCached;

    // Last resort: static offline page
    const offlinePage = await caches.match("/offline.html");
    if (offlinePage) return offlinePage;

    return new Response(
      "<html><body><h1>Sin conexión</h1><p>No hay contenido en caché disponible.</p></body></html>",
      { status: 503, headers: { "Content-Type": "text/html" } }
    );
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then((r) => {
    if (r.ok) cache.put(request, r.clone());
    return r;
  }).catch(() => null);
  return cached ?? fetchPromise;
}

/* ─── Background Sync ─────────────────────────────────────────────────── */
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-pending-ops") {
    event.waitUntil(syncPendingOps());
  }
});

async function syncPendingOps() {
  try {
    const db = await openDB();
    const tx = db.transaction("pendingOps", "readwrite");
    const ops = await getAllFromStore(tx.objectStore("pendingOps"));
    let synced = 0;

    for (const op of ops) {
      try {
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(op),
        });
        if (res.ok) {
          const del = db.transaction("pendingOps", "readwrite");
          del.objectStore("pendingOps").delete(op.id);
          synced++;
        }
      } catch { /* retry later */ }
    }

    await notifyClients("SYNC_COMPLETE", { count: synced, success: true });
  } catch (err) {
    await notifyClients("SYNC_COMPLETE", { count: 0, success: false, error: String(err) });
  }
}

/* ─── Push Notifications ──────────────────────────────────────────────── */
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { data = { title: "Mi App", body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(data.title || "Mi App", {
      body: data.body || "Nueva notificación",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      tag: data.tag || "app-notification",
      data: { url: data.url || "/" },
      requireInteraction: false,
    }).catch(console.error)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) { if (c.url === url && "focus" in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

/* ─── Messages ────────────────────────────────────────────────────────── */
self.addEventListener("message", (event) => {
  if (event.data?.type === "SYNC_NOW") syncPendingOps().then((r) => event.source?.postMessage({ type: "SYNC_COMPLETE", ...r }));
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

/* ─── IndexedDB Helpers ───────────────────────────────────────────────── */
function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open("web-app-starter-db", 1);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
function getAllFromStore(store) {
  return new Promise((res, rej) => {
    const req = store.getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
async function notifyClients(type, data) {
  const all = await self.clients.matchAll({ includeUncontrolled: true });
  all.forEach((c) => c.postMessage({ type, ...data }));
}
