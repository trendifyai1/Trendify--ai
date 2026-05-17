const benefits = [
  {
    icon: "🧠",
    title: "IA que entende viral",
    description:
      "Nossa IA analisa padrões de engajamento e identifica os momentos com maior potencial de viralizar.",
  },
  {
    icon: "⚡",
    title: "Cortes em segundos",
    description:
      "De um vídeo de 2 horas para dezenas de clips prontos em menos de 60 segundos.",
  },
  {
    icon: "💬",
    title: "Legendas Gen Z",
    description:
      "Legendas animadas no estilo TikTok e Reels, com timing perfeito e fontes que prendem atenção.",
  },
  {
    icon: "📈",
    title: "Trends em tempo real",
    description:
      "Sugestões baseadas nas trends do momento para maximizar alcance e descoberta orgânica.",
  },
  {
    icon: "🎯",
    title: "Títulos que convertem",
    description:
      "Headlines e hooks gerados por IA para aumentar CTR e retenção nos primeiros 3 segundos.",
  },
  {
    icon: "📱",
    title: "Export direto 9:16",
    description:
      "Exportação otimizada para TikTok, Reels e Shorts — pronto para postar em um clique.",
  },
];

const plans = [
  {
    name: "Free",
    price: "R$0",
    period: "para sempre",
    features: ["3 cortes/mês", "Marca d'água", "Export 720p", "Legendas básicas"],
    cta: "Começar grátis",
    popular: false,
  },
  {
    name: "Viral",
    price: "R$24,99",
    period: "/mês",
    features: [
      "50 cortes/mês",
      "Sem marca d'água",
      "Export 1080p",
      "Legendas Gen Z",
      "Trends em tempo real",
    ],
    cta: "Assinar Viral",
    popular: false,
  },
  {
    name: "Pro",
    price: "R$79,99",
    period: "/mês",
    features: [
      "Cortes ilimitados",
      "Export 4K",
      "IA avançada",
      "Batch upload",
      "Prioridade na fila",
    ],
    cta: "Assinar Pro",
    popular: true,
  },
  {
    name: "Empire",
    price: "R$129,99",
    period: "/mês",
    features: [
      "Tudo do Pro",
      "5 membros na equipe",
      "API access",
      "White label",
      "Suporte dedicado",
    ],
    cta: "Assinar Empire",
    popular: false,
  },
];

const phoneMockups = [
  { label: "POV: isso viralizou 🔥", gradient: "from-violet-600 to-fuchsia-600" },
  { label: "ninguém esperava isso", gradient: "from-purple-700 to-indigo-900" },
  { label: "salva pra depois ✨", gradient: "from-fuchsia-600 to-orange-500" },
];

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

function PhoneMockups() {
  return (
    <div className="mt-16 flex items-end justify-center gap-4 sm:gap-6">
      {phoneMockups.map((phone, i) => (
        <div
          key={phone.label}
          className={`relative w-[140px] shrink-0 sm:w-[160px] ${
            i === 1
              ? "z-10 -translate-y-4 scale-110"
              : i === 0
                ? "-rotate-6"
                : "rotate-6"
          }`}
        >
          <div className="relative overflow-hidden rounded-[28px] border-2 border-zinc-800 bg-zinc-900 shadow-2xl shadow-purple-900/30">
            <div className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
            <div
              className={`relative aspect-[9/16] w-full bg-gradient-to-b ${phone.gradient}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
              <div className="flex h-full flex-col justify-end p-3">
                <div className="mb-2 flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-white/20" />
                  <div className="flex-1">
                    <div className="h-2 w-16 rounded bg-white/30" />
                    <div className="mt-1 h-2 w-10 rounded bg-white/20" />
                  </div>
                </div>
                <p className="rounded bg-black/50 px-2 py-1 text-center text-[10px] font-bold leading-tight text-white backdrop-blur-sm">
                  {phone.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-800/60 bg-[#0B0B0B]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C3AED] text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]">
              <LightningIcon className="h-4 w-4" />
            </span>
            Trendify AI
          </a>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:inline-block"
            >
              Login
            </a>
            <a
              href="#precos"
              className="rounded-full bg-[#7C3AED] px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.45)] transition-all hover:bg-[#6D28D9] hover:shadow-[0_0_32px_rgba(124,58,237,0.6)]"
            >
              Começar grátis
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pb-24 pt-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
            <LightningIcon className="h-3 w-3 text-[#7C3AED]" />
            Plataforma #1 de cortes virais com IA
          </span>

          <h1 className="mt-8 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Transforme vídeos longos em{" "}
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#7C3AED] to-[#C084FC] bg-clip-text text-transparent">
              cortes virais
            </span>{" "}
            usando IA.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Cole o link do seu podcast, live ou vídeo do YouTube. Em segundos, a
            Trendify AI gera dezenas de clips verticais prontos para TikTok,
            Reels e Shorts.
          </p>

          <a
            href="#precos"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#7C3AED] px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all hover:scale-105 hover:bg-[#6D28D9] hover:shadow-[0_0_56px_rgba(124,58,237,0.65)]"
          >
            <LightningIcon className="h-5 w-5" />
            Começar grátis
          </a>

          <PhoneMockups />
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-zinc-800/60 bg-[#0B0B0B] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Tudo que você precisa para viralizar
            </h2>
            <p className="mt-4 text-zinc-400">
              Ferramentas pensadas para creators que querem escalar sem perder
              horas editando.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-[#7C3AED]/40 hover:bg-zinc-900 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)]"
              >
                <span className="text-3xl" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Planos para cada creator
            </h2>
            <p className="mt-4 text-zinc-400">
              Comece grátis. Escale quando estiver pronto para dominar o feed.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.popular
                    ? "border-[#7C3AED] bg-gradient-to-b from-[#7C3AED]/15 to-zinc-900 shadow-[0_0_40px_rgba(124,58,237,0.2)] lg:scale-105"
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#7C3AED] px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                    Popular
                  </span>
                )}
                <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-sm text-zinc-500">{plan.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-zinc-300"
                    >
                      <svg
                        className="h-4 w-4 shrink-0 text-[#7C3AED]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-[#7C3AED] text-white shadow-[0_0_24px_rgba(124,58,237,0.4)] hover:bg-[#6D28D9]"
                      : "border border-zinc-700 text-white hover:border-[#7C3AED] hover:bg-[#7C3AED]/10"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <a href="#" className="flex items-center gap-2 font-display font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#7C3AED] text-white">
              <LightningIcon className="h-3.5 w-3.5" />
            </span>
            Trendify AI
          </a>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Trendify AI. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="transition-colors hover:text-white">
              Termos
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Privacidade
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
