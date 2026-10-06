import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { bundledBibleStories } from "@/lib/story-catalog";
import { loadStoryProgress, saveStoryProgress } from "@/lib/story-progress";
import { advanceStoryProgress, moveStoryProgress, storyProgressPercent, type SafeBibleStory, type SafeStoryProgress } from "@/lib/storytelling-safety";
import { useAppPreferences } from "@/lib/preferences-provider";
import { loadStoryFilter, saveStoryFilter, type StoryFilterValue } from "@/lib/story-filter";
import { clearLastStoryId, loadLastStoryId, saveLastStoryId } from "@/lib/story-selection";
import { clearRecentStory, formatRecentStoryLabel, loadRecentStory, saveRecentStory, type RecentStory } from "@/lib/story-recent";

type StoryFilter = StoryFilterValue;

export default function StoriesScreen() {
  const colors = useColors();
  const [selected, setSelected] = useState<SafeBibleStory | null>(null);
  const [progress, setProgress] = useState<SafeStoryProgress[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<StoryFilter>("all");
  const [filterReady, setFilterReady] = useState(false);
  const [lastStoryReady, setLastStoryReady] = useState(false);
  const [lastStoryId, setLastStoryId] = useState<string | null>(null);
  const [recentStory, setRecentStory] = useState<RecentStory | null>(null);
  const [recentStoryRetry, setRecentStoryRetry] = useState<RecentStory | null>(null);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const systemReducedMotion = useReducedMotion();
  const { reducedMotion: preferenceReducedMotion } = useAppPreferences();
  const reduceMotion = Boolean(systemReducedMotion || preferenceReducedMotion);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadStoryProgress(), loadStoryFilter(), loadLastStoryId(bundledBibleStories.map((story) => story.id)), loadRecentStory(bundledBibleStories.map((story) => story.id))]).then(([storedProgress, storedFilter, lastStoryId, storedRecentStory]) => { if (!cancelled) { setProgress(storedProgress); setFilter(storedFilter); setLastStoryReady(true); setLastStoryId(lastStoryId); setRecentStory(storedRecentStory); setFilterReady(true); } }).catch(() => { if (!cancelled) { setLastStoryReady(true); setFilterReady(true); setMessage("Some local story settings could not be loaded. The sample library is still available, and your journal was not changed."); } }).finally(() => { if (!cancelled) setLibraryLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const progressFor = useMemo(() => new Map(progress.map((item) => [item.storyId, item])), [progress]);
  const filterCounts = useMemo(() => {
    const counts: Record<StoryFilter, number> = { all: bundledBibleStories.length, not_started: 0, in_progress: 0, completed: 0 };
    bundledBibleStories.forEach((story) => { counts[progressFor.get(story.id)?.status ?? "not_started"] += 1; });
    return counts;
  }, [progressFor]);
  const filteredStories = useMemo(() => bundledBibleStories.filter((story) => {
    const status = progressFor.get(story.id)?.status ?? "not_started";
    return filter === "all" || status === filter;
  }), [filter, progressFor]);

  const lastStory = lastStoryId ? bundledBibleStories.find((item) => item.id === lastStoryId) ?? null : null;
  const lastStoryProgress = lastStory ? progressFor.get(lastStory.id) : undefined;
  const lastStoryProgressLabel = lastStory && lastStoryProgress?.status === "completed" ? "Completed · revisit anytime" : lastStory && lastStoryProgress ? `In progress · reflection ${Math.min(lastStoryProgress.currentBlockIndex + 1, lastStory.blocks.length)} of ${Math.max(1, lastStory.blocks.length)}` : "Not started";

  const clearHistory = async () => {
    try {
      const [clearedLastStory, clearedRecentStory] = await Promise.all([clearLastStoryId(), clearRecentStory()]);
      if (!clearedLastStory || !clearedRecentStory) { setMessage("The last-story history could not be fully cleared. Nothing else changed."); return; }
      setLastStoryId(null);
      setRecentStory(null);
      setRecentStoryRetry(null);
      setSelected(null);
      setMessage("Last-story history cleared. Reading progress remains on this device.");
    } catch {
      setMessage("The last-story history could not be cleared. Your reading progress remains on this device.");
    }
  };

  const saveOpenedStory = async (storyId: string, openedAt: number) => {
    const allowedIds = bundledBibleStories.map((story) => story.id);
    const [savedLastStory, savedRecentStory] = await Promise.all([saveLastStoryId(storyId, allowedIds), saveRecentStory(storyId, allowedIds, openedAt)]);
    if (!savedLastStory || !savedRecentStory) {
      setRecentStoryRetry({ storyId, openedAt });
      setMessage("Story opened, but its local shortcut could not be confirmed.");
      return;
    }
    setRecentStoryRetry(null);
  };

  const changeFilter = async (next: StoryFilter) => {
    const previous = filter;
    setFilter(next);
    if (!filterReady) return;
    try {
      if (!(await saveStoryFilter(next))) {
        setFilter(previous);
        setMessage("The story filter could not be saved. Your previous filter was kept.");
      }
    } catch {
      setFilter(previous);
      setMessage("The story filter could not be saved. Your previous filter was kept.");
    }
  };

  const persistProgress = async (next: SafeStoryProgress) => {
    const previous = progress;
    const updated = [...progress.filter((item) => item.storyId !== next.storyId), next];
    setProgress(updated);
    setMessage("Reading saved on this device.");
    try {
      if (!(await saveStoryProgress(updated))) {
        setProgress(previous);
        setMessage("Reading could not be saved. Your previous progress was kept.");
      }
    } catch {
      setProgress(previous);
      setMessage("Reading could not be saved. Your previous progress was kept.");
    }
  };

  const updateProgress = async (story: SafeBibleStory) => {
    await persistProgress(advanceStoryProgress(story, progressFor.get(story.id) ?? null));
  };

  const navigateProgress = async (story: SafeBibleStory, direction: "previous" | "next") => {
    await persistProgress(moveStoryProgress(story, progressFor.get(story.id) ?? null, direction));
  };

  if (selected) {
    const selectedProgress = progressFor.get(selected.id);
    const currentBlockIndex = Math.min(selectedProgress?.currentBlockIndex ?? 0, Math.max(0, selected.blocks.length - 1));
    const lastBlockIndex = Math.max(0, selected.blocks.length - 1);
    return <ScreenContainer className="px-5 pt-3"><Pressable accessibilityRole="button" accessibilityLabel="Back to story library" accessibilityHint="Returns to the story list without changing saved reading progress." onPress={() => { setSelected(null); setMessage(null); }} style={styles.back}><Text style={[styles.backText, { color: colors.primary }]}>‹ Library</Text></Pressable><Text style={[styles.eyebrow, { color: colors.muted }]}>REFLECTION READER</Text><Text style={[styles.title, { color: colors.foreground }]}>{selected.title}</Text><Text style={[styles.reference, { color: colors.primary }]}>{selected.reference}</Text><View style={[styles.readerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.summary, { color: colors.foreground }]}>{selected.summary}</Text><View style={styles.progressHeader}><Text style={[styles.progressLabel, { color: colors.muted }]}>Reflection {currentBlockIndex + 1} of {lastBlockIndex + 1}</Text><Text style={[styles.progressLabel, { color: colors.primary }]}>{selectedProgress?.status === "completed" ? "Completed" : "In progress"}</Text></View><Text style={[styles.body, { color: colors.foreground }]}>{selected.blocks[currentBlockIndex] ?? selected.summary}</Text><Text style={[styles.body, { color: colors.muted }]}>Read slowly. Notice one phrase that stays with you, then make room for a response in prayer.</Text><View style={styles.themeRow}>{selected.themes.map((theme) => <View key={theme} style={[styles.theme, { backgroundColor: colors.background, borderColor: colors.border }]}><Text style={[styles.themeText, { color: colors.muted }]}>{theme}</Text></View>)}</View></View><Text style={[styles.section, { color: colors.foreground }]}>Reflect</Text>{selected.questions.map((question, index) => <Animated.View key={question} entering={reduceMotion ? undefined : FadeInDown.delay(index * 55).duration(240)} style={[styles.question, { borderBottomColor: colors.border }]}><Text style={[styles.questionIndex, { color: colors.warning }]}>0{index + 1}</Text><Text style={[styles.questionText, { color: colors.foreground }]}>{question}</Text></Animated.View>)}<View style={styles.navRow}><Pressable accessibilityRole="button" accessibilityLabel="Previous reflection" accessibilityHint={currentBlockIndex === 0 ? "You are at the first reflection." : "Moves to the previous reflection and saves your position locally."} accessibilityState={{ disabled: currentBlockIndex === 0 }} onPress={() => void navigateProgress(selected, "previous")} style={[styles.secondaryButton, { borderColor: colors.border }, currentBlockIndex === 0 && styles.disabled]}><Text style={[styles.secondaryText, { color: colors.foreground }]}>Previous</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={selectedProgress?.status === "completed" ? "Read reflection again" : "Save and continue reflection"} accessibilityHint="Advances the reflection and saves your position on this device." onPress={() => void updateProgress(selected)} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}><Text style={styles.primaryText}>{selectedProgress?.status === "completed" ? "Read again" : currentBlockIndex >= lastBlockIndex ? "Finish reflection" : currentBlockIndex > 0 ? "Continue" : "Begin reflection"}</Text></Pressable></View>{message && <Text accessibilityRole="alert" style={[styles.message, { color: message.includes("could not") ? colors.error : colors.success }]}>{message}</Text>}{recentStoryRetry && <Pressable accessibilityRole="button" accessibilityLabel="Retry saving recently opened story" accessibilityHint="Attempts to save the story shortcut again on this device." onPress={() => void saveOpenedStory(recentStoryRetry.storyId, recentStoryRetry.openedAt)} style={styles.retryButton}><Text style={[styles.retryText, { color: colors.primary }]}>Retry local shortcut save</Text></Pressable>}</ScreenContainer>;
  }

  return <ScreenContainer className="px-5 pt-3"><Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Text style={[styles.backText, { color: colors.primary }]}>‹ Back</Text></Pressable><Text style={[styles.eyebrow, { color: colors.muted }]}>A SMALL PLACE TO PAUSE</Text><Text style={[styles.title, { color: colors.foreground }]}>Bible stories</Text><Text style={[styles.intro, { color: colors.muted }]}>Short, local reflections for when you want to return to Scripture without adding noise.</Text>{libraryLoading && <Text accessibilityLiveRegion="polite" style={[styles.message, { color: colors.muted }]}>Loading local story settings…</Text>}{lastStory && <View style={[styles.continueCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.cardTop}><View><Text style={[styles.continueEyebrow, { color: colors.muted }]}>CONTINUE WHERE YOU LEFT OFF</Text><Text style={[styles.cardTitle, { color: colors.foreground }]}>{lastStory.title}</Text><Text style={[styles.status, { color: lastStoryProgress?.status === "completed" ? colors.success : colors.warning }]}>{lastStoryProgressLabel}</Text></View><Text style={[styles.reference, { color: colors.primary }]}>{lastStory.reference}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`Continue ${lastStory.title}`} accessibilityHint="Opens the story at your saved reflection position." onPress={() => { setSelected(lastStory); setMessage(null); }} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}><Text style={styles.primaryText}>Continue story</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Clear last-story history" accessibilityHint="Removes the shortcut only; reading progress stays on this device." onPress={() => void clearHistory()} style={styles.clearHistory}><Text style={[styles.clearHistoryText, { color: colors.muted }]}>Clear last-story history</Text></Pressable></View>}<View accessibilityRole="tablist" style={styles.filterRow}>{(["all", "not_started", "in_progress", "completed"] as StoryFilter[]).map((value) => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: filter === value }} onPress={() => void changeFilter(value)} style={[styles.filterButton, { borderColor: filter === value ? colors.primary : colors.border, backgroundColor: filter === value ? colors.primary : colors.surface }]}><Text style={[styles.filterText, { color: filter === value ? colors.background : colors.muted }]}>{value === "all" ? "All" : value === "not_started" ? "Not started" : value === "in_progress" ? "In progress" : "Completed"} ({filterCounts[value]})</Text></Pressable>)}</View><FlatList accessibilityLabel="Bible story library" data={filteredStories} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item, index }) => { const itemProgress = progressFor.get(item.id); const blockCount = Math.max(1, item.blocks.length); const currentIndex = Math.min(itemProgress?.currentBlockIndex ?? -1, blockCount - 1); const done = itemProgress?.status === "completed"; const progressPercent = storyProgressPercent(item, itemProgress ?? null); const statusLabel = done ? "Completed · revisit anytime" : currentIndex >= 0 ? `In progress · ${currentIndex + 1} of ${blockCount}` : "Not started"; const recentLabel = recentStory?.storyId === item.id ? formatRecentStoryLabel(recentStory.openedAt) : null; return <Animated.View entering={reduceMotion ? undefined : FadeInDown.delay(index * 55).duration(240)}><Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.title}`} accessibilityHint="Opens this local reflection and remembers it as your last story." onPress={() => { setSelected(item); setLastStoryId(item.id); setMessage(null); const openedAt = Date.now(); setRecentStory({ storyId: item.id, openedAt }); if (lastStoryReady) void saveOpenedStory(item.id, openedAt).catch(() => { setRecentStoryRetry({ storyId: item.id, openedAt }); setMessage("Story opened, but its local shortcut could not be confirmed."); }); }} style={({ pressed }) => [styles.storyCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}><View style={styles.cardTop}><Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.duration, { color: colors.muted }]}>{item.durationMinutes} min</Text></View><Text style={[styles.reference, { color: colors.primary }]}>{item.reference}</Text><Text style={[styles.cardSummary, { color: colors.muted }]}>{item.summary}</Text><View accessibilityRole="progressbar" accessibilityLabel={`${item.title} progress`} accessibilityValue={{ min: 0, max: 100, now: progressPercent, text: `${progressPercent}% complete` }} style={[styles.progressTrack, { backgroundColor: colors.border }]}><View style={[styles.progressFill, { backgroundColor: done ? colors.success : colors.primary, width: `${progressPercent}%` }]} /></View><Text style={[styles.status, { color: done ? colors.success : colors.warning }]}>{statusLabel}</Text>{recentLabel && <Text accessibilityLabel={`${item.title} recently opened`} style={[styles.recentLabel, { color: colors.muted }]}>{recentLabel}</Text>}</Pressable></Animated.View>; }} ListEmptyComponent={<Text style={[styles.intro, { color: colors.muted }]}>No stories are available yet. Your journal is still safe on this device.</Text>} /></ScreenContainer>;
}

const styles = StyleSheet.create({
  back: { marginBottom: 18, alignSelf: "flex-start" },
  backText: { fontSize: 16, fontWeight: "700" },
  eyebrow: { fontSize: 11, letterSpacing: 1.5, fontWeight: "800" },
  title: { fontSize: 32, lineHeight: 38, fontWeight: "700", marginTop: 4, marginBottom: 10 },
  intro: { fontSize: 15, lineHeight: 22, maxWidth: 420 },
  list: { gap: 12, paddingTop: 16, paddingBottom: 32 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 18 },
  filterButton: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { fontSize: 12, fontWeight: "800" },
  storyCard: { borderRadius: 20, borderWidth: 1, padding: 18, gap: 8 },
  continueCard: { borderRadius: 20, borderWidth: 1, padding: 18, gap: 10, marginTop: 18 },
  continueEyebrow: { fontSize: 10, letterSpacing: 1.2, fontWeight: "800", marginBottom: 4 },
  clearHistory: { alignItems: "center", paddingVertical: 4 },
  clearHistoryText: { fontSize: 12, fontWeight: "700" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  cardTitle: { fontSize: 18, lineHeight: 24, fontWeight: "800", flex: 1 },
  duration: { fontSize: 12, fontWeight: "700" },
  reference: { fontSize: 14, fontWeight: "700" },
  cardSummary: { fontSize: 14, lineHeight: 20 },
  status: { fontSize: 12, fontWeight: "800", marginTop: 4 },
  recentLabel: { fontSize: 11, lineHeight: 15, fontWeight: "700" },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden", marginTop: 2 },
  progressFill: { height: "100%", borderRadius: 3 },
  readerCard: { borderRadius: 22, borderWidth: 1, padding: 20, gap: 16, marginTop: 12 },
  summary: { fontSize: 19, lineHeight: 28, fontWeight: "700" },
  body: { fontSize: 15, lineHeight: 23 },
  themeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  theme: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  themeText: { fontSize: 12, fontWeight: "700" },
  section: { fontSize: 18, fontWeight: "800", marginTop: 28, marginBottom: 8 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { fontSize: 12, fontWeight: "800" },
  navRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 28 },
  secondaryButton: { flex: 1, borderWidth: 1, borderRadius: 16, paddingVertical: 15, alignItems: "center" },
  secondaryText: { fontWeight: "800", fontSize: 15 },
  disabled: { opacity: 0.45 },
  question: { flexDirection: "row", gap: 12, paddingVertical: 15, borderBottomWidth: 1 },
  questionIndex: { fontSize: 12, fontWeight: "900", paddingTop: 2 },
  questionText: { fontSize: 16, lineHeight: 23, flex: 1 },
  primaryButton: { flex: 1, borderRadius: 16, paddingVertical: 15, alignItems: "center" },
  primaryText: { color: "#FFFDF8", fontWeight: "800", fontSize: 15 },
  message: { textAlign: "center", fontSize: 13, fontWeight: "700", marginTop: 12 },
  retryButton: { alignSelf: "center", paddingVertical: 8, paddingHorizontal: 12 },
  retryText: { fontSize: 12, fontWeight: "800" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
});
