import { describe, expect, it } from "vitest";
import { advancedNoteReadinessMessage, normalizeAdvancedNote } from "../lib/advanced-note-readiness";

describe("advanced note readiness", () => {
  it("normalizes malformed note metadata without throwing", () => {
    const note = normalizeAdvancedNote({
      title: 42,
      tags: [" Faith ", "Faith", null, ""],
      verseRefs: [" John 3:16 ", 7],
      richBlocks: [{ id: "b1", type: "unknown", content: " insight " }, null],
      attachments: [{ uri: "javascript:alert(1)" }, { uri: "file:///notes/photo.jpg", fileSize: -1 }],
    });
    expect(note.title).toBe("Untitled note");
    expect(note.tags).toEqual(["Faith"]);
    expect(note.verseRefs).toEqual(["John 3:16"]);
    expect(note.richBlocks[0].type).toBe("paragraph");
    expect(note.attachments).toHaveLength(1);
    expect(note.attachmentsSkipped).toBe(1);
  });

  it("explains unsupported advanced integrations transparently", () => {
    expect(advancedNoteReadinessMessage()).toContain("remain readiness surfaces");
  });
});
