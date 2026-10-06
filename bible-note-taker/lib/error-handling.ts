import { normalizeAudioSession, type AudioSession } from "./audio-session";
import type { SermonNote } from "./bible-note-store";

export function normalizeSermonNote(value: unknown, index: number): SermonNote | null {
  if (!value || typeof value !== "object") return null;
  const note = value as Partial<SermonNote>;
  if (typeof note.content !== "string" || !note.content.trim()) return null;
  return {
    id: typeof note.id === "string" ? note.id : `note-restored-${index}`,
    content: note.content.trim(),
    timestamp: typeof note.timestamp === "number" && Number.isFinite(note.timestamp) ? Math.max(0, Math.floor(note.timestamp)) : 0,
    isActionItem: note.isActionItem === true,
  };
}

export function safeAudioSession(value: unknown): AudioSession {
  return normalizeAudioSession(value);
}

export function validateRequiredText(value: string, label: string) {
  const trimmed = value.trim();
  return trimmed ? { ok: true as const, value: trimmed } : { ok: false as const, message: `${label} is required.` };
}
