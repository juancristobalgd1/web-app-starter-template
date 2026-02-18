import { PageHeader } from "@/components/shared/page-header";
import { GlassCard } from "@/components/ui/satin-liquid-glass";
import { ChevronRight, Bell, Moon, Globe, Shield, HelpCircle, LogOut } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Ajustes" />

      <div className="flex-1 p-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* Perfil */}
        <GlassCard className="!p-0 overflow-hidden !rounded-2xl">
          <div className="flex items-center gap-4 p-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
              👤
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">Usuario</p>
              <p className="text-sm text-muted-foreground truncate">usuario@email.com</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-auto" />
          </div>
        </GlassCard>

        {/* Secciones */}
        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-2">
              {section.title}
            </p>
            <GlassCard className="!p-0 overflow-hidden !rounded-2xl divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-3 p-4 w-full text-left hover:bg-muted/50 active:bg-muted transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-foreground" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                  {item.value && (
                    <span className="text-xs text-muted-foreground">{item.value}</span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </GlassCard>
          </div>
        ))}

        {/* Cerrar sesión */}
        <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-destructive/30 text-destructive hover:bg-destructive/5 active:bg-destructive/10 transition-colors tap-target">
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

const SETTINGS_SECTIONS = [
  {
    title: "Preferencias",
    items: [
      { icon: Moon,   label: "Tema",       value: "Sistema" },
      { icon: Globe,  label: "Idioma",     value: "Español" },
      { icon: Bell,   label: "Notificaciones" },
    ],
  },
  {
    title: "Cuenta",
    items: [
      { icon: Shield,     label: "Privacidad y seguridad" },
      { icon: HelpCircle, label: "Ayuda y soporte" },
    ],
  },
];
