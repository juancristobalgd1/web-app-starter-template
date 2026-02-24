"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar as HoverSidebar,
  SidebarBody,
} from "@/components/ui/hover-sidebar";
import { hapticTap } from "../../hooks/pwa/use-haptic";
import {
  Settings,
  List,
  LayoutDashboard,
  Store,
  FileText,
  LayoutDashboardIcon as LayoutDashboardFilled,
  ListFilterIcon as ListFilledIcon,
  CalendarFold as CalendarFilled,
  Settings2Icon as SettingsFilledIcon,
  CalendarCheck,
} from "lucide-react";
import { useI18n } from "../../hooks/use-i18n";
import { useUserStorage } from "../../hooks/use-user-storage";
import { usePermission } from "../../hooks/use-permission";
import { useTeamBusiness } from "../../hooks/use-team-business";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppLogo } from "@/components/shared/app-logo";

type Tab = "panel" | "lists" | "documents" | "settings";

interface AppSidebarProps {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useI18n();
  const { getLocalStorageItem } = useUserStorage();
  const { getAllowedTabs, loading: permissionLoading, role, canAccessAI } = usePermission();
  const [sidebarLogoUrl, setSidebarLogoUrl] = useState<string | null>(null);
  const [sidebarBusinessName, setSidebarBusinessName] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = getLocalStorageItem("businessProfile");
      if (raw) {
        const profile = JSON.parse(raw);
        setSidebarLogoUrl(profile?.logoDataUrl || null);
        setSidebarBusinessName(profile?.name || null);
      }
    } catch { }
  }, [getLocalStorageItem]);

  const { businessName: teamBusinessName, isTeamMember } = useTeamBusiness();

  useEffect(() => {
    const refreshProfile = () => {
      try {
        const raw = getLocalStorageItem("businessProfile");
        if (raw) {
          const p = JSON.parse(raw);
          setSidebarLogoUrl(p?.logoDataUrl || null);
          setSidebarBusinessName((p?.name || "").trim() || null);
        }
      } catch { }
    };
    const onUpdated = () => refreshProfile();
    window.addEventListener("businessProfileUpdated", onUpdated);
    window.addEventListener("storage", onUpdated);
    return () => {
      window.removeEventListener("businessProfileUpdated", onUpdated);
      window.removeEventListener("storage", onUpdated);
    };
  }, [getLocalStorageItem]);

  const displayBusinessName = isTeamMember ? (teamBusinessName || "Negocio") : (sidebarBusinessName || "Stockli");

  const allowedTabs = useMemo(() => getAllowedTabs(), [getAllowedTabs, permissionLoading, role]);

  const navigationLinks = useMemo(() => {
    const all = [
      {
        tab: "panel",
        label: t("panel.title"),
        href: "/panel",
        icon: pathname === "/panel" ? <LayoutDashboardFilled className="h-5 w-5 text-sidebar-foreground" /> : <LayoutDashboard className="h-5 w-5 text-sidebar-foreground" />,
      },
      {
        tab: "lists",
        label: t("lists.title"),
        href: "/lists",
        icon: pathname === "/lists" ? <ListFilledIcon className="h-5 w-5 text-sidebar-foreground" /> : <List className="h-5 w-5 text-sidebar-foreground" />,
      },
      {
        tab: "documents",
        label: t("documents.title"),
        href: "/documents",
        icon: pathname === "/documents" ? <FileText className="h-5 w-5 text-sidebar-foreground" /> : <FileText className="h-5 w-5 text-sidebar-foreground" />,
      },
      {
        tab: "settings",
        label: t("settings.title"),
        href: "/settings",
        icon: pathname === "/settings" ? <SettingsFilledIcon className="h-5 w-5 text-sidebar-foreground" /> : <Settings className="h-5 w-5 text-sidebar-foreground" />,
      },
    ];
    return all.filter(link => allowedTabs.includes(link.tab as any));
  }, [t, pathname, allowedTabs]);

  return (
    <div className="hidden md:block h-full">
      <HoverSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        animate={true}
      >
        <SidebarBody className="justify-between gap-10 text-sidebar-foreground [&_a]:text-sidebar-foreground [&_a:hover]:text-sidebar-accent-foreground [&_svg]:text-sidebar-foreground">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden pb-24">
            <div className="hidden md:flex flex-col items-center px-2 pt-10 pb-12">
              <Link href="/panel" className="flex items-center justify-start w-full">
                <AppLogo size={44} showText={sidebarOpen} className="transition-all duration-200" />
              </Link>
            </div>
            <div
              className="flex flex-col gap-2.5 px-2 pt-8 mt-32 mb-28"
              style={{ marginTop: "128px" }}
            >
              {navigationLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => onTabChange?.(link.tab as Tab)}
                  className={cn(
                    "flex items-center justify-start gap-4 group/sidebar py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium shadow-none",
                    pathname === link.href
                      ? "bg-sidebar-accent/80 !text-sidebar-foreground font-semibold shadow-none ring-0"
                      : "!text-sidebar-foreground hover:bg-sidebar-accent/70 hover:!text-sidebar-foreground hover:shadow-none"
                  )}
                >
                  <div className="flex-shrink-0 w-11 flex items-center justify-center">
                    {link.icon}
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm font-medium tracking-tight text-sidebar-foreground group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre">
                      {link.label}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="p-2 mt-12">
            <Link
              href="/"
              className="flex items-center justify-start gap-4 cursor-pointer hover:bg-sidebar-accent/50 rounded-lg transition-colors overflow-hidden py-2"
            >
              <div className="w-11 flex items-center justify-center flex-shrink-0">
                <Avatar className="h-8 w-8 rounded-lg border border-border">
                  {sidebarLogoUrl && (
                    <AvatarImage
                      src={sidebarLogoUrl}
                      alt={sidebarBusinessName || "Logo"}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Store className="size-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
              {sidebarOpen && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    {displayBusinessName}
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    {isTeamMember ? "Equipo" : "Personal"}
                  </span>
                </div>
              )}
            </Link>
          </div>
        </SidebarBody>
      </HoverSidebar>

    </div>
  );
}
