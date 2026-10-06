export function getActionCompletionLabel(openActionCount: number): string {
  return Number.isFinite(openActionCount) && openActionCount > 0 ? "Complete all" : "All completed";
}

export function canCompleteAllActions(openActionCount: number): boolean {
  return Number.isFinite(openActionCount) && openActionCount > 0;
}
