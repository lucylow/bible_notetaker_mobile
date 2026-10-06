import { describe, expect, it } from "vitest";
import { formatAudioProgress, removeAudioFile } from "../lib/audio-session";

describe("audio polish", () => {
  it("formats compact capture progress", () => {
    expect(formatAudioProgress({ status: "recording", durationSeconds: 5, uri: null })).toBe("00:05");
    expect(formatAudioProgress({ status: "saved", durationSeconds: 125, uri: "file:///a.m4a" })).toBe("02:05");
  });

  it("clears local audio safely", () => {
    expect(removeAudioFile({ status: "saved", durationSeconds: 42, uri: "file:///a.m4a" })).toEqual({ status: "ready", durationSeconds: 0, uri: null });
  });
});
