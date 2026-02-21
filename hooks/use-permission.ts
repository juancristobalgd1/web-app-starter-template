"use client";

import { useCallback } from "react";

/**
 * usePermission – stub hook for role-based permissions.
 */
export function usePermission() {
    const getAllowedTabs = useCallback(() => ["panel", "lists", "documents", "settings"], []);

    return {
        getAllowedTabs,
        loading: false,
        role: "owner",
        canAccessAI: true,
    };
}
