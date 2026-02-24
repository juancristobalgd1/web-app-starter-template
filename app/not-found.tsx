import Link from "next/link";
import { AppLogo } from "@/components/shared/app-logo";

export default function NotFound() {
    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-background px-6 text-center safe-top safe-bottom">
            <div className="mb-8 relative">
                <div className="absolute -inset-8 bg-primary/10 rounded-full opacity-40 blur-2xl animate-pulse" />
                <AppLogo size={80} showText={false} />
            </div>

            <h1 className="text-7xl font-extrabold text-foreground mb-2 tracking-tight">
                404
            </h1>
            <p className="text-lg font-semibold text-foreground mb-1">
                Página no encontrada
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mb-8">
                La página que buscas no existe o ha sido movida a otra dirección.
            </p>

            <Link
                href="/panel"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
