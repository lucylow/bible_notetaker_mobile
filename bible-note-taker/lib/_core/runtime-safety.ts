export type SafeAreaInsetsPayload = { top: number; bottom: number; left: number; right: number };

export function isSafeAreaInsetsPayload(payload: Record<string, unknown>): payload is SafeAreaInsetsPayload {
  return (
    typeof payload.top === "number" && Number.isFinite(payload.top) &&
    typeof payload.bottom === "number" && Number.isFinite(payload.bottom) &&
    typeof payload.left === "number" && Number.isFinite(payload.left) &&
    typeof payload.right === "number" && Number.isFinite(payload.right)
  );
}
