# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Development server (Turbopack)
npm run build         # prisma generate + production build
npm run lint          # ESLint
npm run test          # Run tests once (Vitest)
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run db:migrate    # prisma migrate dev (uses .env.local)
npm run db:studio     # Prisma Studio (uses .env.local)

# Run a single test file
npx vitest run __tests__/board.test.ts
```

`.env` files point at a hosted Postgres (Neon). Don't run `prisma migrate dev` against it casually; `prisma migrate deploy` applies committed migrations.

## Architecture

**Next.js App Router** (Next 16, React 19) with client-heavy pages (`"use client"` on interactive pages). Postgres via **Prisma 5** (`prisma/schema.prisma`, `lib/prisma.ts`) backs Blossom, the Writing tool and Hourly, through route handlers under `app/api/**`.

**Auth:** single-user login using iron-session (`lib/session.ts`, cookie `ccc_session`, `SESSION_SECRET`). `middleware.ts` protects only the paths in its explicit `matcher`: pages return a redirect to `/login?from=...`, API routes return 401. **A new protected page or API route must be added to that matcher**, and page prefixes also go in `AUTHED_PREFIXES` in `components/TopBar.tsx` (shows Sign out). Everything not listed is public.

**Routing:**
- `/` — Landing page (chips linking to each app)
- `/blossom` — Self-care/chore tracker (login required)
- `/blossom-demo` — Browser-only Blossom demo (localStorage, public)
- `/writing` — Writing tool for authors (login required)
- `/writing-demo` — Browser-only writing demo (localStorage, public)
- `/hourly` — Activity log with durations, tags and edit history (login required)
- `/repeatable-bowl` — Meal-prep bowl calculator (`build`, `shopping`, `prep`, `calories`, `storage`)
- `/cascades` — Match-3 puzzle game
- `/chord-machine` — Chord/progression generator (Tone.js, public, loaded with `next/dynamic` `ssr: false`)
- `/login` — Login page

**Key directories:**
- `app/` — Pages, `api/` route handlers, `hooks/` (`useTasks`, `useDemoTasks`, `useHourly`), `globals.css`
- `components/` — Client components; subfolders `hourly/`, `writing/`, `cascades/`, `chordmachine/`; Blossom components are at the top level
- `lib/` — Pure logic and helpers: `data.ts` (task library), `taskFilter.ts` (scheduling), `storage.ts` (localStorage helpers used by demos, plus `generateId`, date helpers), `cascades/board.ts` (match-3 engine), `hourly.ts` (Hourly logic), `hourlyApi.ts` (Hourly API mappers), `writing*.ts` (writing client, swappable between API and demo)
- `types/index.ts` — Shared interfaces
- `__tests__/` — Vitest unit tests. Environment is `node` (no DOM), so keep testable logic in pure functions in `lib/`
- `design/` — Product docs, plans and design assets (some are historical)
- `prisma/` — Schema and migrations

**Data patterns:**
- API routes follow `app/api/tasks/route.ts`: Prisma call in try/catch, `NextResponse.json`, a `dbXToApi` mapper that converts `Date` to ISO strings.
- Client hooks fetch from the API, update state optimistically, and keep a `loading` flag (`useTasks.ts`, `useHourly.ts`).
- Demo variants swap the data source for localStorage with seed data and never call the server.
- The repo's ESLint (`react-hooks/set-state-in-effect`) rejects synchronous `setState` in effects; derive state or use callbacks instead.

## Design System

The site uses a **Material 3–style** system: neutral/deep-purple tonal palette, Inter typography, elevation-based cards, and a light/dark theme. All shared styles live in `app/globals.css`; Tailwind CSS 4 is available but custom classes are preferred. CSS Modules are used only for `CascadesGame.module.css` and `ChordMachine.module.css`. The earlier plum/amber palette, Cormorant/Josefin fonts and the mesh/orb/spark/noise decoration were removed in the v1.0 redesign; do not reintroduce them.

### Tokens

Use the semantic CSS variables, never raw hex values, so both themes work:
- Color roles: `--color-bg`, `--color-surface-container(-high)`, `--color-on-surface`, `--color-primary`, `--color-primary-container`, `--color-outline(-variant)`, `--color-danger`
- Text: `--color-text-body`, `--color-text-muted`, `--color-text-faint`
- Components: `--color-bg-card`, `--color-bg-input`, `--color-border-card`, `--color-border-chip`, `--color-bg-modal-sheet`, `--color-overlay`, `--color-focus-ring`
- Shape and depth: `--radius-xs|sm|md|lg|xl|full`, `--elevation-1|2|3`, `--space-1…7`

Dark is the default. Light overrides live under `[data-theme="light"]`, and `ThemeToggle` stores the choice in localStorage (falls back to `prefers-color-scheme`). Legacy aliases (`--amber`, `--plum-deep`, `--cream`, `--font-cormorant`…) still exist so old CSS keeps working; don't use them in new code.

### Typography

Single font: **Inter** (`--font-inter`, weights 400–700), loaded in `app/layout.tsx`. Eyebrow labels are small (~0.7rem), uppercase with modest letter-spacing, in `--color-primary`. Page titles are regular-to-medium weight, not italic serif.

### Shared primitives (in `globals.css`)

- **Buttons:** `.btn` with `.btn--primary`, `.btn--outline`, `.btn--text`, `.btn--link`, `.btn--danger`; `.btn-icon` has no base style
- **Cards:** `.card`, `.card--outlined`, `.card-title`
- **Inputs:** `.input`, `.input--lg`, `.input--textarea` (filled style, 2px bottom border). Use 16px font size on mobile inputs to avoid iOS zoom
- **Chips:** `.chip`, `.chip--active` (pill shape; base has `cursor: default`, so add `cursor: pointer` for tappable chips)
- **Navigation:** `.nav-tabs` is a fixed bottom bar with safe-area padding that becomes a 220px left sidebar at 1024px+; `.top-bar` holds Home, Sign out and the theme toggle on every page
- Page-specific classes use a prefix (`.blossom-*`, `.hourly-*`, `.bowl-*`)

### Layout conventions

- Mobile-first, designed for ~390px. Use `clamp()` for fluid type. Content is centered with a max width (480px for Blossom/Hourly, 720px on content pages).
- Use `100dvh`, `env(safe-area-inset-bottom)` for fixed bottom UI, and ≥44px tap targets.
- Entrance animation: a short CSS `animation` (opacity + `translateY(20px)`) on the page's inner wrapper. Honor `prefers-reduced-motion`.
- Bottom sheets: fixed backdrop with `--color-overlay`, panel with `--color-bg-modal-sheet` and `--radius-xl` top corners (see `.hourly-sheet`).

## Self-Care Tracker (Blossom) Data Model

```typescript
Task { id, name, category, frequency, dayOfWeek?, dayOfMonth?, emoji?, flower, createdAt }
TaskLog { id, taskId, completedAt }
TaskWithStatus extends Task { completedToday, logId? }
```

Categories: `home | hygiene | movement | skills | seeking`. Frequency: `daily | weekly | monthly | once`. `taskFilter.ts` determines which tasks are due on a day. A flower type is assigned to each task at creation (`getFlowerForCategory` in `lib/data.ts`) and animates on completion. Stored in Postgres (`Task`, `TaskLog`) via `/api/tasks` and `/api/logs`; the demo uses localStorage. Roadmap: `design/cozy-chaos-selfcare-plan_v2.md`.

## Hourly Data Model and Rules

```typescript
HourlyEntry { id, message, tags[], loggedAt, createdAt, editCount? }
HourlyEdit { id, entryId, prevMessage, prevTags[], prevLoggedAt, editedAt }  // previous state, one row per edit
HourlyQuickAdd { id, label, tags[], sortOrder }
```

- Entries are logged when an activity **finishes**. An entry's duration is its `loggedAt` minus the previous entry's, **computed on read, never stored** (`computeDurations` in `lib/hourly.ts`). The first entry of each day has none.
- The "day" starts at 4am local time (`DAY_START_HOUR`); `getLogicalDay` and `getDayRange` implement this. The client sends day bounds to `GET /api/hourly/entries?from=&to=`.
- `PATCH /api/hourly/entries/[id]` records an `HourlyEdit` with the previous values in a transaction, only when something changed. Deleting an entry cascades its edits.
- Tag filtering is client-side and never affects durations. Tags are normalized by `normalizeTags` (lowercase, no `#`, de-duplicated).
- Default quick-add chips (`DEFAULT_QUICK_ADDS`) are seeded on the first `GET /api/hourly/quick-adds` when the table is empty.
