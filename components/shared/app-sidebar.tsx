"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  List,
  FileText,
  Settings,
} from "lucide-react";

type Tab = "panel" | "lists" | "documents" | "settings";

interface AppSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_LINKS: { tab: Tab; label: string; href: string; icon: typeof LayoutDashboard }[] = [
  { tab: "panel", label: "Panel", href: "/panel", icon: LayoutDashboard },
  { tab: "lists", label: "Listas", href: "/lists", icon: List },
  { tab: "documents", label: "Documentos", href: "/documents", icon: FileText },
  { tab: "settings", label: "Ajustes", href: "/settings", icon: Settings },
];

/**
 * AppSidebar – sidebar de navegación estilo vyyq.io.
 * Icon-only, thin, no hover expand. Solo visible en desktop (md+).
 */
export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <aside
      className="hidden md:flex flex-col h-full flex-shrink-0"
      style={{
        width: 52,
        borderRight: "1px solid rgba(0,0,0,0.06)",
        backgroundColor: "var(--background)",
      }}
    >
      {/* Top: nav icons */}
      <nav className="flex flex-col items-center gap-1 pt-3 px-2">
        {NAV_LINKS.map(({ tab, label, href, icon: Icon }) => {
          const isActive = activeTab === tab;
          return (
            <Link
              key={tab}
              href={href}
              title={label}
              onClick={() => onTabChange(tab)}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-xl transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
              )}
            >
              <Icon
                className="h-[18px] w-[18px]"
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          );
        })}
      </nav>

      {/* Bottom: spacer fills */}
      <div className="flex-1" />
    </aside>
  );
}
