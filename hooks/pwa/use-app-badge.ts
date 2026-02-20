import { useCallback, useState } from "react";

export function useAppBadge() {
    const [isSupported] = useState(() =>
        typeof navigator !== "undefined" && "setAppBadge" in navigator
    );

    const setBadge = useCallback(async (count?: number) => {
        if (isSupported) {
            try {
                await (navigator as any).setAppBadge(count);
                return true;
            } catch (error) {
                console.error("Failed to set app badge:", error);
                return false;
            }
        }
        return false;
    }, [isSupported]);

    const clearBadge = useCallback(async () => {
        if (isSupported) {
            try {
                await (navigator as any).clearAppBadge();
                return true;
            } catch (error) {
                console.error("Failed to clear app badge:", error);
                return false;
            }
        }
        return false;
    }, [isSupported]);

    return {
        isSupported,
        setBadge,
        clearBadge,
    };
}
