'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { HourlyEntry, HourlyQuickAdd } from '@/types';
import { getDayRange } from '@/lib/hourly';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
  });
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${url} returned ${res.status}`);
  return res.json();
}

export function useHourly(day: string, onError?: (message: string) => void) {
  const [entries, setEntries] = useState<HourlyEntry[]>([]);
  const [quickAdds, setQuickAdds] = useState<HourlyQuickAdd[]>([]);
  const [allTags, setAllTags] = useState<{ tag: string; count: number }[]>([]);
  const [loadedDay, setLoadedDay] = useState<string | null>(null);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  });
  const loading = loadedDay !== day;

  const refreshTags = useCallback(() => {
    request<{ tags: { tag: string; count: number }[] }>('/api/hourly/tags')
      .then(({ tags }) => setAllTags(tags))
      .catch((e) => console.error('Failed to load tags:', e));
  }, []);

  useEffect(() => {
    request<{ quickAdds: HourlyQuickAdd[] }>('/api/hourly/quick-adds')
      .then(({ quickAdds }) => setQuickAdds(quickAdds))
      .catch((e) => console.error('Failed to load quick-adds:', e));
    refreshTags();
  }, [refreshTags]);

  useEffect(() => {
    let cancelled = false;
    const { start, end } = getDayRange(day);
    request<{ entries: HourlyEntry[] }>(
      `/api/hourly/entries?from=${encodeURIComponent(start.toISOString())}&to=${encodeURIComponent(end.toISOString())}`
    )
      .then(({ entries }) => {
        if (cancelled) return;
        setEntries(entries);
        setLoadedDay(day);
      })
      .catch((e) => {
        console.error('Failed to load entries:', e);
        if (cancelled) return;
        setEntries([]);
        setLoadedDay(day);
        onErrorRef.current?.('Could not load entries.');
      });
    return () => {
      cancelled = true;
    };
  }, [day]);

  const fail = useCallback((message: string, e: unknown) => {
    console.error(message, e);
    onErrorRef.current?.(message);
  }, []);

  const addEntry = useCallback(
    async (message: string, tags: string[]): Promise<string | null> => {
      const tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();
      setEntries((prev) => [...prev, { id: tempId, message, tags, loggedAt: now, createdAt: now, editCount: 0 }]);
      try {
        const { entry } = await request<{ entry: HourlyEntry }>('/api/hourly/entries', {
          method: 'POST',
          body: JSON.stringify({ message, tags, loggedAt: now }),
        });
        setEntries((prev) => prev.map((e) => (e.id === tempId ? entry : e)));
        refreshTags();
        return entry.id;
      } catch (e) {
        setEntries((prev) => prev.filter((x) => x.id !== tempId));
        fail('Could not save that entry.', e);
        return null;
      }
    },
    [fail, refreshTags]
  );

  const editEntry = useCallback(
    async (id: string, changes: { message?: string; tags?: string[]; loggedAt?: string }) => {
      try {
        const { entry } = await request<{ entry: HourlyEntry }>(`/api/hourly/entries/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(changes),
        });
        setEntries((prev) => prev.map((e) => (e.id === id ? entry : e)));
        refreshTags();
        return true;
      } catch (e) {
        fail('Could not save your changes.', e);
        return false;
      }
    },
    [fail, refreshTags]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      let removed: HourlyEntry | undefined;
      setEntries((prev) => {
        removed = prev.find((e) => e.id === id);
        return prev.filter((e) => e.id !== id);
      });
      try {
        await request(`/api/hourly/entries/${id}`, { method: 'DELETE' });
        refreshTags();
      } catch (e) {
        if (removed) setEntries((prev) => [...prev, removed!]);
        fail('Could not delete that entry.', e);
      }
    },
    [fail, refreshTags]
  );

  const addQuickAdd = useCallback(
    async (label: string, tags: string[]) => {
      try {
        const { quickAdd } = await request<{ quickAdd: HourlyQuickAdd }>('/api/hourly/quick-adds', {
          method: 'POST',
          body: JSON.stringify({ label, tags }),
        });
        setQuickAdds((prev) => (prev.some((q) => q.id === quickAdd.id) ? prev : [...prev, quickAdd]));
      } catch (e) {
        fail('Could not save that quick-add.', e);
      }
    },
    [fail]
  );

  const removeQuickAdd = useCallback(
    async (id: string) => {
      const prevList = quickAdds;
      setQuickAdds((prev) => prev.filter((q) => q.id !== id));
      try {
        await request(`/api/hourly/quick-adds/${id}`, { method: 'DELETE' });
      } catch (e) {
        setQuickAdds(prevList);
        fail('Could not remove that quick-add.', e);
      }
    },
    [quickAdds, fail]
  );

  return {
    entries,
    quickAdds,
    allTags,
    loading,
    addEntry,
    editEntry,
    deleteEntry,
    addQuickAdd,
    removeQuickAdd,
  };
}
