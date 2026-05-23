import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Você é especialista em tendências virais para criadores de conteúdo brasileiros.
Gere tendências REALISTAS e ATUAIS do momento para TikTok, Instagram Reels e YouTube Shorts no Brasil.
Retorne APENAS JSON válido neste formato:
{
  "trends": {
    "tiktok": [
      { "name": string, "growthScore": number (45-99), "badge": "Em alta" | "Explosivo" }
    ],
    "instagram": [
      { "name": string, "growthScore": number (45-99), "badge": "Em alta" | "Explosivo" }
    ],
    "youtube": [
      { "name": string, "growthScore": number (45-99), "badge": "Em alta" | "Explosivo" }
    ]
  }
}
Regras:
- Exatamente 3 trends por categoria (9 no total)
- Nomes curtos, em português brasileiro, estilo creator economy
- growthScore entre 45 e 99 (percentual de crescimento)
- badge "Explosivo" se growthScore >= 80, senão "Em alta"
- Tendências variadas: formatos, áudios, nichos, hooks, estéticas`;

type TrendItem = {
  name: string;
  growthScore: number;
  badge: "Em alta" | "Explosivo";
};

type TrendsPayload = {
  trends: {
    tiktok: TrendItem[];
    instagram: TrendItem[];
    youtube: TrendItem[];
  };
};

function extractJson(text: string) {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Resposta da IA não contém JSON válido.");
  }
  return JSON.parse(match[0]) as TrendsPayload;
}

function normalizeTrend(item: unknown): TrendItem | null {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const growthScore = Math.round(Number(raw.growthScore));
  if (!name || Number.isNaN(growthScore)) return null;

  const score = Math.min(99, Math.max(45, growthScore));
  const badge: TrendItem["badge"] = score >= 80 ? "Explosivo" : "Em alta";

  return { name, growthScore: score, badge };
}

function normalizeCategory(items: unknown): TrendItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(normalizeTrend)
    .filter((t): t is TrendItem => t !== null)
    .slice(0, 3);
}

export async function GET() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });
    const today = new Date().toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Gere 9 tendências virais atuais para criadores brasileiros (${today}). Foque no que está bombando AGORA em cada plataforma.`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Resposta vazia da IA." },
        { status: 500 }
      );
    }

    const parsed = extractJson(textBlock.text);
    const trends = {
      tiktok: normalizeCategory(parsed.trends?.tiktok),
      instagram: normalizeCategory(parsed.trends?.instagram),
      youtube: normalizeCategory(parsed.trends?.youtube),
    };

    const total = trends.tiktok.length + trends.instagram.length + trends.youtube.length;
    if (total === 0) {
      return NextResponse.json(
        { error: "Formato de trends inválido." },
        { status: 500 }
      );
    }

    return NextResponse.json({ trends });
  } catch (error) {
    console.error("[trends]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao gerar tendências.",
      },
      { status: 500 }
    );
  }
}
