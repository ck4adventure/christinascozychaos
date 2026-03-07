# 🌙 Christina's Cozy Chaos — Self-Care Tracker
## Feature Plan & Version Roadmap

---

## What We're Building

A **mobile-first self-care and chore tracking app** that lets you log completed tasks over time, see your history, and feel good (or honest) about your progress. Built for one person first, designed to grow.

---

## Version 0 — The Foundation
> *Get something real and usable as fast as possible.*

### Data Model
- **Task** — the thing being tracked
  - `id`, `name`, `category`, `frequency` (daily / weekly / monthly / custom), `createdAt`
- **TaskLog** — a record of a completed task
  - `id`, `taskId`, `completedAt` (timestamp)

### Task Library (Pre-loaded Suggestions)
A starter set of common tasks to help new users get going fast, organized by category. User can add any of these to their personal list with one tap.

**Categories in v0:**
- 🏠 Home & Tidying
- 🧴 Personal Hygiene & Body Care
- 🏃 Movement & Exercise
- 🎨 Skills Practice

**Example pre-loaded tasks per category** (not exhaustive):
- Home: Wash dishes, Take out trash, Tidy bedroom, Do laundry, Wipe counters
- Hygiene: Shower, Wash hair, Skincare routine, Brush & floss, Take medications
- Movement: Walk, Stretch / yoga, Workout
- Skills: Practice instrument, Art / drawing session, Read

### Core Screens (v0)

**1. Today View (Home)**
The main screen. Shows all your active tasks for today.
- Each task shows its name, category icon, and frequency label
- Three ways to complete a task:
  - Tap checkbox (one and done for today)
  - Tap a big satisfying button on the task detail
  - The log auto-timestamps on completion
- Visual indicator if a task has already been completed today

**2. Add Task Screen**
- Free-form input: task name (required), category (dropdown), frequency (daily / weekly / monthly / custom interval)
- OR browse & add from the pre-loaded task library
- Save adds it to your personal task list

**3. Task Log / History View**
- Simple chronological list of completions: task name, date, time
- Filterable by task or category
- Calm and clean — just show what was done

### Navigation (v0)
Bottom nav bar (mobile-first):
- Today | History | Add Task

---

## Version 1 — Tracking That Means Something
> *Make the data feel rewarding.*

### Streaks
- Track consecutive days/weeks a task has been completed on schedule
- Show current streak on the task card
- Visual streak indicator (flame, star, etc. — something cozy)

### Stats View
- Per-task: completion rate over last 7 / 30 / 90 days
- Overall: most consistent task, most logged day of the week
- Simple charts — bar or calendar heatmap

### Smarter Today View
- Tasks sorted by: overdue first, then due today, then upcoming
- "Overdue" badge if a recurring task was missed
- Completion percentage for the day

---

## Version 2 — Make It Yours
> *Personalization and emotional customization.*

### Tracking Tone (User-Chosen Mode)
Let the user pick how the app feels emotionally. One setting, three flavors:

- 🌸 **Positive Only** — Celebrate every win. Missed tasks just quietly reset. No guilt, no red badges, no streak breaks shown.
- 📓 **Honest** — Show completions *and* misses. Streaks break visibly. Full picture.
- 🌿 **Gentle But Real** — Misses are acknowledged softly ("You haven't logged this in a while") but never punished. Streaks pause rather than break.

This setting lives in a simple Profile / Settings screen and can be changed any time.

### Categories — Custom
- Create your own categories with a name and emoji
- Assign custom categories to any task

### Task Editing
- Edit task name, category, frequency after creation
- Archive a task (hides it without deleting its history)

---

## Version 3 — Multi-User
> *Open it up beyond just you.*

### Auth
- Simple sign-up / login (email + password or OAuth)
- Each user has their own task list and log — fully private by default

### Household / Shared Mode (optional)
- Invite another user to a shared household
- Shared tasks visible to all members (e.g. "Take out trash")
- Each person logs their own completions
- See household completion summary

### Profile
- Display name, avatar
- Tracking tone setting per user
- Stats scoped to the individual

---

## What's Intentionally Left Out (for now)
- Notifications / reminders (later version — mobile push is its own project)
- Gamification beyond streaks (points, badges — maybe never, keep it cozy)
- Social / public sharing (this is a personal tool first)
- AI suggestions (tempting but out of scope for a long while)

---

## Tech Notes for Claude Code
- **Framework:** Next.js (already exists)
- **Mobile-first:** Design for ~390px width, scale up gracefully
- **Database:** TBD — Postgres + Prisma is a natural fit for this data model
- **Auth:** Not needed in v0 (single user, no login)
- **Palette:** Plum & Ember (`#2A0E30`, `#7B3F6E`, `#E8A020`, `#C46A00`, `#E8D5C4`)

---

*Built with love & a little disorder by Christina* 🌙
