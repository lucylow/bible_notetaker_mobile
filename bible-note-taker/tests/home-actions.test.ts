import { describe, expect, it } from "vitest";
import { getOpenHomeActions } from "../lib/home-actions";

describe("home action selection", () => {
  it("returns at most the requested number of open actions", () => {
    const sources = [{ id: "s1", title: "Faith", actionItems: [{ id: "a1", description: "Pray", completed: false }, { id: "a2", description: "Serve", completed: false }] }];
    expect(getOpenHomeActions(sources, 1)).toEqual([{ id: "a1", sermonId: "s1", sermonTitle: "Faith", description: "Pray" }]);
  });

  it("skips malformed, completed, and blank actions safely", () => {
    const sources = [{ id: "s1", title: "Faith", actionItems: [{ id: "a1", description: " ", completed: false }, { id: "a2", description: "Done", completed: true }] }, null, { id: "s2", title: "Hope", actionItems: [{ id: "a3", description: "Reflect", completed: false }] }];
    expect(getOpenHomeActions(sources)).toEqual([{ id: "a3", sermonId: "s2", sermonTitle: "Hope", description: "Reflect" }]);
    expect(getOpenHomeActions("bad", 3)).toEqual([]);
  });
});
