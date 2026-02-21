"use client";

import { Header } from "@/components/shared/header";
 import { AnimatedFab } from "@/components/ui/animated-fab";
import { GlassCard } from "@/components/ui/satin-liquid-glass_legacy";
import { Plus, Star } from "lucide-react";

export default function PanelPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header title="Panel"  className="px-6 md:px-8" />

      <div className="flex-1 p-8 md:p-10 space-y-4">
        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-2 gap-3">
          {STAT_CARDS.map((card) => (
            <GlassCard key={card.label} className="p-4 !rounded-2xl">
              <div className="text-2xl mb-1">{card.icon}</div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Sección de actividad reciente */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            Actividad reciente
          </h2>
          <div className="empty-state mt-8">
            <span className="empty-state-icon text-5xl">📋</span>
            <p className="font-medium text-foreground">Sin actividad reciente</p>
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

const STAT_CARDS = [
  { icon: "📦", value: "0", label: "Total items" },
  { icon: "✅", value: "0", label: "Completados" },
  { icon: "⏳", value: "0", label: "Pendientes" },
  { icon: "📈", value: "0%", label: "Progreso" },
];
