"use client";

/**
 * ResizableDialog
 *
 * Modal adaptativo:
 * · Mobile  (< 640px): Vaul drawer desde abajo – arrastrable, con handle
 * · Desktop (≥ 640px): Radix UI Dialog centrado con overlay backdrop blur
 *
 * Características:
 * - Animaciones con Framer Motion
 * - Backdrop blur overlay
 * - Scroll interno con momentum (iOS)
 * - Safe area padding para notch / home bar
 * - Accesible: focus trap, ARIA, Esc para cerrar
 */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface ResizableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  disableSwipeToClose?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm:   "max-w-sm",
  md:   "max-w-lg",
  lg:   "max-w-2xl",
  xl:   "max-w-4xl",
  full: "max-w-[95vw]",
};

export function ResizableDialog({
  isOpen, onClose, title, description, children,
  footer, size = "md", disableSwipeToClose = false, className,
}: ResizableDialogProps) {
  const isMobile = useMediaQuery("(max-width: 639px)");

  return isMobile ? (
    <MobileDrawer
      isOpen={isOpen} onClose={onClose} title={title} description={description}
      footer={footer} disableSwipeToClose={disableSwipeToClose} className={className}
    >
      {children}
    </MobileDrawer>
  ) : (
    <DesktopDialog
      isOpen={isOpen} onClose={onClose} title={title} description={description}
      footer={footer} size={size} className={className}
    >
      {children}
    </DesktopDialog>
  );
}

/* ── Mobile Drawer ───────────────────────────────────────────────────── */
function MobileDrawer({ isOpen, onClose, title, description, children, footer, disableSwipeToClose, className }: Omit<ResizableDialogProps, "size">) {
  return (
    <Drawer.Root open={isOpen} onOpenChange={(o) => { if (!o) onClose(); }} dismissible={!disableSwipeToClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm" />
        <Drawer.Content className={cn(
          "fixed bottom-0 left-0 right-0 z-[400] flex flex-col",
          "bg-card rounded-t-2xl shadow-xl outline-none max-h-[92dvh]",
          "pb-[env(safe-area-inset-bottom)]",
          className
        )}>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-9 h-1 rounded-full bg-border" />
          </div>

          {(title || description) && (
            <div className="px-4 pb-3 pt-1 flex-shrink-0 border-b border-border">
              {title && <Drawer.Title className="text-base font-semibold text-foreground">{title}</Drawer.Title>}
              {description && <Drawer.Description className="text-sm text-muted-foreground mt-0.5">{description}</Drawer.Description>}
            </div>
          )}

          <div className="flex-1 overflow-y-auto scroll-momentum">{children}</div>

          {footer && (
            <div className="flex-shrink-0 border-t border-border p-4">{footer}</div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

/* ── Desktop Dialog ──────────────────────────────────────────────────── */
function DesktopDialog({ isOpen, onClose, title, description, children, footer, size = "md", className }: ResizableDialogProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogPrimitive.Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm"
                />
              </DialogPrimitive.Overlay>

              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  key="content"
                  initial={{ opacity: 0, scale: 0.94, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "fixed left-1/2 top-1/2 z-[400] -translate-x-1/2 -translate-y-1/2",
                    "flex flex-col w-full bg-card rounded-2xl shadow-xl outline-none overflow-hidden",
                    "max-h-[90vh]",
                    SIZE_MAP[size ?? "md"],
                    className
                  )}
                >
                  {(title || description) && (
                    <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border flex-shrink-0">
                      <div className="min-w-0">
                        {title && <DialogPrimitive.Title className="text-base font-semibold text-foreground leading-none">{title}</DialogPrimitive.Title>}
                        {description && <DialogPrimitive.Description className="text-sm text-muted-foreground mt-1">{description}</DialogPrimitive.Description>}
                      </div>
                      <DialogPrimitive.Close className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <X size={18} />
                        <span className="sr-only">Cerrar</span>
                      </DialogPrimitive.Close>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto scroll-momentum">{children}</div>

                  {footer && (
                    <div className="flex-shrink-0 border-t border-border px-5 py-4">{footer}</div>
                  )}
                </motion.div>
              </DialogPrimitive.Content>
            </>
          )}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
