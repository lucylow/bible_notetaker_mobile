import { describe, expect, it } from "vitest";
import { fallbackFeedbackMessage, sanitizeFeedbackMessage } from "../lib/feedback-safety";

describe("feedback safety", () => {
  it("trims usable messages", () => {
    expect(sanitizeFeedbackMessage("  Saved locally. ")).toBe("Saved locally.");
  });

  it("falls back for blank or non-string messages", () => {
    expect(sanitizeFeedbackMessage("  ")).toBe("Action completed.");
    expect(sanitizeFeedbackMessage(null, "Try again safely.")).toBe("Try again safely.");
  });

  it("uses non-misleading fallback copy for each feedback tone", () => {
    expect(fallbackFeedbackMessage("error")).toBe("Something went wrong. Please try again.");
    expect(fallbackFeedbackMessage("warning")).toBe("Please try again.");
    expect(fallbackFeedbackMessage("success")).toBe("Action completed.");
  });
});
