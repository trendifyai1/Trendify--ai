import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Você é especialista em viralização para TikTok, Reels e Shorts.
Analise a transcrição e retorne APENAS JSON com 4 clips virais:
{ "clips": [{ "title": string, "hook": string, "viralScore": number (70-99), "duration": number (15-60), "reason": string, "hashtags": string[] }] }`;

function extractJson(text: string) {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Resposta da IA não contém JSON válido.");
  }
  return JSON.parse(match[0]) as { clips: unknown[] };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transcript =
      typeof body?.transcript === "string" ? body.transcript.trim() : "";

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcrição é obrigatória." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Transcrição do vídeo:\n\n${transcript}`,
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

    if (!Array.isArray(parsed.clips) || parsed.clips.length === 0) {
      return NextResponse.json(
        { error: "Formato de clips inválido." },
        { status: 500 }
      );
    }

    return NextResponse.json({ clips: parsed.clips.slice(0, 4) });
  } catch (error) {
    console.error("[analyze-clips]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao analisar transcrição.",
      },
      { status: 500 }
    );
  }
}
