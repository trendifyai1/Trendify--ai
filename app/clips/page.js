"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const menu = [
  { label: "Dashboard", icon: "grid", href: "/dashboard" },
  { label: "Upload Video", icon: "upload", href: "/upload" },
  { label: "Viral Clips", icon: "film", href: "/clips", active: true },
  { label: "AI Captions", icon: "caption", href: "/dashboard" },
  { label: "Saved Projects", icon: "folder", href: "/dashboard" },
  { label: "Settings", icon: "settings", href: "/dashboard" },
];

const filters = ["Todos", "Alta viralidade", "Recentes", "Salvos"];

const initialClips = [
  {
    id: "1",
    title: "POV: isso viralizou em 2 horas 🔥",
    score: 96,
    duration: "45s",
    saved: true,
    gradient: "from-violet-900/90 via-zinc-900 to-black",
  },
  {
    id: "2",
    title: "ninguém esperava esse plot twist",
    score: 91,
    duration: "60s",
    saved: false,
    gradient: "from-purple-900/80 via-zinc-950 to-black",
  },
  {
    id: "3",
    title: "a verdade que ninguém te conta 👀",
    score: 88,
    duration: "30s",
    saved: true,
    gradient: "from-indigo-900/70 via-zinc-900 to-black",
  },
  {
    id: "4",
    title: "salva pra ver depois ✨",
    score: 84,
    duration: "90s",
    saved: false,
    gradient: "from-fuchsia-900/60 via-zinc-900 to-black",
  },
  {
    id: "5",
    title: "isso mudou tudo pra mim",
    score: 93,
    duration: "45s",
    saved: false,
    gradient: "from-violet-800/80 via-purple-950 to-black",
  },
  {
    id: "6",
    title: "reagindo ao momento mais icônico",
    score: 79,
    duration: "60s",
    saved: true,
    gradient: "from-zinc-800 via-zinc-900 to-black",
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
    menu: <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />,
    bolt: <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />,
    search: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
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
    refresh: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    ),
    trash: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

function ViralityBar({ score }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9D5CF6]"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="font-display text-xs font-bold text-[#A78BFA]">{score}</span>
    </div>
  );
}

export default function ClipsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clips, setClips] = useState(initialClips);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(false);

  const filteredClips = useMemo(() => {
    let result = [...clips];

    if (activeFilter === "Alta viralidade") {
      result = result.filter((c) => c.score >= 85);
    } else if (activeFilter === "Salvos") {
      result = result.filter((c) => c.saved);
    } else if (activeFilter === "Recentes") {
      result = [...result].reverse();
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q));
    }

    return result;
  }, [clips, activeFilter, search]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleCopyTitle(title) {
    navigator.clipboard.writeText(title).catch(() => {});
    setToast(true);
  }

  function handleDelete() {
    if (!deleteId) return;
    setClips((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  }

  function handleRegenerate(id) {
    setClips((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              title: `${c.title.split(" ")[0]}... [regenerado] ✨`,
              score: Math.min(99, c.score + Math.floor(Math.random() * 5) + 1),
            }
          : c
      )
    );
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
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C3AED] text-white">
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
                  ? "bg-[#7C3AED]/12 text-[#A78BFA]"
                  : "text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-200"
              }`}
            >
              <Icon
                name={item.icon}
                className={`h-4 w-4 shrink-0 ${item.active ? "text-[#7C3AED]" : ""}`}
              />
              {item.label}
            </Link>
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

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Toast */}
        <div
          className={`pointer-events-none fixed left-1/2 top-4 z-[60] -translate-x-1/2 transition-all duration-300 ${
            toast
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="rounded-xl border border-[#7C3AED]/40 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(124,58,237,0.35)]">
            ✓ Título copiado!
          </div>
        </div>

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
            <h1 className="font-display text-lg font-bold">Viral Clips</h1>
          </div>
          <Link
            href="/login"
            className="text-xs text-zinc-500 transition-colors hover:text-white"
          >
            Sair
          </Link>
        </header>

        <main className="flex-1 p-3 sm:p-5">
          {/* Filters */}
          <div className="mb-4 space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                    activeFilter === f
                      ? "bg-[#7C3AED] text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)]"
                      : "border border-[#1F1F23] text-zinc-400 hover:border-[#7C3AED]/40 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar clips..."
                className="w-full rounded-xl border border-[#1F1F23] bg-zinc-900/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/30"
              />
            </div>
          </div>

          {/* Grid */}
          {filteredClips.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-500">
              Nenhum clip encontrado.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {filteredClips.map((clip) => (
                <article
                  key={clip.id}
                  className="overflow-hidden rounded-xl border border-[#1F1F23] bg-zinc-900/20"
                >
                  <div className="relative">
                    <div
                      className={`aspect-[9/16] w-full bg-gradient-to-b ${clip.gradient}`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(124,58,237,0.2),transparent_55%)]" />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                    <span className="absolute right-2 top-2 rounded-md bg-[#7C3AED] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-lg">
                      VIRAL ✦
                    </span>
                    <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300 backdrop-blur-sm">
                      {clip.duration}
                    </span>
                  </div>

                  <div className="p-3">
                    <p className="mb-2 text-[10px] text-zinc-500">Viralidade</p>
                    <ViralityBar score={clip.score} />
                    <h3 className="mt-2.5 line-clamp-2 text-xs font-semibold leading-snug text-zinc-100 sm:text-sm">
                      {clip.title}
                    </h3>

                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        className="flex items-center justify-center gap-1 rounded-lg border border-[#1F1F23] py-1.5 text-[10px] font-medium text-zinc-400 transition-colors hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/10 hover:text-white"
                      >
                        <Icon name="download" className="h-3 w-3" />
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyTitle(clip.title)}
                        className="flex items-center justify-center gap-1 rounded-lg border border-[#1F1F23] py-1.5 text-[10px] font-medium text-zinc-400 transition-colors hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/10 hover:text-white"
                      >
                        <Icon name="copy" className="h-3 w-3" />
                        Copiar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRegenerate(clip.id)}
                        className="flex items-center justify-center gap-1 rounded-lg border border-[#1F1F23] py-1.5 text-[10px] font-medium text-zinc-400 transition-colors hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/10 hover:text-white"
                      >
                        <Icon name="refresh" className="h-3 w-3" />
                        Regenerar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(clip.id)}
                        className="flex items-center justify-center gap-1 rounded-lg border border-[#1F1F23] py-1.5 text-[10px] font-medium text-zinc-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Icon name="trash" className="h-3 w-3" />
                        Apagar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete modal */}
      {deleteId ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[#1F1F23] bg-zinc-900 p-6 shadow-2xl">
            <h2 className="font-display text-lg font-bold">Deseja apagar este clip?</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Esta ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-[#1F1F23] py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
