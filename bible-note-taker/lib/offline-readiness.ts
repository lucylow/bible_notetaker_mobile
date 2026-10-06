export type SyncReadiness = "local_only" | "native_or_backend_required" | "ready";

export const MAX_LOCAL_BACKUP_PAYLOAD_CHARS = 500_000;

export function parseImportPayload(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "string" || !value.trim() || value.length > MAX_LOCAL_BACKUP_PAYLOAD_CHARS) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export type BackupPreview = { valid: boolean; sermonCount: number; streak: number; exportedAt: string | null };

export function previewBackupPayload(value: unknown): BackupPreview {
  const record = typeof value === "string" ? parseImportPayload(value) : value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  if (!record || !Array.isArray(record.sermons)) return { valid: false, sermonCount: 0, streak: 0, exportedAt: null };
  const streak = typeof record.streak === "number" && Number.isFinite(record.streak) && record.streak >= 0 ? Math.floor(record.streak) : 0;
  return { valid: true, sermonCount: record.sermons.length, streak, exportedAt: typeof record.exportedAt === "string" ? record.exportedAt.slice(0, 40) : null };
}

export function canConfirmRestore(preview: BackupPreview | null, draft: unknown, confirming: boolean): boolean {
  return !confirming && Boolean(preview?.valid) && typeof draft === "string" && draft.trim().length > 0;
}

export function buildLocalBackupPayload(snapshot: unknown): string | null {
  if (!snapshot || typeof snapshot !== "object") return null;
  const record = snapshot as Record<string, unknown>;
  const sermons = Array.isArray(record.sermons) ? record.sermons : [];
  const streak = typeof record.streak === "number" && Number.isFinite(record.streak) && record.streak >= 0 ? Math.floor(record.streak) : 0;
  const activeHabit = record.activeHabit === "Prayer" || record.activeHabit === "Gratitude" || record.activeHabit === "Reflection" ? record.activeHabit : null;
  try {
    const payload = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), streak, activeHabit, sermons }, null, 2);
    return payload.length <= MAX_LOCAL_BACKUP_PAYLOAD_CHARS ? payload : null;
  } catch {
    return null;
  }
}

export function formatSyncReadiness(readiness: SyncReadiness, pendingChanges = 0) {
  if (readiness === "ready") return pendingChanges > 0 ? `${pendingChanges} changes ready to sync` : "Synced";
  if (readiness === "native_or_backend_required") return "Sync requires backend setup";
  return "Stored on this device";
}

export function safeDeepLinkRoute(value: unknown) {
  if (typeof value !== "string") return "/";
  if (value === "/" || value === "/prayer-lock" || value === "/capabilities" || value === "/integrations") return value;
  if (/^\/sermon\/[a-zA-Z0-9_-]+$/.test(value)) return value;
  if (/^\/\(tabs\)\/(bible|library|profile)$/.test(value)) return value;
  return "/";
}

export type BackupDiff = { valid: boolean; added: number; removed: number; updated: number; unchanged: number };

function comparableSermon(value: unknown): { id: string; snapshot: string } | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || !record.id.trim()) return null;
  try {
    return { id: record.id.trim(), snapshot: JSON.stringify(record) };
  } catch {
    return null;
  }
}

export function diffBackupPayload(backup: unknown, currentSermons: unknown): BackupDiff {
  const record = typeof backup === "string" ? parseImportPayload(backup) : backup && typeof backup === "object" && !Array.isArray(backup) ? backup as Record<string, unknown> : null;
  if (!record || !Array.isArray(record.sermons) || !Array.isArray(currentSermons)) return { valid: false, added: 0, removed: 0, updated: 0, unchanged: 0 };
  const toMap = (items: unknown[]) => new Map(items.map(comparableSermon).filter((item): item is { id: string; snapshot: string } => item !== null).map((item) => [item.id, item.snapshot]));
  const incoming = toMap(record.sermons);
  const current = toMap(currentSermons);
  let added = 0;
  let updated = 0;
  let unchanged = 0;
  incoming.forEach((snapshot, id) => {
    if (!current.has(id)) added += 1;
    else if (current.get(id) === snapshot) unchanged += 1;
    else updated += 1;
  });
  let removed = 0;
  current.forEach((_, id) => { if (!incoming.has(id)) removed += 1; });
  return { valid: true, added, removed, updated, unchanged };
}

export type BackupChangeKind = "added" | "updated" | "removed";
export type BackupChange = { id: string; kind: BackupChangeKind; title: string; speaker: string; date: string; noteCount: number };

function sermonReview(value: unknown, fallbackId: string): Pick<BackupChange, "title" | "speaker" | "date" | "noteCount"> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { title: fallbackId, speaker: "Speaker unavailable", date: "Date unavailable", noteCount: 0 };
  const record = value as Record<string, unknown>;
  const text = (candidate: unknown, fallback: string, max: number) => typeof candidate === "string" && candidate.trim() ? candidate.trim().slice(0, max) : fallback;
  const notes = Array.isArray(record.notes) ? record.notes.length : 0;
  return {
    title: text(record.title, fallbackId, 100),
    speaker: text(record.speaker, "Speaker unavailable", 80),
    date: text(record.date, "Date unavailable", 40),
    noteCount: Math.max(0, Math.min(999, notes)),
  };
}
export type BackupChangeList = { valid: boolean; changes: BackupChange[]; truncated: boolean };

export function listBackupChanges(backup: unknown, currentSermons: unknown, limit = 5): BackupChangeList {
  const record = typeof backup === "string" ? parseImportPayload(backup) : backup && typeof backup === "object" && !Array.isArray(backup) ? backup as Record<string, unknown> : null;
  if (!record || !Array.isArray(record.sermons) || !Array.isArray(currentSermons) || !Number.isFinite(limit) || limit < 1) return { valid: false, changes: [], truncated: false };
  const toMap = (items: unknown[]) => new Map(items.map(comparableSermon).filter((item): item is { id: string; snapshot: string } => item !== null).map((item) => [item.id, item.snapshot]));
  const incoming = toMap(record.sermons);
  const current = toMap(currentSermons);
  const incomingRecords = new Map(record.sermons.map((item) => { const comparable = comparableSermon(item); return comparable ? [comparable.id, item] as const : null; }).filter((item): item is readonly [string, unknown] => item !== null));
  const currentRecords = new Map(currentSermons.map((item) => { const comparable = comparableSermon(item); return comparable ? [comparable.id, item] as const : null; }).filter((item): item is readonly [string, unknown] => item !== null));
  const allChanges: BackupChange[] = [];
  incoming.forEach((snapshot, id) => {
    const details = sermonReview(incomingRecords.get(id), id);
    if (!current.has(id)) allChanges.push({ id, kind: "added", ...details });
    else if (current.get(id) !== snapshot) allChanges.push({ id, kind: "updated", ...details });
  });
  current.forEach((_, id) => { if (!incoming.has(id)) allChanges.push({ id, kind: "removed", ...sermonReview(currentRecords.get(id), id) }); });
  const boundedLimit = Math.floor(limit);
  return { valid: true, changes: allChanges.slice(0, boundedLimit), truncated: allChanges.length > boundedLimit };
}

export function formatBackupChange(change: unknown): string | null {
  if (!change || typeof change !== "object" || Array.isArray(change)) return null;
  const record = change as Record<string, unknown>;
  if (typeof record.id !== "string" || !record.id.trim()) return null;
  const title = typeof record.title === "string" && record.title.trim() ? record.title.trim().slice(0, 100) : record.id.trim();
  if (record.kind === "added") return `Add sermon ${title}`;
  if (record.kind === "updated") return `Update sermon ${title}`;
  if (record.kind === "removed") return `Remove sermon ${title}`;
  return null;
}
