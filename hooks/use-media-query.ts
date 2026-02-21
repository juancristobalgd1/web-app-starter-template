"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery – custom hook to listen for media query matches.
 */
export function useMediaQuery(query: string): boolean {
    const [match, setMatch] = useState(false);

    useEffect(() => {
        const m = window.matchMedia(query);
        setMatch(m.matches);
        const listener = (e: MediaQueryListEvent) => setMatch(e.matches);
        m.addEventListener("change", listener);
        return () => m.removeEventListener("change", listener);
    }, [query]);

    return match;
}
