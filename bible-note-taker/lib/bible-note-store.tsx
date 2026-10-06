import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { serializeWidgetState } from "@/lib/widget-state";
import { normalizeSermonNote } from "@/lib/error-handling";
import type { AudioSession } from "@/lib/audio-session";
import { createAudioSession, normalizeAudioSession } from "@/lib/audio-session";
import { parseImportPayload } from "@/lib/offline-readiness";
import { canUseBlankJournal, dedupeById, isPersistedSnapshotCurrent, isHydratedForMutation, hasRecoverableSermons, normalizeActionItems, normalizeHabit, normalizeRequiredSermonText, normalizeSermonChanges, normalizeStreak, parsePersistedJournalEnvelope, shouldUseSampleFallback } from "@/lib/store-safety";

export type SermonNote = {
  id: string;
  content: string;
  timestamp: number;
  isActionItem: boolean;
};

export type Sermon = {
  id: string;
  title: string;
  speaker: string;
  date: string;
  notes: SermonNote[];
  actionItems: { id: string; description: string; completed: boolean }[];
  tags: string[];
  series: string | null;
  archived: boolean;
  audio: AudioSession;
};

type Habit = "Prayer" | "Gratitude" | "Reflection";
type Store = {
  sermons: Sermon[];
  streak: number;
  activeHabit: Habit | null;
  addSermon: (title: string, speaker: string, audio?: AudioSession) => string;
  updateSermon: (sermonId: string, changes: Partial<Pick<Sermon, "title" | "speaker" | "tags" | "series" | "archived">>) => boolean;
  addNote: (sermonId: string, content: string, isActionItem: boolean) => boolean;
  toggleAction: (sermonId: string, actionId: string) => boolean;
  completeAllActions: (sermonId: string) => boolean;
  toggleArchived: (sermonId: string) => boolean;
  setAudioSession: (sermonId: string, session: AudioSession) => boolean;
  startHabit: (habit: Habit) => boolean;
  completeHabit: () => boolean;
  isHydrated: boolean;
  isSaving: boolean;
  storageError: string | null;
  isSampleData: boolean;
  retryPersistence: () => void;
  restoreFromBackup: (payload: unknown) => boolean;
  useBlankJournal: () => boolean;
};

const seed: Sermon[] = [
  {
    id: "seed-1",
    title: "A Faith That Moves",
    speaker: "Pastor James",
    date: "2026-08-16",
    notes: [
      { id: "note-1", content: "Faith becomes visible when we take the next faithful step.", timestamp: 742, isActionItem: true },
      { id: "note-2", content: "Remember: James 2:17", timestamp: 1084, isActionItem: false },
    ],
    actionItems: [{ id: "action-1", description: "Pray for courage to take one next step this week.", completed: false }],
    tags: ["Faith", "Action"],
    series: "Walking with God",
    archived: false,
    audio: createAudioSession(),
  },
];

const StoreContext = createContext<Store | null>(null);

function normalizeSermon(sermon: Partial<Sermon>): Sermon {
  const safeId = typeof sermon.id === "string" && sermon.id.trim() ? sermon.id.trim() : `sermon-recovered-${Date.now()}`;
  return { id: safeId, title: typeof sermon.title === "string" && sermon.title.trim() ? sermon.title.trim() : "Untitled sermon", speaker: typeof sermon.speaker === "string" && sermon.speaker.trim() ? sermon.speaker.trim() : "My notes", date: typeof sermon.date === "string" && sermon.date.trim() ? sermon.date.trim() : new Date().toISOString().slice(0, 10), notes: Array.isArray(sermon.notes) ? sermon.notes.map((note, index) => normalizeSermonNote(note, index)).filter((note): note is SermonNote => note !== null) : [], actionItems: normalizeActionItems(sermon.actionItems), tags: Array.isArray(sermon.tags) ? sermon.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim())).map((tag) => tag.trim()) : [], series: typeof sermon.series === "string" && sermon.series.trim() ? sermon.series.trim() : null, archived: sermon.archived === true, audio: normalizeAudioSession(sermon.audio) };
}

export function BibleNoteProvider({ children }: { children: React.ReactNode }) {
  const [sermons, setSermons] = useState<Sermon[]>(seed.map(normalizeSermon));
  const [streak, setStreak] = useState(4);
  const [activeHabit, setActiveHabit] = useState<Habit | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState(true);
  const [retryToken, setRetryToken] = useState(0);
  const [writeRetryToken, setWriteRetryToken] = useState(0);
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());
  const hasRestoredLocalDataRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setIsHydrated(false);
    AsyncStorage.getItem("bible-note-state")
      .then((raw) => {
        if (cancelled) return;
        if (!raw) return;
        const record = parsePersistedJournalEnvelope(raw);
        if (!record) {
          if (shouldUseSampleFallback(hasRestoredLocalDataRef.current)) setIsSampleData(true);
          setStorageError("Some saved notes could not be read. Clearly labeled sample content is shown until recovery succeeds.");
          return;
        }
        const restoredSermons = dedupeById(record.sermons.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object" && !Array.isArray(item))).map((item) => normalizeSermon(item as Partial<Sermon>)));
        if (!hasRecoverableSermons(record.sermons, restoredSermons)) {
          if (shouldUseSampleFallback(hasRestoredLocalDataRef.current)) setIsSampleData(true);
          setStorageError("Some saved notes are malformed. Clearly labeled sample content is shown until recovery succeeds.");
          return;
        }
        setSermons(restoredSermons);
        hasRestoredLocalDataRef.current = true;
        setIsSampleData(false);
        setStreak(normalizeStreak(record.streak, 4));
        setActiveHabit(normalizeHabit(record.activeHabit));
        setStorageError(null);
      })
      .catch(() => { if (!cancelled) { if (shouldUseSampleFallback(hasRestoredLocalDataRef.current)) setIsSampleData(true); setStorageError("Local storage is unavailable. Sample journal content is shown until you retry."); } })
      .finally(() => { if (!cancelled) setIsHydrated(true); });
    return () => { cancelled = true; };
  }, [retryToken]);

  useEffect(() => {
    if (!isHydrated) return;
    let stateSnapshot: string;
    let widgetSnapshot: string;
    try {
      stateSnapshot = JSON.stringify({ sermons, streak, activeHabit });
      widgetSnapshot = serializeWidgetState({ streak, activeHabit, latestSermonTitle: sermons[0]?.title });
    } catch {
      setStorageError("Could not prepare changes for local storage.");
      return;
    }
    saveChainRef.current = saveChainRef.current.catch(() => undefined).then(async () => {
      setIsSaving(true);
      try {
        await Promise.all([
          AsyncStorage.setItem("bible-note-state", stateSnapshot),
          AsyncStorage.setItem("bible-note-widget-state", widgetSnapshot),
        ]);
        const persistedState = await AsyncStorage.getItem("bible-note-state");
        if (!isPersistedSnapshotCurrent(persistedState, stateSnapshot)) throw new Error("Local state did not persist");
        setStorageError(null);
      } catch {
        setStorageError("Could not save changes on this device. Try again.");
      } finally {
        setIsSaving(false);
      }
    });
  }, [sermons, streak, activeHabit, isHydrated, writeRetryToken]);

  const value = useMemo<Store>(() => ({
    sermons,
    streak,
    activeHabit,
    addSermon: (title, speaker, audio) => {
      const safeTitle = normalizeRequiredSermonText(title);
      const safeSpeaker = normalizeRequiredSermonText(speaker);
      if (!isHydratedForMutation(isHydrated) || !safeTitle || !safeSpeaker) return "";
      setIsSampleData(false);
      const id = `sermon-${Date.now()}`;
      setSermons((current) => [{ id, title: safeTitle, speaker: safeSpeaker, date: new Date().toISOString().slice(0, 10), notes: [], actionItems: [], tags: [], series: null, archived: false, audio: normalizeAudioSession(audio ?? createAudioSession()) }, ...(isSampleData ? current.filter((sermon) => sermon.id !== "seed-1") : current)]);
      return id;
    },
    updateSermon: (sermonId, changes) => { const safeChanges = normalizeSermonChanges(changes); if (!isHydratedForMutation(isHydrated) || typeof sermonId !== "string" || !sermonId.trim() || !safeChanges || isSampleData || !sermons.some((sermon) => sermon.id === sermonId)) return false; setIsSampleData(false); setSermons((current) => current.map((sermon) => sermon.id === sermonId ? { ...sermon, ...safeChanges } : sermon)); return true; },
    addNote: (sermonId, content, isActionItem) => { if (!isHydratedForMutation(isHydrated) || typeof sermonId !== "string" || !sermonId.trim() || typeof content !== "string" || !content.trim() || typeof isActionItem !== "boolean" || isSampleData || !sermons.some((sermon) => sermon.id === sermonId)) return false; setIsSampleData(false); setSermons((current) => current.map((sermon) => {
      if (sermon.id !== sermonId) return sermon;
      const id = `note-${Date.now()}`;
      const note = { id, content, timestamp: sermon.notes.length * 90 + 60, isActionItem };
      return { ...sermon, notes: [...sermon.notes, note], actionItems: isActionItem ? [...sermon.actionItems, { id: `action-${Date.now()}`, description: content, completed: false }] : sermon.actionItems };
    })); return true; },
    toggleAction: (sermonId, actionId) => { if (!isHydratedForMutation(isHydrated) || typeof sermonId !== "string" || !sermonId.trim() || typeof actionId !== "string" || !actionId.trim() || isSampleData || !sermons.some((sermon) => sermon.id === sermonId && sermon.actionItems.some((item) => item.id === actionId))) return false; setIsSampleData(false); setSermons((current) => current.map((sermon) => sermon.id !== sermonId ? sermon : ({ ...sermon, actionItems: sermon.actionItems.map((item) => item.id === actionId ? { ...item, completed: !item.completed } : item) }))); return true; },
    completeAllActions: (sermonId) => { if (!isHydratedForMutation(isHydrated) || typeof sermonId !== "string" || !sermonId.trim() || isSampleData || !sermons.some((sermon) => sermon.id === sermonId)) return false; setIsSampleData(false); setSermons((current) => current.map((sermon) => sermon.id === sermonId ? { ...sermon, actionItems: sermon.actionItems.map((item) => ({ ...item, completed: true })) } : sermon)); return true; },
    toggleArchived: (sermonId) => { if (!isHydratedForMutation(isHydrated) || typeof sermonId !== "string" || !sermonId.trim() || isSampleData || !sermons.some((sermon) => sermon.id === sermonId)) return false; setIsSampleData(false); setSermons((current) => current.map((sermon) => sermon.id === sermonId ? { ...sermon, archived: !sermon.archived } : sermon)); return true; },
    setAudioSession: (sermonId, session) => { if (!isHydratedForMutation(isHydrated) || typeof sermonId !== "string" || !sermonId.trim() || !session || typeof session !== "object" || isSampleData || !sermons.some((sermon) => sermon.id === sermonId)) return false; setIsSampleData(false); setSermons((current) => current.map((sermon) => sermon.id === sermonId ? { ...sermon, audio: normalizeAudioSession(session) } : sermon)); return true; },
    startHabit: (habit) => { if (!isHydratedForMutation(isHydrated) || (habit !== "Prayer" && habit !== "Gratitude" && habit !== "Reflection")) return false; setIsSampleData(false); setSermons((current) => isSampleData ? current.filter((sermon) => sermon.id !== "seed-1") : current); setActiveHabit(habit); return true; },
    completeHabit: () => { if (!isHydratedForMutation(isHydrated) || !activeHabit) return false; setIsSampleData(false); setSermons((current) => isSampleData ? current.filter((sermon) => sermon.id !== "seed-1") : current); setActiveHabit(null); setStreak((current) => normalizeStreak(current) + 1); return true; },
    isHydrated,
    isSaving,
    storageError,
    isSampleData,
    retryPersistence: () => { setStorageError(null); setRetryToken((value) => value + 1); setWriteRetryToken((value) => value + 1); },
    useBlankJournal: () => {
      if (!canUseBlankJournal({ isHydrated, storageError, isSaving, isSampleData })) return false;
      hasRestoredLocalDataRef.current = true;
      setSermons([]);
      setStreak(0);
      setActiveHabit(null);
      setIsSampleData(false);
      setStorageError(null);
      return true;
    },
    restoreFromBackup: (payload) => {
      if (!isHydratedForMutation(isHydrated)) {
        setStorageError("Local journal is still loading. Your backup was not applied; try again when loading finishes.");
        return false;
      }
      try {
        const record = typeof payload === "string" ? parseImportPayload(payload) : payload && typeof payload === "object" && !Array.isArray(payload) ? payload as Record<string, unknown> : null;
        if (!record || !Array.isArray(record.sermons)) {
          setStorageError("This backup is not a valid local journal. Your current journal is unchanged.");
          return false;
        }
        const nextSermons = dedupeById(record.sermons.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object" && !Array.isArray(item))).map((item) => normalizeSermon(item as Partial<Sermon>)));
        if (!hasRecoverableSermons(record.sermons, nextSermons)) {
          setStorageError("This backup contains no recoverable sermon notes. Your current journal is unchanged.");
          return false;
        }
        const nextStreak = normalizeStreak(record.streak);
        setSermons(nextSermons);
        setStreak(nextStreak);
        setActiveHabit(normalizeHabit(record.activeHabit));
        hasRestoredLocalDataRef.current = true;
        setIsSampleData(false);
        setStorageError(null);
        return true;
      } catch {
        setStorageError("This backup could not be restored. Your current journal is unchanged.");
        return false;
      }
    },
  }), [sermons, streak, activeHabit, isHydrated, isSaving, storageError, isSampleData]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useBibleNoteStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useBibleNoteStore must be used inside BibleNoteProvider");
  return store;
}
