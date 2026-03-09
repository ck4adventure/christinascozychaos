# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Development server
npm run build         # Production build
npm run lint          # ESLint
npm run test          # Run tests once (Vitest)
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report

# Run a single test file
npx vitest run __tests__/board.test.ts
```

## Architecture

**Next.js App Router** with client-heavy pages (`"use client"` on interactive pages). No database yet — state persists via LocalStorage (`lib/storage.ts`), managed through `app/hooks/useTasks.ts`.

**Routing:**
- `/` — Landing page
- `/repeatable-meal` — Bowl calorie calculator
- `/blossom` — Self-care task tracker (main feature, v0 in progress)
- `/projects/cascades` — Match-3 puzzle game

**Key directories:**
- `app/` — Pages + hooks + global styles + sparks utility
- `components/` — Client components (TaskCard, TaskModal, NavBar, Flower, CascadesGame)
- `lib/` — Pure logic: `data.ts` (task library), `storage.ts` (localStorage CRUD), `taskFilter.ts` (scheduling), `cascades/board.ts` (match-3 engine)
- `types/index.ts` — Shared interfaces: `Task`, `TaskLog`, `TaskWithStatus`, `FlowerType`
- `__tests__/` — Vitest unit tests (colocated by module)
- `design/` — Product docs and roadmap

## Design System

All styles in `app/globals.css`. Landing page classes (`.page`, `.eyebrow`, `.title`, `.chip`) are reused across pages with page-specific prefixes (e.g. `.bowl-page`, `.bowl-title`).

CSS variables define the palette: `--plum-deep`, `--plum-mid`, `--plum-light`, `--amber`, `--amber-deep`, `--cream`, `--cream-light`. Fonts: `--font-cormorant` (serif titles) and `--font-josefin` (sans-serif labels).

Every page includes floating orbs + spark animations. Sparks are generated via `generateSparks(n)` from `app/utils/sparks.ts`.

Tailwind CSS 4 is used alongside the custom CSS system (via `@tailwindcss/postcss`). CSS modules used for game component scoping (`CascadesGame.module.css`).

## Self-Care Tracker Data Model

```typescript
Task { id, name, category, frequency, dayOfWeek?, dayOfMonth?, createdAt }
TaskLog { id, taskId, completedAt }
TaskWithStatus extends Task { completedToday, logId?, flower }
```

Frequency can be `daily | weekly | monthly | custom`. `taskFilter.ts` determines which tasks are due today. Flower types (rose, daisy, tulip, sunflower, lotus, cherry) are assigned to tasks and animate on completion.

Feature roadmap: `design/cozy-chaos-selfcare-plan_v2.md`. v0 (foundation) is the current target — no auth, no DB, single user.
