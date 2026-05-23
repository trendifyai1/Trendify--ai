const express = require("express");
const cors = require("cors");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");
const readline = require("readline");

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const WHISPER_MODEL = process.env.WHISPER_MODEL || "base";

const ROOT_DIR = __dirname;
const UPLOAD_DIR = path.join(ROOT_DIR, "uploads");
const OUTPUT_DIR = path.join(ROOT_DIR, "outputs");
const TMP_DIR = path.join(ROOT_DIR, "tmp");

for (const dir of [UPLOAD_DIR, OUTPUT_DIR, TMP_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(",").map((o) => o.trim()),
  })
);

app.use(express.json({ limit: "2mb" }));
app.use("/outputs", express.static(OUTPUT_DIR));

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${crypto.randomUUID()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed =
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("audio/") ||
      file.mimetype === "application/octet-stream";

    if (allowed) {
      cb(null, true);
      return;
    }

    cb(new Error("Apenas arquivos de vídeo ou áudio são permitidos."));
  },
});

let whisperReady = false;
let whisperSeq = 0;
const whisperPending = new Map();

const whisperProcess = spawn("python3", [path.join(ROOT_DIR, "whisper_service.py")], {
  stdio: ["pipe", "pipe", "inherit"],
  env: { ...process.env, WHISPER_MODEL },
});

const whisperReader = readline.createInterface({ input: whisperProcess.stdout });

whisperReader.on("line", (line) => {
  try {
    const message = JSON.parse(line);

    if (message.status === "ready") {
      whisperReady = true;
      console.log(`[whisper] Modelo "${message.model}" pronto.`);
      return;
    }

    if (message.status === "loading") {
      console.log(`[whisper] Carregando modelo "${message.model}"...`);
      return;
    }

    if (message.id != null && whisperPending.has(message.id)) {
      whisperPending.get(message.id)(message);
      whisperPending.delete(message.id);
    }
  } catch (error) {
    console.error("[whisper] Resposta inválida:", error);
  }
});

whisperProcess.on("exit", (code) => {
  whisperReady = false;
  console.error(`[whisper] Processo encerrado com código ${code}.`);
});

function transcribeAudio(audioPath, language = "pt") {
  return new Promise((resolve, reject) => {
    if (!whisperReady) {
      reject(new Error("Whisper ainda está carregando. Tente novamente em instantes."));
      return;
    }

    const id = ++whisperSeq;

    const timeout = setTimeout(() => {
      whisperPending.delete(id);
      reject(new Error("Timeout na transcrição com Whisper."));
    }, 10 * 60 * 1000);

    whisperPending.set(id, (message) => {
      clearTimeout(timeout);
      if (message.error) {
        reject(new Error(message.error));
        return;
      }
      resolve(message.text || "");
    });

    whisperProcess.stdin.write(
      `${JSON.stringify({ id, audio: audioPath, language })}\n`
    );
  });
}

function sanitizeFilename(value, fallback) {
  const cleaned = String(value || fallback)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 80);

  return cleaned || fallback;
}

function parseClips(raw) {
  if (!raw) {
    throw new Error('Campo "clips" é obrigatório.');
  }

  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('"clips" deve ser um array com ao menos um corte.');
  }

  return parsed.map((clip, index) => {
    const start = Number(clip.start ?? clip.startTime ?? 0);
    let end = clip.end != null ? Number(clip.end) : null;
    const duration = clip.duration != null ? Number(clip.duration) : null;

    if (Number.isNaN(start) || start < 0) {
      throw new Error(`Clip ${index + 1}: "start" inválido.`);
    }

    if (end == null && duration != null) {
      end = start + duration;
    }

    if (end == null || Number.isNaN(end) || end <= start) {
      throw new Error(`Clip ${index + 1}: informe "end" ou "duration" válidos.`);
    }

    return {
      title: clip.title || `clip-${index + 1}`,
      start,
      end,
      duration: end - start,
    };
  });
}

function extractAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec("pcm_s16le")
      .audioFrequency(16000)
      .audioChannels(1)
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (error) => reject(error))
      .run();
  });
}

function cutClip(inputPath, outputPath, start, duration) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(start)
      .duration(duration)
      .outputOptions([
        "-c:v libx264",
        "-preset fast",
        "-crf 23",
        "-c:a aac",
        "-b:a 128k",
        "-movflags +faststart",
        "-avoid_negative_ts make_zero",
      ])
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (error) => reject(error))
      .run();
  });
}

function removeDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  fs.rmSync(dirPath, { recursive: true, force: true });
}

function removeFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "trendify-video-server",
    ffmpeg: "ready",
    whisper: whisperReady ? "ready" : "loading",
    whisperModel: WHISPER_MODEL,
  });
});

app.post("/transcribe", upload.single("video"), async (req, res) => {
  const uploadedPath = req.file?.path;
  const jobId = crypto.randomUUID();
  const audioPath = path.join(TMP_DIR, `${jobId}.wav`);
  const language =
    typeof req.body.language === "string" && req.body.language.trim()
      ? req.body.language.trim()
      : "pt";

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Campo "video" é obrigatório.' });
    }

    if (!whisperReady) {
      return res.status(503).json({
        error: "Whisper ainda está carregando. Tente novamente em instantes.",
      });
    }

    await extractAudio(uploadedPath, audioPath);
    const transcript = await transcribeAudio(audioPath, language);

    return res.json({
      transcript,
      language,
      model: WHISPER_MODEL,
      source: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("[transcribe]", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Erro ao transcrever vídeo.",
    });
  } finally {
    removeFile(uploadedPath);
    removeFile(audioPath);
  }
});

app.post("/cut", upload.single("video"), async (req, res) => {
  const uploadedPath = req.file?.path;
  const jobId = crypto.randomUUID();
  const jobOutputDir = path.join(OUTPUT_DIR, jobId);

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Campo "video" é obrigatório.' });
    }

    const clips = parseClips(req.body.clips);
    fs.mkdirSync(jobOutputDir, { recursive: true });

    const results = [];

    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const filename = `${String(i + 1).padStart(2, "0")}-${sanitizeFilename(clip.title, `clip-${i + 1}`)}.mp4`;
      const outputPath = path.join(jobOutputDir, filename);

      await cutClip(uploadedPath, outputPath, clip.start, clip.duration);

      const stats = fs.statSync(outputPath);

      results.push({
        index: i + 1,
        title: clip.title,
        start: clip.start,
        end: clip.end,
        duration: clip.duration,
        filename,
        size: stats.size,
        downloadUrl: `/outputs/${jobId}/${filename}`,
      });
    }

    return res.json({
      jobId,
      source: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      clips: results,
      totalClips: results.length,
    });
  } catch (error) {
    removeDir(jobOutputDir);
    console.error("[cut]", error);

    const message =
      error instanceof SyntaxError
        ? 'JSON inválido no campo "clips".'
        : error instanceof Error
          ? error.message
          : "Erro ao cortar vídeo.";

    return res.status(error instanceof multer.MulterError ? 413 : 500).json({ error: message });
  } finally {
    removeFile(uploadedPath);
  }
});

app.use((err, _req, res, _next) => {
  console.error("[server]", err);

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? `Arquivo excede o limite de ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB.`
        : err.message;

    return res.status(413).json({ error: message });
  }

  return res.status(500).json({
    error: err instanceof Error ? err.message : "Erro interno do servidor.",
  });
});

app.listen(PORT, () => {
  console.log(`Trendify video server running on port ${PORT}`);
});
