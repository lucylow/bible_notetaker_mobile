import { describe, expect, it } from "vitest";
import { countOpenActions, formatTimestamp } from "../lib/bible-note-utils";

describe("Bible Note Taker utilities", () => {
  it("formats timestamps with stable minute and second padding", () => {
    expect(formatTimestamp(0)).toBe("0:00");
    expect(formatTimestamp(742)).toBe("12:22");
    expect(formatTimestamp(-10)).toBe("0:00");
  });

  it("counts only incomplete action items", () => {
    expect(countOpenActions([{ completed: false }, { completed: true }, { completed: false }])).toBe(2);
    expect(countOpenActions([])).toBe(0);
  });
});
