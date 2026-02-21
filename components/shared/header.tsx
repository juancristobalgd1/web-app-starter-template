"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, Search, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useActiveBusinessId } from "../../hooks/use-active-business-id";
import { Store } from "lucide-react";
import Image from "next/image";

import { Skeleton } from "../ui/skeleton";
import { useLiquidGlass } from "../ui/satin-liquid-glass_legacy";
import { ToggleTheme } from "../ui/toggle-theme";
import { useCurrentUserProfile } from "../../hooks/use-current-user-profile";

function normalizeLogoSrc(logoDataUrl: unknown, businessId: unknown) {
    if (typeof logoDataUrl !== "string") return null;
    const raw = logoDataUrl.trim();
    if (!raw) return null;
    if (raw.startsWith("data:")) return raw;
    if (raw.startsWith("/api/businesses/")) return raw;
    if (typeof businessId !== "string" || !businessId) return raw;

    const publicMarker = "/storage/v1/object/public/business-assets/";
    const signMarker = "/storage/v1/object/sign/business-assets/";

    let idx = raw.indexOf(publicMarker);
    let path = "";

    if (idx !== -1) {
        path = raw.slice(idx + publicMarker.length);
    } else {
        idx = raw.indexOf(signMarker);
        if (idx !== -1) {
            path = raw.slice(idx + signMarker.length);
            const q = path.indexOf("?");
            if (q !== -1) path = path.slice(0, q);
        }
    }

    if (!path && raw.startsWith("logos/")) {
        path = raw;
    }

    if (!path) return raw;

    return `/api/businesses/${businessId}/logo?path=${encodeURIComponent(path)}`;
}

interface HeaderProps {
    title?: ReactNode;
    showLogo?: boolean;
    showUserMenu?: boolean;
    onBack?: () => void;
    className?: string;
    rightActions?: Array<{
        icon: ReactNode;
        onClick: () => void;
        className?: string;
        ariaLabel?: string;
        badge?: number;
        ariaExpanded?: boolean;
        ariaControls?: string;
        isRawNode?: boolean;
    }>;
    showSearch?: boolean;
    onSearchChange?: (query: string) => void;
    searchQuery?: string;
    hideUserProfileButton?: boolean;
    additionalContent?: ReactNode;
    containerClassName?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showUserMenu = true,
    onBack,
    className,
    rightActions,
    showSearch,
    onSearchChange,
    searchQuery = "",
    hideUserProfileButton,
    additionalContent,
    showLogo = false,
    containerClassName,
}) => {
    const { user, signOut } = useAuth();
    const { businessProfile } = useActiveBusinessId();
    const { profile } = useCurrentUserProfile();
    const router = useRouter();
    const [showShadow, setShowShadow] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const logoSrc = normalizeLogoSrc(businessProfile?.logoDataUrl, businessProfile?.id);
    const { isDark, style: subtleGlassStyle } = useLiquidGlass({ intensity: "medium", satin: true });
    const { style: buttonGlassStyle } = useLiquidGlass({ intensity: "medium", satin: true });

    useEffect(() => {
        const handleScroll = () => {
            // Check window scroll first
            if (window.scrollY > 0) {
                setShowShadow(true);
                return;
            }

            // If window scroll is 0, check if there's any overflow container scrolling
            // Cache the query for better performance
            const scrollContainers = document.querySelectorAll(".overflow-y-auto");
            for (const container of Array.from(scrollContainers)) {
                if (container.scrollTop > 0) {
                    setShowShadow(true);
                    return;
                }
            }

            setShowShadow(false);
        };

        // Single listener with capture for all scroll events
        window.addEventListener("scroll", handleScroll, {
            capture: true,
            passive: true
        });

        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll, { capture: true });
        };
    }, []);

    useEffect(() => {
        setLogoError(false);
    }, [logoSrc]);

    // Reset avatar error when profile avatar changes
    useEffect(() => {
        setAvatarError(false);
    }, [profile?.avatar_url]);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/auth");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // CRITICAL: This style behavior must not be changed.
    // - Default: Transparent background, no shadow, no border.
    // - On Scroll: Satin glass effect (legacy), NO extra black borders, NO custom shadows.
    // The visual consistency with the BottomNav (mobile) and Sidebar (desktop) is paramount.
    const scrollGlassStyle: React.CSSProperties = showShadow ? {
        ...subtleGlassStyle,
        border: "none",
    } : {
        backgroundColor: "transparent",
        boxShadow: "none",
        borderBottom: "none",
    };

    return (
        <header
            data-system-bar
            className={cn(
                "sticky top-0 z-50 flex flex-col pt-[env(safe-area-inset-top)] transition-[background-color,color,box-shadow,border-color] duration-300 ease-in-out rounded-none",
                "before:content-[''] before:absolute before:inset-x-0 before:top-[-100vh] before:h-[100vh] before:bg-inherit before:-z-10",
                className
            )}
            style={scrollGlassStyle}
        >
            <div className={cn("flex w-full min-w-0 max-w-full items-center justify-between gap-2 px-4 h-[var(--navbar-height)]", containerClassName)}>
                <div className="flex min-w-0 flex-1 items-center">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => (onBack ? onBack() : router.back())}
                            className="mr-2 bg-transparent hover:bg-transparent"
                            aria-label="Volver"
                            style={{ ...buttonGlassStyle, borderRadius: "9999px" }}
                        >
                            <ArrowLeft className="h-5 w-5 text-foreground" />
                        </Button>
                    )}
                    {showLogo && (
                        <div className="mr-2">
                            {logoSrc && !logoError ? (
                                <div className="h-8 w-8 rounded-lg overflow-hidden border border-border">
                                    <Image
                                        src={logoSrc}
                                        alt={businessProfile.name || "Logo"}
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                        unoptimized={true}
                                        priority
                                        onError={() => setLogoError(true)}
                                    />
                                </div>
                            ) : (
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Store className="h-5 w-5 text-primary" />
                                </div>
                            )}
                        </div>
                    )}
                    {title && (
                        <h1 className="min-w-0 max-w-full overflow-hidden text-lg font-semibold text-foreground">
                            {title}
                        </h1>
                    )}
                    {!(onBack || title) && (
                        <div
                            className={cn(
                                "flex items-center space-x-2",
                                (rightActions?.length || showUserMenu) && "invisible"
                            )}
                        >
                            {rightActions?.map((_, index) => (
                                <div key={`placeholder-left-${index}`} className="w-10 h-10" />
                            ))}
                            {showUserMenu && (!rightActions || rightActions.length === 0) && (
                                <div className="w-10 h-10" />
                            )}
                            {!((rightActions?.length || 0) > 0 || showUserMenu) && (
                                <div className="w-10 h-10" />
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                    {showSearch && (
                        <div className="relative w-full max-w-[60vw]">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full max-w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) =>
                                    onSearchChange && onSearchChange(e.target.value)
                                }
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    )}

                    {rightActions &&
                        rightActions.map((action, index) =>
                            action.isRawNode ? (
                                <div
                                    key={`right-action-${index}`}
                                    className={cn("relative cursor-pointer", action.className)}
                                    aria-label={action.ariaLabel}
                                    onClick={action.onClick}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            action.onClick();
                                        }
                                    }}
                                >
                                    {action.icon}
                                    {action.badge !== undefined && action.badge > 0 && (
                                        <span className="absolute -top-1 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white shadow-sm">
                                            {action.badge > 99 ? "99+" : action.badge}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <Button
                                    key={`right-action-${index}`}
                                    variant="ghost"
                                    size="icon"
                                    onClick={action.onClick}
                                    className={cn("relative bg-transparent hover:bg-transparent", action.className)}
                                    aria-label={action.ariaLabel}
                                    aria-expanded={action.ariaExpanded}
                                    aria-controls={action.ariaControls}
                                    style={{ ...buttonGlassStyle, borderRadius: "9999px" }}
                                >
                                    <div className="text-foreground">{action.icon}</div>
                                    {action.badge !== undefined && action.badge > 0 && (
                                        <span className="absolute -top-1 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white shadow-sm">
                                            {action.badge > 99 ? "99+" : action.badge}
                                        </span>
                                    )}
                                </Button>
                            )
                        )}

                    {showUserMenu && !hideUserProfileButton && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:bg-transparent h-10 px-2 gap-2 rounded-full cursor-pointer min-w-[3rem]"
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Menú de usuario"
                                    style={{ ...buttonGlassStyle, borderRadius: "9999px" }}
                                >
                                    <Avatar className="h-6 w-6">
                                        {profile?.avatar_url && !avatarError ? (
                                            <Image
                                                src={profile.avatar_url}
                                                alt="Foto de perfil"
                                                fill
                                                sizes="24px"
                                                className="object-cover"
                                                onError={() => setAvatarError(true)}
                                            />
                                        ) : null}
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                                            {profile?.initials || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:block font-medium text-sm truncate max-w-[100px]">
                                        {profile?.name || user?.email?.split('@')[0] || "Usuario"}
                                    </span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-80 p-0 border-none bg-transparent shadow-none"
                                sideOffset={8}
                                style={{
                                    ...subtleGlassStyle,
                                    padding: "16px",
                                    borderRadius: "20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "4px"
                                }}
                            >
                                {user ? (
                                    <>
                                        <div className="px-2 pb-3 pt-1">
                                            <p className="text-base font-bold text-foreground tracking-tight">
                                                {profile?.name || "Mi Cuenta"}
                                            </p>
                                            <p className="text-sm text-muted-foreground/80 mt-1 truncate font-medium">
                                                {profile?.email || user.email}
                                            </p>
                                        </div>

                                        <div className="h-px w-full bg-border/40 my-1" />

                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer group active:scale-[0.98]">
                                                <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors">Apariencia</span>
                                                <div className="flex items-center">
                                                    <ToggleTheme className="flex-row w-auto h-9 border-none bg-transparent hover:bg-transparent shadow-none" />
                                                </div>
                                            </div>

                                            <DropdownMenuItem
                                                onClick={handleSignOut}
                                                className="cursor-pointer text-red-600 hover:!bg-red-500/10 hover:!text-red-700 focus:!bg-red-500/10 focus:!text-red-700 dark:text-red-400 dark:hover:!bg-red-900/20 dark:hover:!text-red-300 dark:focus:!bg-red-900/20 dark:focus:!text-red-300 px-3 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] mt-1"
                                            >
                                                <LogOut className="mr-3 h-4 w-4 stroke-[2.5]" />
                                                <span className="font-semibold">Cerrar sesión</span>
                                            </DropdownMenuItem>
                                        </div>
                                    </>
                                ) : (
                                    <DropdownMenuItem
                                        onClick={() => router.push("/auth")}
                                        className="cursor-pointer px-3 py-3 rounded-xl font-medium"
                                    >
                                        <span>Iniciar sesión</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {additionalContent && (
                <div className="w-full bg-inherit">
                    {additionalContent}
                </div>
            )}
        </header>
    );
};

export const HeaderSkeleton: React.FC<{
    showBack?: boolean;
    showTitle?: boolean;
    rightActionsCount?: number;
    showUserMenu?: boolean;
    className?: string;
    additionalContent?: ReactNode;
}> = ({
    showBack = false,
    showTitle = true,
    rightActionsCount = 1,
    showUserMenu = true,
    className,
    additionalContent,
}) => {
        return (
            <div
                data-system-bar
                className={cn(
                    "sticky top-0 z-50 flex flex-col bg-background pt-[env(safe-area-inset-top)] border-b border-transparent transition-[background-color,color,box-shadow,border-color] duration-300 ease-in-out rounded-none",
                    "before:content-[''] before:absolute before:inset-x-0 before:top-[-100vh] before:h-[100vh] before:bg-inherit before:-z-10",
                    className
                )}
            >
                <div className="flex w-full min-w-0 max-w-full items-center justify-between gap-2 px-3 py-2">
                    <div className="flex min-w-0 flex-1 items-center">
                        {showBack && <Skeleton className="h-9 w-9 mr-2 rounded-md" />}
                        {showTitle && <Skeleton className="h-6 w-32" />}
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                        {Array.from({ length: rightActionsCount }).map((_, i) => (
                            <Skeleton
                                key={`right-action-skeleton-${i}`}
                                className="h-9 w-9 rounded-md"
                            />
                        ))}
                        {showUserMenu && <Skeleton className="h-9 w-9 rounded-full" />}
                    </div>
                </div>
                {additionalContent && (
                    <div className="w-full bg-inherit">{additionalContent}</div>
                )}
            </div>
        );
    };
