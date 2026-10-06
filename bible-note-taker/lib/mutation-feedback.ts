export function mutationFeedback(success: boolean, item = "item"): { message: string; tone: "success" | "warning" } {
  return success
    ? { message: `${item} updated locally.`, tone: "success" }
    : { message: `That ${item} is no longer available. Your journal was not changed.`, tone: "warning" };
}
