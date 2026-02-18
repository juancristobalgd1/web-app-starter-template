import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "./client";

/* ─── Viewport – desactiva pinch-zoom, activa safe areas ────────────── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,      // Deshabilita pinch-zoom
  minimumScale: 1,
  userScalable: false,  // No permite zoom al usuario
  viewportFit: "cover", // Safe areas (notch / home bar)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#1f1f1f" },
  ],
};

/* ─── PWA Metadata ───────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Mi App",
    template: "%s | Mi App",
  },
  description: "Web App Starter – PWA offline-first, mobile-first",
  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mi App",
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Mi App",
    description: "Web App Starter – PWA offline-first, mobile-first",
    siteName: "Mi App",
  },

  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Mi App",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "application-name": "Mi App",
    "msapplication-tap-highlight": "no",
    HandheldFriendly: "true",
    MobileOptimized: "width",
    "format-detection": "telephone=no, date=no, address=no, email=no",
  },

  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script src="/register-sw.js" defer />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
