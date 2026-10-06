import { describe, expect, it } from "vitest";
import { normalizeSermonNote, safeAudioSession, validateRequiredText } from "../lib/error-handling";
import { dedupeById, normalizeActionItems, normalizeSermonChanges, normalizeStreak } from "../lib/store-safety";
import { normalizeAudioSession } from "../lib/audio-session";

describe("error handling", () => {
  it("normalizes invalid streak values to a safe fallback", () => {
    expect(normalizeStreak(4.9)).toBe(4);
    expect(normalizeStreak(-2, 4)).toBe(4);
    expect(normalizeStreak("4", 4)).toBe(4);
    expect(normalizeStreak(Number.NaN, 4)).toBe(4);
  });

  it("removes duplicate records while preserving first-seen order", () => {
    expect(dedupeById([{ id: "s1", value: 1 }, { id: "s1", value: 2 }, { id: "s2", value: 3 }])).toEqual([{ id: "s1", value: 1 }, { id: "s2", value: 3 }]);
  });

  it("drops malformed actions and duplicate action identifiers", () => {
    expect(normalizeActionItems([{ id: "a1", description: " Pray ", completed: false }, { id: "a1", description: "Duplicate", completed: false }, { id: "a2", description: " ", completed: false }, null])).toEqual([{ id: "a1", description: "Pray", completed: false }]);
  });

  it("normalizes sermon metadata changes and rejects empty mutations", () => {
    expect(normalizeSermonChanges({ title: "  New title ", tags: ["Faith", " Faith ", null], series: "  Series  ", archived: true })).toEqual({ title: "New title", tags: ["Faith"], series: "Series", archived: true });
    expect(normalizeSermonChanges({ title: "   " })).toBeNull();
    expect(normalizeSermonChanges(null)).toBeNull();
  });

  it("recovers malformed audio mutation data", () => {
    expect(normalizeAudioSession({ status: "broken", durationSeconds: -9 })).toMatchObject({ status: "ready", durationSeconds: 0, uri: null });
  });

  it("rejects malformed notes and repairs safe fields", () => {
    expect(normalizeSermonNote({ content: "  insight ", timestamp: -3 }, 2)).toEqual({ id: "note-restored-2", content: "insight", timestamp: 0, isActionItem: false });
    expect(normalizeSermonNote({ content: " " }, 1)).toBeNull();
  });

  it("normalizes invalid audio state to a safe ready session", () => {
    expect(safeAudioSession({ status: "broken", durationSeconds: -4 })).toEqual({ status: "ready", durationSeconds: 0, uri: null });
  });

  it("returns actionable required-field feedback", () => {
    expect(validateRequiredText("  ", "Title")).toEqual({ ok: false, message: "Title is required." });
    expect(validateRequiredText(" Note ", "Title")).toEqual({ ok: true, value: "Note" });
  });
});
