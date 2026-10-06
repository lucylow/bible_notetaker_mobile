import { describe, expect, it } from "vitest";
import { parseTranslationBundle, translationFallback, translationReadinessLabel } from "../lib/translation-readiness";

describe("translation readiness helpers", () => {
  it("accepts valid bundles and filters invalid translation values", () => {
    expect(parseTranslationBundle(JSON.stringify({ language: "es", version: "1", lastUpdated: "today", translations: { hello: "Hola", bad: 4 } }))).toEqual({ language: "es", version: "1", lastUpdated: "today", translations: { hello: "Hola" } });
    expect(parseTranslationBundle("broken")).toBeNull();
  });

  it("falls back to English or the first available language", () => {
    expect(translationFallback("fr", ["en", "fr"])).toBe("fr");
    expect(translationFallback("xx", ["en", "es"])).toBe("en");
    expect(translationFallback("xx", ["es"], "en")).toBe("es");
  });

  it("labels translation availability honestly", () => {
    expect(translationReadinessLabel("cached")).toBe("Cached locally");
    expect(translationReadinessLabel("backend_required")).toBe("Backend required");
    expect(translationReadinessLabel("unavailable")).toBe("Unavailable safely");
  });
});
