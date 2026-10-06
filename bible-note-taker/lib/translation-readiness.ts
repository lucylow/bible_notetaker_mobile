export type TranslationBundle = { language: string; translations: Record<string, string>; version: string; lastUpdated: string };

export function parseTranslationBundle(value: unknown): TranslationBundle | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const bundle = parsed as Partial<TranslationBundle>;
    if (typeof bundle.language !== "string" || typeof bundle.version !== "string" || typeof bundle.lastUpdated !== "string") return null;
    if (!bundle.translations || typeof bundle.translations !== "object" || Array.isArray(bundle.translations)) return null;
    const translations = Object.fromEntries(Object.entries(bundle.translations).filter(([, text]) => typeof text === "string"));
    return { language: bundle.language, version: bundle.version, lastUpdated: bundle.lastUpdated, translations };
  } catch {
    return null;
  }
}

export function translationFallback(requestedLanguage: unknown, availableLanguages: readonly string[], fallback = "en") {
  if (typeof requestedLanguage === "string" && availableLanguages.includes(requestedLanguage)) return requestedLanguage;
  return availableLanguages.includes(fallback) ? fallback : availableLanguages[0] ?? fallback;
}

export function translationReadinessLabel(kind: "cached" | "backend_required" | "unavailable") {
  if (kind === "cached") return "Cached locally";
  if (kind === "backend_required") return "Backend required";
  return "Unavailable safely";
}
