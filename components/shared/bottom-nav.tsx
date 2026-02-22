"use client";

import { cn } from "@/lib/utils";
import { LiquidGlass } from "@/components/ui/satin-liquid-glass_legacy";
import {
  LayoutDashboard,
  List,
  FileText,
  Settings,
} from "lucide-react";

type Tab = "panel" | "lists" | "documents" | "settings";

const NAV_ITEMS: {
  tab: Tab;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}[] = [
    {
      tab: "panel",
      label: "Panel",
      icon: (a) => <LayoutDashboard className={cn("h-5 w-5 mb-1", a ? "text-foreground" : "text-muted-foreground")} strokeWidth={a ? 2.5 : 2} />,
    },
    {
      tab: "lists",
      label: "Listas",
      icon: (a) => <List className={cn("h-5 w-5 mb-1", a ? "text-foreground" : "text-muted-foreground")} strokeWidth={a ? 2.5 : 2} />,
    },
    {
      tab: "documents",
      label: "Docs",
      icon: (a) => <FileText className={cn("h-5 w-5 mb-1", a ? "text-foreground" : "text-muted-foreground")} strokeWidth={a ? 2.5 : 2} />,
    },
    {
      tab: "settings",
      label: "Ajustes",
      icon: (a) => <Settings className={cn("h-5 w-5 mb-1", a ? "text-foreground" : "text-muted-foreground")} strokeWidth={a ? 2.5 : 2} />,
    },
  ];

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

/**
 * BottomNav – barra de navegación inferior para mobile.
 * Usa LiquidGlass para el efecto de fondo glass.
 * Solo visible en mobile (md:hidden).
 */
export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, tab: Tab) => {
    // Ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    onTabChange(tab);
  };

  return (
    <LiquidGlass
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 border-t border-border z-50",
        "transition-transform duration-300 pb-[env(safe-area-inset-bottom)]"
      )}
      radius="none"
      intensity="medium"
      satin
      disableHover
      disableActive
      style={{ border: "none", borderTop: "1px solid var(--border)" }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              className={cn(
                "nav-button nav-button-press flex flex-col items-center justify-center",
                "flex-1 h-full rounded-lg transition-all duration-200 overflow-hidden relative"
              )}
              onClick={(e) => handleClick(e, item.tab)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon(isActive)}
              <span className={cn(
                "text-xs font-medium transition-colors duration-200",
                isActive ? "text-foreground font-semibold" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </LiquidGlass>
  );
}
