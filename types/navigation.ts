/**
 * types/navigation.ts
 * Centralized navigation types used across sidebar, bottom nav and dashboard layout.
 */

export type Tab = "panel" | "lists" | "documents" | "settings";

export const ROUTE_TO_TAB: Record<string, Tab> = {
    "/panel": "panel",
    "/": "panel",
    "/lists": "lists",
    "/documents": "documents",
    "/settings": "settings",
};

export const TAB_TO_ROUTE: Record<Tab, string> = {
    panel: "/panel",
    lists: "/lists",
    documents: "/documents",
    settings: "/settings",
};
