import { describe, expect, it } from "vitest";
import { advanceStoryProgress, moveStoryProgress, normalizeBibleStories, normalizeBibleStory, normalizeStoryProgress, storyProgressPercent, storytellingReadinessLabel } from "../lib/storytelling-safety";

describe("storytelling safety", () => {
  it("normalizes bounded story metadata and disables unsupported media", () => {
    const story = normalizeBibleStory({
      id: "  creation ",
      title: "  Creation  ",
      summary: "  A beginning  ",
      reference: " Genesis 1-3 ",
      themes: ["creation", "creation", null, "hope"],
      questions: ["What stands out?"],
      duration: 999,
      audioUrl: "https://example.test/audio.mp3",
    });
    expect(story).toMatchObject({ id: "creation", title: "Creation", durationMinutes: 180, hasAudio: false, hasVideo: false });
    expect(story?.themes).toEqual(["creation", "hope"]);
  });

  it("bounds story catalogs and removes malformed or duplicate records", () => {
    const stories = normalizeBibleStories([{ id: "s1", title: "One" }, { id: "s1", title: "Duplicate" }, null, { id: "s2", title: "Two" }], 1);
    expect(stories).toHaveLength(1);
    expect(stories[0].title).toBe("One");
    expect(normalizeBibleStories({ id: "s1", title: "Not a list" })).toEqual([]);
  });

  it("rejects unusable stories and repairs malformed progress", () => {
    expect(normalizeBibleStory(null)).toBeNull();
    expect(normalizeBibleStory({ title: "" })).toBeNull();
    expect(normalizeStoryProgress({ storyId: "s1", status: "unknown", currentBlockIndex: -4, timeSpent: Number.NaN })).toEqual({
      storyId: "s1", status: "not_started", currentBlockIndex: 0, timeSpentSeconds: 0,
    });
    expect(normalizeStoryProgress({ storyId: "" })).toBeNull();
  });

  it("advances reading blocks, completes at the end, and restarts completed stories", () => {
    const story = normalizeBibleStory({ id: "s1", title: "Story", blocks: ["one", "two", "three"], duration: 4 });
    expect(story).not.toBeNull();
    expect(advanceStoryProgress(story!, null)).toMatchObject({ status: "in_progress", currentBlockIndex: 0 });
    expect(advanceStoryProgress(story!, { storyId: "s1", status: "in_progress", currentBlockIndex: 1, timeSpentSeconds: 30 })).toMatchObject({ status: "completed", currentBlockIndex: 2 });
    expect(advanceStoryProgress(story!, { storyId: "s1", status: "completed", currentBlockIndex: 2, timeSpentSeconds: 90 })).toMatchObject({ status: "in_progress", currentBlockIndex: 0 });
  });

  it("bounds previous and next navigation at the story edges", () => {
    const story = normalizeBibleStory({ id: "s2", title: "Story", blocks: ["one", "two"], duration: 4 });
    expect(story).not.toBeNull();
    expect(moveStoryProgress(story!, null, "previous")).toMatchObject({ currentBlockIndex: 0, status: "in_progress" });
    expect(moveStoryProgress(story!, { storyId: "s2", status: "in_progress", currentBlockIndex: 0, timeSpentSeconds: 30 }, "next")).toMatchObject({ currentBlockIndex: 1, status: "completed" });
    expect(moveStoryProgress(story!, { storyId: "s2", status: "completed", currentBlockIndex: 1, timeSpentSeconds: 60 }, "next")).toMatchObject({ currentBlockIndex: 1, status: "completed" });
  });

  it("calculates bounded progress percentages for the library indicator", () => {
    const story = normalizeBibleStory({ id: "s3", title: "Story", blocks: ["one", "two", "three", "four"] });
    expect(story).not.toBeNull();
    expect(storyProgressPercent(story!, null)).toBe(0);
    expect(storyProgressPercent(story!, { storyId: "s3", status: "in_progress", currentBlockIndex: 1, timeSpentSeconds: 30 })).toBe(50);
    expect(storyProgressPercent(story!, { storyId: "s3", status: "in_progress", currentBlockIndex: 99, timeSpentSeconds: 30 })).toBe(100);
    expect(storyProgressPercent(story!, { storyId: "s3", status: "completed", currentBlockIndex: 0, timeSpentSeconds: 30 })).toBe(100);
  });

  it("keeps the future story surface explicitly gated", () => {
    expect(storytellingReadinessLabel()).toContain("not active");
  });
});
