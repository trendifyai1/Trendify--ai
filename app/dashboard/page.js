
import { useState } from "react";
import Link from "next/link";

const menu = [
  "Upload Video",
  "Viral Clips",
  "AI Captions",
  "Saved Projects",
  "Settings",
];

const stats = [
  { label: "Vídeos enviados", value: "12" },
  { label: "Cortes gerados", value: "84" },
  { label: "Créditos", value: "156" },
  { label: "Views", value: "2.4M" },
];

const recentClips = [
  { title: "POV: isso viralizou 🔥", score: 94, gradient: "from-violet-600 to-fuchsia-600" },
  { title: "plot twist inesperado", score: 87, gradient: "from-purple-800 to-indigo-900" },
  { title: "salva pra depois ✨", score: 91, gradient: "from-fuchsia-600 to-orange-500" },
];

function LightningIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-zinc-800 bg-[#0B0B0B] transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C3AED]">
            <LightningIcon className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold">Trendify AI</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {menu.map((item, i) => (
            <button
              key={item}
              type="button"
              className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-[#7C3AED]/15 text-[#A78BFA]"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C3AED] text-xs font-bold">
              U
            </div>
            <div>
              <p className="text-sm font-medium">Usuário</p>
              <p className="text-xs text-zinc-500">Plano Free</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:text-white lg:hidden"
              aria-label="Abrir menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="font-display text-xl font-bold">Dashboard</h1>
          </div>
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white">
            Sair
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <p className="font-display text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent clips */}
          <section className="mt-8">
            <h2 className="mb-4 font-display text-lg font-bold">Cortes recentes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentClips.map((clip) => (
                <article
                  key={clip.title}
                  className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50"
                >
                  <div
                    className={`aspect-[9/16] bg-gradient-to-b ${clip.gradient}`}
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold">{clip.title}</h3>
                    <p className="mt-2 text-xs text-zinc-500">
                      Viralidade:{" "}
                      <span className="font-bold text-[#A78BFA]">{clip.score}/100</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
