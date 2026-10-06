import { describe, expect, it } from "vitest";
import { normalizeLanguageDetection, normalizeTranslationModel, normalizeTranslationUnit, translationCacheKey } from "../lib/translation-safety";

describe("translation safety", () => {
  it("rejects unusable offline models and normalizes valid metadata", () => {
    expect(normalizeTranslationModel({ id: "m1", sourceLanguage: "en", targetLanguage: "es", version: "1", size: -4, downloaded: false, downloadUrl: "https://example.test/model", checksum: "abc" })).toMatchObject({ id: "m1", sourceLanguage: "en", targetLanguage: "es", size: 0, downloaded: false });
    expect(normalizeTranslationModel({ id: "m2", sourceLanguage: "en", targetLanguage: "en", version: "1", downloaded: false, downloadUrl: "x", checksum: "y" })).toBeNull();
    expect(normalizeTranslationModel({ id: "m3", sourceLanguage: "en", targetLanguage: "es", version: "1", downloaded: "yes", downloadUrl: "x", checksum: "y" })).toBeNull();
  });

  it("repairs translation memory units without allowing same-language entries", () => {
    expect(normalizeTranslationUnit({ sourceText: "  Pray  ", targetText: " Ora ", sourceLanguage: "en", targetLanguage: "pt", quality: 3, usageCount: -2, domain: "invalid" }, 2)).toEqual({ id: "translation-unit-recovered-2", sourceText: "Pray", targetText: "Ora", sourceLanguage: "en", targetLanguage: "pt", domain: "general", quality: 1, usageCount: 0, lastUsed: 0, created: 0 });
    expect(normalizeTranslationUnit({ sourceText: "same", targetText: "same", sourceLanguage: "en", targetLanguage: "en" })).toBeNull();
  });

  it("normalizes detection confidence and drops malformed alternatives", () => {
    expect(normalizeLanguageDetection({ language: "es", confidence: 4, script: "latin", alternatives: [{ language: "fr", confidence: -1 }, { language: "xx", confidence: 0.5 }, null] })).toEqual({ language: "es", confidence: 1, script: "latin", alternatives: [{ language: "fr", confidence: 0 }] });
  });

  it("creates cache keys only for non-empty cross-language requests", () => {
    expect(translationCacheKey(" Pray ", "en", "es")).toBe("en:es:pray");
    expect(translationCacheKey(" ", "en", "es")).toBeNull();
    expect(translationCacheKey("same", "en", "en")).toBeNull();
  });
});
