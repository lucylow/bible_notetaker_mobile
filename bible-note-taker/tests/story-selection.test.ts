import { describe, expect, it } from "vitest";
import { clearLastStoryId, loadLastStoryId, normalizeStoryId, saveLastStoryId } from "../lib/story-selection";

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: async (key: string) => values.get(key) ?? null,
    setItem: async (key: string, value: string) => { values.set(key, value); },
    removeItem: async (key: string) => { values.delete(key); },
  };
}

describe("story selection persistence", () => {
  it("only accepts IDs from the bundled catalog", () => {
    expect(normalizeStoryId("story-1", ["story-1"])).toBe("story-1");
    expect(normalizeStoryId("unknown", ["story-1"])).toBeNull();
    expect(normalizeStoryId("x".repeat(81), ["x".repeat(81)])).toBeNull();
  });

  it("round-trips the last story through verified local storage", async () => {
    const storage = memoryStorage();
    expect(await saveLastStoryId("story-1", ["story-1"], storage)).toBe(true);
    expect(await loadLastStoryId(["story-1"], storage)).toBe("story-1");
  });

  it("clears only the remembered story selection", async () => {
    const storage = memoryStorage({ "bible-note-last-story": "story-1" });
    expect(await clearLastStoryId(storage)).toBe(true);
    expect(await loadLastStoryId(["story-1"], storage)).toBeNull();
    expect(await clearLastStoryId(storage)).toBe(true);
  });

  it("recovers safely from missing or broken storage values", async () => {
    expect(await loadLastStoryId(["story-1"], memoryStorage({ "bible-note-last-story": "unknown" }))).toBeNull();
    const broken = { getItem: async () => { throw new Error("read"); }, setItem: async () => { throw new Error("write"); }, removeItem: async () => { throw new Error("remove"); } };
    expect(await loadLastStoryId(["story-1"], broken)).toBeNull();
    expect(await saveLastStoryId("unknown", ["story-1"], broken)).toBe(false);
  });
});
