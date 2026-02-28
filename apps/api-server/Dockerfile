FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

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

EXPOSE 8001
CMD ["node", "dist/index.js"]
