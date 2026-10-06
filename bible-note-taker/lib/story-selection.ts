import AsyncStorage from "@react-native-async-storage/async-storage";

export const LAST_STORY_KEY = "bible-note-last-story";
export const MAX_LAST_STORY_ID_LENGTH = 80;
type StoryStorage = Pick<typeof AsyncStorage, "getItem" | "setItem" | "removeItem">;

export function normalizeStoryId(value: unknown, allowedIds: readonly string[]): string | null {
  if (typeof value !== "string" || value.length > MAX_LAST_STORY_ID_LENGTH) return null;
  return allowedIds.includes(value) ? value : null;
}

export async function loadLastStoryId(allowedIds: readonly string[], storage: StoryStorage = AsyncStorage): Promise<string | null> {
  try {
    return normalizeStoryId(await storage.getItem(LAST_STORY_KEY), allowedIds);
  } catch {
    return null;
  }
}

export async function clearLastStoryId(storage: StoryStorage = AsyncStorage): Promise<boolean> {
  try {
    await storage.removeItem(LAST_STORY_KEY);
    return (await storage.getItem(LAST_STORY_KEY)) === null;
  } catch {
    return false;
  }
}

export async function saveLastStoryId(value: unknown, allowedIds: readonly string[], storage: StoryStorage = AsyncStorage): Promise<boolean> {
  const normalized = normalizeStoryId(value, allowedIds);
  if (!normalized) return false;
  try {
    await storage.setItem(LAST_STORY_KEY, normalized);
    return (await storage.getItem(LAST_STORY_KEY)) === normalized;
  } catch {
    return false;
  }
}
