ARG NODE_VERSION=24

################################
# Base: use pnpm via corepack
################################
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app
RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PNPM_STORE_PATH="/pnpm-store"
ENV PATH="$PNPM_HOME:$PATH"

################################
# Stage: pnpm fetch (cache dependencies)
################################
FROM base AS fetch

COPY pnpm-lock.yaml ./
RUN pnpm config set store-dir $PNPM_STORE_PATH && pnpm fetch

################################
# Stage: dependencies (install deps offline)
################################
FROM base AS deps

COPY --from=fetch /pnpm-store /pnpm-store
RUN pnpm config set store-dir $PNPM_STORE_PATH
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --offline --frozen-lockfile

################################
# Stage: build
################################
FROM deps AS build

COPY . .
RUN pnpm build
RUN pnpm prune --prod

################################
# Stage: dev
################################
FROM deps AS dev

ENV NODE_ENV=development
COPY . .
CMD ["pnpm", "dev"]

################################
# Stage: prod (distroless)
################################
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12:nonroot AS prod

WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=build --chown=65532:65532 /app/dist ./dist
CMD ["dist/index.js"]
# Optional: its nice to implement some sort of healthcheck in your app
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD ["curl", "-f", "http://localhost:3000/healthz"] || exit 1