"use client";

import type React from "react";
import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { AuthGuard } from "@/components/shared/auth-guard";

type Tab = "panel" | "lists" | "documents" | "settings";

const ROUTE_TO_TAB: Record<string, Tab> = {
  "/panel":     "panel",
  "/":          "panel",
  "/lists":     "lists",
  "/documents": "documents",
  "/settings":  "settings",
};

const TAB_TO_ROUTE: Record<Tab, string> = {
  panel:     "/panel",
  lists:     "/lists",
  documents: "/documents",
  settings:  "/settings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router    = useRouter();
  const pathname  = usePathname();
  const [activeTab, setActiveTab] = useState<Tab>("panel");
  const [_isPending, startTransition] = useTransition();

  useEffect(() => {
    setActiveTab((ROUTE_TO_TAB[pathname] ?? "panel") as Tab);
  }, [pathname]);

  const handleTabChange = (tab: Tab) => {
    if (activeTab === tab) return;
    startTransition(() => {
      setActiveTab(tab);
      router.push(TAB_TO_ROUTE[tab]);
    });
  };

  return (
    <AuthGuard>
      <div className="flex h-dvh overflow-hidden bg-background">
        {/* Sidebar – solo desktop (md+) */}
        <AppSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Contenido principal */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto scroll-momentum pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>

        {/* Bottom nav – solo mobile */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </AuthGuard>
  );
}
