import { describe, expect, it } from "vitest";
import { formatAudioStorageSummary, getFocusedTimestamp } from "../lib/audio-review";

describe("audio review", () => {
  it("keeps timestamp focus non-negative", () => {
    expect(getFocusedTimestamp(742)).toBe(742);
    expect(getFocusedTimestamp(-4)).toBe(0);
  });

  it("describes local storage state clearly", () => {
    expect(formatAudioStorageSummary({ status: "ready", durationSeconds: 0, uri: null })).toBe("No audio file stored on this device");
    expect(formatAudioStorageSummary({ status: "saved", durationSeconds: 12, uri: "file:///recording.m4a" })).toBe("Local audio file · 12s");
  });
});
