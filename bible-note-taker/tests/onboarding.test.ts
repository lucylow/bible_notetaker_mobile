import { describe, expect, it } from "vitest";
import { loadOnboardingComplete, ONBOARDING_KEY, saveOnboardingComplete } from "../lib/onboarding";

describe("onboarding persistence", () => {
  it("loads only the explicit completion marker", async () => {
    const storage = { getItem: async (key: string) => key === ONBOARDING_KEY ? "1" : null, setItem: async () => undefined };
    expect(await loadOnboardingComplete(storage)).toBe(true);
  });

  it("rejects unexpected completion markers", async () => {
    const storage = { getItem: async () => "true", setItem: async () => undefined };
    expect(await loadOnboardingComplete(storage)).toBe(false);
  });

  it("returns false when a write does not persist the marker", async () => {
    const storage = { getItem: async () => null, setItem: async () => undefined };
    expect(await saveOnboardingComplete(storage)).toBe(false);
  });

  it("falls back safely when storage reads or writes fail", async () => {
    const storage = { getItem: async () => { throw new Error("read failed"); }, setItem: async () => { throw new Error("write failed"); } };
    expect(await loadOnboardingComplete(storage)).toBe(false);
    expect(await saveOnboardingComplete(storage)).toBe(false);
  });

  it("persists completion with the stable marker", async () => {
    let written: [string, string] | null = null;
    const storage = { getItem: async () => written?.[1] ?? null, setItem: async (key: string, value: string) => { written = [key, value]; } };
    expect(await saveOnboardingComplete(storage)).toBe(true);
    expect(written).toEqual([ONBOARDING_KEY, "1"]);
  });
});
