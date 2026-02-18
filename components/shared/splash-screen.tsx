"use client";

import { useEffect, useState, useRef } from "react";
import { AppLogo } from "./app-logo";

interface SplashScreenProps {
  onLoadComplete: () => void;
}

/**
 * SplashScreen – pantalla de carga inicial.
 * Anima el logo y muestra una barra de progreso.
 * Se desvanece suavemente al completarse.
 */
export function SplashScreen({ onLoadComplete }: SplashScreenProps) {
  const [show,            setShow]            = useState(true);
  const [fadeOut,         setFadeOut]         = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const completionRef      = useRef(false);
  const onLoadCompleteRef  = useRef(onLoadComplete);

  useEffect(() => { onLoadCompleteRef.current = onLoadComplete; }, [onLoadComplete]);

  useEffect(() => {
    const duration = 800;
    const interval = 30;
    const step     = 100 / (duration / interval);
    let current    = 0;
    let fadeTimeout: ReturnType<typeof setTimeout> | undefined;
    let hideTimeout: ReturnType<typeof setTimeout> | undefined;

    const timer = setInterval(() => {
      current += step;
      setLoadingProgress(Math.min(current, 100));

      if (current >= 100 && !completionRef.current) {
        clearInterval(timer);
        completionRef.current = true;

        fadeTimeout = setTimeout(() => {
          setFadeOut(true);
          hideTimeout = setTimeout(() => {
            setShow(false);
            onLoadCompleteRef.current();
          }, 500);
        }, 100);
      }
    }, interval);

    return () => {
      clearInterval(timer);
      if (fadeTimeout) clearTimeout(fadeTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-b from-background via-background to-primary/10 flex flex-col items-center justify-center z-[var(--z-splash)] transition-all duration-500 safe-top safe-bottom ${
        fadeOut ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20 animate-float"
            style={{
              left:  `${15 + i * 14}%`,
              top:   `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className={`relative mb-8 ${fadeOut ? "" : "animate-bounce-slow"}`}>
        <div className="absolute -inset-8 bg-primary/20 rounded-full opacity-50 blur-2xl animate-pulse" />
        <AppLogo size={120} showText={false} />
      </div>

      <h2 className="text-xl font-bold text-foreground">Mi App</h2>
      <p className="text-muted-foreground mt-1 text-sm tracking-wide">
        Tu descripción aquí
      </p>

      {/* Barra de progreso */}
      <div className="mt-12 w-64 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
    </div>
  );
}
