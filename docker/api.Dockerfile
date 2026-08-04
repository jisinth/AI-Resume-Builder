# syntax=docker/dockerfile:1
FROM node:26-alpine AS base
# Prisma's query/schema engine binaries need OpenSSL, which node:20-alpine
# does not include by default.
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN pnpm install --frozen-lockfile --filter @ai-resume-builder/api... --filter @ai-resume-builder/api

FROM base AS build
COPY --from=deps /app /app
COPY . .
RUN pnpm --filter @ai-resume-builder/api exec prisma generate
RUN pnpm --filter @ai-resume-builder/api... run build

FROM node:26-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY --from=build /app /app
EXPOSE 4000
WORKDIR /app/apps/api
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main.js"]
