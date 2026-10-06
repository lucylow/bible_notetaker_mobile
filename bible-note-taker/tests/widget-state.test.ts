import { describe, expect, it } from "vitest";
import { buildWidgetState, serializeWidgetState } from "../lib/widget-state";

describe("widget-ready state", () => {
  it("marks an active habit as a prayer lock state", () => {
    const state = buildWidgetState({ streak: 4, activeHabit: "Prayer", latestSermonTitle: "A Faith That Moves" });
    expect(state.prayerLockActive).toBe(true);
    expect(state.prayerLockTitle).toBe("Prayer moment");
    expect(state.latestSermonTitle).toBe("A Faith That Moves");
  });

  it("serializes safe defaults for an idle state", () => {
    const parsed = JSON.parse(serializeWidgetState({ streak: -2, activeHabit: null }));
    expect(parsed.prayerLockActive).toBe(false);
    expect(parsed.prayerStreak).toBe(0);
    expect(parsed.todayVerseReference).toBe("Psalm 46:10");
  });
});
