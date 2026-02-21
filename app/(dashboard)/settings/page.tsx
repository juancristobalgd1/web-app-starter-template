"use client";

import {
  ChevronRight,
  MessageSquare,
  Hash,
  CreditCard,
  Globe,
  Palette,
  Bell,
  Cloud,
  RefreshCcw,
  Star,
  Send,
  Trash2,
  Package,
  Users,
  Percent,
  Wallet,
  BarChart2,
  FileText,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Header } from "@/components/shared/header";

// Fixed palette: render correctly regardless of Tailwind JIT
const COLOR_CONFIG = {
  purple: { bg: "rgba(139, 92, 246, 0.10)", color: "rgb(109, 40, 217)" },
  pink: { bg: "rgba(236, 72, 153, 0.10)", color: "rgb(157, 23, 77)" },
  indigo: { bg: "rgba(99, 102, 241, 0.10)", color: "rgb(67, 56, 202)" },
  sky: { bg: "rgba(14, 165, 233, 0.10)", color: "rgb(3, 105, 161)" },
  orange: { bg: "rgba(249, 115, 22, 0.10)", color: "rgb(194, 65, 12)" },
  teal: { bg: "rgba(20, 184, 166, 0.10)", color: "rgb(15, 118, 110)" },
  blue: { bg: "rgba(59, 130, 246, 0.10)", color: "rgb(29, 78, 216)" },
  amber: { bg: "rgba(245, 158, 11, 0.10)", color: "rgb(146, 64, 14)" },
  red: { bg: "rgba(239, 68, 68, 0.10)", color: "rgb(185, 28, 28)" },
  green: { bg: "rgba(34, 197, 94, 0.10)", color: "rgb(21, 128, 61)" },
  emerald: { bg: "rgba(16, 185, 129, 0.10)", color: "rgb(6, 95, 70)" },
  lime: { bg: "rgba(132, 204, 22, 0.10)", color: "rgb(63, 98, 18)" },
  cyan: { bg: "rgba(6, 182, 212, 0.10)", color: "rgb(14, 116, 144)" },
};

type ColorKey = keyof typeof COLOR_CONFIG;

interface SettingsItemData {
  icon: any;
  label: string;
  sublabel: string;
  color: ColorKey;
  danger?: boolean;
}

interface Section {
  title?: string;
  items: SettingsItemData[];
}

const SECTIONS: Section[] = [
  {
    title: "Empresa",
    items: [
      {
        icon: CreditCard,
        label: "Suscripción",
        sublabel: "Gestionar plan y facturación",
        color: "emerald",
      },
      {
        icon: Users,
        label: "Perfil",
        sublabel: "Gestionar datos de la empresa",
        color: "blue",
      },
      {
        icon: Users,
        label: "Equipo",
        sublabel: "Gestionar miembros y permisos",
        color: "indigo",
      },
      {
        icon: Percent,
        label: "Impuestos",
        sublabel: "IVA 21% (21%)",
        color: "green",
      },
      {
        icon: Wallet,
        label: "Moneda",
        sublabel: "Euro (EUR) €",
        color: "amber",
      },
    ],
  },
  {
    title: "Ventas & CRM",
    items: [
      {
        icon: MessageSquare,
        label: "Comunicación",
        sublabel: "Configurar plantillas de email, SMS y WhatsApp",
        color: "purple",
      },
      {
        icon: Hash,
        label: "Prefijos",
        sublabel: "Configura la numeración para documentos",
        color: "pink",
      },
      {
        icon: CreditCard,
        label: "Pasarela de pagos",
        sublabel: "Cómo pagan tus clientes",
        color: "indigo",
      },
    ],
  },
  {
    title: "App y Preferencias",
    items: [
      { icon: Globe, label: "Idioma", sublabel: "Idioma", color: "sky" },
      {
        icon: Palette,
        label: "Tema y Apariencia",
        sublabel: "Claro",
        color: "purple",
      },
      {
        icon: Bell,
        label: "Notificaciones",
        sublabel: "Activadas",
        color: "orange",
      },
    ],
  },
  {
    title: "Datos",
    items: [
      {
        icon: Cloud,
        label: "Copia de seguridad y restauración",
        sublabel: "Copia de seguridad y restauración",
        color: "teal",
      },
      {
        icon: RefreshCcw,
        label: "Restablecer a configuración predeterminada",
        sublabel: "Restablecer todos los valores",
        color: "blue",
      },
    ],
  },
  {
    title: "Soporte",
    items: [
      {
        icon: Star,
        label: "Valorar app",
        sublabel: "Deja tu valoración",
        color: "amber",
      },
      {
        icon: Send,
        label: "Enviar feedback",
        sublabel: "Sugerencias y problemas",
        color: "indigo",
      },
    ],
  },
  {
    title: "Cuenta",
    items: [
      {
        icon: Trash2,
        label: "Eliminar cuenta",
        sublabel: "Eliminar permanentemente todos tus datos",
        color: "red",
        danger: true,
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <>
      <Header title="Configuración" className="px-6 md:px-8" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        <div style={{ flex: 1, width: "100%", padding: "8px 0 80px" }}>
          {SECTIONS.map((section) => (
            <div key={section.title ?? "top"} style={{ marginBottom: 24 }}>
              {section.title && (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                    color: "var(--muted-foreground)",
                    opacity: 0.6,
                    padding: "0 16px",
                    marginBottom: 4,
                    marginTop: 8,
                  }}
                >
                  {section.title}
                </div>
              )}
              {section.items.map((item) => (
                <SettingsRow key={item.label} {...item} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        <div style={{ flex: 1, width: "100%", padding: "8px 0 80px" }}>
          {SECTIONS.map((section) => (
            <div key={section.title ?? "top"} style={{ marginBottom: 24 }}>
              {section.title && (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                    color: "var(--muted-foreground)",
                    opacity: 0.6,
                    padding: "0 16px",
                    marginBottom: 4,
                    marginTop: 8,
                  }}
                >
                  {section.title}
                </div>
              )}
              {section.items.map((item) => (
                <SettingsRow key={item.label} {...item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  sublabel,
  color,
  danger = false,
}: SettingsItemData) {
  const cfg = COLOR_CONFIG[color];
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "10px 16px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        borderRadius: 12,
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(128,128,128,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9999,
          backgroundColor: cfg.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 16, height: 16, color: cfg.color }} />
      </div>

      {/* Label + sublabel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          marginLeft: 14,
          flex: 1,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: danger ? "rgb(185,28,28)" : "var(--foreground)",
            lineHeight: "1.3",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "var(--muted-foreground)",
            opacity: 0.7,
            lineHeight: "1.3",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {sublabel}
        </span>
      </div>

      {/* Chevron */}
      <ChevronRight
        style={{
          width: 16,
          height: 16,
          color: "var(--muted-foreground)",
          opacity: 0.3,
          flexShrink: 0,
          marginLeft: 8,
        }}
      />
    </button>
  );
}
