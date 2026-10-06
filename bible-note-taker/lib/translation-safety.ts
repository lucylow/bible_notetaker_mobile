import { normalizeLanguage, type SupportedLanguage } from "./language";

export type SafeTranslationModel = {
  id: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  version: string;
  size: number;
  downloaded: boolean;
  downloadUrl: string;
  checksum: string;
  downloadedAt?: number;
};

export type SafeTranslationUnit = {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  context?: string;
  domain: "sermon" | "prayer" | "bible" | "general";
  quality: number;
  usageCount: number;
  lastUsed: number;
  created: number;
};

export type SafeLanguageDetection = {
  language: SupportedLanguage;
  confidence: number;
  alternatives: Array<{ language: SupportedLanguage; confidence: number }>;
  script: "latin" | "cyrillic" | "arabic" | "devanagari" | "cjk" | "other";
};

const SCRIPTS = ["latin", "cyrillic", "arabic", "devanagari", "cjk", "other"] as const;
const DOMAINS = ["sermon", "prayer", "bible", "general"] as const;

function safeText(value: unknown, maxLength = 5000): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text ? text.slice(0, maxLength) : null;
}

function finiteNonNegative(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function clamp01(value: unknown, fallback = 0): number {
  const number = finiteNonNegative(value, fallback);
  return Math.min(1, number);
}

export function normalizeTranslationModel(value: unknown): SafeTranslationModel | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const model = value as Record<string, unknown>;
  const id = safeText(model.id, 120);
  const version = safeText(model.version, 80);
  const downloadUrl = safeText(model.downloadUrl, 2000);
  const checksum = safeText(model.checksum, 200);
  const sourceLanguage = normalizeLanguage(model.sourceLanguage);
  const targetLanguage = normalizeLanguage(model.targetLanguage);
  if (!id || !version || !downloadUrl || !checksum || sourceLanguage === targetLanguage) return null;
  if (typeof model.downloaded !== "boolean") return null;
  const downloadedAt = model.downloadedAt === undefined ? undefined : finiteNonNegative(model.downloadedAt, -1);
  if (downloadedAt === -1) return null;
  return {
    id,
    sourceLanguage,
    targetLanguage,
    version,
    size: finiteNonNegative(model.size),
    downloaded: model.downloaded,
    downloadUrl,
    checksum,
    ...(downloadedAt === undefined ? {} : { downloadedAt: Math.floor(downloadedAt) }),
  };
}

export function normalizeTranslationUnit(value: unknown, index = 0): SafeTranslationUnit | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const unit = value as Record<string, unknown>;
  const sourceText = safeText(unit.sourceText);
  const targetText = safeText(unit.targetText);
  const sourceLanguage = normalizeLanguage(unit.sourceLanguage);
  const targetLanguage = normalizeLanguage(unit.targetLanguage);
  if (!sourceText || !targetText || sourceLanguage === targetLanguage) return null;
  const rawDomain = safeText(unit.domain, 20);
  const domain = DOMAINS.includes(rawDomain as (typeof DOMAINS)[number]) ? rawDomain as SafeTranslationUnit["domain"] : "general";
  const context = safeText(unit.context, 500);
  return {
    id: safeText(unit.id, 120) ?? `translation-unit-recovered-${index}`,
    sourceText,
    targetText,
    sourceLanguage,
    targetLanguage,
    ...(context ? { context } : {}),
    domain,
    quality: clamp01(unit.quality),
    usageCount: Math.floor(finiteNonNegative(unit.usageCount)),
    lastUsed: Math.floor(finiteNonNegative(unit.lastUsed)),
    created: Math.floor(finiteNonNegative(unit.created)),
  };
}

export function normalizeLanguageDetection(value: unknown): SafeLanguageDetection | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const result = value as Record<string, unknown>;
  const rawScript = safeText(result.script, 20);
  const script = SCRIPTS.includes(rawScript as (typeof SCRIPTS)[number]) ? rawScript as SafeLanguageDetection["script"] : "other";
  const alternatives = Array.isArray(result.alternatives)
    ? result.alternatives.reduce<SafeLanguageDetection["alternatives"]>((items, item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return items;
        const candidate = item as Record<string, unknown>;
        const language = normalizeLanguage(candidate.language);
        if (candidate.language !== language) return items;
        items.push({ language, confidence: clamp01(candidate.confidence) });
        return items;
      }, [])
    : [];
  return {
    language: normalizeLanguage(result.language),
    confidence: clamp01(result.confidence),
    alternatives,
    script,
  };
}

export function translationCacheKey(sourceText: unknown, sourceLanguage: unknown, targetLanguage: unknown): string | null {
  const text = safeText(sourceText, 5000);
  const source = normalizeLanguage(sourceLanguage);
  const target = normalizeLanguage(targetLanguage);
  if (!text || source === target) return null;
  return `${source}:${target}:${text.toLocaleLowerCase()}`;
}
