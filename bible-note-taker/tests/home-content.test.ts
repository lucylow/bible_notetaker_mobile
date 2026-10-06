import { describe, expect, it } from "vitest";
import { getHomeGreeting, getJournalSummary, getReflectionPrompt } from "../lib/home-content";

describe("home content helpers", () => {
  it("uses a safe greeting for each part of the day", () => {
    expect(getHomeGreeting(8)).toBe("Good morning.");
    expect(getHomeGreeting(14)).toBe("Good afternoon.");
    expect(getHomeGreeting(20)).toBe("Good evening.");
    expect(getHomeGreeting(Number.NaN)).toBe("Welcome back.");
  });

  it("prioritizes an open action, then journal and prayer context", () => {
    expect(getReflectionPrompt(2, 0, 0).title).toContain("faithful step");
    expect(getReflectionPrompt(0, 0, 0).title).toContain("what you heard");
    expect(getReflectionPrompt(0, 1, 3).title).toContain("making room");
  });

  it("normalizes invalid summary counts instead of exposing malformed values", () => {
    expect(getJournalSummary(2.9, Number.NaN, -4)).toBe("2 sermons · 0 notes · 0 actions");
  });
});
