import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalizeStoryProgress, type SafeStoryProgress } from "./storytelling-safety";

export const STORY_PROGRESS_KEY = "bible-note-story-progress";
export const MAX_STORY_PROGRESS_RECORDS = 100;
export const MAX_STORY_PROGRESS_PAYLOAD_CHARS = 250_000;
type StoryProgressStorage = Pick<typeof AsyncStorage, "getItem" | "setItem">;

export async function loadStoryProgress(storage: StoryProgressStorage = AsyncStorage): Promise<SafeStoryProgress[]> {
  try {
    const raw = await storage.getItem(STORY_PROGRESS_KEY);
    if (!raw || raw.length > MAX_STORY_PROGRESS_PAYLOAD_CHARS) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed.flatMap((entry) => {
      const progress = normalizeStoryProgress(entry);
      if (!progress || seen.has(progress.storyId) || seen.size >= MAX_STORY_PROGRESS_RECORDS) return [];
      seen.add(progress.storyId);
      return [progress];
    });
  } catch {
    return [];
  }
}

export async function saveStoryProgress(progress: SafeStoryProgress[], storage: StoryProgressStorage = AsyncStorage): Promise<boolean> {
  try {
    const seen = new Set<string>();
    const normalized = progress.flatMap((entry) => {
      const value = normalizeStoryProgress(entry);
      if (!value || seen.has(value.storyId) || seen.size >= MAX_STORY_PROGRESS_RECORDS) return [];
      seen.add(value.storyId);
      return [value];
    });
    const payload = JSON.stringify(normalized);
    if (payload.length > MAX_STORY_PROGRESS_PAYLOAD_CHARS) return false;
    await storage.setItem(STORY_PROGRESS_KEY, payload);
    return (await storage.getItem(STORY_PROGRESS_KEY)) === payload;
  } catch {
    return false;
  }
}
