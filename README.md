# Web App Starter Template

> **Next.js 15 · PWA · Offline-first · Mobile-first**

Plantilla de aplicación web lista para producción con soporte PWA completo, navegación responsive (sidebar + bottom nav), sistema de diseño glass morphism, y arquitectura offline-first con IndexedDB.

---

## 🚀 Inicio Rápido

```bash
# 1. Clona el repositorio
git clone <tu-repositorio>
cd web-app-starter-template

# 2. Instala dependencias
pnpm install

# 3. Configura las variables de entorno
cp .env.example .env.local
# Edita .env.local con tus valores

# 4. Inicia el servidor de desarrollo
pnpm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📦 Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | Next.js 15 (App Router + Turbopack) |
| **UI** | React 19 + Tailwind CSS 4 |
| **State** | Zustand + React Context |
| **Offline DB** | Dexie (IndexedDB) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Theming** | next-themes (light/dark) |
| **Components** | Radix UI + class-variance-authority |
| **PWA** | Service Worker + Web App Manifest |
| **Tipado** | TypeScript 5 (strict mode) |

---

## 🏗️ Arquitectura del Proyecto

```
├── app/
│   ├── (auth)/auth/         # Rutas de autenticación (login, registro)
│   ├── (dashboard)/         # Rutas protegidas
│   │   ├── panel/           # Dashboard principal
│   │   ├── lists/           # Gestión de listas
│   │   ├── documents/       # Gestión de documentos
│   │   └── settings/        # Configuración
│   ├── globals.css          # Design tokens + CSS global
│   ├── layout.tsx           # Root layout (metadata, PWA)
│   └── client.tsx           # Providers (Theme, Auth, Splash)
├── components/
│   ├── ui/                  # Primitivos reutilizables (Button, Input, etc.)
│   ├── shared/              # Componentes compartidos (Header, Sidebar, etc.)
│   ├── features/            # Componentes por feature (auth/)
│   └── providers/           # Context providers
├── hooks/
│   ├── pwa/                 # Hooks PWA (geolocation, contacts, haptics, etc.)
│   └── *.ts                 # Hooks globales (i18n, auth, media-query)
├── lib/
│   ├── db.ts                # IndexedDB con Dexie + cola de sync
│   └── utils.ts             # Utilidades (cn, formatDate, etc.)
├── types/
│   ├── navigation.ts        # Tipos de navegación centralizados
│   └── notifications.ts     # Tipos de notificaciones
└── public/
    ├── sw.js                # Service Worker
    ├── manifest.json        # Web App Manifest
    └── offline.html         # Fallback offline
```

---

## 🎨 Personalización

### Colores y Tema

Los colores se definen como CSS custom properties en `app/globals.css` usando **OKLCH**:

```css
:root {
  --primary: oklch(0.63 0.2 29);     /* Tu color principal */
  --background: oklch(1 0 0);
  --foreground: oklch(0.28 0.04 254);
  /* ... */
}

.dark {
  --primary: oklch(0.74 0.15 12);
  --background: #1f1f1f;
  /* ... */
}
```

### Nombre de la App

Busca y reemplaza `"Mi App"` en estos archivos:
- `app/layout.tsx` (metadata)
- `public/manifest.json`
- `components/shared/splash-screen.tsx`

### Autenticación

El `AuthProvider` en `components/providers/auth-provider.tsx` es un **stub**. Reemplaza la lógica interna con tu proveedor real:

```typescript
// Supabase, Firebase, NextAuth, Clerk, etc.
const signIn = async (email, password) => {
  // TODO: Tu lógica de autenticación aquí
};
```

### Rutas y Navegación

Las pestañas de navegación se configuran en `types/navigation.ts`:

```typescript
export type Tab = "panel" | "lists" | "documents" | "settings";
```

Para añadir/quitar pestañas, edita también:
- `components/shared/app-sidebar.tsx` — Sidebar desktop
- `components/shared/bottom-nav.tsx` — Nav mobile

---

## 📱 Funcionalidades PWA

La plantilla incluye **17+ hooks PWA** listos para usar:

| Hook | Descripción |
|------|-------------|
| `usePWAInstall` | Prompt de instalación PWA |
| `useOnlineStatus` | Detecta conexión |
| `useGeolocation` | Acceso a GPS |
| `useContacts` | Acceso a contactos |
| `useBarcodeScanner` | Escáner de códigos |
| `useBiometrics` | Auth biométrica |
| `useHaptics` | Feedback háptico |
| `useShare` | API de compartir |
| `useWakeLock` | Mantener pantalla encendida |
| `useOrientation` | Orientación del dispositivo |
| `useNetworkSpeed` | Velocidad de red |
| `useMediaSession` | Controles multimedia |
| `useAppBadge` | Badge del icono |
| `useBackgroundSync` | Sync en segundo plano |
| `useLocalNotifications` | Notificaciones locales |

Importa desde el barrel export:

```typescript
import { usePWAInstall, useOnlineStatus } from "@/hooks/pwa";
```

---

## ⚡ Service Worker

El service worker (`public/sw.js`) implementa múltiples estrategias de caché:

| Recurso | Estrategia |
|---------|-----------|
| Assets estáticos (JS/CSS/img) | **Cache-first** |
| Páginas HTML | **Network-first** + fallback offline |
| API requests | **Network-first** + fallback |
| Otros | **Stale-while-revalidate** |

También incluye:
- ✅ Background Sync (cola de operaciones pendientes)
- ✅ Push Notifications
- ✅ Offline fallback (`offline.html`)

---

## 🗂️ Scripts Disponibles

```bash
pnpm run dev      # Servidor de desarrollo (Turbopack)
pnpm run build    # Build de producción
pnpm run start    # Servidor de producción
pnpm run lint     # Comprobación de tipos (TypeScript)
```

---

## 🌐 Variables de Entorno

Copia `.env.example` a `.env.local` y configura las variables necesarias. Todas las integraciones son **opcionales**:

| Variable | Servicio | Requerido |
|----------|---------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Opcional |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Push Notifications | Opcional |
| `OPENAI_API_KEY` | IA (OpenAI) | Opcional |
| `STRIPE_SECRET_KEY` | Pagos (Stripe) | Opcional |
| `RESEND_API_KEY` | Email (Resend) | Opcional |

---

## 📐 Convenciones de Código

- **Componentes UI**: Usa `cva` (class-variance-authority) para variantes
- **Clases CSS**: Usa `cn()` helper para merge de clases Tailwind
- **Rutas protegidas**: Envuelve con `<AuthGuard>` automaticamente en dashboard layout
- **Touch targets**: Mínimo 44×44px (WCAG)
- **Safe areas**: Manejo automático de notch/home bar
- **Path aliases**: `@/*` mapea a la raíz del proyecto

---

## 📄 Licencia

MIT
