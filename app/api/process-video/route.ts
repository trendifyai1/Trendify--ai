import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 300;

const WHISPER_MAX_BYTES = 25 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const settingsRaw = formData.get("settings");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Arquivo de vídeo é obrigatório." },
        { status: 400 }
      );
    }

    if (file.size > WHISPER_MAX_BYTES) {
      return NextResponse.json(
        { error: "O vídeo deve ter no máximo 25MB para transcrição com Whisper." },
        { status: 400 }
      );
    }

    const settings =
      typeof settingsRaw === "string"
        ? JSON.parse(settingsRaw)
        : {};

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdmin();
    const videoId = crypto.randomUUID();
    const storagePath = `${videoId}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(storagePath, buffer, {
        contentType: file.type || "video/mp4",
        upsert: false,
      });

    if (uploadError) {
      console.error("[process-video] storage", uploadError);
      return NextResponse.json(
        { error: `Falha ao enviar vídeo: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: publicData } = supabase.storage
      .from("videos")
      .getPublicUrl(storagePath);

    const { error: insertError } = await supabase.from("videos").insert({
      id: videoId,
      file_name: file.name,
      storage_path: storagePath,
      file_url: publicData.publicUrl,
      status: "transcribing",
      settings,
    });

    if (insertError) {
      console.error("[process-video] insert", insertError);
      return NextResponse.json(
        { error: `Falha ao salvar vídeo: ${insertError.message}` },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: openaiKey });
    const transcription = await openai.audio.transcriptions.create({
      file: await toFile(buffer, file.name, { type: file.type || "video/mp4" }),
      model: "whisper-1",
      language: "pt",
    });

    const transcript = transcription.text?.trim() || "";

    const { error: updateError } = await supabase
      .from("videos")
      .update({
        transcript,
        status: "ready",
      })
      .eq("id", videoId);

    if (updateError) {
      console.error("[process-video] update", updateError);
      return NextResponse.json(
        { error: `Falha ao salvar transcrição: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: videoId,
      transcript,
      fileUrl: publicData.publicUrl,
    });
  } catch (error) {
    console.error("[process-video]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao processar vídeo.",
      },
      { status: 500 }
    );
  }
}
