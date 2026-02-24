"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, WifiOff } from "lucide-react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Check if the error is due to being offline
        setIsOffline(!navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Log to your error tracking service (Sentry, LogRocket, etc.)
        console.error("[DashboardError]", error);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [error]);

    // Auto-retry when connection comes back
    useEffect(() => {
        if (!isOffline) return;
        const handleOnline = () => {
            // Small delay to let the connection stabilize
            setTimeout(() => reset(), 500);
        };
        window.addEventListener("online", handleOnline);
        return () => window.removeEventListener("online", handleOnline);
    }, [isOffline, reset]);

    if (isOffline) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
                    <WifiOff className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                    Sin conexión
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    Comprueba tu conexión a internet e inténtalo de nuevo.
                    La página se recargará automáticamente cuando vuelvas a estar en línea.
                </p>
                <Button variant="outline" onClick={() => reset()}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
                Algo salió mal
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Ha ocurrido un error inesperado. Puedes intentar recargar la página o volver al inicio.
            </p>
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => reset()}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reintentar
                </Button>
                <Button onClick={() => (window.location.href = "/panel")}>
                    Ir al inicio
                </Button>
            </div>
            {process.env.NODE_ENV === "development" && error?.message && (
                <pre className="mt-8 p-4 bg-muted rounded-xl text-xs text-left max-w-lg overflow-auto text-muted-foreground">
                    {error.message}
                </pre>
            )}
        </div>
    );
}
