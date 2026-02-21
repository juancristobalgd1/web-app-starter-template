"use client";

import { Header } from "@/components/shared/header";
import { AnimatedFab } from "@/components/ui/animated-fab";
import { Plus } from "lucide-react";

export default function ListsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header title="Listas"  className="px-6 md:px-8" />

      <div className="flex-1 p-8 md:p-10">
        {/* Filtros */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
          {["Todas", "Activas", "Completadas", "Archivadas"].map((f) => (
            <button
              key={f}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card text-foreground first:bg-primary first:text-primary-foreground first:border-primary"
            >
              {f}
            </button>
          ))}
        </div>

        {/* Lista vacía */}
        <div className="empty-state mt-8">
          <span className="empty-state-icon text-5xl">📝</span>
          <p className="font-medium text-foreground">No hay listas aún</p>
          <p className="text-sm">Toca + para crear una nueva lista</p>
        </div>
      </div>

      <AnimatedFab
        items={[
          {
            icon: <Plus className="h-5 w-5" />,
            label: "Nueva lista",
            onClick: () => console.log("Nueva lista"),
          },
        ]}
        ariaLabel="Nueva lista"
      />
    </div>
  );
}
