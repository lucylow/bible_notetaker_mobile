import { describe, expect, it } from "vitest";
import { bundledBibleStories } from "../lib/story-catalog";

describe("story catalog fallback", () => {
  it("always exposes at least one safe story for the reader", () => {
    expect(bundledBibleStories.length).toBeGreaterThan(0);
    expect(bundledBibleStories.every((story) => story.id && story.title && story.blocks.length > 0)).toBe(true);
  });

  it("labels the emergency sample content instead of presenting it as Scripture", () => {
    const fallback = bundledBibleStories.find((story) => story.id === "fallback-practice-story");
    if (fallback) {
      expect(fallback.title.toLowerCase()).toContain("sample");
      expect(fallback.reference).toBe("Sample passage");
    }
  });
});
