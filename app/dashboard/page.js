"use client";

import { useState } from "react";
import Link from "next/link";

const menu = [
  { label: "Dashboard", icon: "grid", active: true },
  { label: "Upload Video", icon: "upload" },
  { label: "Viral Clips", icon: "film" },
  { label: "AI Captions", icon: "caption" },
  { label: "Saved Projects", icon: "folder" },
  { label: "Settings", icon: "settings" },
];

const stats = [
  { label: "Vídeos enviados", value: "12", icon: "video" },
  { label: "Cortes gerados", value: "84", icon: "scissors" },
  { label: "Créditos", value: "156", icon: "credit" },
  { label: "Views", value: "2.4M", icon: "eye" },
];

const recentClips = [
  {
    id: "1",
    title: "POV: isso viralizou 🔥",
    score: 94,
    accent: "from-violet-900/80 via-zinc-900 to-black",
  },
  {
    id: "2",
    title: "plot twist inesperado",
    score: 87,
    accent: "from-indigo-900/70 via-zinc-950 to-black",
  },
  {
    id: "3",
    title: "salva pra depois ✨",
    score: 91,
    accent: "from-fuchsia-900/60 via-zinc-900 to-black",
  },
];

function Icon({ name, className = "h-4 w-4" }) {
  const paths = {
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
    video: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    ),
    scissors: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L5.121 5.121M12 12l2.879 2.879"
      />
    ),
    credit: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    ),
    eye: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </>
    ),
    download: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    ),
    copy: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    ),
    menu: (
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    ),
    close: (
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    ),
    bolt: <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />,
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

function ViralityBar({ score }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9D5CF6]"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="shrink-0 font-display text-xs font-bold text-[#A78BFA]">
        {score}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[#1F1F23] bg-[#0B0B0B] transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b border-[#1F1F23] px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C3AED] text-white">
            <Icon name="bolt" className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-bold">Trendify AI</span>
        </div>

        <nav className="flex-1 space-y-0.5 p-2">
          {menu.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                item.active
                  ? "bg-[#7C3AED]/12 text-[#A78BFA]"
                  : "text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-200"
              }`}
            >
              <Icon
                name={item.icon}
                className={`h-4 w-4 shrink-0 ${item.active ? "text-[#7C3AED]" : ""}`}
              />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-[#1F1F23] p-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-zinc-900/50 px-2.5 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-[10px] font-bold">
              U
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">Usuário</p>
              <p className="truncate text-[10px] text-zinc-500">Plano Free</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
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
            <h1 className="font-display text-lg font-bold">Dashboard</h1>
          </div>
          <Link
            href="/login"
            className="text-xs text-zinc-500 transition-colors hover:text-white"
          >
            Sair
          </Link>
        </header>

        <main className="flex-1 space-y-5 p-3 sm:p-5">
          {/* Stats 2x2 */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[#1F1F23] bg-zinc-900/30 px-3 py-3"
              >
                <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#7C3AED]/12 text-[#A78BFA]">
                  <Icon name={stat.icon} className="h-3.5 w-3.5" />
                </div>
                <p className="font-display text-xl font-bold leading-none sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] leading-tight text-zinc-500 sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Recent clips */}
          <section>
            <h2 className="mb-3 font-display text-sm font-bold sm:text-base">
              Cortes recentes
            </h2>
            <div className="space-y-2.5">
              {recentClips.map((clip) => (
                <article
                  key={clip.id}
                  className="flex gap-3 rounded-xl border border-[#1F1F23] bg-zinc-900/20 p-2.5 sm:p-3"
                >
                  {/* Thumbnail simulado */}
                  <div
                    className={`relative w-[68px] shrink-0 overflow-hidden rounded-lg bg-gradient-to-b sm:w-[76px] ${clip.accent}`}
                    style={{ aspectRatio: "9/16" }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-end justify-between">
                      <span className="rounded bg-black/60 px-1 py-0.5 text-[8px] font-bold text-white/90">
                        9:16
                      </span>
                      <span className="h-3 w-3 rounded-full bg-white/10" />
                    </div>
                    <div className="absolute left-1/2 top-1/3 h-5 w-5 -translate-x-1/2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                    <div>
                      <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-zinc-100 sm:text-sm">
                        {clip.title}
                      </h3>
                      <p className="mt-1.5 text-[10px] text-zinc-500">
                        Viralidade
                      </p>
                      <ViralityBar score={clip.score} />
                    </div>

                    <div className="mt-2.5 flex gap-1.5">
                      <button
                        type="button"
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#1F1F23] py-1.5 text-[10px] font-medium text-zinc-400 transition-colors hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/10 hover:text-white sm:text-xs"
                      >
                        <Icon name="download" className="h-3.5 w-3.5" />
                        Download
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center rounded-lg border border-[#1F1F23] px-2.5 py-1.5 text-zinc-400 transition-colors hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/10 hover:text-white"
                        aria-label="Copiar link"
                      >
                        <Icon name="copy" className="h-3.5 w-3.5" />
                      </button>
                    </div>
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
