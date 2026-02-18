"use client";

import type React from "react";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SplashProvider } from "@/components/providers/splash-provider";
import { OfflineIndicator } from "@/components/shared/offline-indicator";
import { Toaster } from "sonner";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  /* ── FAB scroll-aware visibility ── */
  useEffect(() => {
    let lastScrollY = 0;
    let lastTarget: EventTarget | null = null;
    let ticking = false;

    const getScrollY = (target: EventTarget | null): number => {
      if (target instanceof Element) return target.scrollTop;
      if (target instanceof Document) return document.scrollingElement?.scrollTop ?? window.scrollY;
      if (target === window) return window.scrollY;
      return 0;
    };

    const updateFab = (direction: "up" | "down") => {
      const state = direction === "down" ? "hidden" : "shown";
      if (document.documentElement.getAttribute("data-fab-state") !== state) {
        document.documentElement.setAttribute("data-fab-state", state);
      }
    };

    const onScroll = (e: Event) => {
      const target = e.target;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = getScrollY(target);
          if (target !== lastTarget) {
            lastTarget = target;
            lastScrollY = currentY;
            ticking = false;
            return;
          }
          const delta = currentY - lastScrollY;
          if (Math.abs(delta) > 10) {
            updateFab(delta > 0 ? "down" : "up");
            lastScrollY = currentY;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <SplashProvider>
          <OfflineIndicator />
          {children}
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{ className: "!z-[9999]" }}
          />
        </SplashProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
