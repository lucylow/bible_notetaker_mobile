import { describe, expect, it } from "vitest";
import { languageLabel, loadLanguagePreference, normalizeLanguage, saveLanguagePreference } from "../lib/language";
import { featureReadiness, getReadinessLabel } from "../lib/feature-readiness";

describe("language and capability readiness", () => {
  it("falls back safely to English", () => {
    expect(normalizeLanguage("es")).toBe("es");
    expect(normalizeLanguage("xx")).toBe("en");
    expect(normalizeLanguage(" ES ")).toBe("es");
    expect(normalizeLanguage("FR")).toBe("fr");
    expect(languageLabel("fr")).toBe("Français");
  });

  it("keeps advanced audio and translation behind explicit gates", () => {
    expect(getReadinessLabel(featureReadiness.find((feature) => feature.key === "audio_playback")!.readiness)).toBe("Native build");
    expect(getReadinessLabel(featureReadiness.find((feature) => feature.key === "transcription_translation")!.readiness)).toBe("Backend setup");
  });

  it("rejects silently unretained language writes", async () => {
    const silentStorage = { getItem: async () => null, setItem: async () => undefined };
    await expect(saveLanguagePreference("es", silentStorage)).rejects.toThrow("not retained");
  });

  it("recovers from malformed and unavailable language storage", async () => {
    const failingStorage = { getItem: async () => "xx", setItem: async () => { throw new Error("offline"); } };
    expect(await loadLanguagePreference(failingStorage)).toBe("en");
    await expect(saveLanguagePreference("es", failingStorage)).rejects.toThrow("offline");
  });
});
