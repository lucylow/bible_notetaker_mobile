import AsyncStorage from "@react-native-async-storage/async-storage";

export const LANGUAGE_STORAGE_KEY = "bible-note-language";
export const SUPPORTED_LANGUAGES = ["en", "es", "fr", "pt", "de"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function normalizeLanguage(value: unknown): SupportedLanguage {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(normalized) ? normalized as SupportedLanguage : "en";
}

export function languageLabel(language: SupportedLanguage) {
  return { en: "English", es: "Español", fr: "Français", pt: "Português", de: "Deutsch" }[language];
}

type LanguageStorage = Pick<typeof AsyncStorage, "getItem" | "setItem">;

export async function loadLanguagePreference(storage: LanguageStorage = AsyncStorage): Promise<SupportedLanguage> {
  try {
    return normalizeLanguage(await storage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return "en";
  }
}

export async function saveLanguagePreference(value: unknown, storage: LanguageStorage = AsyncStorage): Promise<SupportedLanguage> {
  const language = normalizeLanguage(value);
  await storage.setItem(LANGUAGE_STORAGE_KEY, language);
  const confirmed = await storage.getItem(LANGUAGE_STORAGE_KEY);
  if (normalizeLanguage(confirmed) !== language || confirmed !== language) throw new Error("Language preference was not retained on this device.");
  return language;
}
