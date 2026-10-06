export function formatTimestamp(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

export function countOpenActions(actions: { completed: boolean }[]) {
  return actions.filter((action) => !action.completed).length;
}
