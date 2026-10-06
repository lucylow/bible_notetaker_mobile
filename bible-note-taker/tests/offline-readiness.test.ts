import { describe, expect, it } from "vitest";
import { buildLocalBackupPayload, canConfirmRestore, diffBackupPayload, formatSyncReadiness, listBackupChanges, MAX_LOCAL_BACKUP_PAYLOAD_CHARS, parseImportPayload, previewBackupPayload, safeDeepLinkRoute } from "../lib/offline-readiness";

describe("offline readiness helpers", () => {
  it("accepts object import payloads and rejects malformed values", () => {
    expect(parseImportPayload('{"sermons":[]}')).toEqual({ sermons: [] });
    expect(parseImportPayload("not-json")).toBeNull();
    expect(parseImportPayload("[]")).toBeNull();
    expect(parseImportPayload(`{"sermons":[]}${" ".repeat(MAX_LOCAL_BACKUP_PAYLOAD_CHARS)}`)).toBeNull();
  });

  it("formats local and backend sync boundaries", () => {
    expect(formatSyncReadiness("local_only")).toBe("Stored on this device");
    expect(formatSyncReadiness("native_or_backend_required")).toBe("Sync requires backend setup");
    expect(formatSyncReadiness("ready", 2)).toBe("2 changes ready to sync");
  });

  it("falls back safely for unsupported deep links", () => {
    expect(safeDeepLinkRoute("/sermon/abc-123")).toBe("/sermon/abc-123");
    expect(safeDeepLinkRoute("/unknown-destination")).toBe("/");
    expect(safeDeepLinkRoute(null)).toBe("/");
  });

  it("builds a local backup with a safe streak fallback", () => {
    const payload = buildLocalBackupPayload({ sermons: [{ id: "s1" }], streak: -4.8 });
    expect(payload).not.toBeNull();
    expect(JSON.parse(payload as string)).toMatchObject({ version: 1, streak: 0, activeHabit: null, sermons: [{ id: "s1" }] });
    expect(JSON.parse(buildLocalBackupPayload({ sermons: [], streak: 2, activeHabit: "Prayer" }) as string)).toMatchObject({ activeHabit: "Prayer" });
    expect(JSON.parse(buildLocalBackupPayload({ sermons: [], streak: 2, activeHabit: "Unknown" }) as string)).toMatchObject({ activeHabit: null });
    expect(buildLocalBackupPayload(null)).toBeNull();
    expect(buildLocalBackupPayload({ sermons: [{ id: "large", notes: [{ content: "x".repeat(MAX_LOCAL_BACKUP_PAYLOAD_CHARS) }] }] })).toBeNull();
  });

  it("classifies restore changes without trusting malformed records", () => {
    expect(diffBackupPayload({ sermons: [{ id: "s1", title: "updated" }, { id: "s3" }, null] }, [{ id: "s1", title: "old" }, { id: "s2" }])).toEqual({ valid: true, added: 1, updated: 1, removed: 1, unchanged: 0 });
    expect(diffBackupPayload("bad", [{ id: "s1" }])).toEqual({ valid: false, added: 0, updated: 0, removed: 0, unchanged: 0 });
  });

  it("lists bounded per-sermon restore changes and recovers from malformed inputs", () => {
    expect(listBackupChanges({ sermons: [{ id: "s1", title: "new" }, { id: "s3" }, null] }, [{ id: "s1", title: "old" }, { id: "s2" }], 2)).toEqual({ valid: true, changes: [{ id: "s1", kind: "updated", title: "new", speaker: "Speaker unavailable", date: "Date unavailable", noteCount: 0 }, { id: "s3", kind: "added", title: "s3", speaker: "Speaker unavailable", date: "Date unavailable", noteCount: 0 }], truncated: true });
    expect(listBackupChanges({ sermons: [{ id: "s4", title: "Mercy", speaker: "Alex", date: "2026-08-20", notes: [{ id: "n1" }, { id: "n2" }] }] }, [], 5).changes[0]).toEqual({ id: "s4", kind: "added", title: "Mercy", speaker: "Alex", date: "2026-08-20", noteCount: 2 });
    expect(listBackupChanges("bad", [{ id: "s1" }])).toEqual({ valid: false, changes: [], truncated: false });
  });

  it("only permits confirmation for a valid, non-empty, idle review", () => {
    const valid = { valid: true, sermonCount: 1, streak: 2, exportedAt: null };
    expect(canConfirmRestore(valid, '{"sermons":[]}', false)).toBe(true);
    expect(canConfirmRestore(valid, " ", false)).toBe(false);
    expect(canConfirmRestore({ ...valid, valid: false }, '{"sermons":[]}', false)).toBe(false);
    expect(canConfirmRestore(valid, '{"sermons":[]}', true)).toBe(false);
  });

  it("previews valid backups without mutating them", () => {
    expect(previewBackupPayload('{"sermons":[{"id":"s1"}],"streak":3,"exportedAt":"2026-08-22T00:00:00Z"}')).toEqual({ valid: true, sermonCount: 1, streak: 3, exportedAt: "2026-08-22T00:00:00Z" });
    expect(previewBackupPayload("bad").valid).toBe(false);
  });
});
