export function getHomeGreeting(hour: number): string {
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return "Welcome back.";
  if (hour < 12) return "Good morning.";
  if (hour < 18) return "Good afternoon.";
  return "Good evening.";
}

export function getReflectionPrompt(openActionCount: number, sermonCount: number, streak: number): { title: string; body: string } {
  if (openActionCount > 0) {
    return { title: "One faithful step is waiting", body: "Choose one open action and carry it into today." };
  }
  if (sermonCount === 0) {
    return { title: "Start with what you heard", body: "Capture one sentence from a sermon, Scripture reading, or quiet moment." };
  }
  if (streak > 0) {
    return { title: "Keep making room", body: "Return to your prayer rhythm and notice what is changing in you." };
  }
  return { title: "Make room to pray", body: "Take one unhurried minute to name what is on your heart." };
}

export function getJournalSummary(sermonCount: number, noteCount: number, actionCount: number): string {
  const safe = (value: number) => Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
  return `${safe(sermonCount)} sermons · ${safe(noteCount)} notes · ${safe(actionCount)} actions`;
}
