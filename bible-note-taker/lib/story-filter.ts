import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORY_FILTER_KEY = "bible-note-story-filter";
export type StoryFilterValue = "all" | "not_started" | "in_progress" | "completed";
const FILTERS: StoryFilterValue[] = ["all", "not_started", "in_progress", "completed"];

type FilterStorage = Pick<typeof AsyncStorage, "getItem" | "setItem">;

export function normalizeStoryFilter(value: unknown): StoryFilterValue {
  return typeof value === "string" && FILTERS.includes(value as StoryFilterValue) ? value as StoryFilterValue : "all";
}

export async function loadStoryFilter(storage: FilterStorage = AsyncStorage): Promise<StoryFilterValue> {
  try {
    return normalizeStoryFilter(await storage.getItem(STORY_FILTER_KEY));
  } catch {
    return "all";
  }
}

export async function saveStoryFilter(value: unknown, storage: FilterStorage = AsyncStorage): Promise<boolean> {
  const normalized = normalizeStoryFilter(value);
  try {
    await storage.setItem(STORY_FILTER_KEY, normalized);
    return (await storage.getItem(STORY_FILTER_KEY)) === normalized;
  } catch {
    return false;
  }
}
