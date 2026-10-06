import { describe, expect, it } from "vitest";
import { isSafeAreaInsetsPayload } from "../lib/_core/runtime-safety";

describe("runtime safety", () => {
  it("accepts finite safe-area inset payloads", () => {
    expect(isSafeAreaInsetsPayload({ top: 16, right: 0, bottom: 12, left: 0 })).toBe(true);
  });

  it("rejects malformed and non-finite inset payloads", () => {
    expect(isSafeAreaInsetsPayload({ top: Number.NaN, right: 0, bottom: 12, left: 0 })).toBe(false);
    expect(isSafeAreaInsetsPayload({ top: 16, right: 0, bottom: "12", left: 0 })).toBe(false);
  });
});
