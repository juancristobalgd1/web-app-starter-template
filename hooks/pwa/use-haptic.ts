"use client";

/**
 * hapticTap – trigger a small vibration if supported.
 */
export function hapticTap(pattern: VibratePattern = 10) {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}
