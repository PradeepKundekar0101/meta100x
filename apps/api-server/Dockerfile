FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY apps/api-server/package.json ./apps/api-server/

RUN pnpm install --frozen-lockfile

COPY packages/db ./packages/db
COPY packages/types ./packages/types
COPY apps/api-server ./apps/api-server

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/db exec prisma generate


WORKDIR /app/apps/api-server
RUN npm run build