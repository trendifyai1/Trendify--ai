FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY index.js ./

RUN mkdir -p uploads outputs

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "index.js"]
