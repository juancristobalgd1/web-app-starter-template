import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?:  string;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Input – campo de texto accesible y mobile-first.
 * Font-size 16px siempre para prevenir el zoom automático en iOS.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              /* Base */
              "flex w-full rounded-2xl border border-border bg-input/50",
              "px-4 h-[42px] text-base text-foreground shadow-sm backdrop-blur-sm",
              "placeholder:text-muted-foreground/70",
              /* Font size 16px – previene zoom en iOS */
              "text-[16px] leading-normal",
              /* Focus */
              "focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary",
              /* Disabled */
              "disabled:cursor-not-allowed disabled:opacity-50",
              /* Error */
              error && "border-destructive focus:ring-destructive",
              /* Icons padding */
              leftIcon  && "!pl-14",
              rightIcon && "!pr-14",
              /* Transition */
              "transition-all duration-200",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-0 bottom-0 flex items-center justify-center text-muted-foreground pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-destructive font-medium">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
