import { useCallback, useState, useEffect } from "react";

export function useLocalNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>(
        typeof Notification !== "undefined" ? Notification.permission : "default"
    );

    const isSupported = typeof window !== "undefined" && "Notification" in window;

    const requestPermission = useCallback(async () => {
        if (!isSupported) return "denied" as NotificationPermission;

        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    }, [isSupported]);

    const showNotification = useCallback(async (title: string, options?: NotificationOptions) => {
        if (!isSupported || permission !== "granted") return null;

        // Use service worker notification if available for better PWA support
        if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(title, {
                icon: "/icons/icon-192x192.png",
                badge: "/icons/icon-192x192.png",
                ...options,
            });
            return true;
        }

        // Fallback to standard notification
        return new Notification(title, options);
    }, [isSupported, permission]);

    return {
        permission,
        isSupported,
        requestPermission,
        showNotification,
    };
}
