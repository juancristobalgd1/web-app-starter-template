"use client";

import { PageHeader } from "@/components/shared/page-header";
import { AnimatedFab } from "@/components/ui/animated-fab";
import { FileText, Plus } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Documentos" subtitle="Facturas, presupuestos y más" />

      <div className="flex-1 p-4">
        {/* Tabs de tipo */}
        <div className="flex gap-1 mb-4 bg-muted p-1 rounded-xl">
          {["Todos", "Facturas", "Presupuestos", "Pedidos"].map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                i === 0
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Vacío */}
        <div className="empty-state mt-8">
          <span className="empty-state-icon text-5xl">🗂️</span>
          <p className="font-medium text-foreground">Sin documentos</p>
          <p className="text-sm">Crea tu primer documento con el botón +</p>
        </div>
      </div>

      <AnimatedFab
        items={[
          {
            icon: <FileText className="h-5 w-5" />,
            label: "Nueva factura",
            onClick: () => console.log("Nueva factura"),
          },
          {
            icon: <Plus className="h-5 w-5" />,
            label: "Nuevo presupuesto",
            onClick: () => console.log("Nuevo presupuesto"),
          },
        ]}
        ariaLabel="Nuevo documento"
      />
    </div>
  );
}
