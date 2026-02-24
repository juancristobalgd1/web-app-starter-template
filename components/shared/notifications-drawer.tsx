"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
    Bell,
    X,
    CheckCheck,
    MessageSquare,
    AlertTriangle,
    Info,
    Package,
    Clock,
    Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLiquidGlass } from "@/components/ui/satin-liquid-glass_legacy";

/* ── Types ─────────────────────────────────── */

type MainTab = "alertas" | "mensajes";

type AlertCategory = "todas" | "stock" | "vencimiento" | "vencidos" | "actualizacion";

type NotificationType =
    | "stock"
    | "vencimiento"
    | "vencidos"
    | "actualizacion"
    | "mensaje";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    time: Date;
    read: boolean;
}

/* ── Mock Data ─────────────────────────────── */

const MOCK_ALERTS: Notification[] = [
    {
        id: "a1",
        type: "stock",
        title: "Stock bajo – Kit Premium",
        description: "Solo quedan 3 unidades disponibles",
        time: new Date(Date.now() - 1000 * 60 * 12),
        read: false,
    },
    {
        id: "a2",
        type: "vencimiento",
        title: "Próximo vencimiento",
        description: "Lote #482 vence en 5 días",
        time: new Date(Date.now() - 1000 * 60 * 45),
        read: false,
    },
    {
        id: "a3",
        type: "vencidos",
        title: "Producto vencido",
        description: "Lote #310 ha superado su fecha de caducidad",
        time: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
    },
    {
        id: "a4",
        type: "stock",
        title: "Sin stock – Jabón Artesanal",
        description: "Se han agotado las existencias",
        time: new Date(Date.now() - 1000 * 60 * 60 * 5),
        read: true,
    },
    {
        id: "a5",
        type: "actualizacion",
        title: "Sistema actualizado",
        description: "Se han aplicado mejoras de rendimiento v2.4",
        time: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
    },
];

const MOCK_MESSAGES: Notification[] = [
    {
        id: "m1",
        type: "mensaje",
        title: "Ana López",
        description: "Hola, ¿tienen disponibilidad para mañana a las 10?",
        time: new Date(Date.now() - 1000 * 60 * 22),
        read: false,
    },
    {
        id: "m2",
        type: "mensaje",
        title: "Pedro Ramírez",
        description: "Gracias por la atención, ¡excelente servicio!",
        time: new Date(Date.now() - 1000 * 60 * 60 * 48),
        read: true,
    },
];

/* ── Helpers ───────────────────────────────── */

const ALERT_TYPE_CONFIG: Record<
    NotificationType,
    { icon: React.ElementType; color: string; bg: string }
> = {
    stock: {
        icon: Package,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    vencimiento: {
        icon: Clock,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    vencidos: {
        icon: AlertTriangle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-900/30",
    },
    actualizacion: {
        icon: Info,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    mensaje: {
        icon: MessageSquare,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
};

const ALERT_CATEGORIES: { key: AlertCategory; label: string }[] = [
    { key: "todas", label: "Todas" },
    { key: "stock", label: "Stock" },
    { key: "vencimiento", label: "Vencimiento" },
    { key: "vencidos", label: "Vencidos" },
    { key: "actualizacion", label: "Actualización" },
];

function formatRelativeTime(date: Date): string {
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);

    if (diffMin < 1) return "Ahora";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    const diffDays = Math.floor(diffHr / 24);
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

/* ── Component ─────────────────────────────── */

interface NotificationsDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NotificationsDrawer({
    open,
    onOpenChange,
}: NotificationsDrawerProps) {
    const [activeTab, setActiveTab] = useState<MainTab>("alertas");
    const [activeCategory, setActiveCategory] = useState<AlertCategory>("todas");
    const [alerts, setAlerts] = useState<Notification[]>(MOCK_ALERTS);
    const [messages, setMessages] = useState<Notification[]>(MOCK_MESSAGES);
    const chipsRef = useRef<HTMLDivElement>(null);

    // Glass hook
    const { style: glassStyle } = useLiquidGlass({ intensity: "medium", satin: true });

    /* ── Derived data ────────────────────────── */

    const currentItems = useMemo(() => {
        if (activeTab === "mensajes") return messages;
        if (activeCategory === "todas") return alerts;
        return alerts.filter((n) => n.type === activeCategory);
    }, [activeTab, activeCategory, alerts, messages]);

    const unreadAlerts = useMemo(() => alerts.filter((n) => !n.read).length, [alerts]);
    const unreadMessages = useMemo(() => messages.filter((n) => !n.read).length, [messages]);

    /* ── Actions ────────────────────────────── */

    const markAsRead = useCallback(
        (id: string) => {
            if (activeTab === "alertas") {
                setAlerts((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
            } else {
                setMessages((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
            }
        },
        [activeTab]
    );

    const removeNotification = useCallback(
        (id: string) => {
            if (activeTab === "alertas") {
                setAlerts((prev) => prev.filter((n) => n.id !== id));
            } else {
                setMessages((prev) => prev.filter((n) => n.id !== id));
            }
        },
        [activeTab]
    );

    const markAllAsRead = useCallback(() => {
        if (activeTab === "alertas") {
            setAlerts((prev) => prev.map((n) => ({ ...n, read: true })));
        } else {
            setMessages((prev) => prev.map((n) => ({ ...n, read: true })));
        }
    }, [activeTab]);

    const currentUnread = activeTab === "alertas" ? unreadAlerts : unreadMessages;

    /* ── Empty state text ─────────────────── */
    const emptyTitle = activeTab === "alertas" ? "Todo bajo control" : "Sin mensajes";
    const emptyDesc =
        activeTab === "alertas"
            ? "No tienes alertas pendientes en este momento"
            : "No tienes mensajes en este momento";

    return (
        <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
            <DrawerContent
                className="h-full w-[92vw] sm:max-w-[420px] rounded-none border-l-0 border-none shadow-none bg-transparent"
                aria-describedby="notifications-drawer-desc"
                style={{
                    ...glassStyle,
                    borderRadius: 0,
                }}
            >
                <DrawerTitle className="sr-only">Notificaciones</DrawerTitle>
                <div className="flex flex-col h-full">
                    {/* ── Header: Main Tabs + Close ─────────── */}
                    <div className="flex-shrink-0 px-5 pt-5 pb-0">
                        <div className="flex items-center justify-between mb-4">
                            {/* Tabs */}
                            <div className="flex items-center gap-5">
                                <button
                                    onClick={() => {
                                        setActiveTab("alertas");
                                        setActiveCategory("todas");
                                    }}
                                    className={cn(
                                        "text-base font-bold transition-colors duration-200 pb-0.5",
                                        activeTab === "alertas"
                                            ? "text-foreground"
                                            : "text-muted-foreground/60 hover:text-muted-foreground"
                                    )}
                                >
                                    Alertas
                                    {unreadAlerts > 0 && (
                                        <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold align-middle">
                                            {unreadAlerts}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("mensajes")}
                                    className={cn(
                                        "text-base font-bold transition-colors duration-200 pb-0.5",
                                        activeTab === "mensajes"
                                            ? "text-foreground"
                                            : "text-muted-foreground/60 hover:text-muted-foreground"
                                    )}
                                >
                                    Mensajes
                                    {unreadMessages > 0 && (
                                        <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold align-middle">
                                            {unreadMessages}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Close */}
                            <DrawerClose asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-secondary/80"
                                    aria-label="Cerrar notificaciones"
                                >
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </DrawerClose>
                        </div>

                        {/* ── Category chips (only for Alertas tab) ── */}
                        {activeTab === "alertas" && (
                            <div
                                ref={chipsRef}
                                className="flex gap-2 pb-4 overflow-x-auto scrollbar-none -mx-1 px-1"
                                style={{ WebkitOverflowScrolling: "touch" }}
                            >
                                {ALERT_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.key}
                                        onClick={() => setActiveCategory(cat.key)}
                                        className={cn(
                                            "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                                            activeCategory === cat.key
                                                ? "bg-red-500 text-white shadow-sm"
                                                : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        )}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border/30 mx-4" />

                    {/* ── Mark all read action ─────────────── */}
                    {currentUnread > 0 && currentItems.length > 0 && (
                        <div className="flex items-center justify-end px-5 py-2">
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Marcar todo leído
                            </button>
                        </div>
                    )}

                    {/* ── Content ──────────────────────────── */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        <p id="notifications-drawer-desc" className="sr-only">
                            Panel de notificaciones con alertas y mensajes
                        </p>

                        {currentItems.length === 0 ? (
                            /* ── Empty State ────────────────────── */
                            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
                                <div className="w-20 h-20 rounded-full bg-secondary/60 flex items-center justify-center mb-5">
                                    <Bell className="w-9 h-9 text-muted-foreground/40" />
                                </div>
                                <p className="text-base font-bold text-foreground mb-1.5">
                                    {emptyTitle}
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                                    {emptyDesc}
                                </p>
                            </div>
                        ) : (
                            /* ── Notification List ─────────────── */
                            <div className="flex flex-col gap-2 px-4 py-3">
                                {currentItems.map((notification) => {
                                    const config = ALERT_TYPE_CONFIG[notification.type];
                                    const Icon = config.icon;

                                    return (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                "group relative flex items-start gap-3.5 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200",
                                                "bg-secondary/40 hover:bg-secondary/70 active:bg-secondary/90",
                                                !notification.read && "bg-primary/[0.05] dark:bg-primary/[0.08] ring-1 ring-primary/10"
                                            )}
                                            onClick={() => markAsRead(notification.id)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    markAsRead(notification.id);
                                                }
                                            }}
                                        >
                                            {/* Unread dot */}
                                            {!notification.read && (
                                                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-red-500" />
                                            )}

                                            {/* Icon */}
                                            <div
                                                className={cn(
                                                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 transition-transform duration-200 group-hover:scale-105",
                                                    config.bg
                                                )}
                                            >
                                                <Icon className={cn("w-[18px] h-[18px]", config.color)} />
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p
                                                        className={cn(
                                                            "text-[13px] leading-tight",
                                                            notification.read
                                                                ? "font-medium text-foreground/70"
                                                                : "font-semibold text-foreground"
                                                        )}
                                                    >
                                                        {notification.title}
                                                    </p>
                                                    <span className="flex-shrink-0 text-[10px] font-medium text-muted-foreground/50 mt-0.5">
                                                        {formatRelativeTime(notification.time)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2 leading-relaxed">
                                                    {notification.description}
                                                </p>
                                            </div>

                                            {/* Hover actions */}
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeNotification(notification.id);
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                                                    aria-label="Eliminar notificación"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-destructive" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
