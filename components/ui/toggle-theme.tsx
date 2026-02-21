"use client";

import * as React from "react";
import { MonitorCogIcon, MoonStarIcon, SunIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { icon: MonitorCogIcon, value: "system" },
  { icon: SunIcon, value: "light" },
  { icon: MoonStarIcon, value: "dark" },
] as const;

export function ToggleTheme({
  value,
  onChange,
  className,
}: {
  value?: "system" | "light" | "dark" | null;
  onChange?: (nextTheme: "system" | "light" | "dark") => void;
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="flex h-8 w-24" />;
  }

  const selectedTheme = (value ?? theme ?? "system") as "system" | "light" | "dark";

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-muted/80 inline-flex items-center overflow-hidden rounded-md border",
        className
      )}
      role="radiogroup"
    >
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "relative flex size-7 cursor-pointer items-center justify-center rounded-md transition-all",
            selectedTheme === option.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          role="radio"
          aria-checked={selectedTheme === option.value}
          aria-label={`Switch to ${option.value} theme`}
          onClick={() => {
            if (onChange) onChange(option.value);
            else setTheme(option.value);
          }}
        >
          {selectedTheme === option.value && (
            <motion.div
              layoutId="theme-option"
              transition={{ type: "spring", bounce: 0.1, duration: 0.75 }}
              className="border-muted-foreground/50 absolute inset-0 rounded-md border"
            />
          )}
          <option.icon className="size-3.5" />
        </button>
      ))}
    </motion.div>
  );
}
