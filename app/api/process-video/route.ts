import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_FILE_BYTES = 500 * 1024 * 1024;

function getVideoServerUrl() {
  const url =
    process.env.VIDEO_SERVER_URL?.trim() ||
    process.env.NEXT_PUBLIC_VIDEO_SERVER_URL?.trim();

  if (!url) {
    throw new Error("VIDEO_SERVER_URL não configurada.");
  }

  return url.replace(/\/$/, "");
}

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

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "O vídeo deve ter no máximo 500MB." },
        { status: 400 }
      );
    }

    const settings =
      typeof settingsRaw === "string" ? JSON.parse(settingsRaw) : {};

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

    const videoServerUrl = getVideoServerUrl();
    const transcribeForm = new FormData();
    transcribeForm.append("video", new Blob([buffer], { type: file.type || "video/mp4" }), file.name);
    transcribeForm.append("language", "pt");

    const transcribeRes = await fetch(`${videoServerUrl}/transcribe`, {
      method: "POST",
      body: transcribeForm,
    });

    const transcribeData = (await transcribeRes.json()) as {
      transcript?: string;
      error?: string;
    };

    if (!transcribeRes.ok) {
      console.error("[process-video] transcribe", transcribeData);
      return NextResponse.json(
        {
          error:
            transcribeData.error ||
            "Falha ao transcrever vídeo no servidor de vídeo.",
        },
        { status: transcribeRes.status }
      );
    }

    const transcript = transcribeData.transcript?.trim() || "";

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
