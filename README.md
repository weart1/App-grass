# Leafy 🌿

Plant scanner, personal garden manager and plant-growing community.
Expo (iOS + Android) app with a Next.js API on Vercel.

- **Product spec:** [SPEC.md](./SPEC.md)
- **Decisions & deviations:** [DECISIONS.md](./DECISIONS.md)

> The working name lives in one place: [`packages/shared/brand.json`](./packages/shared/brand.json).

## Status

| Phase | Scope | State |
|---|---|---|
| 1 | Foundation: monorepo, design system, `/dev/components`, tab bar, placeholder routes, API skeleton | ✅ Done |
| 2 | Auth (Better Auth) & profile setup, DB schema + migrations, `/me` | ⏭ Next |
| 3 | Scanner + mock AI → report → history, then the Runware adapter | |
| 4 | My Garden | |
| 5 | Care tab & notifications | |
| 6 | Community | |
| 7 | Profile & settings | |
| 8 | Polish | |
| 9 | Release prep | |

## Repository layout

```
apps/
  mobile/                 Expo SDK 57 app (Expo Router)
    app/                  routes (file-based): (tabs), scan/, plant/, post/, settings/, dev/ …
    src/
      components/         design system — ui/, garden/, safety/, feed/, layout/, navigation/
      theme/              ThemeProvider, useTheme, createStyles
      i18n/               i18next setup + locales/en.json (type-checked keys)
      lib/                api client, query client, haptics, network, formatters
      stores/             Zustand stores (toast)
      features/           feature hooks/state (care badge demo)
      navigation/         route registry, shared stack options
      dev/                component gallery + fixtures (dev builds only)
    assets/               icon, splash, brand/logo.svg
  api/                    Next.js 16 App Router, API-only (deployed to Vercel)
    app/api/              route handlers (health, JSON 404 catch-all)
    lib/                  env (Zod), http helpers (error envelope, route wrapper)
packages/
  shared/                 Zod schemas, enums, API envelopes, limits, brand.json
  ui-tokens/              colors, typography, spacing, radius, shadows, motion (+ contrast tests)
```

## Getting started

Prerequisites: **Node ≥ 22.12**, **pnpm 10** (`corepack enable`). For devices: Expo Go
or a development build, the iOS Simulator (macOS) or an Android emulator.

```bash
pnpm install
cp apps/api/.env.example apps/api/.env.local       # all optional in Phase 1
cp apps/mobile/.env.example apps/mobile/.env.local # EXPO_PUBLIC_API_URL
pnpm dev                                           # Expo + API together
```

- Expo dev server: press `i` (iOS), `a` (Android) or `w` (web preview), or scan the QR
  code with Expo Go.
- API: <http://localhost:3000/api/health>
- On a physical device, set `EXPO_PUBLIC_API_URL` to your computer's LAN IP, e.g.
  `http://192.168.1.20:3000`.

### Developer menu

In dev builds: **Profile → Developer menu**, or open `/dev`.

- **Component gallery** (`/dev/components`): every design-system component and state.
- **Route index** (`/dev/routes`): jump to any screen, including placeholders, grouped
  by the phase that builds them.
- **API status**: live `GET /api/health` check against `EXPO_PUBLIC_API_URL`.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Expo dev server + Next.js API in parallel |
| `pnpm dev:mobile` / `pnpm dev:api` | One side only |
| `pnpm typecheck` | `tsc` in every workspace (mobile regenerates typed routes first) |
| `pnpm lint` | ESLint everywhere (bans hard-coded colours in the mobile app) |
| `pnpm test` | Vitest in every workspace |
| `pnpm check` | typecheck + lint + test |
| `pnpm format` / `pnpm format:check` | Prettier |
| `pnpm db:migrate` / `pnpm db:seed` | Placeholders until Phases 2 and 8 |
| `pnpm --filter @leafy/mobile doctor` | `expo-doctor` |

## Environment variables

Each app has a `.env.example`. **Never commit real values.**

- `apps/mobile/.env.example`: only `EXPO_PUBLIC_API_URL`. Everything `EXPO_PUBLIC_*`
  ships inside the app bundle, so no secrets go there. All AI and storage keys stay on
  the server.
- `apps/api/.env.example`: Runware, Neon, Blob, Upstash, auth, cron, Expo push, Sentry.
  The API validates them with Zod when they're used (`lib/env.ts`).

## Deploying the API to Vercel

1. Import the repo in Vercel and set **Root Directory = `apps/api`**. Next.js and the
   pnpm workspace are detected automatically.
2. Add the Neon, Blob and Upstash integrations from the Vercel Marketplace. They inject
   `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN` and `UPSTASH_*`.
3. Add the remaining variables from `apps/api/.env.example`.
4. `GET /api/health` should return `{ "status": "ok", … }`.

Route handlers that call Runware or process images use the **Node.js runtime**
(`export const runtime = 'nodejs'`).

## Conventions

- **Design tokens only.** Use `useTheme()` / `createStyles()`. Hex colours in app code fail lint.
- **Strings in `en.json` only.** Keys are type-checked.
- **API errors** are always `{ error: { code, message } }`. Lists use `{ items, nextCursor }`.
- **Accessibility:** icon buttons require `accessibilityLabel` (enforced by types), touch
  targets are ≥ 44 pt, font scaling is capped at 1.3×, and animations respect Reduce Motion.
