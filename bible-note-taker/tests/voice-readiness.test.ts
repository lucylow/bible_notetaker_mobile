import { describe, expect, it } from "vitest";
import { matchVoiceCommand, validateSpeechInput, voiceReadinessLabel } from "../lib/voice-readiness";

describe("voice readiness helpers", () => {
  it("matches only supported commands and safely rejects unknown input", () => {
    expect(matchVoiceCommand("please open prayer")?.action).toBe("open_prayer");
    expect(matchVoiceCommand("launch an unknown destination")).toBeNull();
    expect(matchVoiceCommand(null)).toBeNull();
  });

  it("validates spoken note text defensively", () => {
    expect(validateSpeechInput("  write this down  ").valid).toBe(true);
    expect(validateSpeechInput("   ").valid).toBe(false);
    expect(validateSpeechInput("x".repeat(4001)).valid).toBe(false);
  });

  it("labels voice readiness without implying availability", () => {
    expect(voiceReadinessLabel("native_build")).toBe("Native build");
    expect(voiceReadinessLabel("backend_required")).toBe("Backend required");
  });
});
