"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LiquidGlass } from "@/components/ui/satin-liquid-glass";
import { motion, AnimatePresence } from "framer-motion";
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

const NAV_LINKS: { tab: Tab; label: string; href: string; icon: typeof LayoutDashboard }[] = [
  { tab: "panel", label: "Panel", href: "/panel", icon: LayoutDashboard },
  { tab: "lists", label: "Listas", href: "/lists", icon: List },
  { tab: "documents", label: "Documentos", href: "/documents", icon: FileText },
  { tab: "settings", label: "Ajustes", href: "/settings", icon: Settings },
];

const COLLAPSED_W = 52;
const EXPANDED_W = 200;

/**
 * AppSidebar – spans the FULL height of the viewport.
 * Collapses to icon-only (52 px); expands to show labels on hover.
 */
export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.aside
      className="hidden md:flex flex-col h-full flex-shrink-0 overflow-hidden"
      animate={{ width: hovered ? EXPANDED_W : COLLAPSED_W }}
      transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <LiquidGlass
        intensity="subtle"
        satin={false}
        radius="none"
        disableHover
        disableActive
        className="flex flex-col h-full w-full"
        style={{
          border: "none",
          borderRight: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "none",
        }}
      >
        {/* Nav links — top section with breathing room from the very top */}
        <nav className="flex flex-col gap-1 pt-5 px-2 flex-1">
          {NAV_LINKS.map(({ tab, label, href, icon: Icon }) => {
            const isActive = activeTab === tab;
            return (
              <Link
                key={tab}
                href={href}
                title={label}
                onClick={() => onTabChange(tab)}
                className={cn(
                  "flex items-center gap-3 h-9 px-2 rounded-xl transition-colors overflow-hidden",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                )}
              >
                <Icon
                  className="h-[18px] w-[18px] flex-shrink-0"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <AnimatePresence>
                  {hovered && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.12, delay: 0.05 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: brand/store icon */}
        <div className="flex items-center justify-center pb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm flex-shrink-0">
            <Store className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      </LiquidGlass>
    </motion.aside>
  );
}
