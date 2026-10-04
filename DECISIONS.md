# Decisions

Choices made where [SPEC.md](./SPEC.md) was open or ambiguous, or where we
departed from it. Newest phase at the bottom. Each entry gives the decision,
the reason, and what it costs.

---

## Phase 1 — Foundation

### D-001 · Monorepo: pnpm workspaces, no build step for internal packages

- `pnpm@10` workspaces (`apps/*`, `packages/*`). Root scripts fan out with `pnpm -r`.
- `@leafy/shared` and `@leafy/ui-tokens` ship **TypeScript source** (`main: src/index.ts`).
  Metro compiles TS natively. Next.js compiles them through `transpilePackages`.
- No Turborepo yet. With 4 small packages it adds config without saving time. Add it
  when CI time starts to matter (remote caching).

### D-002 · Versions (October 2026)

| Area | Choice | Why |
|---|---|---|
| Mobile | **Expo SDK 57** (React Native 0.86.3, React 19.2.3, New Architecture only) | Latest SDK, as SPEC §2 asks |
| Navigation | **Expo Router 57** | It now vendors react-navigation. Tab types come from `expo-router/tabs` |
| API | **Next.js 16.3** (App Router, Turbopack), Node runtime | — |
| Language | **TypeScript ~6.0** (not 7.0) | Expo's template pins `~6.0.3`, and `typescript-eslint` supports `<6.1` |
| Lint | **ESLint 9** (not 10) | `eslint-plugin-react`, used by both the Expo and Next configs, supports ESLint ≤ 9 |
| Validation | **Zod 4** | — |
| Tests | **Vitest 5** | — |

Native module versions are the ones SDK 57's `bundledNativeModules.json` pins.
`expo-doctor` passes all of its dependency and version checks.

### D-003 · Auth provider: **Better Auth** (implemented in Phase 2)

SPEC §2 offers Clerk or Better Auth. We chose **Better Auth**:

- **Users live in our Postgres.** `posts`, `plants`, `follows` and the rest reference
  `users.id` directly through Drizzle. There is no webhook sync with an external user
  store, and nothing can drift.
- **Account deletion** (required by both app stores, SPEC §5.7/§11) is one transaction
  we control, together with media cleanup.
- **No per-user pricing**, which matters for a free consumer app with a community.
- It fits the stack: Drizzle adapter, Next.js route handler (`app/api/auth/[...all]`),
  the first-party Expo plugin (`@better-auth/expo`, secure-store sessions), the email-OTP
  plugin, and Apple and Google sign-in from native ID tokens.
  Mobile sends `Authorization: Bearer`, and API routes verify it with
  `auth.api.getSession` in one `requireUser()` helper.

Trade-offs we accept:
- We send the OTP emails ourselves through **Resend**. This adds `RESEND_API_KEY` and `EMAIL_FROM`.
- We own rate-limiting and security updates for the auth routes. Upstash handles the rate limits.
- Apple and Google client setup is manual. The steps will be in the README in Phase 2.

Escape hatch: auth is isolated behind `requireUser()` on the API and an
`AuthProvider` on mobile. Moving to Clerk later only touches those two places.

### D-004 · `node-linker=hoisted`

React Native autolinking and Metro work most reliably with a flat `node_modules`.
SDK 54+ can work with isolated installs, but hoisting avoids edge cases with native modules.
The cost is that phantom (undeclared) dependencies become possible. Every app declares
what it imports, and the lint rules catch most mistakes.

### D-005 · The 4th tab stays **Care**

We kept the spec's proposal. Care is the screen people open every day. Its badge
(tasks due today) drives return visits, and it puts the scan button in the exact centre.
We considered *Explore/Search* instead, but search already sits in the Garden and
Community headers, so a tab for it would duplicate them.

### D-006 · Typography: Inter only, 4 weights

Inter is used for everything (SPEC §3.3 lets us choose), in Regular 400, Medium 500,
SemiBold 600 and Bold 700. It reads very well at 12–13 pt and covers Latin, Cyrillic
and Greek for i18n. Each weight is its own font family because Android ignores
`fontWeight` for custom fonts.

Fonts are imported **per weight** (`@expo-google-fonts/inter/400Regular`). Importing
from the package root bundled all 18 Inter files (≈6 MB).

### D-007 · Colour changes for WCAG AA ⚠️ *please review*

SPEC §3.2 requires every text/background pair to meet WCAG AA (4.5:1). We measured
the palette. Several tokens fail for small text, including `primaryStrong`, which the
spec says "meets contrast". We kept every spec value for its non-text uses and changed
the minimum needed:

| Token | Spec | Now | Contrast on white | Notes |
|---|---|---|---|---|
| `primaryStrong` | `#2F8F3A` (4.11) | **`#2A7F33`** | 5.02 | Same hue, a little darker. White button text 5.02. On the `primary50` tab pill 4.64. On `surfaceAlt` 4.50 |
| `textMuted` | `#98A69A` (2.54) | **`#677769`** | 4.75 | Placeholders and timestamps |
| `textDisabled` | — | `#98A69A` | — | The original muted value, kept for disabled or decorative use only (exempt from WCAG) |
| `dangerStrong` | — | `#D61E24` | 5.16 | Danger text and filled destructive buttons (white on `danger` was 3.91) |
| `warningStrong` | — | `#9E630A` | 4.95 | Warning text, including on `warningBg` |
| `infoStrong` | — | `#2374A7` | 5.09 | "Water today" text, including on `infoBg` |

- `danger`, `warning`, `info` and `primary` keep their spec values for icons, fills,
  meters and borders.
- The `*Strong` names follow the spec's own `primary` / `primaryStrong` pattern.
- `DangerMeter` uses two in-between colours, `#B9D85A` and `#EE7A3F`, to grade from
  green to red.
- `packages/ui-tokens/src/contrast.test.ts` checks every pair the components use
  (34 assertions).
- **Known gap:** the white icon on the scan-button gradient measures 1.7–2.75:1, under
  the 3:1 guideline for non-text graphics. We accept it for now because the button is
  identified by its unique raised shape and position and has an accessibility label.
  Phase 9 can darken the gradient's end stop or add an icon shadow.

### D-008 · Theming architecture

- Tokens live in `packages/ui-tokens`. Components read them through `useTheme()` /
  `createStyles(theme => …)`. Styles are created once per theme and cached.
- Dark mode will only change `ThemeProvider` (`lightTheme` → pick by colour scheme).
  No component needs to change.
- **Enforced:** ESLint fails on hex, `rgb()` or `hsl()` literals in `apps/mobile/app/**`
  and `apps/mobile/src/**` (SPEC rule 5).
- Shadows use `boxShadow` strings, which the New Architecture supports on iOS, Android
  and web. This replaces the platform-specific `shadow*` and `elevation` props.

### D-009 · Tab bar overlays the screen

The custom `TabBar` is positioned absolutely, and its container includes the 20 pt the
scan button rises into, with `pointerEvents: box-none`. **Android does not deliver
touches outside a parent's bounds**, so a button that sticks out of a normal bar would
be partly untappable. Scrollable tab screens add `useTabBarInset()` of bottom padding
(this is built into `<Screen tabBarInset>`).

### D-010 · Routes not named in the spec's route map

- Onboarding is at **`/welcome`** and `/permissions`. A group index `(onboarding)/index`
  would collide with `app/index.tsx` at `/`.
- **`(auth)/profile-setup`** was added. SPEC §5.2 describes this screen, but §4.2 doesn't list it.
- The scanner is its own nested stack (`scan/_layout.tsx`) presented as a
  **full-screen modal**. `plant/new` and `post/new` use modal presentation.
- `app/index.tsx` redirects to `/garden`. Phase 2 will route by auth and onboarding state.
- `/dev/*` (component gallery, route index, API status) redirects away when
  `__DEV__` is false.
- Typed routes are on. `pnpm typecheck` regenerates them first
  (`expo customize tsconfig.json`), so a bad `href` fails CI.

### D-011 · Web is a developer preview target only

`react-native-web` is installed so the app can run in a browser for quick design
review and automated Playwright checks. We don't ship web. Because of this:

- the API sends CORS headers **only in development**;
- `DateField` has a small `.web.tsx` fallback (an HTML date input).

### D-012 · i18n

- `i18next` + `react-i18next` + `expo-localization`.
- English strings are in `apps/mobile/src/i18n/locales/en.json`.
- Keys are **type-checked** (`CustomTypeOptions`), so `t('garden.typo')` fails `tsc`.
- Init is synchronous (`initAsync: false`), so the first frame already has strings.
- Fixture content in the dev gallery (demo plant names, captions) is not in the locale
  files. It stands in for user-generated content.

### D-013 · Reanimated 4 conventions

- Shared values are written with `.set()` in JS-thread code. The React-Compiler-aware
  rule in `eslint-plugin-react-hooks` v7 flags `.value =`.
- Callbacks from the UI thread use `scheduleOnRN` from `react-native-worklets`
  (`runOnJS` is deprecated in Reanimated 4).
- Every animation checks `useReducedMotion()`, or uses layout animations that follow
  the OS setting.

### D-014 · API conventions

- Every handler is wrapped in `route()`. Thrown `HttpError` / `ZodError` / unknown
  errors become `{ error: { code, message } }` with the right status. Unknown errors
  never leak internals.
- Unknown `/api/*` paths return the JSON 404 envelope (catch-all route), not HTML.
- Environment variables are validated with Zod **lazily**. `requireEnv('X')` at the
  point of use throws a clear error, so `next build` and unrelated routes don't need
  every secret.

### D-015 · Images accept URLs or bundled assets

`PlantCard`, `CareTaskRow` and `PostCard` take `ImageLike = string | number`: an API
URL, or `require()`'d art in dev. The dev gallery bundles three small generated
illustrations (~60 KB) rather than remote placeholder photos, which also lets it work
offline.

### D-016 · Phase 1 demo state for the Care tab

A small Zustand store (`features/care/demoCareStore.ts`) drives **both** the Care tab
list and its tab-bar badge. This lets you review the badge, the water-drop check
animation and the "All caught up! 🌿" state together. Phase 5 replaces it with
`GET /api/care/tasks`. Pull to refresh on the Care tab resets the demo.

### D-017 · Splash

The native splash shows the logo on white (`expo-splash-screen`). The JS `BrandSplash`
then shows the same logo in the same place, fades in the wordmark, and fades out
(~1.1 s, or instant with Reduce Motion). The icon, adaptive icon, splash and favicon
PNGs are rendered from `apps/mobile/assets/brand/logo.svg`. They're placeholder
quality until Phase 9.

### D-018 · Testing approach (Phase 1)

- Vitest covers pure TypeScript in every workspace: token contrast, shared schemas,
  API `http`/`env` helpers, mobile formatters (68 tests).
- Component tests (`jest-expo` + Testing Library) and API integration tests for
  auth/ownership arrive with the features they test (Phase 2+ / Phase 8).

### D-019 · Runware not touched yet

Phase 1 has no AI code. As SPEC rule 2 requires, Phase 3 starts by reading the current
Runware docs to confirm task types, models, request/response shapes and auth before
writing `RunwareProvider`. `AI_PROVIDER=mock` is already in the env schema.

### D-020 · Placeholder identifiers to replace

- The bundle ID / Android package `app.leafy.mobile` (in `packages/shared/brand.json`)
  is a placeholder. Use a reverse-DNS name you own before the first EAS build.
- The product name is in one place: `packages/shared/brand.json` (also read by
  `app.config.ts`).
