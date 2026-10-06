export type SafeRichBlock = {
  id: string;
  type: "paragraph" | "heading" | "list" | "quote" | "code" | "divider";
  content: string;
  style: Record<string, unknown>;
};

export type SafeNoteAttachment = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uri: string;
};

export type NormalizedAdvancedNote = {
  title: string;
  content: string;
  tags: string[];
  verseRefs: string[];
  richBlocks: SafeRichBlock[];
  attachments: SafeNoteAttachment[];
  attachmentsSkipped: number;
};

const BLOCK_TYPES = new Set<SafeRichBlock["type"]>(["paragraph", "heading", "list", "quote", "code", "divider"]);

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim().slice(0, 4000) : fallback;
}

export function normalizeAdvancedNote(value: unknown): NormalizedAdvancedNote {
  const record = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const tags = Array.isArray(record.tags)
    ? [...new Set(record.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim())).map((tag) => tag.trim().slice(0, 60)))].slice(0, 50)
    : [];
  const verseRefs = Array.isArray(record.verseRefs)
    ? [...new Set(record.verseRefs.filter((ref): ref is string => typeof ref === "string" && Boolean(ref.trim())).map((ref) => ref.trim().slice(0, 120)))].slice(0, 50)
    : [];
  const richBlocks = Array.isArray(record.richBlocks)
    ? record.richBlocks.flatMap((candidate, index) => {
        if (!candidate || typeof candidate !== "object") return [];
        const block = candidate as Record<string, unknown>;
        const type = BLOCK_TYPES.has(block.type as SafeRichBlock["type"]) ? block.type as SafeRichBlock["type"] : "paragraph";
        return [{ id: text(block.id, `block-${index}`), type, content: text(block.content), style: block.style && typeof block.style === "object" ? block.style as Record<string, unknown> : {} }];
      }).slice(0, 200)
    : [];
  const rawAttachments = Array.isArray(record.attachments) ? record.attachments : [];
  const attachments = rawAttachments.flatMap((candidate, index) => {
    if (!candidate || typeof candidate !== "object") return [];
    const attachment = candidate as Record<string, unknown>;
    const uri = text(attachment.uri);
    if (!uri || !/^((file|content|ph|https?):\/\/)/i.test(uri)) return [];
    return [{ id: text(attachment.id, `attachment-${index}`), fileName: text(attachment.fileName, "Attachment"), fileType: text(attachment.fileType, "application/octet-stream"), fileSize: typeof attachment.fileSize === "number" && Number.isFinite(attachment.fileSize) && attachment.fileSize >= 0 ? attachment.fileSize : 0, uri }];
  }).slice(0, 20);
  return { title: text(record.title, "Untitled note"), content: text(record.content), tags, verseRefs, richBlocks, attachments, attachmentsSkipped: rawAttachments.length - attachments.length };
}

export function advancedNoteReadinessMessage(): string {
  return "Rich formatting, attachments, templates, links, comments, and AI enhancement remain readiness surfaces until native file access, privacy controls, and backend contracts are configured.";
}
