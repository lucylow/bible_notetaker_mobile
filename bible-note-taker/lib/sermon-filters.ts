import type { Sermon, SermonNote } from "@/lib/bible-note-store";

export type NoteFilter = "all" | "insights" | "actions";
export type SermonSort = "recent" | "oldest";
export type ArchiveScope = "active" | "archived" | "all";

export function filterSermons(sermons: Sermon[], query: string, tag: string | null, series: string | null) {
  const normalized = typeof query === "string" ? query.trim().toLowerCase() : "";
  return (Array.isArray(sermons) ? sermons : []).filter((sermon) => {
    if (!sermon || typeof sermon !== "object") return false;
    const title = typeof sermon.title === "string" ? sermon.title : "";
    const speaker = typeof sermon.speaker === "string" ? sermon.speaker : "";
    const sermonSeries = typeof sermon.series === "string" ? sermon.series : "";
    const matchesText = !normalized || `${title} ${speaker} ${sermonSeries}`.toLowerCase().includes(normalized);
    const matchesTag = !tag || (Array.isArray(sermon.tags) && sermon.tags.includes(tag));
    const matchesSeries = !series || sermon.series === series;
    return matchesText && matchesTag && matchesSeries;
  });
}

export function filterByArchive(sermons: Sermon[], scope: ArchiveScope) {
  const safeSermons = Array.isArray(sermons) ? sermons : [];
  if (scope === "archived") return safeSermons.filter((sermon) => sermon?.archived === true);
  if (scope === "active") return safeSermons.filter((sermon) => sermon?.archived !== true);
  return safeSermons;
}

export function collectMonths(sermons: Sermon[]) {
  return Array.from(new Set((Array.isArray(sermons) ? sermons : []).map((sermon) => typeof sermon?.date === "string" ? sermon.date.slice(0, 7) : "").filter(Boolean))).sort().reverse();
}

export function filterByMonth(sermons: Sermon[], month: string | null) {
  const safeSermons = Array.isArray(sermons) ? sermons : [];
  return month ? safeSermons.filter((sermon) => typeof sermon?.date === "string" && sermon.date.startsWith(month)) : safeSermons;
}

export function sortSermons(sermons: Sermon[], sort: SermonSort) {
  const safeSermons = Array.isArray(sermons) ? sermons : [];
  return [...safeSermons].sort((a, b) => {
    const direction = sort === "recent" ? -1 : 1;
    const aTime = typeof a?.date === "string" ? new Date(a.date).getTime() : 0;
    const bTime = typeof b?.date === "string" ? new Date(b.date).getTime() : 0;
    return direction * (aTime - bTime);
  });
}

export function filterNotes(notes: SermonNote[], filter: NoteFilter) {
  const safeNotes = Array.isArray(notes) ? notes : [];
  if (filter === "actions") return safeNotes.filter((note) => note?.isActionItem === true);
  if (filter === "insights") return safeNotes.filter((note) => note?.isActionItem !== true);
  return safeNotes;
}

export function collectSermonTags(sermons: Sermon[]) {
  return Array.from(new Set((Array.isArray(sermons) ? sermons : []).flatMap((sermon) => Array.isArray(sermon?.tags) ? sermon.tags : []))).sort();
}

export function collectSermonSeries(sermons: Sermon[]) {
  return Array.from(new Set((Array.isArray(sermons) ? sermons : []).map((sermon) => sermon?.series).filter((series): series is string => typeof series === "string" && Boolean(series.trim())))).sort();
}
