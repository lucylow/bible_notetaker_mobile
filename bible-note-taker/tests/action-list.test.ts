import { describe, expect, it } from "vitest";
import { filterActionItems, flattenActionItems } from "../lib/action-list";

describe("action list helpers", () => {
  const items = flattenActionItems([{ id: "s1", title: "Faith", actionItems: [{ id: "a1", description: "Pray", completed: false }, { id: "a2", description: "Serve", completed: true }] }]);

  it("flattens valid items and preserves completion state", () => {
    expect(items).toHaveLength(2);
    expect(items[1]).toMatchObject({ sermonId: "s1", completed: true });
  });

  it("filters open, completed, and all items predictably", () => {
    expect(filterActionItems(items, "open")).toHaveLength(1);
    expect(filterActionItems(items, "completed")).toHaveLength(1);
    expect(filterActionItems(items, "all")).toHaveLength(2);
  });

  it("recovers from malformed sources and action records", () => {
    expect(flattenActionItems([null, { id: "bad", title: "Bad", actionItems: [{ id: "x", description: "", completed: false }, { id: "y", description: "ok", completed: "no" }] }])).toEqual([]);
  });
});
