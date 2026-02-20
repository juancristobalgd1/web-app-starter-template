import { useCallback } from "react";

export function useHaptics() {
    const vibrate = useCallback((pattern: number | number[]) => {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch (error) {
                console.warn("Haptics (vibration) failed:", error);
            }
        }
    }, []);

    const vibrateSuccess = useCallback(() => vibrate([10, 30, 10]), [vibrate]);
    const vibrateError = useCallback(() => vibrate([50, 100, 50]), [vibrate]);
    const vibrateLight = useCallback(() => vibrate(10), [vibrate]);
    const vibrateMedium = useCallback(() => vibrate(20), [vibrate]);
    const vibrateHeavy = useCallback(() => vibrate(40), [vibrate]);

    return {
        vibrate,
        vibrateSuccess,
        vibrateError,
        vibrateLight,
        vibrateMedium,
        vibrateHeavy,
        isSupported: typeof navigator !== "undefined" && "vibrate" in navigator,
    };
}
