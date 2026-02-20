import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader – cabecera estándar de página.
 * Con glass morphism, safe areas y header-shadow-animation.
 */
export function PageHeader({ title, subtitle, right, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-[200] flex-shrink-0",
        "flex items-center justify-between",
        "px-4 py-3 min-h-[56px]",
        "bg-background/80 backdrop-blur-md",
        "header-shadow-animation",
        "safe-top",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-foreground leading-none truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      {right && (
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">{right}</div>
      )}
    </header>
  );
}
