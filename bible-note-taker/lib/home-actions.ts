export type HomeActionSource = {
  id: string;
  title: string;
  actionItems: Array<{ id: string; description: string; completed: boolean }>;
};

export type HomeAction = {
  id: string;
  sermonId: string;
  sermonTitle: string;
  description: string;
};

export function getOpenHomeActions(sources: unknown, limit = 3): HomeAction[] {
  if (!Array.isArray(sources) || !Number.isFinite(limit) || limit <= 0) return [];
  const safeLimit = Math.floor(limit);
  const actions: HomeAction[] = [];
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    const item = source as HomeActionSource;
    if (typeof item.id !== "string" || typeof item.title !== "string" || !Array.isArray(item.actionItems)) continue;
    for (const action of item.actionItems) {
      if (!action || typeof action !== "object" || action.completed !== false || typeof action.id !== "string" || typeof action.description !== "string" || !action.description.trim()) continue;
      actions.push({ id: action.id, sermonId: item.id, sermonTitle: item.title, description: action.description.trim() });
      if (actions.length >= safeLimit) return actions;
    }
  }
  return actions;
}
