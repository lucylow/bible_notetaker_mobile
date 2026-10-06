export type ActionListFilter = "open" | "completed" | "all";

export type ActionListItem = {
  id: string;
  sermonId: string;
  sermonTitle: string;
  description: string;
  completed: boolean;
};

export function flattenActionItems(sources: unknown): ActionListItem[] {
  if (!Array.isArray(sources)) return [];
  const items: ActionListItem[] = [];
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    const record = source as { id?: unknown; title?: unknown; actionItems?: unknown };
    if (typeof record.id !== "string" || typeof record.title !== "string" || !Array.isArray(record.actionItems)) continue;
    for (const action of record.actionItems) {
      if (!action || typeof action !== "object") continue;
      const item = action as { id?: unknown; description?: unknown; completed?: unknown };
      if (typeof item.id !== "string" || typeof item.description !== "string" || !item.description.trim() || typeof item.completed !== "boolean") continue;
      items.push({ id: item.id, sermonId: record.id, sermonTitle: record.title, description: item.description.trim(), completed: item.completed });
    }
  }
  return items;
}

export function filterActionItems(items: ActionListItem[], filter: ActionListFilter): ActionListItem[] {
  if (filter === "open") return items.filter((item) => !item.completed);
  if (filter === "completed") return items.filter((item) => item.completed);
  return items;
}
