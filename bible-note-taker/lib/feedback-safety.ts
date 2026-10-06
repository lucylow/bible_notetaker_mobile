export type FeedbackTone = "info" | "success" | "warning" | "error";

export function fallbackFeedbackMessage(tone: FeedbackTone): string {
  return tone === "error" ? "Something went wrong. Please try again." : tone === "warning" ? "Please try again." : "Action completed.";
}

export function sanitizeFeedbackMessage(message: unknown, fallback = "Action completed."): string {
  return typeof message === "string" && message.trim() ? message.trim() : fallback;
}
