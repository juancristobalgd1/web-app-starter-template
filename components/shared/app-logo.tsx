import { cn } from "@/lib/utils";

interface AppLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

/**
 * AppLogo – logo de la aplicación.
 * Reemplaza el SVG y el texto con tu marca.
 */
export function AppLogo({ size = 64, showText = true, className }: AppLogoProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Icono – reemplazar con tu logo */}
      <div
        className="rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        A
      </div>

      {showText && (
        <span className="font-bold text-foreground" style={{ fontSize: size * 0.2 }}>
          Mi App
        </span>
      )}
    </div>
  );
}
