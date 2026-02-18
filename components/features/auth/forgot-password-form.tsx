"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/satin-liquid-glass";
import { Mail, ArrowLeft } from "lucide-react";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email,     setEmail]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent,      setSent]      = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: implementar recuperación de contraseña
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setSent(true);
  };

  return (
    <GlassCard className="!rounded-2xl !p-6 space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Recuperar contraseña</h2>
        <p className="text-sm text-muted-foreground">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      {sent ? (
        <div className="text-center py-4 space-y-2">
          <span className="text-4xl">📧</span>
          <p className="font-medium text-foreground">Correo enviado</p>
          <p className="text-sm text-muted-foreground">
            Revisa tu bandeja de entrada en <strong>{email}</strong>
          </p>
          <Button variant="outline" onClick={onBack} className="mt-4 w-full">
            Volver al inicio de sesión
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground" />
                Enviando...
              </span>
            ) : "Enviar enlace"}
          </Button>
        </form>
      )}
    </GlassCard>
  );
}
