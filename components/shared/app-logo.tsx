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
    <div className={cn("flex flex-row items-center gap-3", className)}>
      {/* Icono – reemplazar con tu logo */}
      <div
        className="rounded-2xl bg-sidebar-foreground/10 flex items-center justify-center text-sidebar-foreground font-bold shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        A
      </div>

      {showText && (
        <span className="font-bold text-foreground whitespace-nowrap" style={{ fontSize: size * 0.35 }}>
          Mi App
        </span>
      )}
    </div>
  );
}
