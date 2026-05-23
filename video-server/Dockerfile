FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    python3-pip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages \
      torch --index-url https://download.pytorch.org/whl/cpu \
  && pip3 install --no-cache-dir --break-system-packages -r requirements.txt \
  && python3 -c "import whisper; whisper.load_model('base')"

COPY package.json ./
RUN npm install --omit=dev

COPY index.js whisper_service.py ./

RUN mkdir -p uploads outputs tmp

ENV NODE_ENV=production
ENV PORT=3001
ENV WHISPER_MODEL=base

EXPOSE 3001

CMD ["node", "index.js"]
