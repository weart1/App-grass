# PROMPT FOR CLAUDE CODE — "Leafy" Plant Scanner App

> Copy everything below this line into Claude Code (or save it in the repo as `SPEC.md` and tell Claude Code: "Read SPEC.md and build the project phase by phase").

---

## 0. Your role and how to work

You are a senior full-stack engineer and product designer. Build a production-quality mobile app called **Leafy** (working name — keep it in one constant so it's easy to rename) — a plant scanner, personal garden manager and plant-growing community.

Rules for how you work:

1. **Work in phases** (see section 12). After each phase: run the app, run type checks and lint, fix errors, then summarize what was done and what's next. Do not jump ahead.
2. **Before writing any Runware integration code, read the current Runware API docs** (https://runware.ai/docs) and confirm the exact task types, model identifiers, request/response shapes and auth method. Do not invent endpoints or parameters. If a capability I describe isn't available in Runware, tell me and propose the closest alternative behind the same adapter interface (section 6).
3. TypeScript everywhere, strict mode. No `any` unless justified in a comment.
4. Never expose API keys to the mobile client. All Runware calls go through the backend.
5. Keep components small and reusable. Build the design system (section 3) first and use only its tokens — no hardcoded colors or spacing in screens.
6. If something in this spec is ambiguous, pick the most sensible option, write the decision in `DECISIONS.md`, and continue.

---

## 1. Product overview

Leafy lets users:

- **Scan** any plant with the camera and get a detailed report: what it is, how dangerous it is (to people, children, pets), how useful it is (edible, medicinal, decorative, pollinator-friendly), and how to care for it.
- Keep a **My Garden** collection: add their plants, track planting date, expected sprouting/flowering/harvest dates, watering and fertilizing schedules, and a photo journal of growth — with reminders.
- Share progress in a **Community** feed (Instagram-like): posts with photos, likes, comments, saves, follows.
- Manage a **Profile** with their posts, their garden (public or private), scan history and settings.

Target: iOS and Android phones. Portrait only.

---

## 2. Tech stack

**Mobile app**
- Expo (latest SDK) + React Native + TypeScript
- Expo Router (file-based navigation, tabs + stacks + modals)
- `expo-camera` for the scanner, `expo-image-picker` for gallery upload, `expo-image-manipulator` to resize/compress before upload (max 1600px long side, JPEG ~0.8)
- `expo-image` for fast cached images
- `expo-notifications` for watering/care reminders (push via Expo Push Service)
- `expo-haptics` for tactile feedback (scan button, like, save)
- TanStack Query for server state, Zustand for small local UI state
- React Hook Form + Zod for forms
- `react-native-reanimated` + `react-native-gesture-handler` for animations (double-tap like, scan pulse, bottom sheets)
- `@gorhom/bottom-sheet` for sheets
- Icons: `lucide-react-native`
- i18n-ready from day one (`i18next`), English as default; keep all strings in locale files

**Backend (Node.js on Vercel)**
- Next.js (App Router) used as an API-only project deployed on Vercel — route handlers under `app/api/**`. Node.js runtime (not Edge) for routes that call Runware or process images.
- Database: Postgres via Neon (Vercel Marketplace integration) + Drizzle ORM + drizzle-kit migrations
- File storage: Vercel Blob (user photos, plant photos, post images). Mobile uploads via signed client upload tokens from the backend.
- Auth: email one-time code + Sign in with Apple + Google. Use a proven library/service (e.g. Clerk with its Expo SDK, or Better Auth) — choose one, justify in `DECISIONS.md`. Backend verifies the session/JWT on every request.
- Validation: Zod on every request body and on every AI response.
- Rate limiting: Upstash Redis (Vercel Marketplace) — e.g. free users 10 scans/day, 60 API writes/min.
- Scheduled jobs: Vercel Cron (every 15 min) to send due care reminders via Expo Push.
- AI: **Runware API** via a provider adapter (section 6).

**Repo structure (monorepo, pnpm workspaces)**
```
/apps/mobile        Expo app
/apps/api           Next.js API on Vercel
/packages/shared    Zod schemas, TS types, constants shared by both
/packages/ui-tokens Design tokens (colors, spacing, typography)
```

**Environment variables** (create `.env.example` in each app, never commit real values):
```
RUNWARE_API_KEY=
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
AUTH_SECRET=            # or Clerk keys if Clerk is chosen
CRON_SECRET=
EXPO_ACCESS_TOKEN=
EXPO_PUBLIC_API_URL=    # mobile → backend base URL
```

---

## 3. Design system

### 3.1 Mood
Fresh, airy, calm, "morning greenhouse". Lots of white space, soft light-green surfaces, rounded shapes, gentle shadows, friendly illustrations. Never dark or aggressive — except clear red/orange for toxicity warnings.

### 3.2 Color palette — white + light green

| Token | Hex | Use |
|---|---|---|
| `bg` | `#FFFFFF` | Main background |
| `surface` | `#F5FBF3` | Cards, inputs, sheets |
| `surfaceAlt` | `#EAF6E6` | Selected chips, section backgrounds, skeletons |
| `primary50` | `#EEF9EC` | Very light tint (tab-bar active pill, banners) |
| `primary100` | `#D4F0CE` | Tags, progress track |
| `primary300` | `#A6DE9B` | Borders of active elements, illustrations |
| `primary` | `#6CC55C` | Main brand light green — icons, accents, progress fill, large elements |
| `primaryStrong` | `#2F8F3A` | Filled buttons with white text, links, active tab label (meets contrast) |
| `primaryDeep` | `#1E5E27` | Pressed states, headings on green surfaces |
| `textPrimary` | `#1C2B1F` | Main text |
| `textSecondary` | `#5B6B5E` | Secondary text |
| `textMuted` | `#98A69A` | Placeholders, timestamps |
| `border` | `#E2ECDF` | Dividers, card borders |
| `danger` | `#E5484D` | "Highly toxic", destructive actions |
| `dangerBg` | `#FDECEC` | Danger badge background |
| `warning` | `#F2A93B` | "Mildly toxic / caution" |
| `warningBg` | `#FEF4E4` | Warning badge background |
| `info` | `#3D9BD6` | Watering (water-drop icons), info notes |
| `infoBg` | `#E8F4FB` | Watering badge background |
| `sun` | `#F5C542` | Sunlight indicators |

Gradients (use sparingly): scan button and onboarding hero `#8BD97C → #4FB04A` (top-left to bottom-right).

**Check every text/background pair for WCAG AA (4.5:1 for body text).** Light green `primary` is for icons and large shapes only, never for small text on white.

Dark mode: not in v1, but keep all colors in tokens so it can be added later.

### 3.3 Typography
- Font: **Inter** (or "Manrope" for headings + Inter for body — pick one approach and be consistent), loaded via `expo-font`.
- Scale: `display 32/38 bold`, `h1 26/32 bold`, `h2 21/28 semibold`, `h3 17/24 semibold`, `body 15/22 regular`, `bodySmall 13/18 regular`, `caption 12/16 medium`, `button 16/20 semibold`.
- Support Dynamic Type / font scaling up to 1.3× without breaking layouts.

### 3.4 Spacing, radius, shadow
- Spacing scale (4-pt): 4, 8, 12, 16, 20, 24, 32, 40, 48. Screen horizontal padding 20.
- Radius: `sm 10`, `md 16` (cards, inputs), `lg 24` (sheets, big cards), `full 999` (chips, avatars, scan button).
- Shadow (soft, green-tinted): `0 4 16 rgba(47,143,58,0.08)`; elevated (tab bar, scan button): `0 8 24 rgba(47,143,58,0.18)`.

### 3.5 Core components (build these first, with a hidden `/dev/components` screen showing all of them)
- `Button` (primary filled, secondary tinted, ghost, destructive; sizes L/M/S; loading state)
- `IconButton`, `Chip` / `FilterChip`, `Badge` (success/warning/danger/info/neutral)
- `Card`, `PlantCard` (photo, name, next task), `PostCard`
- `TextField`, `TextArea`, `DateField`, `Select`, `Stepper` (e.g. "every N days"), `Toggle`
- `Avatar` (with fallback initials on primary100)
- `ProgressRing` and `ProgressBar` (growth stage, days until sprouting)
- `CareTaskRow` (icon + task + due label + check button)
- `DangerMeter` (3–5 segment scale, colored from green to red)
- `UsefulnessTags` (edible, medicinal, decorative, air-purifying, pollinator-friendly…)
- `EmptyState` (illustration + title + text + CTA)
- `Skeleton` loaders for every list
- `Toast`, `ConfirmDialog`, `BottomSheet`
- `SegmentedControl` (for tabs inside screens)

### 3.6 Motion & feedback
- Scan button: idle soft pulse ring (light green, 2s loop); on press → scale 0.92 + haptic.
- Like: double-tap image → heart burst animation + haptic; heart icon fills.
- Watering check-off: checkbox fills with a water-drop splash micro-animation.
- Screen transitions: native stack defaults; modals slide up.
- Respect "Reduce Motion" OS setting.

---

## 4. Navigation

### 4.1 Bottom tab bar (custom component)
White bar, top border `border`, elevated shadow, 5 slots, safe-area aware:

```
[ My Garden ]  [ Community ]  ( ● SCAN ● )  [ Care ]  [ Profile ]
```

- **Center Scan button**: circular, 64–68 pt, raised ~20 pt above the bar, gradient fill, white scan/leaf-viewfinder icon, white 4 pt ring separating it from the bar. Tap opens the Scanner as a **full-screen modal** (not a tab content screen).
- Other tabs: icon + label; active = `primaryStrong` icon/label on a `primary50` pill; inactive = `textMuted`.
- Icons (lucide): Garden → `sprout`, Community → `users` (or `layout-grid`), Care → `calendar-check`, Profile → `user-round`.
- "Care" tab shows a badge with the number of tasks due today.
- The 4th tab ("Care" — calendar of all care tasks) is added so the scan button sits in the exact center. If you think a different 4th tab is better, propose it in `DECISIONS.md`.

### 4.2 Route map (Expo Router)
```
app/
  _layout.tsx                 root providers (Query, Auth, Theme, i18n, Notifications)
  (onboarding)/               welcome slides, permissions
  (auth)/                     sign-in, verify-code
  (tabs)/
    _layout.tsx               custom tab bar
    garden/index.tsx          My Garden
    community/index.tsx       Feed
    care/index.tsx            Care calendar
    profile/index.tsx         My profile
  scan/
    index.tsx                 camera (modal)
    processing.tsx            analyzing
    result/[scanId].tsx       report
    history.tsx               scan history
  plant/
    new.tsx                   add plant (modal)
    [plantId]/index.tsx       plant card
    [plantId]/edit.tsx
    [plantId]/journal-new.tsx add growth photo/entry
    [plantId]/schedule.tsx    edit care schedule
  post/
    new.tsx                   create post (modal)
    [postId].tsx              post detail + comments
  user/[userId].tsx           other user's profile
  notifications.tsx
  settings/…                  account, notifications, privacy, units, about
  search.tsx                  search users, posts, plants
```

---

## 5. Screens — detailed specification

For each screen implement: loading skeleton, empty state, error state with retry, pull-to-refresh where it's a list, and offline handling (show cached data + banner "You're offline").

### 5.1 Splash & Onboarding
- **Splash**: white background, Leafy logo (leaf inside a rounded viewfinder) in `primary`, subtle fade-in.
- **Onboarding (3 slides)**, swipeable, dots indicator, "Skip" top-right:
  1. "Identify any plant in seconds" — illustration of a phone scanning a leaf.
  2. "Grow with smart reminders" — watering can + calendar illustration.
  3. "Share your green wins" — feed of plant photos with hearts.
  - Final CTA "Get started" (primaryStrong button).
- **Permissions screen**: friendly explanation cards for Camera (required for scanning) and Notifications (for watering reminders), each with "Allow" button; user can continue without notifications.

### 5.2 Auth
- **Sign in**: logo, title "Welcome to Leafy", buttons: Continue with Apple, Continue with Google, Continue with email. Small terms/privacy text.
- **Email code**: 6-digit OTP input with auto-advance, resend timer (30s).
- **Profile setup** (first login only): avatar picker, display name, unique @username (live availability check), optional: city/climate zone (used for planting advice), experience level (Beginner / Hobbyist / Expert) as chips.

### 5.3 Scanner (center button) — the core feature

**5.3.1 Camera screen (full-screen modal)**
- Live camera preview, full bleed.
- Center: rounded-square viewfinder frame with animated light-green corner brackets and a soft scanning line moving top→bottom.
- Top bar (on translucent dark gradient): close (X), flash toggle, "Tips" (?) icon.
- Hint pill under the frame: "Fit the leaf or flower in the frame" (rotates through tips: good light, one plant, close-up of leaves/flowers).
- Mode chips above the shutter: **Identify** (default) · **Diagnose** (sick plant: spots, yellow leaves, pests) · **Toxicity check** (quick safety-focused result). Mode changes the AI prompt.
- Bottom: gallery thumbnail (left, opens image picker), big shutter button (center, white with green ring), scan history icon (right).
- Option to add up to 3 photos of the same plant (leaf, flower, whole plant) for better accuracy — small thumbnails stack appears after first shot with "+ Add angle" and "Analyze" button.
- On capture: resize/compress → upload to Blob via signed token → `POST /api/scans` → navigate to Processing.

**5.3.2 Processing screen**
- The captured photo blurred in background, the sharp photo in a rounded card in the center.
- Animated leaf/progress ring, rotating status text: "Looking at leaf shape…", "Comparing with plant database…", "Checking safety for pets and kids…", "Preparing your report…".
- Cancel button. Timeout handling (e.g. 30s) → friendly error with "Try again" and tips for a better photo.

**5.3.3 Scan Result / Plant Report**
Scrollable screen, large hero photo at top (user's photo) with back + share + save icons over it. Then a white sheet with rounded top corners overlapping the photo:

1. **Header**: common name (h1), scientific name (italic, textSecondary), family. **Confidence** badge (e.g. "92% match"). If confidence < 60%: yellow banner "Not sure — here are the closest matches" + horizontal carousel of 2–3 alternative candidates (tap to switch report).
2. **Quick facts row** (horizontal chips with icons): type (houseplant / tree / herb / vegetable / weed / flower), lifecycle (annual / perennial), native region, size at maturity.
3. **Safety section** — most prominent block:
   - `DangerMeter` with overall level: Safe / Low / Moderate / High / Severe.
   - Three sub-cards: **Humans**, **Children**, **Pets (cats/dogs)** — each with level badge and 1–2 sentences.
   - Toxic parts (leaves, berries, sap, roots…), symptoms, what to do if ingested.
   - Skin/allergy contact warnings.
   - Fixed disclaimer: "AI identification can be wrong. Never eat or use a plant medicinally based only on this app. In case of poisoning contact local poison control or emergency services." (Danger levels High/Severe show this in a red-tinted card at the top of the section.)
4. **Usefulness section**: `UsefulnessTags` + short descriptions — edible parts (with caution note), medicinal uses (traditional, with disclaimer), decorative value, air purification, attracts pollinators, companion planting.
5. **Care guide** (icon grid, 2×3): Light ☀ · Water 💧 (frequency) · Temperature · Humidity · Soil · Fertilizer. Each tile opens a bottom sheet with details.
6. **Growing timeline** (for growable plants): sowing → germination (X–Y days) → first true leaves → flowering → harvest/maturity, shown as a horizontal step timeline.
7. **Diagnose mode only**: "Health check" block on top — detected issue (e.g. overwatering, spider mites, fungal leaf spot), severity, causes, step-by-step treatment, prevention.
8. **Fun fact** card (light green background).
9. **Sticky bottom bar**: primary button **"Add to My Garden"** + secondary icon buttons "Share to Community" and "Save report".
- "Report wrong result" link at the bottom → small form (correct name, comment) stored for quality review.

**5.3.4 Scan History**
- List grouped by date: thumbnail, plant name, confidence, safety badge. Search + filter chips (All / Toxic / Edible / Diagnoses). Swipe to delete. Tap → result screen (from DB, no re-scan).

### 5.4 My Garden tab

**5.4.1 Garden home**
- Header: "My Garden" (h1), subtitle "12 plants · 3 tasks today", right: search icon + "+" button.
- **Today's care strip** (horizontal cards): "Water Basil", "Fertilize Tomato" with quick check buttons. Tap "See all" → Care tab.
- Filter chips: All · Indoor · Outdoor · Vegetables · Herbs · Flowers · Needs attention. Optional custom "Spaces" (e.g. Balcony, Kitchen, Greenhouse) user can create.
- Toggle grid (2 columns) / list view.
- `PlantCard`: photo (rounded 16), nickname (e.g. "Tommy the Tomato") + species small, growth stage chip (Seed / Sprout / Growing / Flowering / Fruiting / Dormant), next task with icon and due label ("Water today" in info color, "Overdue 2d" in danger color), small health dot.
- Empty state: illustration of an empty pot, "Your garden is empty", buttons "Scan a plant" and "Add manually".

**5.4.2 Add Plant (modal, multi-step)**
1. Photo: take/upload photo (or prefilled from a scan). Option "Identify from photo" calls scan API and pre-fills species.
2. Species: search field with autocomplete (from previous scans / AI lookup) or "I don't know".
3. Details: nickname, location/space, indoor/outdoor, pot or ground, **planting date** (date picker, default today), planted as (seed / seedling / cutting / bought plant).
4. Care schedule: AI-suggested defaults (water every N days, fertilize every N weeks, mist, rotate, repot) shown as editable rows with `Stepper`; preferred reminder time.
5. Review & save → success animation (sprout growing) → plant card.
- Expected dates (sprouting, flowering, harvest) are calculated from species data + planting date + planted-as, via AI on the backend, and stored.

**5.4.3 Plant Card (detail)** — the heart of the garden
- Hero image carousel (latest photo first) with back, edit, more (⋯: share, move to space, archive, delete).
- Name + species + space chip + "Planted 34 days ago".
- **Growth progress block**: `ProgressRing` showing current stage + "Sprouts expected in 3–5 days" / "Flowering in ~2 weeks" / "Harvest window: Aug 10–25". Stage timeline with dots.
- `SegmentedControl` with 4 sections:
  1. **Overview**: key care tiles (light, water, temp, soil), safety badges for pets/kids (from species), notes field.
  2. **Care**: list of scheduled tasks (water, fertilize, mist, prune, rotate, repot) — each with frequency, last done, next due, toggle reminders on/off, "Done" button (logs the event, reschedules). "+ Add custom task". History log below (calendar heat-map of watering for last 30 days).
  3. **Journal**: chronological timeline of entries — photo + note + date + optional tag (new leaf, first flower, harvest, problem, treatment). "+ Add entry" button. Side-by-side "Then vs Now" comparison view of first and latest photo.
  4. **Health**: "Run health check" (opens scanner in Diagnose mode for this plant), list of past diagnoses with status (active / resolved).
- Floating action: "Share progress" → creates a community post prefilled with the plant, latest photos, and days since planting.

**5.4.4 Edit care schedule** — form with all tasks, frequency steppers, reminder time, season adjustments (e.g. water less in winter toggle).

### 5.5 Care tab (calendar of tasks)
- Header with week strip (Mon–Sun), selected day highlighted with primary50 circle, dots under days that have tasks.
- Toggle week / month view.
- Sections: **Overdue** (danger accent), **Today**, **Upcoming**.
- `CareTaskRow`: plant thumbnail, task icon (water drop / fertilizer / scissors / rotate), "Water Monstera", plant space, check button. Swipe right = done, swipe left = snooze (1h / tomorrow / pick date).
- "Water all in Balcony" bulk action.
- Empty state: "All caught up! 🌿".
- Notifications: each task triggers a push at the user's preferred time ("Time to water Basil 💧"); tapping opens the plant card's Care section.

### 5.6 Community tab (Instagram-like feed)
- Header: "Community" + icons: search, notifications (bell with unread badge), "+" create post.
- Top segmented: **For you** · **Following** · (optional) **Nearby** (same climate zone).
- Optional horizontal "stories-like" row of trending topics/challenges (e.g. "#FirstHarvest", "#30DaySprout").
- **PostCard**:
  - Header: avatar, @username, experience badge (Beginner/Hobbyist/Expert), time ago, ⋯ menu (report, hide, copy link; delete/edit if own).
  - Media: 1–10 photos, swipeable carousel with dots, 4:5 aspect, double-tap to like.
  - Linked plant chip (e.g. "🌱 Cherry tomato · Day 45") → opens public plant card (if public).
  - Action row: like (heart), comment, share, save (bookmark right side).
  - "128 likes", caption (2 lines, "more"), hashtags in primaryStrong, "View all 14 comments", top comment preview.
- Infinite scroll with cursor pagination, image prefetch, skeleton cards.
- **Post detail / Comments**: full post + comments list, nested replies (1 level), like on comments, sticky input at bottom with avatar, @mention autocomplete.
- **Create post (modal)**:
  1. Pick photos (gallery or camera, multi-select, reorder, crop to 4:5 or 1:1).
  2. Caption, hashtags, link to one of my plants (optional, shows growth day automatically), category tag (Success / Question / Harvest / Problem / Tip).
  3. Publish → optimistic insert at top of feed.
- **Notifications screen**: likes, comments, replies, new followers, mentions, care reminders — grouped by Today / This week.
- Moderation: report post/comment/user (reasons list), block user, basic profanity filter on server, hidden posts after N reports pending review.

### 5.7 Profile tab
- **My profile**: cover-less clean header — avatar (88pt), display name, @username, bio, city/climate zone, experience badge. Stats row: Posts · Followers · Following · Plants. Buttons: "Edit profile", "Share profile". Settings gear top-right.
- Segmented tabs:
  1. **Posts** — 3-column grid of my posts (multi-photo icon on thumbnails).
  2. **Garden** — my public plants (grid) with privacy toggle per plant.
  3. **Saved** — saved posts (private).
  4. **Scans** — scan history shortcut (private).
- Big "+ New post" button (or "+" in header) → Create post modal, so posts about my plants go to the feed.
- Achievements strip (optional, fun): "First scan", "7-day watering streak", "First harvest", "10 plants".
- **Other user profile**: same layout, "Follow / Following" + "Message" (message disabled in v1, hide or show "coming soon"), ⋯ (report, block).
- **Edit profile**: avatar, name, username, bio, city, experience level.
- **Settings**: account (email, sign-in methods, delete account — required by app stores), notifications (care reminders on/off + time, community activity), privacy (private account, garden visibility), units (°C/°F, metric/imperial), language, help/feedback, terms, privacy policy, about/version, log out.

### 5.8 Search
- Single search screen with tabs: Plants (from my garden + species), Posts (hashtags), Users. Recent searches, trending hashtags.

---

## 6. AI integration (Runware) — adapter design

Create `apps/api/lib/ai/` with a provider-agnostic interface:

```ts
interface PlantAIProvider {
  identify(input: { imageUrls: string[]; mode: 'identify' | 'diagnose' | 'toxicity'; locale: string; userContext?: { climateZone?: string } }): Promise<PlantReport>;
  careSchedule(input: { species: string; plantedAs: string; plantedAt: string; indoor: boolean; climateZone?: string }): Promise<CarePlan>;
}
```

- Implement `RunwareProvider` using the Runware API (verify in the docs which vision/LLM or image-captioning tasks and models are currently available and best for structured plant analysis). Use the official Runware JS/TS SDK if it exists and is maintained; otherwise call the REST API directly.
- Additionally use Runware image capabilities where useful and supported, e.g.: background removal for clean plant thumbnails in My Garden, upscaling low-res photos, and generating soft illustrated placeholder art for species without user photos (optional, cache results).
- The model must return **strict JSON** matching the `PlantReport` Zod schema (below). Parse, validate with Zod, retry once with a "fix your JSON" message on validation failure, then return a typed error.
- Cache identical requests (hash of image + mode) for 24h in Redis to save cost.
- Log token/cost usage per request in a `ai_usage` table.

**`PlantReport` schema (in `packages/shared`)** — at minimum:
```ts
{
  isPlant: boolean,
  confidence: number,            // 0..1
  commonName: string,
  scientificName: string,
  family: string,
  alternatives: { commonName, scientificName, confidence }[],
  type: 'houseplant'|'tree'|'shrub'|'herb'|'vegetable'|'fruit'|'flower'|'succulent'|'grass'|'weed'|'other',
  lifecycle: 'annual'|'biennial'|'perennial'|'unknown',
  nativeRegion: string,
  matureSize: string,
  safety: {
    overall: 'safe'|'low'|'moderate'|'high'|'severe',
    humans:   { level, summary },
    children: { level, summary },
    pets:     { cats: { level, summary }, dogs: { level, summary } },
    toxicParts: string[],
    symptoms: string[],
    firstAid: string,
    skinContact: string
  },
  usefulness: {
    tags: ('edible'|'medicinal'|'decorative'|'air_purifying'|'pollinator_friendly'|'aromatic'|'companion')[],
    edible?: { parts: string[], notes: string },
    medicinal?: { uses: string[], notes: string },
    other: string[]
  },
  care: { light, water: { frequencyDays: [min,max], notes }, temperature, humidity, soil, fertilizer },
  growth?: { germinationDays?: [min,max], floweringAfterDays?: [min,max], harvestAfterDays?: [min,max], stages: string[] },
  diagnosis?: { issue, severity: 'mild'|'moderate'|'severe', causes: string[], treatment: string[], prevention: string[] },
  funFact: string
}
```
- If `isPlant === false`: show a friendly screen "We couldn't find a plant in this photo" with tips.
- System prompt for the model must instruct: be conservative about edibility/medicinal claims, always lean to the safer side on toxicity when uncertain, respond in the user's locale, return JSON only.

---

## 7. Data model (Drizzle / Postgres)

- `users` (id, username unique, display_name, avatar_url, bio, city, climate_zone, experience_level, is_private, push_token, reminder_time, units, locale, created_at)
- `scans` (id, user_id, mode, image_urls[], report jsonb, confidence, common_name, scientific_name, safety_overall, created_at)
- `scan_feedback` (id, scan_id, user_id, correct_name, comment)
- `spaces` (id, user_id, name, icon)
- `plants` (id, user_id, space_id, scan_id nullable, nickname, species_common, species_scientific, cover_url, indoor, planted_as, planted_at, stage, expected_dates jsonb, is_public, archived_at, created_at)
- `care_tasks` (id, plant_id, type: water|fertilize|mist|prune|rotate|repot|custom, title, frequency_days, next_due_at, reminder_enabled, last_done_at)
- `care_logs` (id, task_id, plant_id, done_at, note)
- `journal_entries` (id, plant_id, photo_url, note, tag, created_at)
- `posts` (id, user_id, caption, category, plant_id nullable, plant_day nullable, created_at, deleted_at)
- `post_media` (id, post_id, url, width, height, position)
- `likes` (user_id, post_id, created_at) PK(user_id, post_id)
- `comments` (id, post_id, user_id, parent_id nullable, text, created_at, deleted_at)
- `comment_likes`, `saves`, `follows` (follower_id, following_id)
- `hashtags`, `post_hashtags`
- `notifications` (id, user_id, type, actor_id, post_id, comment_id, plant_id, read_at, created_at)
- `reports` (id, reporter_id, target_type, target_id, reason, status)
- `blocks` (blocker_id, blocked_id)
- `ai_usage` (id, user_id, provider, task, cost, created_at)

Indexes on all foreign keys, `posts(created_at desc)`, `care_tasks(next_due_at)`. Denormalized counters (`likes_count`, `comments_count`) updated in transactions.

---

## 8. API endpoints (REST, JSON, all under `/api`, all authenticated except auth routes)

- `POST /uploads/token` → signed Vercel Blob client-upload token (validate content type and size ≤ 10 MB)
- **Scans**: `POST /scans` · `GET /scans` (cursor) · `GET /scans/:id` · `DELETE /scans/:id` · `POST /scans/:id/feedback`
- **Plants**: `GET /plants` · `POST /plants` · `GET /plants/:id` · `PATCH /plants/:id` · `DELETE /plants/:id` · `POST /plants/:id/care-plan` (AI suggestion)
- **Care**: `GET /care/tasks?from&to` · `POST /care/tasks` · `PATCH /care/tasks/:id` · `POST /care/tasks/:id/done` · `POST /care/tasks/:id/snooze`
- **Journal**: `GET /plants/:id/journal` · `POST /plants/:id/journal` · `DELETE /journal/:id`
- **Feed & posts**: `GET /feed?tab=for_you|following&cursor` · `POST /posts` · `GET /posts/:id` · `PATCH /posts/:id` · `DELETE /posts/:id` · `POST/DELETE /posts/:id/like` · `POST/DELETE /posts/:id/save`
- **Comments**: `GET /posts/:id/comments` · `POST /posts/:id/comments` · `DELETE /comments/:id` · `POST/DELETE /comments/:id/like`
- **Users**: `GET /me` · `PATCH /me` · `DELETE /me` · `GET /users/:id` · `GET /users/:id/posts` · `GET /users/:id/plants` · `POST/DELETE /users/:id/follow` · `GET /usernames/check?u=`
- **Notifications**: `GET /notifications` · `POST /notifications/read`
- **Moderation**: `POST /reports` · `POST/DELETE /users/:id/block`
- **Search**: `GET /search?q&type=`
- **Cron**: `GET /cron/reminders` (protected by `CRON_SECRET`, configured in `vercel.json`)

Consistent error format: `{ error: { code, message } }`. Cursor pagination: `{ items, nextCursor }`.

"For you" feed v1 algorithm: recent posts (last 14 days) ranked by `likes + 2×comments`, time-decayed, excluding blocked users, mixing in followed users.

---

## 9. Non-functional requirements

- Performance: feed scroll at 60 fps (FlashList), images served at appropriate sizes, lists virtualized.
- Accessibility: labels on all icon buttons, minimum touch target 44×44, screen-reader friendly scan result (headings, safety level read first).
- Security: auth check on every route, ownership checks on every mutation, input validation with Zod, upload type/size checks, rate limits on scans/posts/comments.
- Privacy: EXIF location stripped from uploaded photos; private accounts' posts hidden from non-followers; account deletion removes user data and media.
- Error tracking: Sentry (mobile + API) — add setup with env-based DSN.
- Analytics events (abstracted, provider optional): `scan_started`, `scan_completed`, `plant_added`, `task_done`, `post_created`, `like`, `comment`.

---

## 10. Seed data & dev experience

- Seed script: 5 demo users, 20 plants with schedules and journal entries, 30 posts with real-looking captions and placeholder images, likes/comments/follows.
- Mock AI provider (`AI_PROVIDER=mock`) returning realistic fixed reports so UI can be developed without spending Runware credits.
- Scripts: `pnpm dev` (mobile + api), `pnpm db:migrate`, `pnpm db:seed`, `pnpm lint`, `pnpm typecheck`, `pnpm test`.
- Tests: unit tests for schedule calculation (next due dates, snooze, season adjustments) and Zod schemas; API integration tests for auth/ownership on key routes.

---

## 11. App store readiness (later phase)

- App icon (leaf in rounded viewfinder, light green on white), adaptive Android icon, splash.
- Camera/photo/notification permission strings in `app.json`.
- In-app account deletion, privacy policy & terms links, content reporting and blocking (required for UGC apps).
- EAS Build profiles: development, preview, production.

---

## 12. Build phases

1. **Foundation**: monorepo, Expo app, Next.js API on Vercel, tokens + component library + `/dev/components` screen, custom tab bar with center scan button, placeholder screens for all routes.
2. **Auth & profile setup**, DB schema + migrations, `/me` endpoints.
3. **Scanner**: camera UI, uploads, mock AI → processing → full report screen → scan history. Then real Runware adapter.
4. **My Garden**: add plant flow, garden grid, plant card with all 4 sections, care tasks logic.
5. **Care tab & notifications**: calendar, done/snooze, Vercel Cron + Expo push.
6. **Community**: feed, post card, create post, likes, comments, saves, follows, notifications screen.
7. **Profile**: my/other profiles, grids, edit, settings, account deletion.
8. **Polish**: animations, empty/error states, accessibility pass, moderation, rate limiting, Sentry, seed data, tests.
9. **Release prep**: icons, EAS builds, store checklist.

Start with **Phase 1** now. Before coding, show me: the final folder structure, the list of packages you'll install, and the decisions you made (auth provider, etc.). Then build it.
