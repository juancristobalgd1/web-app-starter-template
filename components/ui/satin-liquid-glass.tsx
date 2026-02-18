"use client";

import React, { useEffect, useState, ElementType, ComponentPropsWithoutRef } from "react";

/* =====================================================================
   LiquidGlass – Componente de efecto glass morphism / satin
   Copia exacta del componente de stockli/vyyq
   ===================================================================== */

const glassConfig = {
  light: {
    satin: {
      background: "rgba(255, 255, 255, 0.65)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      boxShadow: `
        inset 0 0 0 1px rgba(255,255,255,0.8),
        inset 2px 3px 0px -2px rgba(255,255,255,1),
        inset -2px -2px 0px -2px rgba(255,255,255,0.9),
        inset -3px -8px 2px -6px rgba(255,255,255,0.7),
        inset -0.5px -1px 4px 0px rgba(0,0,0,0.08),
        inset -2px 3px 1px -2px rgba(0,0,0,0.1),
        inset 0px 4px 6px -3px rgba(0,0,0,0.1),
        inset 2px -6px 2px -4px rgba(0,0,0,0.05),
        0px 2px 8px 0px rgba(0,0,0,0.08),
        0px 8px 32px 0px rgba(0,0,0,0.12)
      `,
    },
    natural: {
      background: "rgba(255, 255, 255, 0.5)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: `
        0px 2px 8px 0px rgba(0,0,0,0.06),
        0px 8px 24px 0px rgba(0,0,0,0.08)
      `,
    },
    primary: {
      background: "color-mix(in oklch, var(--primary) 85%, transparent)",
      border: "1px solid color-mix(in oklch, var(--primary) 60%, white)",
      boxShadow: `
        inset 0 0 0 1px color-mix(in oklch, var(--primary) 40%, white),
        inset 2px 3px 0px -2px color-mix(in oklch, var(--primary) 30%, white),
        inset -2px -2px 0px -2px color-mix(in oklch, var(--primary) 35%, white),
        inset -0.5px -1px 4px 0px rgba(0,0,0,0.15),
        inset 0px 4px 6px -3px rgba(0,0,0,0.12),
        0px 4px 12px 0px color-mix(in oklch, var(--primary) 40%, transparent),
        0px 8px 32px 0px color-mix(in oklch, var(--primary) 25%, transparent)
      `,
    },
  },
  dark: {
    satin: {
      background: "rgba(30, 30, 32, 0.7)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: `
        inset 0 0 0 1px rgba(255,255,255,0.05),
        inset 2px 3px 0px -2px rgba(255,255,255,0.15),
        inset -2px -2px 0px -2px rgba(255,255,255,0.1),
        inset -3px -8px 2px -6px rgba(255,255,255,0.08),
        inset -0.5px -1px 4px 0px rgba(0,0,0,0.3),
        inset -2px 3px 1px -2px rgba(0,0,0,0.4),
        inset 0px 4px 6px -3px rgba(0,0,0,0.4),
        inset 2px -6px 2px -4px rgba(0,0,0,0.2),
        0px 2px 8px 0px rgba(0,0,0,0.3),
        0px 8px 32px 0px rgba(0,0,0,0.4)
      `,
    },
    natural: {
      background: "rgba(30, 30, 32, 0.5)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      boxShadow: `
        0px 2px 8px 0px rgba(0,0,0,0.2),
        0px 8px 24px 0px rgba(0,0,0,0.25)
      `,
    },
    primary: {
      background: "color-mix(in oklch, var(--primary) 80%, transparent)",
      border: "1px solid color-mix(in oklch, var(--primary) 50%, white 10%)",
      boxShadow: `
        inset 0 0 0 1px color-mix(in oklch, var(--primary) 30%, white),
        inset 2px 3px 0px -2px color-mix(in oklch, var(--primary) 25%, white),
        inset -2px -2px 0px -2px color-mix(in oklch, var(--primary) 20%, white),
        inset -0.5px -1px 4px 0px rgba(0,0,0,0.25),
        inset 0px 4px 6px -3px rgba(0,0,0,0.2),
        0px 4px 12px 0px color-mix(in oklch, var(--primary) 50%, transparent),
        0px 8px 32px 0px color-mix(in oklch, var(--primary) 35%, transparent)
      `,
    },
  },
};

const intensityConfig = {
  subtle: { blur: 12, saturate: 140, opacity: 0.4 },
  medium: { blur: 20, saturate: 180, opacity: 0.55 },
  strong: { blur: 28, saturate: 200, opacity: 0.7 },
};

const radiusConfig = {
  none: "0px",
  sm:   "8px",
  md:   "12px",
  lg:   "16px",
  xl:   "20px",
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px",
};

type Intensity = keyof typeof intensityConfig;
type Radius    = keyof typeof radiusConfig;

interface LiquidGlassProps<T extends ElementType = "div"> {
  as?: T;
  children?: React.ReactNode;
  className?: string;
  intensity?: Intensity;
  radius?: Radius;
  satin?: boolean;
  variant?: "satin" | "natural" | "primary";
  disableHover?: boolean;
  disableActive?: boolean;
}

type PolymorphicProps<T extends ElementType> = LiquidGlassProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof LiquidGlassProps<T>>;

export function LiquidGlass<T extends ElementType = "div">({
  as,
  children,
  className = "",
  intensity = "medium",
  radius = "2xl",
  satin = true,
  variant,
  disableHover  = false,
  disableActive = false,
  style,
  ...props
}: PolymorphicProps<T>) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", check);
    return () => { observer.disconnect(); mq.removeEventListener("change", check); };
  }, []);

  const Component    = as || "div";
  const themeConfig  = isDark ? glassConfig.dark : glassConfig.light;
  const resolvedVariant = variant || (satin ? "satin" : "natural");
  const currentGlass = themeConfig[resolvedVariant];
  const currentIntensity = intensityConfig[intensity];
  const currentRadius    = radiusConfig[radius];

  const adjustedBackground = resolvedVariant === "primary"
    ? currentGlass.background
    : currentGlass.background.replace(
        /[\d.]+\)$/,
        `${resolvedVariant === "satin" ? currentIntensity.opacity + 0.1 : currentIntensity.opacity})`
      );

  const glassStyle: React.CSSProperties = {
    background:          adjustedBackground,
    backdropFilter:      `blur(${currentIntensity.blur}px) saturate(${currentIntensity.saturate}%)`,
    WebkitBackdropFilter:`blur(${currentIntensity.blur}px) saturate(${currentIntensity.saturate}%)`,
    border:      currentGlass.border,
    boxShadow:   currentGlass.boxShadow,
    borderRadius: currentRadius,
    ...style,
  };

  return (
    <Component
      className={`${!disableHover ? "transition-transform duration-200 hover:scale-[1.02]" : ""} ${!disableActive ? "active:scale-[0.98]" : ""} ${className}`}
      style={glassStyle}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ── Hook para usar los estilos glass programáticamente ─────────────── */
export function useLiquidGlass(options?: {
  intensity?: Intensity;
  satin?: boolean;
  variant?: "satin" | "natural" | "primary";
}) {
  const [isDark, setIsDark] = useState(false);
  const intensity = options?.intensity || "medium";
  const variant   = options?.variant || (options?.satin === false ? "natural" : "satin");

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const themeConfig    = isDark ? glassConfig.dark : glassConfig.light;
  const currentGlass   = themeConfig[variant];
  const currentIntensity = intensityConfig[intensity];

  const adjustedBackground = variant === "primary"
    ? currentGlass.background
    : currentGlass.background.replace(
        /[\d.]+\)$/,
        `${variant === "satin" ? currentIntensity.opacity + 0.1 : currentIntensity.opacity})`
      );

  return {
    isDark,
    style: {
      background:          adjustedBackground,
      backdropFilter:      `blur(${currentIntensity.blur}px) saturate(${currentIntensity.saturate}%)`,
      WebkitBackdropFilter:`blur(${currentIntensity.blur}px) saturate(${currentIntensity.saturate}%)`,
      border:    currentGlass.border,
      boxShadow: currentGlass.boxShadow,
    } as React.CSSProperties,
  };
}

/* ── Pre-styled variants ─────────────────────────────────────────────── */

export function GlassCard({ children, className = "", satin = true, ...props }: Omit<PolymorphicProps<"div">, "as">) {
  return <LiquidGlass as="div" className={`p-6 ${className}`} radius="2xl" satin={satin} disableHover disableActive {...props}>{children}</LiquidGlass>;
}

export function GlassButton({ children, className = "", satin = true, ...props }: Omit<PolymorphicProps<"button">, "as">) {
  return <LiquidGlass as="button" className={`px-6 py-3 font-medium cursor-pointer ${className}`} radius="full" intensity="medium" satin={satin} {...props}>{children}</LiquidGlass>;
}

export function GlassPanel({ children, className = "", satin = true, ...props }: Omit<PolymorphicProps<"div">, "as">) {
  return <LiquidGlass as="div" className={`p-4 ${className}`} radius="xl" intensity="subtle" satin={satin} disableHover disableActive {...props}>{children}</LiquidGlass>;
}

export function GlassInput({ className = "", satin = false, ...props }: Omit<PolymorphicProps<"input">, "as" | "children"> & { satin?: boolean }) {
  return <LiquidGlass as="input" className={`px-4 py-3 outline-none placeholder:text-muted-foreground ${className}`} radius="xl" intensity="subtle" satin={satin} disableHover disableActive {...props} />;
}

export function GlassBadge({ children, className = "", satin = false, ...props }: Omit<PolymorphicProps<"span">, "as">) {
  return <LiquidGlass as="span" className={`px-3 py-1 text-sm font-medium ${className}`} radius="full" intensity="subtle" satin={satin} disableHover disableActive {...props}>{children}</LiquidGlass>;
}

export function GlassFloating({ children, className = "", satin = true, ...props }: Omit<PolymorphicProps<"div">, "as">) {
  return <LiquidGlass as="div" className={`p-4 ${className}`} radius="2xl" intensity="strong" satin={satin} disableHover disableActive {...props}>{children}</LiquidGlass>;
}

export function GlassNavbar({ children, className = "", satin = true, ...props }: Omit<PolymorphicProps<"nav">, "as">) {
  return <LiquidGlass as="nav" className={`px-6 py-4 ${className}`} radius="none" intensity="medium" satin={satin} disableHover disableActive {...props}>{children}</LiquidGlass>;
}

export function GlassIconButton({ children, className = "", size = 48, satin = true, ...props }: Omit<PolymorphicProps<"button">, "as"> & { size?: number }) {
  return <LiquidGlass as="button" className={`flex items-center justify-center cursor-pointer ${className}`} radius="full" intensity="medium" satin={satin} style={{ width: size, height: size }} {...props}>{children}</LiquidGlass>;
}
