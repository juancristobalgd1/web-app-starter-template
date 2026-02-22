"use client";

import { Header } from "@/components/shared/header";
import { AnimatedFab } from "@/components/ui/animated-fab";
import { GlassCard } from "@/components/ui/satin-liquid-glass_legacy";
import { Plus, Star, Search, Bell } from "lucide-react";

export default function PanelPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Panel"
        className="px-6 md:px-8"
        rightActions={[
          {
            icon: <Search className="w-5 h-5" />,
            onClick: () => console.log("Buscar"),
            ariaLabel: "Buscar",
          },
          {
            icon: <Bell className="w-5 h-5" />,
            onClick: () => console.log("Notificaciones"),
            ariaLabel: "Notificaciones",
            badge: 62,
          },
        ]}
      />

      <div className="flex-1 p-8 md:p-10 space-y-4 pl-10 pr-10">
        {/* Sección de actividad reciente */}
        <div className="space-y-2 px-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-6">
            Actividad reciente
          </h2>
          <div className="empty-state mt-8">
            <span className="empty-state-icon text-5xl">📋</span>
            <p className="font-medium text-foreground">
              Sin actividad reciente
            </p>
            <p className="text-sm">Los registros aparecerán aquí</p>
          </div>
        </div>
      </div>

      {/* FAB */}
      <AnimatedFab
        items={[
          {
            icon: <Star className="h-5 w-5" />,
            label: "Acción 1",
            onClick: () => console.log("Acción 1"),
          },
          {
            icon: <Plus className="h-5 w-5" />,
            label: "Acción 2",
            onClick: () => console.log("Acción 2"),
          },
        ]}
        ariaLabel="Nuevo"
      />
    </div>
  );
}
