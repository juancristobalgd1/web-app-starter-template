"use client";

import { useCallback } from "react";

/**
 * useI18n – stub hook for internationalization.
 * Returns a simple translation function that returns the key.
 */
export function useI18n() {
    const t = useCallback((key: string) => key, []);
    return { t };
}
