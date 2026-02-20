import { useState, useEffect, useCallback } from "react";

type OrientationLockType =
    | "any"
    | "natural"
    | "landscape"
    | "portrait"
    | "portrait-primary"
    | "portrait-secondary"
    | "landscape-primary"
    | "landscape-secondary";

export function useOrientation() {
    const [orientation, setOrientation] = useState<{
        type: string;
        angle: number;
        isLandscape: boolean;
    }>({
        type: "portrait-primary",
        angle: 0,
        isLandscape: false,
    });

    const getOrientationData = () => {
        if (typeof window === "undefined" || !window.screen.orientation) {
            return {
                type: "unknown",
                angle: 0,
                isLandscape: typeof window !== "undefined" ? window.innerWidth > window.innerHeight : false,
            };
        }

        const { type, angle } = window.screen.orientation;
        return {
            type,
            angle,
            isLandscape: type.startsWith("landscape"),
        };
    };

    useEffect(() => {
        if (typeof window === "undefined") return;

        setOrientation(getOrientationData());

        const handler = () => {
            setOrientation(getOrientationData());
        };

        if (window.screen.orientation) {
            window.screen.orientation.addEventListener("change", handler);
        } else {
            window.addEventListener("orientationchange", handler);
        }

        return () => {
            if (window.screen.orientation) {
                window.screen.orientation.removeEventListener("change", handler);
            } else {
                window.removeEventListener("orientationchange", handler);
            }
        };
    }, []);

    const lock = useCallback(async (orientationType: OrientationLockType) => {
        const screenOrientation = (window.screen as any).orientation;
        if (typeof window !== "undefined" && screenOrientation && screenOrientation.lock) {
            try {
                await screenOrientation.lock(orientationType);
                return true;
            } catch (error) {
                console.error("Failed to lock orientation:", error);
                return false;
            }
        }
        return false;
    }, []);

    const unlock = useCallback(() => {
        const screenOrientation = (window.screen as any).orientation;
        if (typeof window !== "undefined" && screenOrientation && screenOrientation.unlock) {
            screenOrientation.unlock();
            return true;
        }
        return false;
    }, []);

    return {
        ...orientation,
        lock,
        unlock,
        isSupported: typeof window !== "undefined" && !!window.screen.orientation,
    };
}
