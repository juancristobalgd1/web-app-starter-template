"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/satin-liquid-glass";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onRegister, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      router.push("/panel");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="!rounded-2xl !p-6 space-y-7">
      <div className="space-y-1.5 mb-2">
        <h2 className="text-xl font-bold text-foreground">Iniciar sesión</h2>
        <p className="text-sm text-muted-foreground">Ingresa tus credenciales</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          required
          autoComplete="email"
        />

        <div className="space-y-2">
          <Input
            label="Contraseña"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPass(!showPass)} className="tap-target">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            required
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-primary hover:underline w-full text-right pt-1"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button type="submit" className="w-full h-12 text-base mt-6" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground" />
              Ingresando...
            </span>
          ) : "Iniciar sesión"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground pt-2">
        ¿No tienes cuenta?{" "}
        <button onClick={onRegister} className="text-primary font-medium hover:underline">
          Regístrate
        </button>
      </p>
    </GlassCard>
  );
}
