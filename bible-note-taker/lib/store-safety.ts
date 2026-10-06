export type SafeActionItem = { id: string; description: string; completed: boolean };

export function normalizeStreak(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
}

export function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function normalizeActionItems(value: unknown): SafeActionItem[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<SafeActionItem[]>((items, raw, index) => {
    if (!raw || typeof raw !== "object") return items;
    const item = raw as { id?: unknown; description?: unknown; completed?: unknown };
    if (typeof item.description !== "string" || !item.description.trim()) return items;
    const id = typeof item.id === "string" && item.id.trim() ? item.id.trim() : `action-recovered-${index}`;
    if (items.some((existing) => existing.id === id)) return items;
    items.push({ id, description: item.description.trim(), completed: item.completed === true });
    return items;
  }, []);
}

export function normalizeRequiredSermonText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function normalizeSermonChanges(value: unknown): Partial<{
  title: string;
  speaker: string;
  tags: string[];
  series: string | null;
  archived: boolean;
}> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const changes: Partial<{
    title: string;
    speaker: string;
    tags: string[];
    series: string | null;
    archived: boolean;
  }> = {};

  if (typeof source.title === "string" && source.title.trim()) changes.title = source.title.trim();
  if (typeof source.speaker === "string" && source.speaker.trim()) changes.speaker = source.speaker.trim();
  if (Array.isArray(source.tags)) {
    changes.tags = Array.from(new Set(source.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim())).map((tag) => tag.trim())));
  }
  if (source.series === null) changes.series = null;
  else if (typeof source.series === "string" && source.series.trim()) changes.series = source.series.trim();
  if (typeof source.archived === "boolean") changes.archived = source.archived;

  return Object.keys(changes).length > 0 ? changes : null;
}

export function isPersistedSnapshotCurrent(raw: unknown, expected: string): boolean {
  return typeof raw === "string" && raw === expected;
}

export const MAX_PERSISTED_JOURNAL_CHARS = 500_000;

export type PersistedJournalEnvelope = { sermons: unknown[]; streak: unknown; activeHabit: unknown };

export function normalizeHabit(value: unknown): "Prayer" | "Gratitude" | "Reflection" | null {
  return value === "Prayer" || value === "Gratitude" || value === "Reflection" ? value : null;
}

export function shouldUseSampleFallback(hasRestoredLocalData: unknown): boolean {
  return hasRestoredLocalData !== true;
}

export function isHydratedForMutation(value: unknown): value is true {
  return value === true;
}

export function canUseBlankJournal(input: { isHydrated: unknown; storageError: unknown; isSaving: unknown; isSampleData: unknown }): boolean {
  return isHydratedForMutation(input.isHydrated) && !input.storageError && input.isSaving !== true && input.isSampleData === true;
}

export function hasRecoverableSermons(raw: unknown[], normalized: unknown[]): boolean {
  return raw.length === 0 || normalized.length > 0;
}

/**
 * Parses the small local journal envelope without trusting any stored shape.
 * A missing envelope is distinct from malformed data so hydration can safely
 * keep the seeded preview while surfacing recovery guidance.
 */
export function parsePersistedJournalEnvelope(raw: unknown): PersistedJournalEnvelope | null {
  if (typeof raw !== "string" || !raw.trim() || raw.length > MAX_PERSISTED_JOURNAL_CHARS) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const record = parsed as { sermons?: unknown; streak?: unknown; activeHabit?: unknown };
    if (!Array.isArray(record.sermons)) return null;
    return { sermons: record.sermons, streak: record.streak, activeHabit: record.activeHabit };
  } catch {
    return null;
  }
}
