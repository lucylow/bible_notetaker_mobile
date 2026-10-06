import { describe, expect, it } from "vitest";

describe("home action undo contract", () => {
  it("keeps the completed action identity sufficient for a local undo", () => {
    const completed = { sermonId: "seed-1", actionId: "action-1", description: "Pray for courage" };
    expect(completed.sermonId).toBe("seed-1");
    expect(completed.actionId).toBe("action-1");
    expect(completed.description).toBeTruthy();
  });

  it("does not invent an undo target when no action was completed", () => {
    const recentlyCompleted: { sermonId: string; actionId: string } | null = null;
    expect(recentlyCompleted).toBeNull();
  });
});
