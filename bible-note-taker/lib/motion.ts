export const MOTION = {
  duration: 360,
  step: 55,
  maxDelay: 440,
} as const;

export function getMotionDelay(index: number): number {
  if (!Number.isFinite(index) || index <= 0) return 0;
  return Math.min(Math.floor(index) * MOTION.step, MOTION.maxDelay);
}
