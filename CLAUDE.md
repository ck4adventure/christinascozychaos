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

All styles live in `app/globals.css`. Tailwind CSS 4 is available but custom CSS classes are preferred for anything that matches the established design language. CSS modules are used only for scoped game component styles (`CascadesGame.module.css`).

### Palette

| Variable | Hex | Use |
|---|---|---|
| `--plum-deep` | `#2A0E30` | Page backgrounds, card backgrounds |
| `--plum-mid` | `#7B3F6E` | Orbs, mesh gradients |
| `--plum-light` | `#9B6090` | Subtext, secondary labels |
| `--amber` | `#E8A020` | Primary accent — eyebrows, values, highlights, sparks |
| `--amber-deep` | `#C46A00` | Amber gradient ends, hover states |
| `--cream` | `#E8D5C4` | Body text, row labels |
| `--cream-light` | `#F5EAE0` | Titles, headings |
| `--dark` | `#1A081E` | Blossom page body background |

Amber is the primary accent — use it for numbers, labels, interactive highlights, and decorative rules. Cream is for readable body text. Plum tones are structural/atmospheric.

### Typography

Two fonts, loaded via `next/font/google` in `app/layout.tsx`, available as CSS variables:

- **`--font-cormorant`** (Cormorant Garamond, serif) — titles, taglines, large display numbers. Weights 300/400/600. Always `font-weight: 300` unless emphasis needed. Use `font-style: italic` for taglines and card titles.
- **`--font-josefin`** (Josefin Sans, sans-serif) — eyebrows, labels, chips, UI text. Always uppercase + letter-spacing for labels (`letter-spacing: 0.2em–0.35em`). Weights 200/300/400.

Typical size pattern:
- Eyebrow label: `0.65–0.7rem`, `letter-spacing: 0.35em`, uppercase, `font-weight: 300`, amber
- Page title: `clamp(2.5rem, 7vw, 5rem)`, Cormorant, `font-weight: 300`, cream-light. Italicized `<em>` in amber.
- Large display number: `clamp(3.5rem, 9vw, 6rem)`, Cormorant, amber
- Card section title: `~1.35rem`, Cormorant italic, cream-light
- Row label: `0.68rem`, Josefin, uppercase, `letter-spacing: 0.15em`, cream
- Metadata/value: `0.65rem`, Josefin, amber

### Page Layout Structure

Every page uses the same layered background stack (z-index order, bottom to top):

1. **Base** — `background: var(--plum-deep)` on the page root
2. **Mesh** (z-index 0) — `.mesh` class, radial gradient atmospheric glow
3. **Orbs** (z-index 0) — `.orb` divs, blurred circles in plum/amber with `drift` animation
4. **Noise overlay** (z-index 1) — `::before` pseudo-element on `.page` / `.bowl-page`, SVG fractalNoise at 40% opacity
5. **Sparks** (z-index 1) — `.spark` divs, generated via `generateSparks(n)` from `app/utils/sparks.ts`
6. **Content** (z-index 10) — actual page content, fades in via `.content.visible` or equivalent

When adding a new page, replicate this layering. Use `generateSparks(20)` as a baseline spark count.

Content entrance animation pattern: start `opacity: 0; transform: translateY(20–30px)`, add a `.visible` class after mount (`useEffect` → `setVisible(true)`), transition to `opacity: 1; transform: translateY(0)` over ~0.9s.

### Cards

Glass-morphism card style used across pages:
```css
background: rgba(42, 14, 48, 0.55);
border: 1px solid rgba(232, 160, 32, 0.18);
border-radius: 16px;
padding: 1.5rem 1.75rem;
backdrop-filter: blur(10px);
```
Section dividers within cards: `border-bottom: 1px solid rgba(232, 160, 32, 0.1)`.

### Decorative Elements

- **Amber divider line**: `width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--amber), transparent)`
- **Bottom rule**: full-width 3px gradient bar in amber, fixed to bottom of viewport
- **Corner accents**: `.corner-tl` / `.corner-br` — 60×60px L-shaped amber borders, `opacity: 0.3`
- **Chips**: pill-shaped, amber border at 30% opacity, amber text, subtle amber fill on hover. Used for navigation links and feature labels.

### Interactive Controls

Sliders use a custom style: 2px amber track, 14px circular amber thumb with a glow `box-shadow`. See `.bowl-slider` in `globals.css` for the full pattern.

Buttons: no global button style established yet — follow the card border aesthetic (amber border, transparent or low-opacity fill).

### Mobile-First

Design base target is ~390px viewport width. Use `clamp()` for fluid type sizing. Max content width is `720px` centered.

## Self-Care Tracker Data Model

```typescript
Task { id, name, category, frequency, dayOfWeek?, dayOfMonth?, createdAt }
TaskLog { id, taskId, completedAt }
TaskWithStatus extends Task { completedToday, logId?, flower }
```

Frequency can be `daily | weekly | monthly | custom`. `taskFilter.ts` determines which tasks are due today. Flower types (rose, daisy, tulip, sunflower, lotus, cherry) are assigned to tasks and animate on completion.

Feature roadmap: `design/cozy-chaos-selfcare-plan_v2.md`. v0 (foundation) is the current target — no auth, no DB, single user.
