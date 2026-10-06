export type WidgetStateInput = {
  streak: number;
  activeHabit: string | null;
  latestSermonTitle?: string;
  verseReference?: string;
  verseText?: string;
};

export type WidgetState = {
  prayerLockActive: boolean;
  prayerLockTitle: string;
  prayerStreak: number;
  latestSermonTitle: string;
  todayVerseReference: string;
  todayVerse: string;
  updatedAt: string;
};

const DEFAULT_REFERENCE = "Psalm 46:10";
const DEFAULT_VERSE = "Be still, and know that I am God.";
const ALLOWED_WIDGET_ROUTES = new Set(["prayer-lock", "prayer", "sermon/latest", "bible"]);

function safeText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 240) : fallback;
}

export function buildWidgetState(input: WidgetStateInput): WidgetState {
  const streak = typeof input.streak === "number" && Number.isFinite(input.streak) ? Math.max(0, Math.floor(input.streak)) : 0;
  const activeHabit = typeof input.activeHabit === "string" && input.activeHabit.trim() ? input.activeHabit.trim().slice(0, 80) : null;
  return {
    prayerLockActive: Boolean(activeHabit),
    prayerLockTitle: activeHabit ? `${activeHabit} moment` : "Prayer Time",
    prayerStreak: streak,
    latestSermonTitle: safeText(input.latestSermonTitle, "No sermon yet"),
    todayVerseReference: safeText(input.verseReference, DEFAULT_REFERENCE),
    todayVerse: safeText(input.verseText, DEFAULT_VERSE),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeWidgetState(value: unknown): WidgetState {
  if (!value || typeof value !== "object") return buildWidgetState({ streak: 0, activeHabit: null });
  const record = value as Record<string, unknown>;
  return buildWidgetState({
    streak: typeof record.prayerStreak === "number" ? record.prayerStreak : 0,
    activeHabit: record.prayerLockActive === true && typeof record.prayerLockTitle === "string" ? record.prayerLockTitle.replace(/\s+moment$/, "") : null,
    latestSermonTitle: typeof record.latestSermonTitle === "string" ? record.latestSermonTitle : undefined,
    verseReference: typeof record.todayVerseReference === "string" ? record.todayVerseReference : undefined,
    verseText: typeof record.todayVerse === "string" ? record.todayVerse : undefined,
  });
}

export function serializeWidgetState(input: WidgetStateInput) {
  return JSON.stringify(buildWidgetState(input));
}

export function validateWidgetRoute(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/^biblenotetaker:\/\//, "").replace(/^\/+/, "").split("?")[0].split("#")[0];
  return ALLOWED_WIDGET_ROUTES.has(normalized) ? normalized : null;
}

export function buildSafeWidgetUrl(value: unknown): string {
  const route = validateWidgetRoute(value);
  return route ? `biblenotetaker://${route}` : "biblenotetaker://prayer-lock";
}
