"use client";

import { useCallback } from "react";

/**
 * useUserStorage – stub hook for localStorage/persistence.
 */
export function useUserStorage() {
    const getLocalStorageItem = useCallback((key: string) => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(key);
    }, []);

    const setLocalStorageItem = useCallback((key: string, value: string) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, value);
    }, []);

    return { getLocalStorageItem, setLocalStorageItem };
}
