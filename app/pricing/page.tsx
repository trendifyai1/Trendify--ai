"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ACCENT = "#a855f7";
const ACCENT_LIGHT = "#c084fc";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Ideal para começar a testar o Trendify",
    features: [
      "3 clips por mês",
      "Gerador de clips com IA",
      "Upload de vídeos",
    ],
    cta: "Plano atual",
    popular: false,
    action: "current" as const,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 47",
    period: "/mês",
    description: "Para criadores que querem escalar conteúdo viral",
    features: [
      "Clips ilimitados",
      "AI Trends em tempo real",
      "Análise viral avançada",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    popular: true,
    action: "checkout" as const,
  },
];

function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    check: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    ),
    bolt: <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />,
    sparkles: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    ),
  };

  const stroke = name === "bolt";
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={stroke ? "currentColor" : "none"}
      stroke={stroke ? "none" : "currentColor"}
      strokeWidth={stroke ? undefined : 1.75}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function PricingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setBanner("Assinatura Pro ativada com sucesso! 🎉");
    } else if (searchParams.get("canceled") === "true") {
      setBanner("Checkout cancelado. Você pode tentar novamente quando quiser.");
    }
  }, [searchParams]);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao iniciar checkout.");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("URL de checkout não retornada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 text-center">
        <p
          className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${ACCENT}22`, color: ACCENT_LIGHT }}
        >
          <Icon name="sparkles" className="h-3.5 w-3.5" />
          Planos
        </p>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Escolha seu plano
        </h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">
          Comece grátis ou desbloqueie clips ilimitados e AI Trends com Pro
        </p>
      </div>

      {banner ? (
        <p
          className="mb-6 rounded-xl border px-4 py-3 text-center text-sm"
          style={{
            borderColor: `${ACCENT}44`,
            background: `${ACCENT}11`,
            color: ACCENT_LIGHT,
          }}
        >
          {banner}
        </p>
      ) : null}

      {error ? (
        <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border p-5 sm:p-6 ${
              plan.popular
                ? "border-[#a855f7]/50 shadow-lg"
                : "border-[#1F1F23] bg-zinc-900/20"
            }`}
            style={
              plan.popular
                ? {
                    background:
                      "linear-gradient(180deg, rgba(168,85,247,0.12) 0%, rgba(9,9,11,0.6) 100%)",
                    boxShadow: `0 8px 40px ${ACCENT}33`,
                  }
                : undefined
            }
          >
            {plan.popular ? (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                }}
              >
                Mais popular
              </span>
            ) : null}

            <div className="mb-4">
              <h2 className="font-display text-lg font-bold">{plan.name}</h2>
              <p className="mt-1 text-xs text-zinc-500">{plan.description}</p>
            </div>

            <div className="mb-5 flex items-end gap-1">
              <span className="font-display text-3xl font-bold sm:text-4xl">
                {plan.price}
              </span>
              <span className="mb-1 text-sm text-zinc-500">{plan.period}</span>
            </div>

            <ul className="mb-6 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-zinc-300"
                >
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ background: `${ACCENT}33`, color: ACCENT_LIGHT }}
                  >
                    <Icon name="check" className="h-2.5 w-2.5" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {plan.action === "checkout" ? (
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                  boxShadow: `0 4px 24px ${ACCENT}55`,
                }}
              >
                {loading ? "Redirecionando..." : plan.cta}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full rounded-xl border border-[#1F1F23] py-3 text-sm font-semibold text-zinc-500"
              >
                {plan.cta}
              </button>
            )}
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-zinc-600">
        Pagamento seguro via Stripe. Cancele quando quiser.
      </p>
    </main>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <header className="flex h-14 items-center justify-between border-b border-[#1F1F23] px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{ background: ACCENT }}
          >
            <Icon name="bolt" className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-bold">Trendify AI</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-xs text-zinc-500 transition-colors hover:text-white"
        >
          Voltar ao dashboard
        </Link>
      </header>

      <Suspense
        fallback={
          <p className="py-20 text-center text-sm text-zinc-500">Carregando...</p>
        }
      >
        <PricingContent />
      </Suspense>
    </div>
  );
}
