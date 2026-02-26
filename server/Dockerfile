# ---------- BUILD STAGE ----------
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build
RUN npx prisma generate


# ---------- RUNTIME STAGE ----------
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y openssl dumb-init

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

ENTRYPOINT ["dumb-init","--"]
CMD ["node","dist/server.js"]