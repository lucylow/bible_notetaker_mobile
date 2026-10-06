import { describe, expect, it } from "vitest";
import { canCompleteAllActions, getActionCompletionLabel } from "../lib/action-status";

describe("action status", () => {
  it("allows bulk completion only when open actions exist", () => {
    expect(canCompleteAllActions(2)).toBe(true);
    expect(canCompleteAllActions(0)).toBe(false);
    expect(canCompleteAllActions(Number.NaN)).toBe(false);
  });

  it("uses a clear completed-state label", () => {
    expect(getActionCompletionLabel(1)).toBe("Complete all");
    expect(getActionCompletionLabel(0)).toBe("All completed");
    expect(getActionCompletionLabel(-1)).toBe("All completed");
  });
});
