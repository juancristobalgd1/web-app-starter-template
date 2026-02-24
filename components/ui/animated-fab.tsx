"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FabMenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface AnimatedFabProps {
  items: FabMenuItem[];
  className?: string;
  ariaLabel?: string;
  fabColorClass?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const CIRCLE_SIZE = 56;   // px – icon circle diameter
const FAB_SIZE = 56;   // px – main FAB diameter
const ROW_GAP = 20;   // px – gap between item rows
const FAB_GAP = 28;   // px – gap between last item and main FAB

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

  const setIsOpen = React.useCallback(
    (v: boolean) => { if (isControlled) onOpenChange?.(v); else setInternalIsOpen(v); },
    [isControlled, onOpenChange]
  );

  const handleClose = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(() => { setIsOpen(false); setIsClosing(false); }, 280);
  }, [setIsOpen]);

  const handleItemClick = (onClick: () => void) => {
    handleClose();
    setTimeout(onClick, 140);
  };

  const handleToggle = () => (isOpen ? handleClose() : setIsOpen(true));

  const visible = isOpen && !isClosing;

  return (
    <div
      className={cn("fixed z-50 flex flex-col items-end pointer-events-none", className)}
      style={{ right: 20, bottom: 88 }}
    >
      {/* Backdrop */}
      {(isOpen || isClosing) && (
        <div
          className="fixed inset-0 z-10 pointer-events-auto"
          style={{
            background: "rgba(0,0,0,0.14)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            opacity: isClosing ? 0 : 1,
            transition: "opacity 0.22s ease",
          }}
          onClick={handleClose}
        />
      )}

      {/* ── Menu items ────────────────────────────────────── */}
      <div
        className="z-20"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          rowGap: ROW_GAP,              // ← explicit pixel gap between rows
          marginBottom: FAB_GAP,        // ← explicit pixel gap before FAB
          pointerEvents: visible ? "auto" : "none",
        }}
        role="menu"
      >
        {items.map((item, index) => {
          const delay = visible
            ? `${(items.length - 1 - index) * 55}ms`
            : `${index * 30}ms`;

          return (
            <div
              key={index}
              role="menuitem"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.92)",
                transition: "opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                transitionDelay: delay,
              }}
            >
              {/* Label pill */}
              <button
                onClick={() => handleItemClick(item.onClick)}
                aria-label={item.label}
                style={{
                  height: CIRCLE_SIZE,
                  minWidth: 180,
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderRadius: 16,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "var(--popover)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: "0 2px 14px rgba(0,0,0,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--popover-foreground)",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </button>

              {/* Icon circle */}
              <button
                onClick={() => handleItemClick(item.onClick)}
                aria-label={item.label}
                style={{
                  width: CIRCLE_SIZE,
                  height: CIRCLE_SIZE,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "var(--popover)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: "0 2px 14px rgba(0,0,0,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--popover-foreground)",
                  flexShrink: 0,
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                {item.icon}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Main FAB ──────────────────────────────────────── */}
      <button
        ref={fabButtonRef}
        className="fab-scroll-aware z-20 pointer-events-auto"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={handleToggle}
        style={{
          width: FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          backgroundColor: "var(--primary)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {visible
          ? <X className="h-6 w-6" style={{ color: "#fff" }} />
          : <Plus className="h-6 w-6" style={{ color: "#fff" }} />
        }
      </button>
    </div>
  );
}
