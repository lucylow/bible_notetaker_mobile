export type AudioSessionStatus = "ready" | "recording" | "paused" | "saved";

export type AudioSession = { status: AudioSessionStatus; durationSeconds: number; uri: string | null };

export function normalizeAudioSession(value: unknown): AudioSession {
  if (!value || typeof value !== "object") return createAudioSession();
  const candidate = value as Partial<AudioSession>;
  const status = candidate.status === "recording" || candidate.status === "paused" || candidate.status === "saved" ? candidate.status : "ready";
  return { status, durationSeconds: typeof candidate.durationSeconds === "number" && Number.isFinite(candidate.durationSeconds) ? Math.max(0, Math.floor(candidate.durationSeconds)) : 0, uri: typeof candidate.uri === "string" ? candidate.uri : null };
}

export function createAudioSession(status: AudioSession["status"] = "ready"): AudioSession {
  return { status, durationSeconds: 0, uri: null };
}

export function advanceAudioSession(session: AudioSession): AudioSession {
  if (session.status !== "recording") return session;
  return { ...session, durationSeconds: session.durationSeconds + 1 };
}

export function toggleAudioSession(session: AudioSession): AudioSession {
  if (session.status === "recording") return { ...session, status: "paused" };
  if (session.status === "ready" || session.status === "paused") return { ...session, status: "recording" };
  return session;
}

export function finishAudioSession(session: AudioSession): AudioSession {
  return { ...session, status: "saved" };
}

export function removeAudioFile(session: AudioSession): AudioSession {
  return { ...session, status: "ready", durationSeconds: 0, uri: null };
}

export function formatAudioProgress(session: AudioSession) {
  const minutes = String(Math.floor(session.durationSeconds / 60)).padStart(2, "0");
  const seconds = String(session.durationSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function formatAudioSummary(session: AudioSession) {
  if (session.status === "ready" && session.durationSeconds === 0) return "Audio ready · not recorded";
  const minutes = Math.floor(session.durationSeconds / 60);
  const seconds = String(session.durationSeconds % 60).padStart(2, "0");
  const duration = `${minutes}:${seconds}`;
  return `${session.status === "saved" ? "Audio saved" : "Audio ${session.status}"} · ${duration}`;
}
