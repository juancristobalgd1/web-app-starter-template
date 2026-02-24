"use client";
import type React from "react";
import { useState, useMemo } from "react";
import { Drawer } from "vaul";
import { Bell, X, Star, AlertTriangle, Clock, ChevronRight, ChevronDown, Package, Truck, Calendar, Trash2, MessageSquare, Inbox, FileText, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useI18n } from "@/hooks/use-i18n";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLiquidGlass } from "@/components/ui/satin-liquid-glass";
export interface Product {
    id: string;
    name: string;
    quantity: number;
    demandCategory?: string;
    expirationDate?: string;
    supplierName?: string;
    requiredQty?: number;
    unitOfMeasure?: string;
    price?: number;
    image?: string | null;
}
export interface Notification {
    listId: string;
    listName: string;
    products: Product[];
    type?: "low_stock" | "expiration" | "order_overdue" | "document_update";
}
export interface AdminMessage {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
}
interface NotificationsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    adminMessages?: AdminMessage[];
    isPushSupported?: boolean;
    isPushSubscribed?: boolean;
    pushPermission?: string;
    onRequestPushPermission?: () => Promise<boolean>;
    onSubscribeToPush?: () => Promise<boolean>;
    onSuccessToast?: (message: string) => void;
    onCreatePurchaseDocumentForSupplier?: (
        listId: string,
        supplierName: string | undefined,
        products: Product[]
    ) => void;
    isSupplierGroupCompleted?: (
        listId: string,
        supplierName: string | undefined
    ) => boolean;
    onOpenPurchaseDocumentDetails?: (documentId: string) => void;
    onOpenSalesDocumentDetails?: (documentId: string) => void;
    onClearAllNotifications?: () => void;
    onMarkMessageAsRead?: (messageId: string) => void;
    onMarkNotificationAsRead?: (notificationId: string) => void;
    onMarkAllAsRead?: () => void;
}
type TabType = "notifications" | "messages";
type FilterType = "all" | "low_stock" | "expiration" | "order_overdue" | "document_update";
function getNotificationTitle(notification: Notification, t: any): string {
    if (notification.type === "expiration") {
        return t("panel.notifications.expirationAt", { name: notification.listName });
    } else if (notification.type === "order_overdue") {
        const isPlural = notification.products.length > 1;
        if (notification.listId === "orders-sales-overdue") {
            return isPlural ? t("panel.notifications.salesOverdue") : t("panel.notifications.saleOverdue");
        } else if (notification.listId === "orders-purchases-overdue") {
            return isPlural ? t("panel.notifications.purchasesOverdue") : t("panel.notifications.purchaseOverdue");
        } else {
            return t("panel.notifications.overdueAt", { name: notification.listName });
        }
    } else if (notification.type === "document_update") {
        return notification.listName;
    } else {
        return t("panel.notifications.lowStockAt", { name: notification.listName });
    }
}
// Supplier Group Component
function SupplierGroup({
    supplier,
    products,
    notification,
    isCompleted,
    onCreatePurchaseDocument,
    onMissingSupplier,
    t,
}: {
    supplier: string;
    products: Product[];
    notification: Notification;
    isCompleted: boolean;
    onCreatePurchaseDocument: () => void;
    onMissingSupplier: () => void;
    t: any;
}) {
    const [isExpanded, setIsExpanded] = useState(true);
    const noSupplierLabel = t("panel.notifications.noSupplier");
    return (
        <div className={cn(
            "border-t border-border overflow-hidden",
            isCompleted
                ? "bg-emerald-500/5"
                : "bg-muted/20"
        )}>
            {/* Supplier Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    type="button"
                    className="flex items-center gap-2 flex-1 min-w-0 text-left"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <ChevronDown className={cn(
                        "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        !isExpanded && "-rotate-90"
                    )} />
                    <div className="h-6 w-6 rounded-full flex items-center justify-center bg-muted shrink-0">
                        <Truck className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-semibold text-foreground truncate">
                        {supplier === "Sin proveedor" ? noSupplierLabel : supplier}
                    </span>
                    <Badge variant="outline" className="ml-1 h-5 px-1.5 text-[10px] border-border">
                        {products.length}
                    </Badge>
                </button>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-7 text-xs font-medium px-3 rounded-lg shrink-0 ml-2",
                        (!supplier || supplier === "Sin proveedor") && "opacity-50"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!supplier || supplier === "Sin proveedor") {
                            onMissingSupplier();
                        } else {
                            onCreatePurchaseDocument();
                        }
                    }}
                >
                    {t("panel.notifications.repopulate")}
                </Button>
            </div>
            {/* Products List - Collapsible */}
            <div
                className={cn(
                    "grid transition-all duration-200 ease-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-1.5">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-2.5 bg-background rounded-lg border border-border"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-muted shrink-0 p-0.5 overflow-hidden">
                                        {product.image ? (
                                            product.image.startsWith("data:application/pdf") ? (
                                                <div className="h-full w-full flex items-center justify-center bg-background rounded-md">
                                                    <FileText className="h-4 w-4 text-primary" />
                                                </div>
                                            ) : (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={32}
                                                    height={32}
                                                    className="h-full w-full object-cover rounded-md"
                                                    unoptimized={true}
                                                />
                                            )
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-background text-muted-foreground rounded-md">
                                                <Package className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {product.name}
                                        </p>
                                        {product.requiredQty ? (
                                            <p className="text-[11px] text-muted-foreground">
                                                {t("panel.notifications.missing", { qty: product.requiredQty, unit: product.unitOfMeasure || "" })}
                                            </p>
                                        ) : (
                                            <p className="text-[11px] text-muted-foreground">
                                                {t("panel.notifications.lowStock")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {product.demandCategory === "high" && (
                                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                    )}
                                    <Badge className="h-6 px-2.5 min-w-[28px] justify-center text-xs font-medium border-none bg-muted text-foreground whitespace-nowrap">
                                        {product.quantity}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default function NotificationsDrawer({
    isOpen,
    onClose,
    notifications,
    adminMessages = [],
    onCreatePurchaseDocumentForSupplier,
    isSupplierGroupCompleted,
    onOpenPurchaseDocumentDetails,
    onOpenSalesDocumentDetails,
    onClearAllNotifications,
    onMarkMessageAsRead,
    onMarkNotificationAsRead,
    onMarkAllAsRead,
}: NotificationsDrawerProps) {
    const { t, currentLanguage } = useI18n();
    const [activeTab, setActiveTab] = useState<TabType>("notifications");
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [missingSupplierDialogOpen, setMissingSupplierDialogOpen] = useState(false);
    const [clearDialogOpen, setClearDialogOpen] = useState(false);
    const [missingSupplierContext, setMissingSupplierContext] = useState<{
        listName: string;
        count: number;
    } | null>(null);
    const filters: { id: FilterType; label: string }[] = [
        { id: "all", label: t("panel.notifications.all") },
        { id: "low_stock", label: t("panel.notifications.stock") },
        { id: "expiration", label: t("panel.notifications.expiration") },
        { id: "order_overdue", label: t("panel.notifications.overdue") },
        { id: "document_update", label: t("panel.notifications.updates") },
    ];
    const { style: glassStyle } = useLiquidGlass({ intensity: "subtle", satin: true });
    const { style: activeGlassStyle } = useLiquidGlass({ intensity: "medium", satin: true, variant: "primary" });
    const { style: drawerGlassStyle } = useLiquidGlass({ intensity: "strong", satin: true });
    const getExpirationStatus = (dateStr?: string) => {
        if (!dateStr) return { label: t("panel.notifications.noDate"), colorClass: "text-muted-foreground" };
        const now = new Date();
        const target = new Date(dateStr);
        const diffMs = target.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return { label: t("panel.notifications.expired"), colorClass: "text-red-500 font-semibold" };
        if (diffDays <= 7) return { label: `${diffDays}d`, colorClass: "text-orange-500 font-semibold" };
        if (diffDays <= 30) return { label: `${diffDays}d`, colorClass: "text-amber-500" };
        return { label: `${diffDays}d`, colorClass: "text-muted-foreground" };
    };
    // Filter notifications based on active filter
    const filteredNotifications = useMemo(() => {
        if (activeFilter === "all") return notifications;
        return notifications.filter(n => {
            if (activeFilter === "low_stock") return n.type === "low_stock" || !n.type;
            return n.type === activeFilter;
        });
    }, [notifications, activeFilter]);
    const groupedLowStock = useMemo(() => {
        return filteredNotifications.filter(n => n.type === "low_stock" || !n.type).map(notification => {
            const products = notification.products;
            const rawSuppliers = Array.from(new Set(products.map(p => p.supplierName?.trim() || "Sin proveedor")));
            const supplierMap = new Map<string, string>();
            const displayNames = new Map<string, string>();
            rawSuppliers.sort((a, b) => a.length - b.length).forEach(raw => {
                if (raw === "Sin proveedor") {
                    supplierMap.set(raw, raw);
                    displayNames.set(raw, raw);
                    return;
                }
                const normRaw = raw.toLowerCase();
                let matchedGroupKey: string | null = null;
                for (const groupKey of displayNames.keys()) {
                    if (groupKey === "Sin proveedor") continue;
                    const normKey = groupKey.toLowerCase();
                    if (normRaw.startsWith(normKey) && normKey.length >= 3) {
                        matchedGroupKey = groupKey;
                        break;
                    }
                }
                if (matchedGroupKey) {
                    supplierMap.set(raw, matchedGroupKey);
                } else {
                    supplierMap.set(raw, raw);
                    displayNames.set(raw, raw);
                }
            });
            const groups: Record<string, Product[]> = {};
            products.forEach(p => {
                const raw = p.supplierName?.trim() || "Sin proveedor";
                const key = supplierMap.get(raw) || raw;
                if (!groups[key]) groups[key] = [];
                groups[key].push(p);
            });
            return { ...notification, groups };
        });
    }, [filteredNotifications]);
    const otherNotifications = useMemo(() => {
        return filteredNotifications.filter(n => n.type === "expiration" || n.type === "order_overdue" || n.type === "document_update");
    }, [filteredNotifications]);
    const unreadMessagesCount = adminMessages.filter(m => !m.read).length;
    return (
        <>
            <Drawer.Root
                open={isOpen}
                onOpenChange={(open) => !open && onClose()}
                direction="right"
            >
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[55]" />
                    <Drawer.Content
                        className="right-0 sm:right-2 top-0 sm:top-2 bottom-0 sm:bottom-2 fixed z-[60] outline-none w-full sm:w-[420px] flex"
                        style={{ "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties}
                        aria-describedby={undefined}
                    >
                        <Drawer.Title className="sr-only">{t("panel.notifications.title")}</Drawer.Title>
                        <div className="h-full w-full grow flex flex-col sm:rounded-2xl overflow-hidden" style={drawerGlassStyle}>
                            {/* Header */}
                            <div
                                data-system-bar
                                className="px-4 py-3 border-b border-border/40"
                            >
                                <div className="flex justify-between items-center">
                                    {/* Tabs */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setActiveTab("notifications")}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-base font-semibold transition-all",
                                                activeTab === "notifications"
                                                    ? "text-foreground"
                                                    : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50"
                                            )}
                                            style={activeTab === "notifications" ? glassStyle : undefined}
                                        >
                                            {t("panel.notifications.alerts")}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("messages")}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-base font-semibold transition-all flex items-center gap-1.5",
                                                activeTab === "messages"
                                                    ? "text-foreground"
                                                    : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50"
                                            )}
                                            style={activeTab === "messages" ? glassStyle : undefined}
                                        >
                                            {t("panel.notifications.messages")}
                                            {unreadMessagesCount > 0 && (
                                                <Badge className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground border-none">
                                                    {unreadMessagesCount}
                                                </Badge>
                                            )}
                                        </button>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        {activeTab === "notifications" && notifications.length > 0 && (
                                            <>
                                                {onMarkAllAsRead && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-full hover:bg-accent"
                                                        onClick={() => onMarkAllAsRead()}
                                                        aria-label={t("panel.notifications.markAllAsRead")}
                                                        title={t("panel.notifications.markAllAsRead")}
                                                    >
                                                        <CheckCheck className="h-4.5 w-4.5 text-muted-foreground" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-full hover:bg-accent"
                                                    onClick={() => setClearDialogOpen(true)}
                                                    aria-label={t("panel.notifications.clearAll")}
                                                >
                                                    <Trash2 className="h-4.5 w-4.5 text-muted-foreground" />
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-full hover:bg-accent"
                                            onClick={onClose}
                                            aria-label={t("panel.notifications.close")}
                                        >
                                            <X className="h-5 w-5 text-foreground" />
                                        </Button>
                                    </div>
                                </div>
                                {/* Filters - Only show for notifications tab */}
                                {activeTab === "notifications" && (
                                    <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                                        {filters.map((filter) => {
                                            const count = filter.id === "all"
                                                ? notifications.length
                                                : notifications.filter(n => {
                                                    if (filter.id === "low_stock") return n.type === "low_stock" || !n.type;
                                                    return n.type === filter.id;
                                                }).length;
                                            const isActive = activeFilter === filter.id;
                                            return (
                                                <button
                                                    key={filter.id}
                                                    onClick={() => setActiveFilter(filter.id)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5",
                                                        isActive
                                                            ? "text-primary-foreground"
                                                            : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                    style={isActive ? activeGlassStyle : glassStyle}
                                                >
                                                    {filter.label}
                                                    {count > 0 && (
                                                        <span className={cn(
                                                            "text-[10px]",
                                                            isActive ? "opacity-70" : "text-muted-foreground"
                                                        )}>
                                                            {count}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            {/* Content */}
                            <div className="flex-1 overflow-y-auto">
                                {activeTab === "notifications" ? (
                                    // Notifications Content
                                    filteredNotifications.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                            <div className="h-16 w-16 rounded-full flex items-center justify-center bg-muted/50 mb-4">
                                                <Bell className="h-8 w-8 text-muted-foreground/50" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-foreground mb-1">
                                                {activeFilter === "all" ? t("panel.notifications.everythingControl") : t("panel.notifications.noAlerts")}
                                            </h3>
                                            <p className="text-sm text-muted-foreground max-w-[240px]">
                                                {activeFilter === "all"
                                                    ? t("panel.notifications.noPendingAlerts")
                                                    : t("panel.notifications.noAlertsOf", { type: (filters.find(f => f.id === activeFilter)?.label || "").toLowerCase() })
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-4 space-y-3">
                                            <Accordion type="multiple" defaultValue={filteredNotifications.map(n => `${n.listId}:${n.type || "low_stock"}`)} className="space-y-3">
                                                {/* Render Low Stock Notifications */}
                                                {groupedLowStock.map((notification) => {
                                                    const itemKey = `${notification.listId}:${notification.type || "low_stock"}`;
                                                    return (
                                                        <AccordionItem
                                                            key={itemKey}
                                                            value={itemKey}
                                                            className="border border-border rounded-xl overflow-hidden bg-card"
                                                        >
                                                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 group">
                                                                <div className="flex items-center justify-between w-full pr-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-orange-500/15">
                                                                            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                                        </div>
                                                                        <span className="text-sm font-semibold text-foreground">
                                                                            {getNotificationTitle(notification, t)}
                                                                        </span>
                                                                    </div>
                                                                    <Badge variant="secondary" className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border-none">
                                                                        {notification.products.length}
                                                                    </Badge>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent>
                                                                <div className="mt-0">
                                                                    {Object.entries(notification.groups).map(([supplier, products]) => (
                                                                        <SupplierGroup
                                                                            key={supplier}
                                                                            supplier={supplier}
                                                                            products={products}
                                                                            notification={notification}
                                                                            isCompleted={isSupplierGroupCompleted?.(notification.listId, supplier) ?? false}
                                                                            onCreatePurchaseDocument={() => {
                                                                                onCreatePurchaseDocumentForSupplier?.(notification.listId, supplier, products);
                                                                            }}
                                                                            onMissingSupplier={() => {
                                                                                setMissingSupplierContext({ listName: notification.listName, count: products.length });
                                                                                setMissingSupplierDialogOpen(true);
                                                                            }}
                                                                            t={t}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    );
                                                })}
                                                {/* Render Other Notifications (Expiration, Overdue, Document Updates) */}
                                                {otherNotifications.map((notification) => {
                                                    const itemKey = `${notification.listId}:${notification.type}`;
                                                    const isExpiration = notification.type === "expiration";
                                                    const isUpdate = notification.type === "document_update";
                                                    return (
                                                        <AccordionItem
                                                            key={itemKey}
                                                            value={itemKey}
                                                            className="border border-border rounded-xl overflow-hidden bg-card"
                                                        >
                                                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 group">
                                                                <div className="flex items-center justify-between w-full pr-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={cn(
                                                                            "h-8 w-8 rounded-full flex items-center justify-center",
                                                                            isExpiration ? "bg-amber-500/15" : isUpdate ? "bg-blue-500/15" : "bg-red-500/15"
                                                                        )}>
                                                                            {isExpiration
                                                                                ? <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                                                : isUpdate
                                                                                    ? <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                                    : <Calendar className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                                            }
                                                                        </div>
                                                                        <span className="text-sm font-semibold text-foreground">
                                                                            {getNotificationTitle(notification, t)}
                                                                        </span>
                                                                    </div>
                                                                    <Badge variant="secondary" className={cn(
                                                                        "border-none",
                                                                        isExpiration
                                                                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                                                            : isUpdate
                                                                                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                                                                                : "bg-red-500/15 text-red-600 dark:text-red-400"
                                                                    )}>
                                                                        {notification.products.length}
                                                                    </Badge>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="px-4 pb-4">
                                                                <div className="space-y-1.5 mt-2">
                                                                    {notification.products.map((item) => {
                                                                        const status = isExpiration ? getExpirationStatus(item.expirationDate) : null;
                                                                        return (
                                                                            <div
                                                                                key={item.id}
                                                                                className="group/item flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                                                                            >
                                                                                <div className="flex items-center gap-3 min-w-0 pr-2">
                                                                                    <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-muted shrink-0 p-0.5 overflow-hidden">
                                                                                        {item.image ? (
                                                                                            item.image.startsWith("data:application/pdf") ? (
                                                                                                <div className="h-full w-full flex items-center justify-center bg-background rounded-md">
                                                                                                    <FileText className="h-4 w-4 text-primary" />
                                                                                                </div>
                                                                                            ) : (
                                                                                                <Image
                                                                                                    src={item.image}
                                                                                                    alt={item.name}
                                                                                                    width={32}
                                                                                                    height={32}
                                                                                                    className="h-full w-full object-cover rounded-md"
                                                                                                    unoptimized={true}
                                                                                                />
                                                                                            )
                                                                                        ) : (
                                                                                            <div className="h-full w-full flex items-center justify-center bg-background text-muted-foreground rounded-md">
                                                                                                {isUpdate ? <FileText className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="min-w-0">
                                                                                        <p className="text-sm font-medium text-foreground truncate">
                                                                                            {isExpiration ? item.name : isUpdate ? item.name : t("panel.notifications.orderNumber", { number: item.name })}
                                                                                        </p>
                                                                                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                                                            {isExpiration ? (
                                                                                                item.expirationDate ? (
                                                                                                    <>
                                                                                                        <Calendar className="h-3 w-3" />
                                                                                                        {new Date(item.expirationDate).toLocaleDateString(currentLanguage === "es" ? "es-ES" : "en-US")}
                                                                                                    </>
                                                                                                ) : (
                                                                                                    t("panel.notifications.noDate")
                                                                                                )
                                                                                            ) : isUpdate ? (
                                                                                                <span className="truncate">{item.supplierName}</span> /* reusing supplierName for message */
                                                                                            ) : (
                                                                                                <span className="truncate">{item.supplierName}</span>
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    {isExpiration && (
                                                                                        <>
                                                                                            <Badge className="h-6 px-2.5 min-w-[28px] justify-center text-xs font-medium border-none bg-muted text-foreground whitespace-nowrap">
                                                                                                {item.quantity}
                                                                                            </Badge>
                                                                                            <span className={cn("text-xs whitespace-nowrap", status?.colorClass)}>
                                                                                                {status?.label}
                                                                                            </span>
                                                                                        </>
                                                                                    )}
                                                                                    {isUpdate && onMarkNotificationAsRead && (
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                                                            title={t("panel.notifications.markAsRead")}
                                                                                            onClick={() => onMarkNotificationAsRead(item.id)}
                                                                                        >
                                                                                            <Check className="h-4 w-4" />
                                                                                        </Button>
                                                                                    )}
                                                                                    {!isExpiration && !isUpdate && (
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-7 w-7 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity"
                                                                                            onClick={() => {
                                                                                                const isPurchase = notification.listId === "orders-purchases-overdue";
                                                                                                if (isPurchase) onOpenPurchaseDocumentDetails?.(item.id);
                                                                                                else onOpenSalesDocumentDetails?.(item.id);
                                                                                            }}
                                                                                        >
                                                                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    );
                                                })}
                                            </Accordion>
                                        </div>
                                    )
                                ) : (
                                    // Messages Content
                                    adminMessages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                            <div className="h-16 w-16 rounded-full flex items-center justify-center bg-muted/50 mb-4">
                                                <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-foreground mb-1">
                                                {t("panel.notifications.noMessages")}
                                            </h3>
                                            <p className="text-sm text-muted-foreground max-w-[240px]">
                                                {t("panel.notifications.noAdminMessages")}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-4 space-y-3">
                                            {adminMessages.map((message) => (
                                                <button
                                                    key={message.id}
                                                    onClick={() => onMarkMessageAsRead?.(message.id)}
                                                    className={cn(
                                                        "w-full text-left p-4 rounded-xl border transition-all",
                                                        message.read
                                                            ? "bg-card border-border"
                                                            : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                                                    )}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={cn(
                                                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                                            message.read ? "bg-muted" : "bg-primary/15"
                                                        )}>
                                                            <Inbox className={cn(
                                                                "h-4 w-4",
                                                                message.read ? "text-muted-foreground" : "text-primary"
                                                            )} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <h4 className={cn(
                                                                    "text-sm truncate",
                                                                    message.read ? "font-medium text-foreground" : "font-semibold text-foreground"
                                                                )}>
                                                                    {message.title}
                                                                </h4>
                                                                {!message.read && (
                                                                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                                {message.message}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground/70 mt-2">
                                                                {new Date(message.createdAt).toLocaleDateString(currentLanguage === "es" ? "es-ES" : "en-US", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root >
            {/* Missing Supplier Dialog */}
            < AlertDialog open={missingSupplierDialogOpen} onOpenChange={setMissingSupplierDialogOpen} >
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogTitle className="text-lg font-semibold text-foreground">
                        {t("panel.notifications.configRequired")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        {t("panel.notifications.configRequiredDesc")}
                        {missingSupplierContext && (
                            <span className="block mt-4 p-3 bg-muted/50 rounded-lg text-sm font-medium text-foreground">
                                {missingSupplierContext.listName}: {missingSupplierContext.count} {t("panel.notifications.productsWithoutSupplier")}
                            </span>
                        )}
                    </AlertDialogDescription>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="w-full">
                            {t("panel.notifications.understood")}
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >
            {/* Clear Notifications Dialog */}
            < AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen} >
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogTitle className="text-lg font-semibold text-foreground">
                        {t("panel.notifications.clearConfirmTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        {t("panel.notifications.clearConfirmDesc")}
                    </AlertDialogDescription>
                    <AlertDialogFooter className="mt-4 gap-2">
                        <AlertDialogCancel>
                            {t("panel.notifications.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onClearAllNotifications?.();
                                setClearDialogOpen(false);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {t("panel.notifications.clear")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >
        </>
    );
}