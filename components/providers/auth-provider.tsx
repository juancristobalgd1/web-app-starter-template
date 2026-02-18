"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

/* ── Tipos ── */
interface User {
  id:    string;
  email: string;
  name?: string;
}

interface AuthContextValue {
  user:      User | null;
  isLoading: boolean;
  signIn:    (email: string, password: string) => Promise<void>;
  signUp:    (email: string, password: string, name?: string) => Promise<void>;
  signOut:   () => Promise<void>;
}

/* ── Contexto ── */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/**
 * AuthProvider – proveedor de autenticación.
 * Reemplaza la lógica interna con tu proveedor real
 * (Supabase, Firebase, NextAuth, Clerk, etc.).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Restaurar sesión al montar */
  useEffect(() => {
    const stored = sessionStorage.getItem("__auth_user__");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* noop */ }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, _password: string) => {
    // TODO: reemplazar con tu proveedor de auth real
    const u: User = { id: crypto.randomUUID(), email, name: email.split("@")[0] };
    setUser(u);
    sessionStorage.setItem("__auth_user__", JSON.stringify(u));
  };

  const signUp = async (email: string, _password: string, name?: string) => {
    // TODO: reemplazar con tu proveedor de auth real
    const u: User = { id: crypto.randomUUID(), email, name: name || email.split("@")[0] };
    setUser(u);
    sessionStorage.setItem("__auth_user__", JSON.stringify(u));
  };

  const signOut = async () => {
    setUser(null);
    sessionStorage.removeItem("__auth_user__");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
