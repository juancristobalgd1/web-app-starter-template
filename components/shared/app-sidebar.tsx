"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarBody,
} from "@/components/ui/hover-sidebar";
import {
  LayoutDashboard,
  List,
  FileText,
  Settings,
  Store,
} from "lucide-react";

type Tab = "panel" | "lists" | "documents" | "settings";

interface AppSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_LINKS: { tab: Tab; label: string; href: string; icon: React.ReactNode; activeIcon: React.ReactNode }[] = [
  {
    tab: "panel",
    label: "Panel",
    href: "/panel",
    icon:       <LayoutDashboard className="h-5 w-5" />,
    activeIcon: <LayoutDashboard className="h-5 w-5 text-primary" strokeWidth={2.5} />,
  },
  {
    tab: "lists",
    label: "Listas",
    href: "/lists",
    icon:       <List className="h-5 w-5" />,
    activeIcon: <List className="h-5 w-5 text-primary" strokeWidth={2.5} />,
  },
  {
    tab: "documents",
    label: "Documentos",
    href: "/documents",
    icon:       <FileText className="h-5 w-5" />,
    activeIcon: <FileText className="h-5 w-5 text-primary" strokeWidth={2.5} />,
  },
  {
    tab: "settings",
    label: "Ajustes",
    href: "/settings",
    icon:       <Settings className="h-5 w-5" />,
    activeIcon: <Settings className="h-5 w-5 text-primary" strokeWidth={2.5} />,
  },
];

/**
 * AppSidebar – sidebar de navegación principal.
 * Solo visible en desktop (md+). En mobile se usa BottomNav.
 * Hover para expandir, collapse por defecto (icono only).
 */
export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="hidden md:block h-full">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="flex items-center gap-2 px-3 py-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Store className="h-4 w-4 text-primary-foreground" />
              </div>
              {sidebarOpen && (
                <span className="font-semibold text-sidebar-foreground whitespace-nowrap">
                  Mi App
                </span>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 px-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeTab === link.tab;
                return (
                  <Link
                    key={link.tab}
                    href={link.href}
                    onClick={() => onTabChange(link.tab)}
                    className={cn(
                      "flex items-center gap-2 group/sidebar py-2 px-2 rounded-lg cursor-pointer transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <div className="flex-shrink-0">
                      {isActive ? link.activeIcon : link.icon}
                    </div>
                    {sidebarOpen && (
                      <span className="text-sm font-medium group-hover/sidebar:translate-x-0.5 transition duration-150 whitespace-pre">
                        {link.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer – perfil / logo */}
          <div className="p-2">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent rounded-lg p-2 -m-2 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-border flex items-center justify-center flex-shrink-0 text-sm">
                👤
              </div>
              {sidebarOpen && (
                <span className="font-medium text-sidebar-foreground whitespace-nowrap truncate text-sm">
                  Usuario
                </span>
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
