type LocalSermon = { notes?: Array<{ content?: unknown }> };

export type BibleReference = { reference: string; text: string; source: "local" | "sample" };

export function normalizeBibleQuery(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, 120) : "";
}

const SAMPLE_REFERENCES: BibleReference[] = [
  { reference: "Psalm 46:10", text: "Be still, and know that I am God.", source: "sample" },
  { reference: "James 2:17", text: "Faith by itself, if it does not have works, is dead.", source: "sample" },
  { reference: "Matthew 6:33", text: "Seek first the kingdom of God and his righteousness.", source: "sample" },
];

const REFERENCE_PATTERN = /\b(?:[1-3]\s*)?[A-Za-z]+\s+\d{1,3}(?::\d{1,3}(?:[-–]\d{1,3})?)?\b/g;

export function getBibleReferences(sermons: readonly LocalSermon[] | unknown): BibleReference[] {
  const found = new Map<string, BibleReference>();
  const safeSermons = Array.isArray(sermons) ? sermons : [];
  safeSermons.forEach((rawSermon) => {
    if (!rawSermon || typeof rawSermon !== "object" || Array.isArray(rawSermon)) return;
    const candidateNotes = (rawSermon as LocalSermon).notes;
    const notes: Array<{ content?: unknown }> = Array.isArray(candidateNotes) ? candidateNotes : [];
    notes.forEach((rawNote) => {
      if (!rawNote || typeof rawNote !== "object" || Array.isArray(rawNote) || typeof rawNote.content !== "string") return;
      rawNote.content.match(REFERENCE_PATTERN)?.forEach((reference) => {
        const normalized = reference.replace(/\s+/g, " ").trim();
        if (!found.has(normalized)) found.set(normalized, { reference: normalized, text: "Saved from your local sermon notes.", source: "local" });
      });
    });
  });
  return found.size > 0 ? [...found.values()] : SAMPLE_REFERENCES;
}
