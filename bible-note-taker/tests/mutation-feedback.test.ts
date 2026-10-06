import { describe, expect, it } from "vitest";
import { mutationFeedback } from "../lib/mutation-feedback";

describe("mutation feedback", () => {
  it("returns a success message for accepted local writes", () => {
    expect(mutationFeedback(true, "action")).toEqual({ message: "action updated locally.", tone: "success" });
  });

  it("returns a safe warning for rejected writes", () => {
    expect(mutationFeedback(false, "sermon")).toEqual({ message: "That sermon is no longer available. Your journal was not changed.", tone: "warning" });
  });
});
