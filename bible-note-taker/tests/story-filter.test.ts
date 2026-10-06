import { describe, expect, it } from "vitest";
import { loadStoryFilter, normalizeStoryFilter, saveStoryFilter } from "../lib/story-filter";

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: async (key: string) => values.get(key) ?? null,
    setItem: async (key: string, value: string) => { values.set(key, value); },
  };
}

describe("story filter persistence", () => {
  it("normalizes unsupported values to the safe default", () => {
    expect(normalizeStoryFilter("completed")).toBe("completed");
    expect(normalizeStoryFilter("unknown")).toBe("all");
    expect(normalizeStoryFilter(null)).toBe("all");
  });

  it("round-trips a valid filter through local storage", async () => {
    const storage = memoryStorage();
    expect(await saveStoryFilter("in_progress", storage)).toBe(true);
    expect(await loadStoryFilter(storage)).toBe("in_progress");
  });

  it("recovers safely when storage operations fail", async () => {
    const broken = { getItem: async () => { throw new Error("read"); }, setItem: async () => { throw new Error("write"); } };
    expect(await loadStoryFilter(broken)).toBe("all");
    expect(await saveStoryFilter("completed", broken)).toBe(false);
  });
});
