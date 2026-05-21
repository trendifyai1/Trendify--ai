"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

function GoogleGIcon({ className }) {
  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#7C3AED] ${className ?? ""}`}
      aria-hidden="true"
    >
      G
    </span>
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

    const { error: authError } = await supabase.auth.signInWithOAuth({
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

    const { error: authError } = await supabase.auth.signInWithPassword({
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-10 flex flex-col items-center gap-3"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED] text-white shadow-[0_0_24px_rgba(124,58,237,0.5)]">
            <LightningIcon className="h-6 w-6" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Trendify AI
          </span>
        </Link>

        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-white">
            Entrar na sua conta
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Bem-vindo de volta</p>
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[#7C3AED] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.45)] transition-all hover:bg-[#6D28D9] hover:shadow-[0_0_32px_rgba(124,58,237,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleGIcon />
          Continuar com Google
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0B0B0B] px-4 text-xs text-zinc-500">
              ou continue com email
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
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
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3.5 text-sm text-white placeholder-zinc-600 transition-colors focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
            />
          </div>
          <div>
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
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3.5 text-sm text-white placeholder-zinc-600 transition-colors focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#7C3AED] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.45)] transition-all hover:bg-[#6D28D9] hover:shadow-[0_0_32px_rgba(124,58,237,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Não tem conta?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#A78BFA] transition-colors hover:text-[#7C3AED]"
          >
            Criar grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
