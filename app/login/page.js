"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

function LightningIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function EmailIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGoogleLogin() {
    setError(null);
    setLoading(true);

    const { error: authError } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <style>{`
        @keyframes loginFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .login-card-enter {
          animation: loginFadeIn 0.5s ease-out forwards;
        }
        .login-input:focus {
          border-color: #7C3AED;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }
        .login-btn-primary:hover:not(:disabled) {
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.55), 0 0 0 1px rgba(157, 92, 246, 0.3);
        }
      `}</style>

      <div
        className="relative flex min-h-screen items-center justify-center px-5 py-14"
        style={{
          backgroundColor: "#0B0B0B",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(124, 58, 237, 0.18) 0%, rgba(124, 58, 237, 0.06) 40%, transparent 70%)",
        }}
      >
        <div
          className="login-card-enter relative w-full max-w-[440px] rounded-[24px] border border-[#7C3AED]/25 p-10 sm:p-12"
          style={{
            background: "rgba(17, 17, 17, 0.72)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 0 0 1px rgba(124, 58, 237, 0.08), 0 24px 64px rgba(0, 0, 0, 0.5), 0 0 80px rgba(124, 58, 237, 0.08)",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{
                background: "#7C3AED",
                boxShadow: "0 0 24px rgba(124, 58, 237, 0.45)",
              }}
            >
              <LightningIcon className="h-5 w-5" />
            </span>
            <span
              className="font-display text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-syne), system-ui, sans-serif" }}
            >
              Trendify AI
            </span>
          </Link>

          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#A78BFA]"
              style={{
                borderColor: "rgba(124, 58, 237, 0.35)",
                background: "rgba(124, 58, 237, 0.1)",
              }}
            >
              ✦ Plataforma #1 de cortes virais
            </span>
          </div>

          {/* Headings */}
          <div className="mb-10 text-center">
            <h1
              className="font-display font-bold leading-tight text-white"
              style={{
                fontSize: "32px",
                fontFamily: "var(--font-syne), system-ui, sans-serif",
              }}
            >
              Bem-vindo de volta
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">
              Entre para transformar seus vídeos em virais
            </p>
          </div>

          {error && (
            <p
              className="mb-6 rounded-xl border px-4 py-3 text-center text-sm text-red-400"
              style={{
                borderColor: "rgba(239, 68, 68, 0.3)",
                background: "rgba(239, 68, 68, 0.08)",
              }}
            >
              {error}
            </p>
          )}

          {/* Divider */}
          <div className="relative mb-8">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t" style={{ borderColor: "#2a2a2a" }} />
            </div>
            <div className="relative flex justify-center">
              <span
                className="px-4 text-xs font-medium uppercase tracking-widest text-zinc-500"
                style={{ background: "rgba(17, 17, 17, 0.9)" }}
              >
                ou
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="relative">
              <EmailIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="login-input h-[52px] w-full rounded-xl border pl-12 pr-4 text-[15px] text-white placeholder-zinc-500 transition-all duration-200 outline-none"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "#2a2a2a",
                }}
              />
            </div>

            <div className="relative">
              <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                autoComplete="current-password"
                className="login-input h-[52px] w-full rounded-xl border pl-12 pr-4 text-[15px] text-white placeholder-zinc-500 transition-all duration-200 outline-none"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "#2a2a2a",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-btn-primary mt-2 flex h-[52px] w-full items-center justify-center rounded-xl text-[15px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #9D5CF6 100%)",
                boxShadow: "0 4px 24px rgba(124, 58, 237, 0.35)",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-zinc-400">
            Não tem conta?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#A78BFA] transition-all hover:text-[#7C3AED] hover:underline"
            >
              Criar conta grátis
            </Link>
          </p>

          {/* Footer */}
          <p className="mt-6 text-center text-xs leading-relaxed text-zinc-500">
            🔒 Seus dados estão seguros e criptografados
          </p>

          {/* Google — abaixo de tudo */}
          <div className="mt-12 pt-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-white text-[15px] font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
              }}
            >
              <GoogleIcon className="h-5 w-5 shrink-0" />
              Continuar com Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
