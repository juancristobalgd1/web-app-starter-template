import { useState, useEffect } from "react";

interface NetworkInformation extends EventTarget {
    readonly effectiveType: "slow-2g" | "2g" | "3g" | "4g";
    readonly saveData: boolean;
    readonly downlink: number;
    readonly rtt: number;
    onchange: EventListener;
}

export function useNetworkSpeed() {
    const [connection, setConnection] = useState<{
        effectiveType: string;
        saveData: boolean;
        downlink: number;
        rtt: number;
    } | null>(null);

    useEffect(() => {
        if (typeof navigator === "undefined" || !("connection" in navigator)) {
            return;
        }

        const conn = (navigator as any).connection as NetworkInformation;

        const updateConnection = () => {
            setConnection({
                effectiveType: conn.effectiveType,
                saveData: conn.saveData,
                downlink: conn.downlink,
                rtt: conn.rtt,
            });
        };

        updateConnection();
        conn.addEventListener("change", updateConnection);
        return () => conn.removeEventListener("change", updateConnection);
    }, []);

    return {
        ...connection,
        isSupported: typeof navigator !== "undefined" && "connection" in navigator,
        isSlow: connection ? ["slow-2g", "2g", "3g"].includes(connection.effectiveType) : false,
    };
}
