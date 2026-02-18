"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { cn } from "@/lib/utils";

/**
 * OfflineIndicator – banner fijo cuando el usuario está offline.
 * Se oculta automáticamente al recuperar la conexión.
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed top-0 left-0 right-0 z-[500]",
        "flex items-center justify-center gap-2",
        "px-4 py-2",
        "bg-yellow-500 text-yellow-950",
        "text-xs font-semibold",
        "animate-fade-in safe-top"
      )}
    >
      <span>📡</span>
      <span>Sin conexión – modo offline</span>
    </div>
  );
}
