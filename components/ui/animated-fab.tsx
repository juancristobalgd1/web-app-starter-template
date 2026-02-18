"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLiquidGlass } from "@/components/ui/satin-liquid-glass";

export interface FabMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface AnimatedFabProps {
  items: FabMenuItem[];
  className?: string;
  ariaLabel?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * AnimatedFab – FAB con menú expandible y animaciones escalonadas.
 * Usa LiquidGlass para el efecto glass morphism.
 * Soporta modo controlado y no controlado.
 */
export function AnimatedFab({
  items,
  className,
  ariaLabel = "Menú de acciones",
  isOpen: controlledIsOpen,
  onOpenChange,
}: AnimatedFabProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const fabButtonRef = React.useRef<HTMLButtonElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const { style: glassStyle }        = useLiquidGlass({ intensity: "medium", satin: true });
  const { style: subtleGlassStyle }  = useLiquidGlass({ intensity: "subtle", satin: false });
  const { style: primaryGlassStyle } = useLiquidGlass({ intensity: "strong", variant: "primary" });

  const setIsOpen = React.useCallback((value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setInternalIsOpen(value);
  }, [isControlled, onOpenChange]);

  const handleClose = React.useCallback(() => {
    setIsClosing(true);
    if (fabButtonRef.current) fabButtonRef.current.classList.add("animate-fab-bounce");
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      if (fabButtonRef.current) fabButtonRef.current.classList.remove("animate-fab-bounce");
    }, 300);
  }, [setIsOpen]);

  const handleItemClick = (onClick: () => void) => {
    handleClose();
    setTimeout(() => onClick(), 150);
  };

  const handleToggle = () => isOpen ? handleClose() : setIsOpen(true);

  return (
    <div
      className={cn("fixed z-50 flex flex-col items-end pointer-events-none", className)}
      style={{ right: "1.5rem", bottom: "6rem" }}
    >
      {/* Backdrop */}
      {(isOpen || isClosing) && (
        <div
          className={cn(
            "fixed inset-0 z-10 bg-black/20 backdrop-blur-[2px] pointer-events-auto",
            isClosing ? "animate-fade-out" : "animate-fade-in"
          )}
          onClick={handleClose}
        />
      )}

      {/* Ítems del menú */}
      <div
        className={cn(
          "flex flex-col items-end space-y-4 mb-5 z-20",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        role="menu"
        aria-label="Opciones"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3",
              isOpen && !isClosing
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-2 scale-95 pointer-events-none"
            )}
            style={{
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDelay: isOpen && !isClosing
                ? `${(items.length - 1 - index) * 50}ms`
                : `${(items.length - 1 - index) * 40}ms`,
            }}
            role="menuitem"
          >
            {/* Label */}
            <span
              className={cn(
                "text-sm font-medium px-4 py-2.5 rounded-xl text-foreground min-w-[120px] text-right",
                isOpen && !isClosing ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              )}
              style={{
                ...subtleGlassStyle,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: isOpen && !isClosing
                  ? `${(items.length - 1 - index) * 50 + 30}ms`
                  : `${(items.length - 1 - index) * 30}ms`,
              }}
            >
              {item.label}
            </span>

            {/* Botón circular */}
            <button
              className={cn(
                "rounded-full w-14 h-14 flex items-center justify-center",
                "text-foreground transition-all duration-200 hover:scale-105 active:scale-95",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "tap-target"
              )}
              style={{ ...glassStyle, boxShadow: "none" }}
              onClick={() => handleItemClick(item.onClick)}
              aria-label={item.label}
            >
              {item.icon}
            </button>
          </div>
        ))}
      </div>

      {/* Botón FAB principal */}
      <button
        ref={fabButtonRef}
        className={cn(
          "fab-scroll-aware w-16 h-16 z-20 pointer-events-auto rounded-full",
          "flex items-center justify-center",
          "text-primary-foreground transition-all duration-200 hover:scale-105 active:scale-95",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
        style={{ ...primaryGlassStyle, boxShadow: "none", borderRadius: "9999px" }}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <Plus
          className={cn(
            "h-7 w-7 transition-transform duration-300 ease-out",
            isOpen && !isClosing && "rotate-45"
          )}
        />
      </button>
    </div>
  );
}
