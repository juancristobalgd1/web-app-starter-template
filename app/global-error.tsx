"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[GlobalError]", error);
    }, [error]);

    return (
        <html lang="es">
            <body>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                        padding: "24px",
                        textAlign: "center",
                        fontFamily: "system-ui, sans-serif",
                        backgroundColor: "#fafafa",
                        color: "#1a1a2e",
                    }}
                >
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            backgroundColor: "rgba(220, 38, 38, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 24,
                        }}
                    >
                        <AlertTriangle style={{ width: 32, height: 32, color: "#dc2626" }} />
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                        Error inesperado
                    </h2>
                    <p style={{ fontSize: 14, color: "#64748b", maxWidth: 320, marginBottom: 24 }}>
                        La aplicación ha encontrado un error que no se pudo recuperar automáticamente.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 20px",
                            borderRadius: 8,
                            border: "1px solid #e2e8f0",
                            background: "white",
                            cursor: "pointer",
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                    >
                        <RotateCcw style={{ width: 16, height: 16 }} />
                        Reintentar
                    </button>
                </div>
            </body>
        </html>
    );
}
