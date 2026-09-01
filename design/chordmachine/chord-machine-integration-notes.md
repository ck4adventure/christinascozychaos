# Handoff notes: Chord Machine → new site

Attach `chord-machine.jsx` to the Claude Code conversation along with these notes.

## What this component is
A self-contained React component (default export) that generates diatonic
chords/progressions in major, natural minor, and Phrygian, plays them via
Tone.js (Web Audio), and renders hand-drawn SVG staff notation + a piano
keyboard. It currently has no external dependencies besides `react` and
`tone`, and its CSS lives entirely in an inline `<style>` tag in the same
file — it was built as a single portable artifact, not as part of a project
yet.

## Things to actually watch for (not just "make it work")

**1. This must not render on the server.**
It calls the Web Audio API (`Tone.start()`, `AudioContext`) as soon as it
mounts-adjacent code runs, and that throws in any SSR context (Next.js,
Remix, Astro server islands, etc.) because `window`/`AudioContext` don't
exist server-side.
- Next.js App Router: add `'use client'` at the top of the file, and if the
  page itself is a server component, dynamically import the chord machine
  with `ssr: false`.
- Next.js Pages Router: `next/dynamic` with `{ ssr: false }`.
- Plain Vite/CRA SPA: not an issue, everything's client-side already.

**2. Style scoping.**
The class names (`.panel`, `.pads`, `.control`, `.seg`, `.prog-row`, etc.)
are generic and *will* collide with any existing site CSS using similar
names. Before dropping this into a real site, either:
- convert the inline `<style>` block to a CSS Module (`chord-machine.module.css`)
  and update the JSX to use the generated class map, or
- at minimum, prefix every class with something namespaced (`.cm-panel`,
  `.cm-pads`, …) — the root `.cm-root` wrapper already exists, so a global
  descendant selector scope (`.cm-root .panel { ... }`) is a fast option if
  a full CSS Modules conversion isn't worth it right now.

**3. No cleanup on unmount.**
The Tone.js synth/filter/reverb chain is created lazily and never disposed
when the component unmounts. Fine for a page that's always mounted, but if
this becomes a client-side-routed page in a SPA (user navigates away and
back without a full reload), add a `useEffect` cleanup that calls
`.dispose()` on the synth/filter/reverb refs on unmount — otherwise repeated
visits leak Web Audio nodes.

**4. Accessibility.**
The chord pads and progression rows are `<div onClick>`, not real buttons —
no keyboard access, no screen reader semantics. Worth converting to actual
`<button>` elements (or adding `role="button"`, `tabIndex={0}`, and an
Enter/Space key handler) as part of the integration rather than leaving it
as a mouse-only tool.

**5. Mobile check.**
The keyboard and staff SVGs are wrapped in `overflow-x: auto` containers,
so they shouldn't break layout on narrow screens, but they haven't been
tested on an actual phone. Worth a real pass — pinch-to-scroll on the piano
strip in particular.

**6. Audio needs a real user gesture.**
`Tone.start()` only succeeds inside a genuine click/tap handler — don't let
an autoplay-on-load or route-transition-triggered version of this get
built; it'll silently fail in most browsers.

## Suggested stack if this is a brand-new site
No opinion required here beyond: keep it simple. A Vite + React SPA is the
lowest-friction choice for a small personal site with a couple of pages and
no need for SSR/SEO-critical content. Next.js only pays for itself if there
are multiple content-heavy pages, blog-style routing, or SEO requirements —
in which case items #1 above become mandatory, not optional.
