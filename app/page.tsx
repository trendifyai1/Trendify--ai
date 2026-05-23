"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const ACCENT = "#a855f7";
const ACCENT_LIGHT = "#c084fc";
const ACCENT_DARK = "#7c3aed";

const steps = [
  {
    emoji: "📹",
    title: "Envie seu vídeo",
    description:
      "Podcast, live ou YouTube — faça upload e deixe a IA trabalhar por você.",
  },
  {
    emoji: "🧠",
    title: "IA analisa momentos virais",
    description:
      "Detectamos hooks, emoções e picos de engajamento em tempo real.",
  },
  {
    emoji: "🚀",
    title: "Baixe seus clips prontos",
    description:
      "Cortes verticais 9:16 otimizados para TikTok, Reels e Shorts.",
  },
];

const stats = [
  { value: "+2M", label: "views gerados", numeric: false },
  { value: "96", suffix: "%", label: "score viral médio", numeric: true },
  { value: "30", suffix: "s", label: "para gerar clips", numeric: true },
  { value: "500", suffix: "+", label: "criadores ativos", numeric: true },
];

const testimonials = [
  {
    name: "Ana Carolina Silva",
    niche: "Criadora de conteúdo fitness",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    quote:
      "Passei de 2 cortes por semana para 15. Meu Reels explodiu com 400k views no primeiro mês.",
    metric: "+340% alcance",
  },
  {
    name: "Lucas Mendes",
    niche: "Podcaster e empresário",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "Transformo episódios de 2h em dezenas de Shorts virais. Economizo 10h de edição por semana.",
    metric: "10h/semana salvas",
  },
  {
    name: "Juliana Costa",
    niche: "Influencer de lifestyle",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "A IA acerta os hooks melhor que eu. Meus clips no TikTok bateram 1M views em 3 semanas.",
    metric: "1M+ views",
  },
];

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function AnimatedNumber({
  target,
  suffix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const { ref, visible } = useInView(0.4);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;

    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

function LiveCounter() {
  const { ref, visible } = useInView(0.5);
  const [count, setCount] = useState(98);

  useEffect(() => {
    if (!visible) return;

    let frame: number;
    const start = performance.now();
    const from = 98;
    const to = 127;
    const duration = 2200;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from + (to - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  return (
    <span
      ref={ref}
      className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm"
    >
      <span className="animate-pulse text-base">🔥</span>
      <span>
        <span className="font-display font-bold text-white">{count}</span>{" "}
        criadores usando agora
      </span>
    </span>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const count = Math.min(80, Math.floor((rect.width * rect.height) / 12000));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2.2 + 0.6,
      opacity: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }));

    let frame: number;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0) p.x = rect.width;
        if (p.x > rect.width) p.x = 0;
        if (p.y < 0) p.y = rect.height;
        if (p.y > rect.height) p.y = 0;

        const glow = p.opacity + Math.sin(p.pulse) * 0.12;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        gradient.addColorStop(0, `rgba(192, 132, 252, ${glow})`);
        gradient.addColorStop(0.5, `rgba(168, 85, 247, ${glow * 0.4})`);
        gradient.addColorStop(1, "rgba(168, 85, 247, 0)");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(216, 180, 254, ${glow + 0.2})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const cleanup = draw();
    const onResize = () => {
      cleanup?.();
      draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cleanup?.();
      window.removeEventListener("resize", onResize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function HeroGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="landing-glow-orb absolute left-1/2 top-[-20%] h-[700px] w-[900px] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ background: `${ACCENT}28` }}
      />
      <div
        className="landing-glow-orb absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ background: `${ACCENT_LIGHT}18`, animationDelay: "3s" }}
      />
      <div
        className="landing-glow-orb absolute -left-32 bottom-[-10%] h-[450px] w-[450px] rounded-full blur-[100px]"
        style={{ background: `${ACCENT_DARK}22`, animationDelay: "1.5s" }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.9) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
    </div>
  );
}

function ClipPreview() {
  const clips = [
    { title: "POV: viralizou 🔥", score: 96, hue: "from-violet-600/95 to-fuchsia-950" },
    { title: "plot twist", score: 94, hue: "from-purple-700/95 to-indigo-950" },
    { title: "salva isso ✨", score: 91, hue: "from-fuchsia-700/95 to-violet-950" },
  ];

  return (
    <div className="relative z-0 mx-auto mt-12 flex max-w-md items-end justify-center gap-4 sm:mt-16 sm:gap-6">
      {clips.map((clip, i) => (
        <div
          key={clip.title}
          className={`landing-float-card relative w-[108px] shrink-0 overflow-hidden rounded-[1.25rem] border border-white/10 sm:w-[128px] ${
            i === 1
              ? "z-[1] scale-110"
              : i === 0
                ? "-rotate-6 landing-float-card-delay-1"
                : "rotate-6 landing-float-card-delay-2"
          }`}
          style={{
            boxShadow:
              i === 1
                ? `0 32px 80px ${ACCENT}55, 0 0 0 1px ${ACCENT}33`
                : "0 16px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div className={`relative aspect-[9/16] bg-gradient-to-b ${clip.hue}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(168,85,247,0.45),transparent_60%)]" />
            <div className="absolute left-0 right-0 top-0 h-8 bg-gradient-to-b from-black/40 to-transparent" />
            <div className="flex h-full flex-col justify-between p-3">
              <span
                className="w-fit rounded-lg px-2 py-0.5 text-[10px] font-bold text-white"
                style={{ background: ACCENT }}
              >
                {clip.score}
              </span>
              <p className="text-[11px] font-bold leading-tight text-white">
                {clip.title}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LightningIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-black/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-3 font-display text-lg font-bold">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                boxShadow: `0 0 32px ${ACCENT}55`,
              }}
            >
              <LightningIcon />
            </span>
            Trendify AI
          </Link>
          <div className="flex items-center gap-2 sm:gap-5">
            <Link
              href="/pricing"
              className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:inline-block"
            >
              Planos
            </Link>
            <Link
              href="/login"
              className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:inline-block"
            >
              Login
            </Link>
            <Link
              href="/upload"
              className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                boxShadow: `0 4px 28px ${ACCENT}50`,
              }}
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[92vh] px-5 pb-32 pt-36 sm:px-8 sm:pt-44">
        <ParticleField />
        <HeroGlow />
        <div className="relative isolate mx-auto max-w-5xl text-center">
          <Reveal>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]"
              style={{
                borderColor: `${ACCENT}40`,
                background: `${ACCENT}12`,
                color: ACCENT_LIGHT,
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: ACCENT }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: ACCENT_LIGHT }}
                />
              </span>
              Powered by IA
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-10 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              Transforme vídeos longos em{" "}
              <span className="landing-shimmer-text bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#c084fc] bg-clip-text text-transparent">
                clips virais
              </span>{" "}
              com IA
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl md:text-2xl">
              Em segundos. Sem edição. Pronto para TikTok, Reels e Shorts.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="relative z-30 mb-6">
              <Link
                href="/upload"
                className="group relative z-30 mt-12 inline-flex items-center gap-3 rounded-2xl px-10 py-5 text-lg font-bold text-white transition-all hover:scale-[1.04] active:scale-[0.98] sm:text-xl"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                  boxShadow: `0 12px 48px ${ACCENT}66, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              >
                Começar grátis agora
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="relative z-30 mb-20 flex justify-center sm:mb-24">
              <LiveCounter />
            </div>
          </Reveal>

          <Reveal delay={420}>
            <div className="relative z-0">
              <ClipPreview />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Como funciona */}
      <section className="relative border-t border-white/[0.06] px-5 py-28 sm:px-8 sm:py-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${ACCENT}10, transparent)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <p
                className="text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: ACCENT_LIGHT }}
              >
                Como funciona
              </p>
              <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                3 passos. Zero fricção.
              </h2>
            </div>
          </Reveal>

          <div className="mt-20 grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 120}>
                <article className="group relative h-full rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-8 transition-all duration-500 hover:border-[#a855f7]/35 hover:shadow-[0_0_60px_rgba(168,85,247,0.12)] sm:p-10">
                  <div
                    className="absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT}22, transparent 60%)`,
                    }}
                  />
                  <span
                    className="relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: ACCENT }}
                  >
                    {i + 1}
                  </span>
                  <span className="relative mt-8 block text-6xl" role="img" aria-hidden="true">
                    {step.emoji}
                  </span>
                  <h3 className="relative mt-6 font-display text-2xl font-bold">{step.title}</h3>
                  <p className="relative mt-4 text-base leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="relative px-5 py-28 sm:px-8 sm:py-36">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 50%, ${ACCENT}14, transparent)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Números que impressionam
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-8">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <div className="text-center">
                  <p
                    className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
                    style={{
                      background: `linear-gradient(135deg, #fff 30%, ${ACCENT_LIGHT})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.numeric ? (
                      <AnimatedNumber
                        target={Number(stat.value)}
                        suffix={stat.suffix ?? ""}
                      />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="border-t border-white/[0.06] px-5 py-28 sm:px-8 sm:py-36">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <p
                className="text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: ACCENT_LIGHT }}
              >
                Depoimentos
              </p>
              <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                Creators brasileiros confiam
              </h2>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <article className="flex h-full flex-col rounded-3xl border border-white/[0.06] bg-zinc-950/80 p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#a855f7]/30 hover:bg-zinc-900/50">
                  <div className="mb-5 flex gap-0.5 text-amber-400">
                    {"★★★★★".split("").map((star, idx) => (
                      <span key={idx} className="text-sm">
                        {star}
                      </span>
                    ))}
                  </div>
                  <p className="flex-1 text-base leading-relaxed text-zinc-300">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-4 border-t border-white/[0.06] pt-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-14 w-14 shrink-0 rounded-full border-2 border-[#a855f7]/30 bg-zinc-800 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-bold">{t.name}</p>
                      <p className="truncate text-sm text-zinc-500">{t.niche}</p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold"
                      style={{ background: `${ACCENT}22`, color: ACCENT_LIGHT }}
                    >
                      {t.metric}
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-5 pb-28 pt-4 sm:px-8">
        <Reveal>
          <div
            className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] px-6 py-20 text-center sm:px-16 sm:py-28"
            style={{
              background: `linear-gradient(135deg, ${ACCENT_DARK} 0%, ${ACCENT} 45%, #9333ea 100%)`,
            }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="landing-glow-orb absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
              <div className="landing-glow-orb absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-[90px]" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>
            <h2 className="relative font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Comece a viralizar hoje
            </h2>
            <p className="relative mx-auto mt-5 max-w-lg text-lg text-white/80">
              Junte-se a centenas de creators que dominam TikTok, Reels e Shorts com IA.
            </p>
            <Link
              href="/upload"
              className="relative mt-10 inline-flex items-center gap-3 rounded-2xl bg-white px-12 py-5 text-lg font-bold text-[#581c87] transition-all hover:scale-[1.04] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] active:scale-[0.98] sm:text-xl"
            >
              Começar grátis agora
              <span>→</span>
            </Link>
            <p className="relative mt-5 text-sm text-white/60">
              3 clips grátis por mês · Sem cartão de crédito
            </p>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
          <Link href="/" className="flex items-center gap-2.5 font-display text-base font-bold">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ background: ACCENT }}
            >
              <LightningIcon className="h-3.5 w-3.5" />
            </span>
            Trendify AI
          </Link>
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Trendify AI. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-sm text-zinc-500">
            <Link href="/pricing" className="transition-colors hover:text-white">
              Planos
            </Link>
            <Link href="/login" className="transition-colors hover:text-white">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
