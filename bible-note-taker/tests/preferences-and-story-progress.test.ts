import { describe, expect, it } from "vitest";
import { loadReducedMotionPreference, REDUCED_MOTION_KEY, saveReducedMotionPreference } from "../lib/preferences";
import { loadStoryProgress, saveStoryProgress, STORY_PROGRESS_KEY } from "../lib/story-progress";
import { ONBOARDING_KEY, resetOnboardingComplete } from "../lib/onboarding";

function memoryStorage(initial: Record<string, string | null> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    async getItem(key: string) { return values.get(key) ?? null; },
    async setItem(key: string, value: string) { values.set(key, value); },
  };
}

describe("local preference and story progress recovery", () => {
  it("verifies reduced-motion writes and safely falls back on malformed values", async () => {
    const storage = memoryStorage({ [REDUCED_MOTION_KEY]: "unexpected" });
    expect(await loadReducedMotionPreference(storage)).toBe(false);
    expect(await saveReducedMotionPreference(true, storage)).toBe(true);
    expect(await loadReducedMotionPreference(storage)).toBe(true);
  });

  it("normalizes story progress, removes duplicates, and verifies writes", async () => {
    const storage = memoryStorage({ [STORY_PROGRESS_KEY]: JSON.stringify([
      { storyId: "story-1", status: "in_progress", currentBlockIndex: 2, timeSpent: 9 },
      { storyId: "story-1", status: "completed", currentBlockIndex: 8, timeSpent: 99 },
      { storyId: "", status: "completed" },
    ]) });
    expect(await loadStoryProgress(storage)).toEqual([{ storyId: "story-1", status: "in_progress", currentBlockIndex: 2, timeSpentSeconds: 9 }]);
    expect(await saveStoryProgress([{ storyId: "story-2", status: "completed", currentBlockIndex: 1, timeSpentSeconds: 60 }, { storyId: "story-2", status: "in_progress", currentBlockIndex: 2, timeSpentSeconds: 90 }, null as never], storage)).toBe(true);
    expect(await loadStoryProgress(storage)).toEqual([{ storyId: "story-2", status: "completed", currentBlockIndex: 1, timeSpentSeconds: 60 }]);
  });

  it("caps oversized hydrated story-progress snapshots", async () => {
    const records = Array.from({ length: 105 }, (_, index) => ({ storyId: `story-${index}`, status: "in_progress", currentBlockIndex: 0, timeSpentSeconds: index }));
    expect((await loadStoryProgress(memoryStorage({ [STORY_PROGRESS_KEY]: JSON.stringify(records) }))).length).toBe(100);
  });

  it("rejects oversized story-progress payloads before parsing", async () => {
    const oversized = "{" + "x".repeat(250_001);
    expect(await loadStoryProgress(memoryStorage({ [STORY_PROGRESS_KEY]: oversized }))).toEqual([]);
  });

  it("falls back safely when story-progress storage rejects a write", async () => {
    const storage = {
      async getItem() { return null; },
      async setItem() { throw new Error("storage unavailable"); },
    };
    expect(await saveStoryProgress([{ storyId: "story-1", status: "in_progress", currentBlockIndex: 0, timeSpentSeconds: 1 }], storage)).toBe(false);
  });

  it("confirms onboarding replay clears the completion marker", async () => {
    const storage = memoryStorage({ [ONBOARDING_KEY]: "1" });
    expect(await resetOnboardingComplete(storage)).toBe(true);
    expect(await storage.getItem(ONBOARDING_KEY)).toBe("0");
  });
});
