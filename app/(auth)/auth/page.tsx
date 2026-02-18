"use client";

import { useState } from "react";
import { LoginForm } from "@/components/features/auth/login-form";
import { RegisterForm } from "@/components/features/auth/register-form";
import { ForgotPasswordForm } from "@/components/features/auth/forgot-password-form";
import { AppLogo } from "@/components/shared/app-logo";

type AuthView = "login" | "register" | "forgot-password";

export default function AuthPage() {
  const [view, setView] = useState<AuthView>("login");

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-background px-4 py-8 safe-top safe-bottom">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <AppLogo size={80} />
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Mi App</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tu descripción aquí
          </p>
        </div>
      </div>

      {/* Auth forms */}
      <div className="w-full max-w-sm space-y-4">
        {view === "login" && (
          <LoginForm
            onRegister={() => setView("register")}
            onForgotPassword={() => setView("forgot-password")}
          />
        )}
        {view === "register" && (
          <RegisterForm onLogin={() => setView("login")} />
        )}
        {view === "forgot-password" && (
          <ForgotPasswordForm onBack={() => setView("login")} />
        )}
      </div>
    </div>
  );
}
