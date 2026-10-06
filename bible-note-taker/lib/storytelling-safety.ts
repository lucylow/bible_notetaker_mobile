export type SafeBibleStory = {
  id: string;
  title: string;
  summary: string;
  reference: string;
  themes: string[];
  questions: string[];
  blocks: string[];
  durationMinutes: number;
  hasAudio: false;
  hasVideo: false;
};

export type SafeStoryProgress = {
  storyId: string;
  status: "not_started" | "in_progress" | "completed";
  currentBlockIndex: number;
  timeSpentSeconds: number;
};

const STATUSES = ["not_started", "in_progress", "completed"] as const;

function safeText(value: unknown, fallback: string, max: number): string {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}

function safeList(value: unknown, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim().slice(0, maxLength)))).slice(0, maxItems);
}

export function normalizeBibleStory(value: unknown, index = 0): SafeBibleStory | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const title = safeText(source.title, "", 120);
  if (!title) return null;
  const rawDuration = typeof source.duration === "number" && Number.isFinite(source.duration) ? source.duration : 0;
  return {
    id: safeText(source.id, `story-recovered-${index}`, 100),
    title,
    summary: safeText(source.summary, "A Bible story ready for reflection.", 500),
    reference: safeText(source.reference, "Reference unavailable", 120),
    themes: safeList(source.themes, 8, 60),
    questions: safeList(source.questions, 6, 240),
    blocks: safeList(source.blocks, 8, 600),
    durationMinutes: Math.max(0, Math.min(180, Math.floor(rawDuration))),
    hasAudio: false,
    hasVideo: false,
  };
}

export function normalizeStoryProgress(value: unknown): SafeStoryProgress | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const storyId = safeText(source.storyId, "", 100);
  if (!storyId) return null;
  const status = STATUSES.includes(source.status as (typeof STATUSES)[number]) ? source.status as SafeStoryProgress["status"] : "not_started";
  const block = typeof source.currentBlockIndex === "number" && Number.isFinite(source.currentBlockIndex) ? source.currentBlockIndex : 0;
  const rawTime = source.timeSpentSeconds ?? source.timeSpent;
  const time = typeof rawTime === "number" && Number.isFinite(rawTime) ? rawTime : 0;
  return {
    storyId,
    status,
    currentBlockIndex: Math.max(0, Math.floor(block)),
    timeSpentSeconds: Math.max(0, Math.floor(time)),
  };
}

export function advanceStoryProgress(story: SafeBibleStory, previous: SafeStoryProgress | null): SafeStoryProgress {
  const previousIndex = previous?.status === "completed" ? -1 : (previous?.currentBlockIndex ?? -1);
  const lastIndex = Math.max(0, story.blocks.length - 1);
  const nextIndex = Math.min(previousIndex + 1, lastIndex);
  return {
    storyId: story.id,
    status: nextIndex >= lastIndex ? "completed" : "in_progress",
    currentBlockIndex: nextIndex,
    timeSpentSeconds: Math.max(30, (nextIndex + 1) * Math.max(1, story.durationMinutes) * 20),
  };
}

export function moveStoryProgress(story: SafeBibleStory, previous: SafeStoryProgress | null, direction: "previous" | "next"): SafeStoryProgress {
  const lastIndex = Math.max(0, story.blocks.length - 1);
  const currentIndex = previous?.status === "completed" ? lastIndex : Math.max(0, previous?.currentBlockIndex ?? 0);
  const nextIndex = direction === "previous" ? Math.max(0, currentIndex - 1) : Math.min(lastIndex, currentIndex + 1);
  return {
    storyId: story.id,
    status: nextIndex >= lastIndex ? "completed" : "in_progress",
    currentBlockIndex: nextIndex,
    timeSpentSeconds: Math.max(30, (nextIndex + 1) * Math.max(1, story.durationMinutes) * 20),
  };
}

export function storyProgressPercent(story: SafeBibleStory, progress: SafeStoryProgress | null): number {
  if (progress?.status === "completed") return 100;
  const blockCount = story.blocks.length;
  if (blockCount === 0 || !progress || progress.currentBlockIndex < 0) return 0;
  const index = Math.min(blockCount - 1, Math.max(0, Math.floor(progress.currentBlockIndex)));
  return Math.min(100, Math.max(0, Math.round(((index + 1) / blockCount) * 100)));
}

export function storytellingReadinessLabel(): string {
  return "Story library is planned; cloud stories, AI generation, audio, video, and sharing are not active in the local-first MVP.";
}

export function normalizeBibleStories(value: unknown, limit = 50): SafeBibleStory[] {
  if (!Array.isArray(value)) return [];
  const boundedLimit = Number.isFinite(limit) ? Math.max(0, Math.min(100, Math.floor(limit))) : 50;
  const seen = new Set<string>();
  const stories: SafeBibleStory[] = [];
  value.forEach((candidate, index) => {
    if (stories.length >= boundedLimit) return;
    const story = normalizeBibleStory(candidate, index);
    if (!story || seen.has(story.id)) return;
    seen.add(story.id);
    stories.push(story);
  });
  return stories;
}
