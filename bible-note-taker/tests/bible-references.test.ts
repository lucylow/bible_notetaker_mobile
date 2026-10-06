import { describe, expect, it } from "vitest";
import { getBibleReferences, normalizeBibleQuery } from "../lib/bible-references";

describe("Bible reference recovery", () => {
  it("normalizes deep-link search queries safely", () => {
    expect(normalizeBibleQuery("  Psalm 46:10  ")).toBe("Psalm 46:10");
    expect(normalizeBibleQuery(["Psalm 46:10"])).toBe("");
    expect(normalizeBibleQuery(null)).toBe("");
  });

  it("extracts and deduplicates references from local notes", () => {
    const result = getBibleReferences([{ notes: [{ content: "Remember James 2:17 and James 2:17." }, { content: "Try Psalm 46:10." }] }]);
    expect(result.map((item) => item.reference)).toEqual(["James 2:17", "Psalm 46:10"]);
    expect(result.every((item) => item.source === "local")).toBe(true);
  });

  it("uses labeled samples when local notes have no references", () => {
    const result = getBibleReferences([{ notes: [{ content: "Pray for courage." }] }]);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.source === "sample")).toBe(true);
  });

  it("ignores malformed note content without throwing", () => {
    expect(() => getBibleReferences([{ notes: [{ content: null }, { content: 42 }] }])).not.toThrow();
  });

  it("returns labeled samples for malformed sermon collections without throwing", () => {
    expect(() => getBibleReferences(null)).not.toThrow();
    expect(() => getBibleReferences([null, "bad", { notes: "bad" }])).not.toThrow();
    expect(getBibleReferences(null).every((item) => item.source === "sample")).toBe(true);
  });
});
