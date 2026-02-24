"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log to your error tracking service (Sentry, LogRocket, etc.)
        console.error("[DashboardError]", error);
    }, [error]);

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
