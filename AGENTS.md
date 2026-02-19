# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This is a **Next.js 15 PWA starter template** with an offline-first, mobile-first architecture. It uses the App Router with Turbopack for development.

## Commands

```bash
# Development (Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking (no ESLint configured)
npm run lint
```

## Architecture

### Route Groups

- `app/(auth)/` — Public authentication routes (`/auth`)
- `app/(dashboard)/` — Protected routes requiring authentication (`/panel`, `/lists`, `/documents`, `/settings`)

### Provider Hierarchy

`app/client.tsx` wraps the app with providers in this order:
1. `ThemeProvider` — Dark/light mode via next-themes (class-based)
2. `AuthProvider` — Authentication state (stub implementation, replace with Supabase/Firebase/etc.)
3. `SplashProvider` — Initial loading screen

### Component Organization

- `components/ui/` — Reusable primitives (Button, Input, etc.) using `class-variance-authority` for variants
- `components/shared/` — App-specific shared components (BottomNav, AppSidebar, AuthGuard)
- `components/features/` — Feature-specific components grouped by domain
- `components/providers/` — React context providers

### Key Patterns

**UI Components**: Use `cva` (class-variance-authority) for variant definitions with `cn()` helper for class merging:
```typescript
const buttonVariants = cva([...baseClasses], { variants: {...}, defaultVariants: {...} })
```

**Protected Routes**: Use `AuthGuard` component which redirects unauthenticated users to `/auth`

**Responsive Navigation**: 
- Desktop (md+): `AppSidebar` component
- Mobile: `BottomNav` component with glass effect

### Offline Support

- **IndexedDB**: `lib/db.ts` uses Dexie for local storage with a sync queue pattern (`PendingSyncOp`)
- **Service Worker**: `public/sw.js` handles caching, `public/register-sw.js` handles registration
- **Offline Detection**: `hooks/use-online-status.ts` hook and `OfflineIndicator` component

### Styling

- Tailwind CSS 4 with CSS custom properties defined in `app/globals.css`
- OKLCH color system with light/dark mode tokens
- CSS variables for layout: `--sidebar-width`, `--bottom-nav-height`, `--navbar-height`
- Safe area handling for mobile (notch, home bar)
- All buttons have min 44px touch target (WCAG)

### Path Aliases

`@/*` maps to the root directory (configured in `tsconfig.json`)
