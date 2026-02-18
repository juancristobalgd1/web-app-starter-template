"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SplashScreen } from "@/components/shared/splash-screen";

interface SplashContextValue {
  hasShownSplash: boolean;
}

const SplashContext = createContext<SplashContextValue>({ hasShownSplash: false });

export function useSplash() {
  return useContext(SplashContext);
}

/**
 * SplashProvider – muestra la splash screen al inicio
 * y expone `hasShownSplash` para saber si ya se completó.
 */
export function SplashProvider({ children }: { children: ReactNode }) {
  const [hasShownSplash, setHasShownSplash] = useState(false);

  return (
    <SplashContext.Provider value={{ hasShownSplash }}>
      {!hasShownSplash && (
        <SplashScreen onLoadComplete={() => setHasShownSplash(true)} />
      )}
      <div style={{ visibility: hasShownSplash ? "visible" : "hidden" }}>
        {children}
      </div>
    </SplashContext.Provider>
  );
}
