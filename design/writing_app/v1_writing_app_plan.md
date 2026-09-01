# Writing Tool — Build Spec (for /writing inside Cozy Chaos)

## Scope for v1
- Project types: `NOVEL`, `SHORT_STORY_COLLECTION` only (enum has room to grow later)
- Generic writing unit: `Section` (displays as "Chapter" or "Story" depending on project type)
- Notes attached to a Section (unanchored — no text-position pinning in v1)
- Rich text editor (Tiptap), autosave, chapter/section reordering
- Offline: not required for v1, but do the cheap localStorage fallback (see below)

---

## 1. Prisma Schema

```prisma
enum ProjectType {
  NOVEL
  SHORT_STORY_COLLECTION
}

model Project {
  id        String      @id @default(cuid())
  userId    String
  title     String
  type      ProjectType @default(NOVEL)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  sections  Section[]
}

model Section {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  title     String
  content   Json     // Tiptap JSON document
  order     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  notes     Note[]
}

model Note {
  id        String   @id @default(cuid())
  sectionId String
  section   Section  @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  body      String   @db.Text
  createdAt DateTime @default(now())
}
```

**Notes on the schema:**
- `content` is `Json`, not `String` — this is a Tiptap document tree, not a markdown string. This is what makes anchored notes and rich formatting possible later without a data migration.
- `order` is a plain `Int`. On reorder, just re-assign order values for the affected sections — don't build fractional indexing until it's actually painful at this scale.
- Both `Section → Project` and `Note → Section` cascade on delete. Deleting a project should not leave orphaned rows.
- No `sectionType` label field — that's derived purely from `Project.type` at the display layer (see §3).

---

## 2. Service Layer

Mirror the Bakeshop pattern — no DB calls directly in route handlers.

```
/lib/services
  projectService.ts
    - createProject(userId, title, type)
    - listProjects(userId)
    - getProject(projectId)   // includes sections, ordered
    - deleteProject(projectId)

  sectionService.ts
    - createSection(projectId, title)       // auto-assigns next order value
    - getSection(sectionId)                  // includes notes
    - updateSectionContent(sectionId, content)
    - updateSectionTitle(sectionId, title)
    - reorderSections(projectId, orderedIds: string[])
    - deleteSection(sectionId)

  noteService.ts
    - createNote(sectionId, body)
    - listNotes(sectionId)
    - deleteNote(noteId)
```

Keep these framework-agnostic (plain functions taking/returning plain objects) so they're easy to unit test with Vitest, same as Bakeshop.

---

## 3. Display Label Mapping (not in the DB)

```ts
// lib/sectionLabels.ts
export const sectionLabel: Record<ProjectType, { singular: string; plural: string; newLabel: string }> = {
  NOVEL: { singular: 'Chapter', plural: 'Chapters', newLabel: '+ New Chapter' },
  SHORT_STORY_COLLECTION: { singular: 'Story', plural: 'Stories', newLabel: '+ New Story' },
};
```

Every UI string that would say "Chapter" pulls from this, keyed off `project.type`. Never hardcode "Chapter" in a component.

---

## 4. Routes / Folder Structure

```
/app
  /writing
    page.tsx                          → project list (create/select)
    /[projectId]
      page.tsx                        → section list/nav for that project
      /[sectionId]
        page.tsx                      → editor view

/app/api
  /projects
    route.ts                          → GET (list), POST (create)
    /[id]/route.ts                    → GET, DELETE
  /sections
    route.ts                          → POST (create)
    /[id]/route.ts                    → GET, PATCH (content/title), DELETE
    /reorder/route.ts                 → PATCH (bulk order update)
  /notes
    route.ts                          → POST (create)
    /[id]/route.ts                    → DELETE

/lib
  /services
    projectService.ts
    sectionService.ts
    noteService.ts
  sectionLabels.ts
```

---

## 5. Editor + Autosave

- Editor: **Tiptap** (ProseMirror-based). `editor.getJSON()` on update → matches the `Json` content column directly.
- Autosave: debounce ~1.5–2s of idle typing, PATCH to `/api/sections/[id]`.
- Show a small "Saving… / Saved" indicator — cheap to build, meaningfully increases trust that nothing's being lost (this is the exact failure mode that pushed you off Apollo).
- **localStorage fallback**: on every successful save, also write `content` to `localStorage` keyed by `sectionId`. On editor mount, if a save request ever fails, fall back to the localStorage copy rather than silently losing the in-progress paragraph. This is ~10 lines and is NOT the same as full offline support — it's just a safety net against a flaky save request.

---

## 6. Build Order (suggested for Claude Code to follow)

1. Prisma migration for the three models above
2. `projectService` + `sectionService` + basic CRUD API routes, no editor yet — confirm data model end-to-end with simple forms
3. Project list page + "create project" flow (title + type picker)
4. Section list/nav page per project, using `sectionLabel` mapping
5. Drop Tiptap into the section editor page, wire up autosave + saving indicator
6. Section reordering (drag-and-drop — `@dnd-kit` is a solid, well-maintained choice)
7. Notes: create/list/delete on the section page (simple sidebar list, no anchoring)
8. localStorage fallback on save failure

---

## 7. Things worth deciding now (easy) vs. later (fine to defer)

**Decide now (cheap to set up, annoying to retrofit):**
- `content` as `Json` (Tiptap doc), not plain string — locks in rich text + future anchoring support
- `Section` as the generic model name, never `Chapter` in code
- Service-layer pattern from day one, even for simple CRUD

**Fine to defer:**
- Anchored notes (pin a note to a text range) — genuinely hard, don't build until the unanchored version feels limiting
- Export (PDF/Markdown/ebook) — worth designing one canonical export format later rather than per-format logic
- Full offline sync (IndexedDB + service worker) — you said not urgent; the localStorage fallback above covers the actual pain point (Apollo silently eating text) without the complexity
- `ProjectType.CUSTOM` with free-text label override — only needed if you add a project type the enum doesn't fit later (letters, blog, etc.)
- Word count / progress tracking — nice addition once the core loop is solid

**One thing to flag explicitly for Claude Code:** the whole reason for the `Json` content column and the `Section`/label split is to avoid Apollo's mistakes (data loss from arbitrary size limits, and "Chapter" baked in everywhere). Worth stating in the prompt so it doesn't quietly simplify back to a plain string column or hardcode "Chapter" for convenience.