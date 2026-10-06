import { describe, expect, it } from "vitest";
import { getMotionDelay, MOTION } from "../lib/motion";

describe("motion safety", () => {
  it("returns bounded stagger delays", () => {
    expect(getMotionDelay(0)).toBe(0);
    expect(getMotionDelay(2)).toBe(110);
    expect(getMotionDelay(100)).toBe(MOTION.maxDelay);
  });

  it("recovers safely from malformed indexes", () => {
    expect(getMotionDelay(Number.NaN)).toBe(0);
    expect(getMotionDelay(-2)).toBe(0);
    expect(getMotionDelay(Infinity)).toBe(0);
  });
});
