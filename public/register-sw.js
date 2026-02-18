/**
 * register-sw.js – Registro del Service Worker
 * Cargado via <script defer> en el root layout.
 */
(function () {
  if (!("serviceWorker" in navigator)) return;

  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(window.location.hostname)
  );

  window.addEventListener("load", () => {
    isLocalhost ? checkValidSW("/sw.js") : registerSW("/sw.js");

    // Mensajes del SW
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "SYNC_COMPLETE") {
        document.dispatchEvent(new CustomEvent("backgroundSyncComplete", { detail: event.data }));
      }
    });
  });

  window.addEventListener("online",  () => handleConnection(true));
  window.addEventListener("offline", () => handleConnection(false));

  function handleConnection(online) {
    document.dispatchEvent(new CustomEvent("connectionChange", { detail: { online } }));
    if (online) registerBackgroundSync();
  }

  function registerBackgroundSync() {
    navigator.serviceWorker.ready
      .then((reg) => {
        if ("sync" in reg) return reg.sync.register("sync-pending-ops");
      })
      .catch(() => {});
  }

  function registerSW(url) {
    navigator.serviceWorker.register(url)
      .then((reg) => {
        reg.update().catch(() => {});
        setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);

        reg.onupdatefound = () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.onstatechange = () => {
            if (sw.state === "installed") {
              if (navigator.serviceWorker.controller) {
                document.dispatchEvent(new CustomEvent("appUpdateAvailable"));
              } else {
                document.dispatchEvent(new CustomEvent("appReadyOffline"));
              }
            }
          };
        };
      })
      .catch((err) => console.error("[SW] Registration failed:", err));
  }

  function checkValidSW(url) {
    fetch(url, { headers: { "Service-Worker": "script" } })
      .then((r) => {
        const ct = r.headers.get("content-type");
        if (r.status === 404 || (ct && !ct.includes("javascript"))) {
          navigator.serviceWorker.ready.then((reg) => reg.unregister()).then(() => window.location.reload());
        } else {
          registerSW(url);
        }
      })
      .catch(() => console.log("[SW] Offline mode."));
  }

  // Helper para desarrollo
  window.__unregisterSW = () =>
    navigator.serviceWorker.ready.then((r) => r.unregister()).catch(console.error);
})();
