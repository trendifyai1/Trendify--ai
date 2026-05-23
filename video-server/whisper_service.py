#!/usr/bin/env python3
import json
import os
import sys

import whisper

MODEL_NAME = os.environ.get("WHISPER_MODEL", "base")

print(json.dumps({"status": "loading", "model": MODEL_NAME}), flush=True)
model = whisper.load_model(MODEL_NAME)
print(json.dumps({"status": "ready", "model": MODEL_NAME}), flush=True)

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue

    request_id = None
    try:
        payload = json.loads(line)
        request_id = payload.get("id")
        audio_path = payload.get("audio")
        language = payload.get("language", "pt")

        if not audio_path:
            raise ValueError('Campo "audio" é obrigatório.')

        result = model.transcribe(
            audio_path,
            language=language,
            fp16=False,
            verbose=False,
        )

        print(
            json.dumps(
                {
                    "id": request_id,
                    "text": (result.get("text") or "").strip(),
                    "language": result.get("language", language),
                }
            ),
            flush=True,
        )
    except Exception as error:
        print(
            json.dumps(
                {
                    "id": request_id,
                    "error": str(error),
                }
            ),
            flush=True,
        )
