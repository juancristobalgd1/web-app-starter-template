/**
 * types/notifications.ts
 * Shared notification types extracted from notifications-drawer.
 */

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

export type NotificationTabType = "notifications" | "messages";
export type NotificationFilterType =
    | "all"
    | "low_stock"
    | "expiration"
    | "order_overdue"
    | "document_update";
