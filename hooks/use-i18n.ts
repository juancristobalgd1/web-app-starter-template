"use client";

import { useCallback } from "react";

/**
 * useI18n – stub hook for internationalization.
 * Returns a translation function `t(key, params?)` and `currentLanguage`.
 * Extend the `translations` map as more keys are needed across the app.
 */
export function useI18n() {
    const currentLanguage = "es"; // change to a real locale value when wiring full i18n

    const translations: Record<string, string> = {
        // ── General ──────────────────────────────────────────────────────────
        "panel.title": "Panel",
        "lists.title": "Listas",
        "documents.title": "Documentos",
        "settings.title": "Ajustes",

        // ── Notifications drawer ──────────────────────────────────────────────
        "panel.notifications.title": "Notificaciones",
        "panel.notifications.alerts": "Alertas",
        "panel.notifications.messages": "Mensajes",
        "panel.notifications.close": "Cerrar",

        // Tabs / filters
        "panel.notifications.all": "Todas",
        "panel.notifications.stock": "Stock",
        "panel.notifications.expiration": "Vencimiento",
        "panel.notifications.overdue": "Vencidas",
        "panel.notifications.updates": "Actualizaciones",

        // Empty-state messages
        "panel.notifications.everythingControl": "¡Todo bajo control!",
        "panel.notifications.noPendingAlerts": "No hay alertas pendientes en este momento.",
        "panel.notifications.noAlerts": "Sin alertas",
        "panel.notifications.noAlertsOf": "No hay alertas de tipo {type}.",

        // Actions
        "panel.notifications.markAllAsRead": "Marcar todas como leídas",
        "panel.notifications.markAsRead": "Marcar como leída",
        "panel.notifications.clearAll": "Limpiar alertas",

        // Notification titles (with interpolation)
        "panel.notifications.expirationAt": "Vencimientos en {name}",
        "panel.notifications.salesOverdue": "Ventas vencidas",
        "panel.notifications.saleOverdue": "Venta vencida",
        "panel.notifications.purchasesOverdue": "Compras vencidas",
        "panel.notifications.purchaseOverdue": "Compra vencida",
        "panel.notifications.overdueAt": "Pedido vencido en {name}",
        "panel.notifications.lowStockAt": "Stock bajo en {name}",

        // Products / suppliers
        "panel.notifications.noSupplier": "Sin proveedor",
        "panel.notifications.repopulate": "Reponer",
        "panel.notifications.lowStock": "Stock bajo",
        "panel.notifications.missing": "Faltan {qty} {unit}",
        "panel.notifications.orderNumber": "Pedido #{number}",

        // Expiration dates
        "panel.notifications.noDate": "Sin fecha",
        "panel.notifications.expired": "Vencido",

        // Admin messages
        "panel.notifications.noMessages": "Sin mensajes",
        "panel.notifications.noAdminMessages": "No hay mensajes del administrador.",

        // Dialogs
        "panel.notifications.configRequired": "Configuración requerida",
        "panel.notifications.configRequiredDesc": "Algunos productos no tienen proveedor asignado. Asigna un proveedor para poder generar órdenes de compra.",
        "panel.notifications.productsWithoutSupplier": "productos sin proveedor",
        "panel.notifications.understood": "Entendido",
        "panel.notifications.clearConfirmTitle": "¿Limpiar todas las alertas?",
        "panel.notifications.clearConfirmDesc": "Esta acción eliminará todas las notificaciones actuales. No podrás deshacer esta acción.",
        "panel.notifications.cancel": "Cancelar",
        "panel.notifications.clear": "Limpiar",
    };

    const t = useCallback((key: string, params?: Record<string, string | number>) => {
        let value = translations[key] || key;
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                // Support both {key} and {{ key }} placeholder styles
                value = value.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, "g"), String(v));
                value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
            });
        }
        return value;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { t, currentLanguage };
}
