import { useCallback, useState } from "react";

export function useBackgroundSync() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSupported = typeof window !== "undefined" && "serviceWorker" in navigator && "SyncManager" in window;

    const registerSync = useCallback(async (tag: string) => {
        if (!isSupported) {
            setError("Background Sync not supported");
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            const registration = await navigator.serviceWorker.ready;
            await (registration as any).sync.register(tag);
            setLoading(false);
            return true;
        } catch (err: any) {
            setLoading(false);
            setError(err.message || "Failed to register background sync");
            return false;
        }
    }, [isSupported]);

    return {
        isSupported,
        loading,
        error,
        registerSync,
    };
}
