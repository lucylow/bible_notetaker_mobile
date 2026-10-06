export type VoiceReadiness = "available" | "native_build" | "backend_required";

export type VoiceCommand = { action: string; confidence: number };

const COMMANDS: Array<{ phrases: string[]; action: string }> = [
  { phrases: ["open prayer", "start prayer"], action: "open_prayer" },
  { phrases: ["open bible", "read bible"], action: "open_bible" },
  { phrases: ["open profile", "go to profile"], action: "open_profile" },
  { phrases: ["start recording", "record sermon"], action: "start_recording" },
  { phrases: ["stop recording"], action: "stop_recording" },
  { phrases: ["take note", "add note"], action: "add_note" },
];

export function matchVoiceCommand(input: unknown): VoiceCommand | null {
  if (typeof input !== "string") return null;
  const normalized = input.toLowerCase().trim().replace(/\s+/g, " ");
  if (!normalized) return null;
  let best: VoiceCommand | null = null;
  for (const command of COMMANDS) {
    for (const phrase of command.phrases) {
      const words = phrase.split(" ");
      const matches = words.filter((word) => normalized.includes(word)).length;
      const confidence = matches / words.length;
      if (confidence >= 0.75 && (!best || confidence > best.confidence)) best = { action: command.action, confidence };
    }
  }
  return best;
}

export function validateSpeechInput(input: unknown) {
  if (typeof input !== "string") return { valid: false, message: "Voice input was not text." };
  const text = input.trim();
  if (!text) return { valid: false, message: "No voice input was detected." };
  if (text.length > 4000) return { valid: false, message: "Voice input is too long to save safely." };
  return { valid: true, message: null };
}

export function voiceReadinessLabel(readiness: VoiceReadiness) {
  if (readiness === "available") return "Available now";
  if (readiness === "native_build") return "Native build";
  return "Backend required";
}
