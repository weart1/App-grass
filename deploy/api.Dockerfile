# Leafy API image. Build from the repo root:
#   docker build -f deploy/api.Dockerfile .
# (docker compose in deploy/ does this for you.)

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

# 1) Install dependencies. Only manifests are copied first, so this layer is
#    cached until a package.json or the lockfile changes.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/
COPY apps/mobile/package.json apps/mobile/
COPY packages/shared/package.json packages/shared/
COPY packages/ui-tokens/package.json packages/ui-tokens/
RUN pnpm install --frozen-lockfile --filter "@leafy/api..."

# 2) Build the Next.js server (standalone output).
FROM deps AS build
COPY tsconfig.base.json ./
COPY packages packages
COPY apps/api apps/api
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @leafy/api build

# 3) Small runtime image: just Node + the standalone server. Runs as non-root.
FROM node:22-alpine AS runner
WORKDIR /app
ARG GIT_COMMIT_SHA=dev
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    GIT_COMMIT_SHA=$GIT_COMMIT_SHA
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /repo/apps/api/.next/standalone ./
COPY --from=build --chown=app:app /repo/apps/api/.next/static ./apps/api/.next/static
USER app
EXPOSE 3000
CMD ["node", "apps/api/server.js"]
