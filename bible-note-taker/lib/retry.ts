export function getRetryDelay(attempt: number, baseMs = 400, maxMs = 5000) {
  const safeAttempt = Math.max(0, Math.floor(attempt));
  const safeBase = Math.max(1, baseMs);
  const safeMax = Math.max(safeBase, maxMs);
  return Math.min(safeMax, safeBase * 2 ** safeAttempt);
}
