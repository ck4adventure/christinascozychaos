import { HourlyEdit, HourlyEntry, HourlyQuickAdd } from '@/types';

export function dbEntryToApi(
  e: { id: string; message: string; tags: string[]; loggedAt: Date; createdAt: Date },
  editCount = 0
): HourlyEntry {
  return {
    id: e.id,
    message: e.message,
    tags: e.tags,
    loggedAt: e.loggedAt.toISOString(),
    createdAt: e.createdAt.toISOString(),
    editCount,
  };
}

export function dbEditToApi(e: {
  id: string;
  entryId: string;
  prevMessage: string;
  prevTags: string[];
  prevLoggedAt: Date;
  editedAt: Date;
}): HourlyEdit {
  return {
    id: e.id,
    entryId: e.entryId,
    prevMessage: e.prevMessage,
    prevTags: e.prevTags,
    prevLoggedAt: e.prevLoggedAt.toISOString(),
    editedAt: e.editedAt.toISOString(),
  };
}

export function dbQuickAddToApi(q: { id: string; label: string; tags: string[]; sortOrder: number }): HourlyQuickAdd {
  return { id: q.id, label: q.label, tags: q.tags, sortOrder: q.sortOrder };
}

/** Returns a valid Date or null. */
export function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
