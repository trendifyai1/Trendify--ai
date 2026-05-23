"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menu = [
  { label: "Dashboard", icon: "grid", href: "/dashboard" },
  { label: "Upload Video", icon: "upload", href: "/upload", active: true },
  { label: "Viral Clips", icon: "film", href: "/clips" },
  { label: "AI Captions", icon: "caption", href: "/dashboard" },
  { label: "Saved Projects", icon: "folder", href: "/saved" },
  { label: "Settings", icon: "settings", href: "/dashboard" },
];

const durations = ["30s", "45s", "60s", "90s"];

const progressStages = [
  { until: 25, label: "Transcrevendo com IA..." },
  { until: 55, label: "Detectando momentos virais..." },
  { until: 100, label: "Cortando clips no servidor..." },
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
    uploadLarge: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
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

function Toggle({ label, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#1F1F23] bg-zinc-900/30 px-3.5 py-3">
      <span className="text-sm text-zinc-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          enabled ? "bg-[#7C3AED]" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function getProgressLabel(percent) {
  for (const stage of progressStages) {
    if (percent <= stage.until) return stage.label;
  }
  return progressStages[progressStages.length - 1].label;
}

function parseDurationSeconds(value) {
  const match = String(value).match(/(\d+)/);
  return match ? Number(match[1]) : 60;
}

function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const url = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível ler a duração do vídeo."));
    };

    video.src = url;
  });
}

function buildCutClips(aiClips, videoDurationSec, preferredDuration) {
  const maxDuration = parseDurationSeconds(preferredDuration);
  const segment = videoDurationSec / (aiClips.length + 1);

  return aiClips.map((clip, index) => {
    const duration = Math.min(
      Number(clip.duration) || maxDuration,
      maxDuration,
      90
    );
    const center = segment * (index + 1);
    const start = Math.max(
      0,
      Math.min(center - duration / 2, Math.max(0, videoDurationSec - duration))
    );

    return {
      title: clip.title,
      start: Math.round(start * 10) / 10,
      duration,
    };
  });
}

function getVideoServerUrl() {
  const url = process.env.NEXT_PUBLIC_VIDEO_SERVER_URL?.replace(/\/$/, "");
  if (!url) {
    throw new Error("Servidor de vídeo não configurado.");
  }
  return url;
}

export default function UploadPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [captions, setCaptions] = useState(true);
  const [viralTitles, setViralTitles] = useState(true);
  const [hashtags, setHashtags] = useState(false);
  const [duration, setDuration] = useState("60s");

  const fileInputRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const handleFile = useCallback((selected) => {
    if (!selected) return;
    const validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/avi"];
    const isVideo =
      validTypes.includes(selected.type) ||
      /\.(mp4|mov|avi)$/i.test(selected.name);

    if (!isVideo) return;

    setFile(selected);
    setProgress(0);
    setStatusLabel("");
    setError(null);
  }, []);

  useEffect(() => {
    if (!processing) return;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? prev : prev + Math.random() * 3 + 1));
    }, 200);

    return () => clearInterval(progressIntervalRef.current);
  }, [processing]);

  async function handleProcessVideo() {
    if (!file || processing) return;

    setProcessing(true);
    setError(null);
    setProgress(5);
    setStatusLabel("Preparando vídeo...");

    try {
      const videoServerUrl = getVideoServerUrl();
      const videoDuration = await getVideoDuration(file);

      setProgress(12);
      setStatusLabel("Enviando vídeo...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "settings",
        JSON.stringify({
          captions,
          viralTitles,
          hashtags,
          duration,
        })
      );

      const processRes = await fetch("/api/process-video", {
        method: "POST",
        body: formData,
      });

      const processData = await processRes.json();

      if (!processRes.ok) {
        throw new Error(processData.error || "Falha ao processar vídeo.");
      }

      setProgress(38);
      setStatusLabel("Detectando momentos virais...");

      const analyzeRes = await fetch("/api/analyze-clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: processData.transcript }),
      });

      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        throw new Error(analyzeData.error || "Falha ao analisar transcrição.");
      }

      setProgress(62);
      setStatusLabel("Cortando clips no servidor...");

      const cutSpecs = buildCutClips(analyzeData.clips, videoDuration, duration);
      const cutForm = new FormData();
      cutForm.append("video", file);
      cutForm.append("clips", JSON.stringify(cutSpecs));

      const cutRes = await fetch(`${videoServerUrl}/cut`, {
        method: "POST",
        body: cutForm,
      });

      const cutData = await cutRes.json();

      if (!cutRes.ok) {
        throw new Error(cutData.error || "Falha ao cortar vídeo no servidor.");
      }

      sessionStorage.setItem(
        `trendify-video-job-${processData.id}`,
        JSON.stringify({
          jobId: cutData.jobId,
          aiClips: analyzeData.clips,
          cutClips: cutData.clips.map((clip) => ({
            ...clip,
            downloadUrl: `${videoServerUrl}${clip.downloadUrl}`,
          })),
        })
      );

      setProgress(100);
      setStatusLabel("Redirecionando para clips...");
      router.push(`/clips?v=${processData.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setProcessing(false);
      setProgress(0);
      setStatusLabel("");
    }
  }

  const displayProgress = Math.min(Math.round(progress), 100);

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
            <h1 className="font-display text-lg font-bold">Upload Video</h1>
          </div>
          <Link
            href="/login"
            className="text-xs text-zinc-500 transition-colors hover:text-white"
          >
            Sair
          </Link>
        </header>

        <main className="mx-auto w-full max-w-2xl flex-1 space-y-5 p-3 sm:p-5">
          {/* Drag & drop */}
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragging(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 transition-all sm:py-14 ${
              dragging
                ? "border-[#7C3AED] bg-[#7C3AED]/10"
                : "border-[#7C3AED]/50 bg-[#7C3AED]/5 hover:border-[#7C3AED] hover:bg-[#7C3AED]/8"
            }`}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7C3AED]/15 text-[#A78BFA] sm:h-20 sm:w-20">
              <Icon name="uploadLarge" className="h-9 w-9 sm:h-11 sm:w-11" />
            </div>
            <p className="font-display text-base font-bold sm:text-lg">
              Arraste seu vídeo aqui
            </p>
            <p className="mt-1.5 text-xs text-zinc-500 sm:text-sm">
              MP4, MOV, AVI até 500MB
            </p>

            {file ? (
              <p className="mt-3 max-w-full truncate px-4 text-xs text-[#A78BFA]">
                {file.name}
              </p>
            ) : null}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,.mp4,.mov,.avi"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 rounded-xl bg-[#7C3AED] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(124,58,237,0.35)] transition-all hover:bg-[#6D28D9] hover:shadow-[0_4px_32px_rgba(124,58,237,0.5)]"
            >
              Selecionar arquivo
            </button>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          ) : null}

          {/* Progress */}
          {processing ? (
            <div className="rounded-xl border border-[#1F1F23] bg-zinc-900/30 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-zinc-400">
                  {statusLabel || getProgressLabel(displayProgress)}
                </span>
                <span className="font-display font-bold text-[#A78BFA]">
                  {displayProgress}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9D5CF6] transition-all duration-300 ease-out"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
            </div>
          ) : null}

          {/* Settings */}
          <section className="rounded-xl border border-[#1F1F23] bg-zinc-900/20 p-4">
            <h2 className="mb-4 font-display text-sm font-bold sm:text-base">
              Configurações do corte
            </h2>
            <div className="space-y-2.5">
              <Toggle
                label="Legendas automáticas"
                enabled={captions}
                onChange={setCaptions}
              />
              <Toggle
                label="Títulos virais com IA"
                enabled={viralTitles}
                onChange={setViralTitles}
              />
              <Toggle
                label="Hashtags automáticas"
                enabled={hashtags}
                onChange={setHashtags}
              />
            </div>

            <p className="mb-2.5 mt-5 text-xs text-zinc-500">Duração do corte</p>
            <div className="grid grid-cols-4 gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                    duration === d
                      ? "border-[#7C3AED] bg-[#7C3AED]/15 text-[#A78BFA]"
                      : "border-[#1F1F23] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </section>

          {/* CTA */}
          <button
            type="button"
            onClick={handleProcessVideo}
            disabled={!file || processing}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl text-base font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #9D5CF6 100%)",
              boxShadow: file
                ? "0 8px 32px rgba(124, 58, 237, 0.45)"
                : "0 4px 16px rgba(124, 58, 237, 0.2)",
            }}
          >
            <Icon name="bolt" className="h-5 w-5" />
            {processing ? "Processando..." : "Gerar cortes virais"}
          </button>
        </main>
      </div>
    </div>
  );
}
