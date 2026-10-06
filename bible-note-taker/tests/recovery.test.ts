import { describe, expect, it } from "vitest";
import { getRetryDelay } from "../lib/retry";
import { normalizeSermonNote, validateRequiredText } from "../lib/error-handling";

describe("recovery helpers", () => {
  it("caps exponential persistence retry delays", () => {
    expect(getRetryDelay(0)).toBe(400);
    expect(getRetryDelay(3)).toBe(3200);
    expect(getRetryDelay(8)).toBe(5000);
  });

  it("keeps invalid user actions recoverable", () => {
    expect(normalizeSermonNote(null, 0)).toBeNull();
    expect(validateRequiredText("", "Action").ok).toBe(false);
  });
});
