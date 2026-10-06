import { describe, expect, it } from "vitest";
import { canUseBlankJournal, hasRecoverableSermons, isHydratedForMutation, isPersistedSnapshotCurrent, normalizeHabit, normalizeRequiredSermonText, parsePersistedJournalEnvelope, shouldUseSampleFallback, MAX_PERSISTED_JOURNAL_CHARS } from "../lib/store-safety";

describe("persisted snapshot safety", () => {
  it("accepts only an exact persisted string snapshot", () => {
    expect(isPersistedSnapshotCurrent('{"streak":4}', '{"streak":4}')).toBe(true);
    expect(isPersistedSnapshotCurrent('{"streak":3}', '{"streak":4}')).toBe(false);
  });

  it("rejects missing and non-string storage results", () => {
    expect(isPersistedSnapshotCurrent(null, "snapshot")).toBe(false);
    expect(isPersistedSnapshotCurrent({ value: "snapshot" }, "snapshot")).toBe(false);
    expect(isPersistedSnapshotCurrent("snapshot", "")).toBe(false);
  });

  it("parses only valid journal envelopes and preserves unknown record values for normalization", () => {
    expect(parsePersistedJournalEnvelope(null)).toBeNull();
    expect(parsePersistedJournalEnvelope("not-json")).toBeNull();
    expect(parsePersistedJournalEnvelope(JSON.stringify({ streak: 4 }))).toBeNull();
    expect(parsePersistedJournalEnvelope(JSON.stringify({ sermons: [], streak: "bad", activeHabit: "Prayer" }))).toEqual({ sermons: [], streak: "bad", activeHabit: "Prayer" });
    expect(parsePersistedJournalEnvelope("{" + "x".repeat(MAX_PERSISTED_JOURNAL_CHARS) )).toBeNull();
    expect(normalizeHabit("Prayer")).toBe("Prayer");
    expect(normalizeHabit("Unknown")).toBeNull();
  });

  it("allows mutations only after hydration has completed", () => {
    expect(isHydratedForMutation(false)).toBe(false);
    expect(isHydratedForMutation(null)).toBe(false);
    expect(isHydratedForMutation(true)).toBe(true);
  });

  it("keeps restored personal data from being relabeled as sample fallback", () => {
    expect(shouldUseSampleFallback(false)).toBe(true);
    expect(shouldUseSampleFallback(undefined)).toBe(true);
    expect(shouldUseSampleFallback(true)).toBe(false);
  });

  it("normalizes required sermon text and rejects malformed values", () => {
    expect(normalizeRequiredSermonText("  Sunday gathering  ")).toBe("Sunday gathering");
    expect(normalizeRequiredSermonText("   ")).toBeNull();
    expect(normalizeRequiredSermonText(null)).toBeNull();
    expect(normalizeRequiredSermonText({})).toBeNull();
  });

  it("allows blank-journal fallback only after safe hydration and while sample data is active", () => {
    expect(canUseBlankJournal({ isHydrated: true, storageError: null, isSaving: false, isSampleData: true })).toBe(true);
    expect(canUseBlankJournal({ isHydrated: false, storageError: null, isSaving: false, isSampleData: true })).toBe(false);
    expect(canUseBlankJournal({ isHydrated: true, storageError: "storage unavailable", isSaving: false, isSampleData: true })).toBe(false);
    expect(canUseBlankJournal({ isHydrated: true, storageError: null, isSaving: true, isSampleData: true })).toBe(false);
    expect(canUseBlankJournal({ isHydrated: true, storageError: null, isSaving: false, isSampleData: false })).toBe(false);
  });

  it("rejects backups with no recoverable sermons unless they are intentionally empty", () => {
    expect(hasRecoverableSermons([], [])).toBe(true);
    expect(hasRecoverableSermons([null, "bad"], [])).toBe(false);
    expect(hasRecoverableSermons([null, { id: "s1" }], [{ id: "s1" }])).toBe(true);
  });
});
