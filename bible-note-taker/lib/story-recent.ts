import AsyncStorage from "@react-native-async-storage/async-storage";

export const RECENT_STORY_KEY = "bible-note-recent-story";
export const MAX_RECENT_STORY_ID_LENGTH = 80;
export const MAX_RECENT_STORY_AGE_MS = 1000 * 60 * 60 * 24 * 365;

type StoryStorage = Pick<typeof AsyncStorage, "getItem" | "setItem" | "removeItem">;

export type RecentStory = {
  storyId: string;
  openedAt: number;
};

function normalizeTimestamp(value: unknown, now: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const timestamp = Math.floor(value);
  if (timestamp < 0 || timestamp > now || now - timestamp > MAX_RECENT_STORY_AGE_MS) return null;
  return timestamp;
}

export function normalizeRecentStory(value: unknown, allowedIds: readonly string[], now = Date.now()): RecentStory | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const storyId = typeof source.storyId === "string" && source.storyId.length <= MAX_RECENT_STORY_ID_LENGTH && allowedIds.includes(source.storyId) ? source.storyId : null;
  const openedAt = normalizeTimestamp(source.openedAt, now);
  return storyId && openedAt !== null ? { storyId, openedAt } : null;
}

export async function loadRecentStory(allowedIds: readonly string[], now = Date.now(), storage: StoryStorage = AsyncStorage): Promise<RecentStory | null> {
  try {
    const raw = await storage.getItem(RECENT_STORY_KEY);
    if (!raw) return null;
    return normalizeRecentStory(JSON.parse(raw), allowedIds, now);
  } catch {
    return null;
  }
}

export async function saveRecentStory(value: unknown, allowedIds: readonly string[], now = Date.now(), storage: StoryStorage = AsyncStorage): Promise<boolean> {
  const storyId = typeof value === "string" && value.length <= MAX_RECENT_STORY_ID_LENGTH && allowedIds.includes(value) ? value : null;
  const openedAt = normalizeTimestamp(now, now);
  if (!storyId || openedAt === null) return false;
  const next = { storyId, openedAt } satisfies RecentStory;
  try {
    await storage.setItem(RECENT_STORY_KEY, JSON.stringify(next));
    const saved = await loadRecentStory(allowedIds, now, storage);
    return saved?.storyId === storyId && saved.openedAt === openedAt;
  } catch {
    return false;
  }
}

export async function clearRecentStory(storage: StoryStorage = AsyncStorage): Promise<boolean> {
  try {
    await storage.removeItem(RECENT_STORY_KEY);
    return (await storage.getItem(RECENT_STORY_KEY)) === null;
  } catch {
    return false;
  }
}

export function formatRecentStoryLabel(openedAt: number, now = Date.now()): string | null {
  const ageMs = now - openedAt;
  if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > MAX_RECENT_STORY_AGE_MS) return null;
  if (ageMs < 60_000) return "Opened just now";
  if (ageMs < 60 * 60_000) return `Opened ${Math.floor(ageMs / 60_000)}m ago`;
  if (ageMs < 24 * 60 * 60_000) return `Opened ${Math.floor(ageMs / (60 * 60_000))}h ago`;
  return `Opened ${Math.floor(ageMs / (24 * 60 * 60_000))}d ago`;
}
