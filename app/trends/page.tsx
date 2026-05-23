"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

const ACCENT = "#a855f7";
const ACCENT_LIGHT = "#c084fc";

type TrendItem = {
  name: string;
  growthScore: number;
  badge: "Em alta" | "Explosivo";
};

type TrendsByCategory = {
  tiktok: TrendItem[];
  instagram: TrendItem[];
  youtube: TrendItem[];
};

const menu = [
  { label: "Dashboard", icon: "grid", href: "/dashboard" },
  { label: "Upload Video", icon: "upload", href: "/upload" },
  { label: "Viral Clips", icon: "film", href: "/clips" },
  { label: "AI Trends", icon: "trend", href: "/trends", active: true },
  { label: "AI Captions", icon: "caption", href: "/dashboard" },
  { label: "Saved Projects", icon: "folder", href: "/saved" },
  { label: "Settings", icon: "settings", href: "/dashboard" },
];

const categories = [
  {
    key: "tiktok" as const,
    label: "TikTok",
    emoji: "🎵",
    gradient: "from-violet-900/90 via-zinc-900 to-black",
  },
  {
    key: "instagram" as const,
    label: "Instagram Reels",
    emoji: "📸",
    gradient: "from-purple-900/80 via-zinc-950 to-black",
  },
  {
    key: "youtube" as const,
    label: "YouTube Shorts",
    emoji: "▶️",
    gradient: "from-indigo-900/70 via-zinc-900 to-black",
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
    grid: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    ),
    upload: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    ),
    film: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
      />
    ),
    trend: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    ),
    caption: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
      />
    ),
    folder: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    ),
    settings: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
    ),
    menu: <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />,
    bolt: <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />,
    sparkles: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    ),
    refresh: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
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

function GrowthBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full"
          style={{
        width: `${score}%`,
            background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})`,
          }}
        />
      </div>
      <span
        className="font-display text-xs font-bold"
        style={{ color: ACCENT_LIGHT }}
      >
        +{score}%
      </span>
    </div>
  );
}

function TrendBadge({ badge }: { badge: TrendItem["badge"] }) {
  const isExplosive = badge === "Explosivo";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
        isExplosive
          ? "bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/40"
          : "bg-[#a855f7]/20 text-[#c084fc] ring-1 ring-[#a855f7]/40"
      }`}
    >
      {badge}
    </span>
  );
}

function TrendCard({
  trend,
  gradient,
  onUse,
}: {
  trend: TrendItem;
  gradient: string;
  onUse: (name: string) => void;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#1F1F23] bg-zinc-900/20 transition-colors hover:border-[#a855f7]/30">
      <div className={`relative h-20 bg-gradient-to-br ${gradient}`}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, rgba(168,85,247,0.35), transparent 50%)",
          }}
        />
        <div className="absolute left-3 top-3">
          <TrendBadge badge={trend.badge} />
        </div>
      </div>
      <div className="space-y-3 p-3 sm:p-4">
        <h3 className="font-display text-sm font-bold leading-snug text-zinc-100 sm:text-base">
          {trend.name}
        </h3>
        <div>
          <p className="mb-1.5 text-[10px] text-zinc-500">Crescimento</p>
          <GrowthBar score={trend.growthScore} />
        </div>
        <button
          type="button"
          onClick={() => onUse(trend.name)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#1F1F23] py-2.5 text-xs font-semibold text-zinc-300 transition-all hover:border-[#a855f7]/50 hover:bg-[#a855f7]/10 hover:text-white sm:text-sm"
        >
          Usar essa trend
        </button>
      </div>
    </article>
  );
}

export default function TrendsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trends, setTrends] = useState<TrendsByCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchTrends = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/trends");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao carregar tendências.");
      }

      setTrends(data.trends as TrendsByCategory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  function handleUseTrend(name: string) {
    navigator.clipboard.writeText(name).catch(() => {});
    setToast(`Trend "${name}" copiada!`);
  }

  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-white">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[#1F1F23] bg-[#0B0B0B] transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b border-[#1F1F23] px-4">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{ background: ACCENT }}
          >
            <Icon name="bolt" className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-bold">Trendify AI</span>
        </div>

        <nav className="flex-1 space-y-0.5 p-2">
          {menu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                item.active
                  ? "text-[#c084fc]"
                  : "text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-200"
              }`}
              style={
                item.active ? { background: `${ACCENT}1f` } : undefined
              }
            >
              <Icon
                name={item.icon}
                className={`h-4 w-4 shrink-0 ${item.active ? "text-[#a855f7]" : ""}`}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#1F1F23] p-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-zinc-900/50 px-2.5 py-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              style={{ background: ACCENT }}
            >
              U
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">Usuário</p>
              <p className="truncate text-[10px] text-zinc-500">Plano Free</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        {toast ? (
          <div className="pointer-events-none fixed left-1/2 top-4 z-[60] -translate-x-1/2">
            <div
              className="rounded-xl border bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
              style={{ borderColor: `${ACCENT}66` }}
            >
              ✓ {toast}
            </div>
          </div>
        ) : null}

        <header className="flex h-14 items-center justify-between border-b border-[#1F1F23] px-3 sm:px-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-[#1F1F23] p-1.5 text-zinc-400 hover:text-white lg:hidden"
              aria-label="Abrir menu"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-bold">
              <span className="mr-1.5">📈</span>
              AI Trends
            </h1>
          </div>
          <Link
            href="/login"
            className="text-xs text-zinc-500 transition-colors hover:text-white"
          >
            Sair
          </Link>
        </header>

        <main className="flex-1 p-3 sm:p-5">
          <section
            className="mb-5 rounded-xl border border-[#1F1F23] p-4"
            style={{ background: "rgba(168, 85, 247, 0.05)" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span style={{ color: ACCENT }}>
                  <Icon name="sparkles" className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-sm font-bold sm:text-base">
                    Tendências virais do momento
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Geradas por IA para criadores brasileiros
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={fetchTrends}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                  boxShadow: `0 4px 24px ${ACCENT}55`,
                }}
              >
                <Icon name="refresh" className="h-4 w-4" />
                {loading ? "Gerando..." : "Atualizar trends"}
              </button>
            </div>
          </section>

          {error ? (
            <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          {loading && !trends ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div
                className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-[#a855f7]"
                aria-hidden="true"
              />
              <p className="text-sm text-[#c084fc]">
                IA analisando tendências virais...
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map((cat) => {
                const items = trends?.[cat.key] ?? [];
                return (
                  <section key={cat.key}>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-xl">{cat.emoji}</span>
                      <h2 className="font-display text-base font-bold sm:text-lg">
                        {cat.label}
                      </h2>
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                        {items.length} trends
                      </span>
                    </div>

                    {items.length === 0 ? (
                      <p className="text-sm text-zinc-500">
                        Nenhuma trend disponível.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((trend) => (
                          <TrendCard
                            key={`${cat.key}-${trend.name}`}
                            trend={trend}
                            gradient={cat.gradient}
                            onUse={handleUseTrend}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
