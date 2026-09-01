# Christina's Cozy Chaos

A personal site + small app suite. Landing page at `/`, with four sub-apps: Cascades (game), the Infinitely Repeatable Bowl (calorie calculator), Blossom (chore tracker), and a Writing tool for authors.

## App Itself

### Design
Material 3–inspired design system: neutral blue/gray tonal palette, Inter typography, elevation-based cards, and a user-toggleable light/dark theme that also respects the visitor's system preference on first load. All shared tokens and primitives live in `app/globals.css`.

### Architecture
Next.js App Router, mostly client components. Blossom and the Writing tool are backed by Postgres via Prisma; both also ship a fully browser-only **demo mode** (`/blossom-demo`, `/writing-demo`) so visitors can explore either app without an account and without anything touching the server — data lives only in `localStorage`.

### Testing
Vitest unit tests, colocated in `__tests__/`. Run with `npm test`.

### Version History
#### v1.1 — 2026-09-01
- Added browser-only demo logins for Blossom and the Writing tool (`/blossom-demo`, `/writing-demo`) — no account needed, nothing stored on the server, seeded with sample data
- Login page now offers both demos side by side

#### v1.0 — 2026-09-01
- Full site redesign to a Material 3–style system: replaced the plum/amber palette with a neutral (now deep purple accent) tonal palette, explicit light/dark tokens, and a `prefers-color-scheme` fallback ahead of the manual toggle
- Swapped Cormorant Garamond + Josefin Sans for Inter; removed italic serif treatment and ultra-wide letter-spacing site-wide
- Rebuilt shared card/button/input/nav primitives on Material elevation + state layers, added missing `:focus-visible` rings
- Removed the decorative mesh/orb/spark/noise-texture system from every page, including Cascades' own independent copy

---

## Writing Tool
A lightweight novel/short-story writing tool at `/writing`: chapters/sections with a Tiptap rich-text editor, autosave, drag-to-reorder, and unanchored notes per section.

### Version History
#### v1.3 — 2026-09-01
- Material 3 redesign (see App Itself v1.0)
- Added `/writing-demo` — browser-only version of the whole tool, backed by a swappable `WritingClient` (real Prisma-backed API vs. localStorage), seeded with a sample novel

#### v1.2 — 2026-07-04
- Site-wide CSS/design-system unification pass: shared card, button, nav, and label primitives consolidated out of duplicated per-page styles
- Shared sidebar shell between the project dashboard and section editor
- Fixed autosave-on-click-away, editor content persistence, and topbar overlap bugs

#### v1.1 — 2026-07-03
- Responsive layouts for mobile and desktop
- Redirect back to the originally requested page after login

#### v1.0 — 2026-07-03
- Initial launch: `NOVEL` / `SHORT_STORY_COLLECTION` project types, Section model (displays as Chapter/Story), Tiptap rich-text editor with autosave, notes per section

---

## Tasks and Chores App (Blossom)
Self-care/chore tracker at `/blossom`: daily/weekly/monthly tasks, a Today view with streak-style progress, a full Schedule view, and History. Task completion blooms an animated flower.

### Version History
#### v1.2 — 2026-09-01
- Material 3 redesign (see App Itself v1.0)
- Added `/blossom-demo` — browser-only version backed by localStorage, seeded with daily (shower, brush teeth), weekly (one task per day of the week), and monthly sample tasks

#### v1.1 — 2026-04-09
- Quick Log sheet for logging one-off or off-schedule tasks
- Retroactive task completion for the past 7 days in History

#### v1.0 — 2026-03-23
- Persistent storage via Postgres + Prisma, replacing localStorage
- Desktop sidebar layout
- New "Seeking" (spiritual) category with reserved flower types
- Login/logout, session-gated access

#### v0.1 — 2026-03-06
- Initial build: task cards, Today/Schedule tabs, weekly tasks by weekday, monthly by ordinal date, basic test coverage

---

## Calorie Calculator (Infinitely Repeatable Bowl)
Meal-prep bowl calculator at `/repeatable-bowl`: build a bowl, shopping list, prep-day steps, calorie breakdown, and storage guidance.

### Version History
#### v1.1 — 2026-09-01
Material 3 redesign (see App Itself v1.0)

#### v1.0 — 2026-04-06
Condensed into a single dashboard layout with a shared sidebar across all five views (Build, Shopping, Prep, Calories, Storage).

#### v0.1 — 2026-03-24
Initial build, including the bowl-prep step-by-step flow.

---

## Cascades
Implementation of a basic match 3 game where the tiles fall down, creating potentially more matches in a cascade.

### Up Next
- debug matching logic on first switch for both mobile and desktop

### Eventual Features
- custom height and width
- custom number of color types

### Version History
#### c0.8 — 2026-09-01
Material 3 redesign: game tiles recolored to a neutral M3 palette, removed the page's own independent copy of the mesh/orb/spark decoration system, Inter typography.

#### c0.7
Ported over to this personal project site. Changed color and design to better match the rest of the site.

#### v0.6
- refactored into Board and Game classes — Board holds pure grid logic, Game owns the DOM
- Board extracted to its own ES module for testability
- added 84-unit test suite covering all board logic (run with `npm test`)
- fixed several bugs: drag-drop tile flicker, double-counted match scores, missing null check in available-moves scan
- removed dead code and cleaned up commented-out debug lines

#### v0.5
- alert modal now has button to reset game
- switched yellow color for gray
- add favicon
- vite devserver

#### v0.4 12/17/24
- alerts when no moves left
- lighter game board colors
- cascade speed control slider

#### v0.3 11/30/24
- adds basic 10pts per square game scoring
- resetting board resets the score
- update colors for higher visibility
- fix bug of allowing switch if not 3 in a row

#### v0.2 11/28/24
- Added link to this github repo.
- Added modal with instructions on how to play.
- Added mobile touch functionality.

#### v0.1 11/27/24
- Published 11/27 to AWS Amplify, no custom domain yet.
- Working game with cascading tiles on matching 3 in a row.
- Reset button for when there are no more moves.
