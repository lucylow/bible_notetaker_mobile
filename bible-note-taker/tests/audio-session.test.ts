import { describe, expect, it } from "vitest";
import { advanceAudioSession, createAudioSession, finishAudioSession, formatAudioSummary, toggleAudioSession } from "../lib/audio-session";

describe("audio session", () => {
  it("moves between ready, recording, paused, and saved", () => {
    const ready = createAudioSession();
    const recording = toggleAudioSession(ready);
    const paused = toggleAudioSession(recording);
    const saved = finishAudioSession(paused);
    expect(recording.status).toBe("recording");
    expect(paused.status).toBe("paused");
    expect(saved.status).toBe("saved");
  });

  it("formats saved and ready summaries clearly", () => {
    expect(formatAudioSummary(createAudioSession())).toBe("Audio ready · not recorded");
    expect(formatAudioSummary({ status: "saved", durationSeconds: 125, uri: null })).toBe("Audio saved · 2:05");
  });

  it("only advances duration while recording", () => {
    const recording = toggleAudioSession(createAudioSession());
    expect(advanceAudioSession(recording).durationSeconds).toBe(1);
    expect(advanceAudioSession(createAudioSession("paused")).durationSeconds).toBe(0);
  });
});
