"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    /** Custom color class for the main FAB button (e.g., "bg-blue-600 hover:bg-blue-700") */
    fabColorClass?: string;
    /** Controlled mode: external open state */
    isOpen?: boolean;
    /** Controlled mode: callback when open state should change */
    onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Animated Floating Action Button with expandable menu.
 * Items animate in/out with staggered timing for a premium feel.
 * 
 * Can be used in two modes:
 * - Uncontrolled (default): manages its own open state
 * - Controlled: pass isOpen and onOpenChange props
 */
export function AnimatedFab({
    items,
    className,
    ariaLabel = "Menú de acciones",
    fabColorClass,
    isOpen: controlledIsOpen,
    onOpenChange
}: AnimatedFabProps) {
    const [internalIsOpen, setInternalIsOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const fabButtonRef = React.useRef<HTMLButtonElement>(null);

    // Determine if we're in controlled or uncontrolled mode
    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

    // Get liquid glass styles
    const { style: glassStyle } = useLiquidGlass({ intensity: "medium", satin: true });
    const { style: subtleGlassStyle } = useLiquidGlass({ intensity: "subtle", satin: false });
    const { style: primaryGlassStyle } = useLiquidGlass({ intensity: "strong", variant: "primary" });

    const setIsOpen = React.useCallback((value: boolean) => {
        if (isControlled) {
            onOpenChange?.(value);
        } else {
            setInternalIsOpen(value);
        }
    }, [isControlled, onOpenChange]);

    const handleClose = React.useCallback(() => {
        setIsClosing(true);
        // Trigger bounce animation on the FAB button
        if (fabButtonRef.current) {
            fabButtonRef.current.classList.add('animate-fab-bounce');
        }
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
            if (fabButtonRef.current) {
                fabButtonRef.current.classList.remove('animate-fab-bounce');
            }
        }, 300);
    }, [setIsOpen]);

    const handleItemClick = (onClick: () => void) => {
        handleClose();
        setTimeout(() => onClick(), 150);
    };

    const handleToggle = () => {
        if (isOpen) {
            handleClose();
        } else {
            setIsOpen(true);
        }
    };

    return (
        <div
            className={cn("fixed z-50 flex flex-col items-end pointer-events-none", className)}
            style={{ right: '1.5rem', bottom: '6rem' }}
        >
            {/* Backdrop */}
            {(isOpen || isClosing) && (
                <div
                    className={cn(
                        "fixed inset-0 z-10 bg-black/20 backdrop-blur-[2px] pointer-events-auto",
                        isClosing ? "animate-fade-out" : "animate-fade-in"
                    )}
                    onClick={handleClose}
                    style={{
                        animationDuration: '0.2s',
                        opacity: isClosing ? 0 : undefined
                    }}
                />
            )}

            {/* FAB Menu Items */}
            <div
                className={cn(
                    "flex flex-col items-end space-y-4 mb-5 z-20",
                    isOpen ? "pointer-events-auto" : "pointer-events-none"
                )}
                role="menu"
                aria-label="Opciones de acciones"
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
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            transitionDelay: isOpen && !isClosing
                                ? `${(items.length - 1 - index) * 50}ms`
                                : `${(items.length - 1 - index) * 40}ms`,
                        }}
                        role="menuitem"
                    >
                        {/* Label - tamaño mejorado para accesibilidad */}
                        <span
                            className={cn(
                                "text-sm font-medium px-4 py-2.5 rounded-xl text-foreground",
                                "min-w-[120px] text-right",
                                isOpen && !isClosing ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                            )}
                            style={{
                                ...subtleGlassStyle,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                transitionDelay: isOpen && !isClosing
                                    ? `${(items.length - 1 - index) * 50 + 30}ms`
                                    : `${(items.length - 1 - index) * 30}ms`,
                            }}
                            id={`fab-label-${index}`}
                        >
                            {item.label}
                        </span>

                        {/* Button - touch target mínimo 44x44 (WCAG) */}
                        <Button
                            className={cn(
                                "rounded-full w-14 h-14 min-w-[44px] min-h-[44px] text-foreground",
                                "transition-all duration-200 hover:scale-105 active:scale-95",
                                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                "bg-transparent hover:bg-transparent border-0"
                            )}
                            style={{ ...glassStyle, boxShadow: 'none' }}
                            onClick={() => handleItemClick(item.onClick)}
                            aria-labelledby={`fab-label-${index}`}
                        >
                            {item.icon}
                        </Button>
                    </div>
                ))}
            </div>

            {/* Main FAB Button */}
            <Button
                ref={fabButtonRef}
                className={cn(
                    "floating-action-button fab-scroll-aware w-16 h-16 z-20 pointer-events-auto",
                    "bg-transparent hover:bg-transparent border-0 text-primary-foreground",
                    "transition-all duration-200 hover:scale-105 active:scale-95",
                    fabColorClass
                )}
                style={{
                    ...primaryGlassStyle,
                    boxShadow: 'none',
                    borderRadius: '9999px',
                }}
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
            </Button>
        </div>
    );
}
