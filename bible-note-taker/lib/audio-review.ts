import type { AudioSession } from "@/lib/audio-session";

export function getFocusedTimestamp(timestamp: number) {
  return Math.max(0, timestamp);
}

export function formatAudioStorageSummary(session: AudioSession) {
  if (!session.uri) return "No audio file stored on this device";
  return `${session.uri.startsWith("file:") ? "Local audio file" : "Audio reference"} · ${session.durationSeconds}s`;
}
