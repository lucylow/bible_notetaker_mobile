import { describe, expect, it } from "vitest";
import { clearRecentStory, formatRecentStoryLabel, loadRecentStory, normalizeRecentStory, saveRecentStory } from "../lib/story-recent";

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: async (key: string) => values.get(key) ?? null,
    setItem: async (key: string, value: string) => { values.set(key, value); },
    removeItem: async (key: string) => { values.delete(key); },
  };
}

const NOW = 1_800_000_000_000;

describe("recent story persistence", () => {
  it("accepts only allowed stories and timestamps at or before now", () => {
    expect(normalizeRecentStory({ storyId: "story-1", openedAt: NOW - 1_000 }, ["story-1"], NOW)).toEqual({ storyId: "story-1", openedAt: NOW - 1_000 });
    expect(normalizeRecentStory({ storyId: "unknown", openedAt: NOW - 1_000 }, ["story-1"], NOW)).toBeNull();
    expect(normalizeRecentStory({ storyId: "story-1", openedAt: NOW + 1 }, ["story-1"], NOW)).toBeNull();
  });

  it("rejects stale, malformed, and oversized local records", () => {
    expect(normalizeRecentStory({ storyId: "story-1", openedAt: NOW - 1000 * 60 * 60 * 24 * 366 }, ["story-1"], NOW)).toBeNull();
    expect(normalizeRecentStory({ storyId: "story-1", openedAt: "yesterday" }, ["story-1"], NOW)).toBeNull();
    expect(normalizeRecentStory({ storyId: "x".repeat(81), openedAt: NOW }, ["x".repeat(81)], NOW)).toBeNull();
  });

  it("round-trips with readback verification and clears safely", async () => {
    const storage = memoryStorage();
    expect(await saveRecentStory("story-1", ["story-1"], NOW, storage)).toBe(true);
    expect(await loadRecentStory(["story-1"], NOW, storage)).toEqual({ storyId: "story-1", openedAt: NOW });
    expect(await clearRecentStory(storage)).toBe(true);
    expect(await loadRecentStory(["story-1"], NOW, storage)).toBeNull();
  });

  it("formats bounded labels without exposing raw timestamps", () => {
    expect(formatRecentStoryLabel(NOW - 30_000, NOW)).toBe("Opened just now");
    expect(formatRecentStoryLabel(NOW - 5 * 60_000, NOW)).toBe("Opened 5m ago");
    expect(formatRecentStoryLabel(NOW - 3 * 60 * 60_000, NOW)).toBe("Opened 3h ago");
    expect(formatRecentStoryLabel(NOW - 2 * 24 * 60 * 60_000, NOW)).toBe("Opened 2d ago");
    expect(formatRecentStoryLabel(NOW + 1, NOW)).toBeNull();
  });
});
