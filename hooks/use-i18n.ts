"use client";

import { useCallback } from "react";

/**
 * useI18n – stub hook for internationalization.
 * Returns a simple translation function that returns the key.
 */
export function useI18n() {
    const translations: Record<string, string> = {
        "panel.title": "Panel",
        "lists.title": "Listas",
        "documents.title": "Documentos",
        "settings.title": "Ajustes",
    };

    const t = useCallback((key: string) => {
        return translations[key] || key;
    }, []);

    return { t };
}
