"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteProject,
  formatProjectDate,
  loadSavedProjects,
  type SavedProject,
} from "@/lib/saved-projects";

const ACCENT = "#a855f7";
const ACCENT_LIGHT = "#c084fc";

const menu = [
  { label: "Dashboard", icon: "grid", href: "/dashboard" },
  { label: "Upload Video", icon: "upload", href: "/upload" },
  { label: "Viral Clips", icon: "film", href: "/clips" },
  { label: "AI Trends", icon: "trend", href: "/trends" },
  { label: "AI Captions", icon: "caption", href: "/dashboard" },
  { label: "Saved Projects", icon: "folder", href: "/saved", active: true },
  { label: "Settings", icon: "settings", href: "/dashboard" },
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
    download: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    ),
    trash: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    ),
    open: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
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

function ProjectCard({
  project,
  onOpen,
  onDownload,
  onDelete,
}: {
  project: SavedProject;
  onOpen: (project: SavedProject) => void;
  onDownload: (project: SavedProject) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="flex gap-3 rounded-xl border border-[#1F1F23] bg-zinc-900/20 p-2.5 transition-colors hover:border-[#a855f7]/30 sm:p-3">
      <div
        className={`relative w-[68px] shrink-0 overflow-hidden rounded-lg bg-gradient-to-b sm:w-[76px] ${project.gradient}`}
        style={{ aspectRatio: "9/16" }}
      >
        <p className="absolute inset-0 flex items-center justify-center text-2xl opacity-40">
          🎬
        </p>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
        <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1 py-0.5 text-[8px] font-bold text-white/90">
          {project.clipCount} clips
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-zinc-100 sm:text-sm">
            {project.name}
          </h3>
          <p className="mt-1.5 text-[10px] text-zinc-500">
            Criado em {formatProjectDate(project.createdAt)}
          </p>
          <p className="mt-0.5 text-[10px] font-medium" style={{ color: ACCENT_LIGHT }}>
            {project.clipCount} {project.clipCount === 1 ? "clip gerado" : "clips gerados"}
          </p>
        </div>

        <div className="mt-2.5 flex gap-1.5">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#1F1F23] py-1.5 text-[10px] font-medium text-zinc-400 transition-colors hover:border-[#a855f7]/40 hover:bg-[#a855f7]/10 hover:text-white sm:text-xs"
          >
            <Icon name="open" className="h-3.5 w-3.5" />
            Abrir
          </button>
          <button
            type="button"
            onClick={() => onDownload(project)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#1F1F23] py-1.5 text-[10px] font-medium text-zinc-400 transition-colors hover:border-[#a855f7]/40 hover:bg-[#a855f7]/10 hover:text-white sm:text-xs"
          >
            <Icon name="download" className="h-3.5 w-3.5" />
            Baixar
          </button>
          <button
            type="button"
            onClick={() => onDelete(project.id)}
            className="flex items-center justify-center rounded-lg border border-[#1F1F23] px-2.5 py-1.5 text-zinc-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
            aria-label="Apagar projeto"
          >
            <Icon name="trash" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function SavedPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProjects(loadSavedProjects());
  }, []);

  function refreshProjects() {
    setProjects(loadSavedProjects());
  }

  function handleOpen(project: SavedProject) {
    if (project.videoId) {
      router.push(`/clips?v=${project.videoId}`);
      return;
    }
    router.push("/clips");
  }

  function handleDownload(project: SavedProject) {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteProject(deleteId);
    refreshProjects();
    setDeleteId(null);
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
              <span className="mr-1.5">💾</span>
              Saved Projects
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
          {!mounted ? (
            <p className="py-12 text-center text-sm text-zinc-500">Carregando...</p>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#1F1F23] bg-zinc-900/20 px-6 py-16 text-center">
              <span className="mb-4 text-4xl">💾</span>
              <p className="font-display text-base font-bold text-zinc-200 sm:text-lg">
                Nenhum projeto salvo ainda
              </p>
              <p className="mt-2 max-w-sm text-sm text-zinc-500">
                Faça upload de um vídeo e gere clips virais para salvar seu primeiro
                projeto automaticamente.
              </p>
              <Link
                href="/upload"
                className="mt-6 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                  boxShadow: `0 4px 24px ${ACCENT}55`,
                }}
              >
                Criar primeiro projeto
              </Link>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-xs text-zinc-500">
                {projects.length}{" "}
                {projects.length === 1 ? "projeto salvo" : "projetos salvos"}
              </p>
              <div className="space-y-2.5">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={handleOpen}
                    onDownload={handleDownload}
                    onDelete={setDeleteId}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {deleteId ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl border border-[#1F1F23] bg-zinc-900 p-5 shadow-xl">
            <h2 className="font-display text-base font-bold">Apagar projeto?</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Esta ação não pode ser desfeita.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-[#1F1F23] py-2 text-sm font-medium text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-bold text-white hover:bg-red-500"
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
