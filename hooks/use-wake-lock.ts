import { useCallback, useRef, useState, useEffect } from "react";

export function useWakeLock() {
    const [isActive, setIsActive] = useState(false);
    const wakeLockRef = useRef<any>(null);

    const isSupported = typeof window !== "undefined" && "wakeLock" in navigator;

    const request = useCallback(async () => {
        if (!isSupported) return false;

        try {
            wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
            setIsActive(true);

            wakeLockRef.current.addEventListener("release", () => {
                setIsActive(false);
                wakeLockRef.current = null;
            });

            return true;
        } catch (error) {
            console.error("Wake Lock request failed:", error);
            return false;
        }
    }, [isSupported]);

    const release = useCallback(async () => {
        if (wakeLockRef.current) {
            await wakeLockRef.current.release();
            wakeLockRef.current = null;
            setIsActive(false);
            return true;
        }
        return false;
    }, []);

    // Re-acquire wake lock if document becomes visible again
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (wakeLockRef.current !== null && document.visibilityState === "visible") {
                await request();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            release();
        };
    }, [request, release]);

    return {
        isSupported,
        isActive,
        request,
        release,
    };
}
