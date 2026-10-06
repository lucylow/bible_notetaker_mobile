import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, Share, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useBibleNoteStore } from "@/lib/bible-note-store";
import { useColors } from "@/hooks/use-colors";
import { languageLabel, loadLanguagePreference, saveLanguagePreference, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/language";
import { useAppPreferences } from "@/lib/preferences-provider";
import { resetOnboardingComplete } from "@/lib/onboarding";
import { buildLocalBackupPayload, canConfirmRestore, diffBackupPayload, formatBackupChange, listBackupChanges, previewBackupPayload, type BackupChangeList, type BackupDiff, type BackupPreview } from "@/lib/offline-readiness";
import { getMonetizationReadiness, normalizeEntitlementState, unavailableMonetizationMessage } from "@/lib/monetization-readiness";

export default function ProfileScreen() {
  const colors = useColors();
  const { sermons, streak, activeHabit, restoreFromBackup, useBlankJournal, isSampleData, isHydrated, isSaving, storageError, retryPersistence } = useBibleNoteStore();
  const totalNotes = sermons.reduce((total, sermon) => total + sermon.notes.length, 0);
  const openActions = sermons.reduce((total, sermon) => total + sermon.actionItems.filter((item) => !item.completed).length, 0);
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [languageError, setLanguageError] = useState<string | null>(null);
  const [languageRetry, setLanguageRetry] = useState<{ next: SupportedLanguage; previous: SupportedLanguage } | null>(null);
  const [languageSaving, setLanguageSaving] = useState(false);
  const [languageSavedMessage, setLanguageSavedMessage] = useState<string | null>(null);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [backupSaving, setBackupSaving] = useState(false);
  const [blankJournalMessage, setBlankJournalMessage] = useState<string | null>(null);
  const [restoreDraft, setRestoreDraft] = useState("");
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [restorePreview, setRestorePreview] = useState<BackupPreview | null>(null);
  const [restoreDiff, setRestoreDiff] = useState<BackupDiff | null>(null);
  const [restoreChanges, setRestoreChanges] = useState<BackupChangeList | null>(null);
  const [selectedRestoreChange, setSelectedRestoreChange] = useState<string | null>(null);
  const [restoreConfirming, setRestoreConfirming] = useState(false);
  const [restoreReviewOpen, setRestoreReviewOpen] = useState(false);
  const { reducedMotion, loading: motionSaving, error: preferenceError, reload: reloadPreferences, setReducedMotion } = useAppPreferences();
  const entitlement = normalizeEntitlementState(null);
  const monetizationReadiness = getMonetizationReadiness();
  const premiumUnavailableMessage = unavailableMonetizationMessage("Premium access");
  const [motionMessage, setMotionMessage] = useState<string | null>(null);
  const [motionStatus, setMotionStatus] = useState<"saved" | "saving" | "error">("saved");
  const [replayingOnboarding, setReplayingOnboarding] = useState(false);
  const [onboardingMessage, setOnboardingMessage] = useState<string | null>(null);
  const clearRestoreDraft = () => {
    setRestoreReviewOpen(false);
    setRestoreDraft("");
    setRestorePreview(null);
    setRestoreDiff(null);
    setRestoreChanges(null);
    setSelectedRestoreChange(null);
    setRestoreMessage(null);
  };

  const useBlankJournalSafely = () => {
    if (!isHydrated) {
      setBlankJournalMessage("Your local journal is still loading. Try again when loading finishes.");
      return;
    }
    if (storageError) {
      setBlankJournalMessage("Local storage needs attention. Retry before starting a blank journal.");
      return;
    }
    if (isSaving) {
      setBlankJournalMessage("Your latest journal changes are still saving. Try again in a moment.");
      return;
    }
    if (!useBlankJournal()) {
      setBlankJournalMessage("The sample journal could not be cleared safely. Your current journal was not changed.");
      return;
    }
    setBlankJournalMessage("Blank journal started. Your sample content was not saved as personal data.");
  };

  const restoreLocalBackup = () => {
    setRestoreReviewOpen(false);
    if (!isHydrated || storageError || isSaving) {
      setRestorePreview(null);
      setRestoreDiff(null);
      setRestoreChanges(null);
      setSelectedRestoreChange(null);
      setRestoreMessage(!isHydrated ? "Your local journal is still loading. Try previewing the backup when loading finishes." : storageError ? "Local storage needs attention. Retry before previewing a backup." : "Your latest journal changes are still saving. Try previewing again in a moment.");
      return;
    }
    if (!restoreDraft.trim()) {
      setRestoreMessage("Paste a local backup before previewing.");
      setRestorePreview(null);
      setRestoreDiff(null);
      setRestoreChanges(null);
      setSelectedRestoreChange(null);
      return;
    }
    try {
      const preview = previewBackupPayload(restoreDraft);
      setRestorePreview(preview);
      setRestoreDiff(preview.valid ? diffBackupPayload(restoreDraft, sermons) : null);
      setRestoreChanges(preview.valid ? listBackupChanges(restoreDraft, sermons) : null);
      setSelectedRestoreChange(null);
      if (!preview.valid) setRestoreMessage("That backup is not valid. Your current journal was not changed.");
      else setRestoreMessage("Backup validated. Review the summary, then confirm restore.");
    } catch {
      setRestorePreview(null);
      setRestoreDiff(null);
      setRestoreChanges(null);
      setSelectedRestoreChange(null);
      setRestoreMessage("The backup preview failed safely. Your current journal was not changed.");
    }
  };

  const confirmRestoreLocalBackup = () => {
    if (!isHydrated || storageError || isSaving) {
      setRestoreReviewOpen(false);
      setRestorePreview(null);
      setRestoreDiff(null);
      setRestoreChanges(null);
      setSelectedRestoreChange(null);
      setRestoreMessage(!isHydrated ? "Your local journal is still loading. Restore is paused until loading finishes." : storageError ? "Local storage needs attention. Retry before restoring a backup." : "Your latest journal changes are still saving. Restore is paused until saving finishes.");
      return;
    }
    if (!canConfirmRestore(restorePreview, restoreDraft, restoreConfirming)) {
      setRestoreMessage("Review a valid backup before confirming restore.");
      return;
    }
    setRestoreConfirming(true);
    try {
      if (!restorePreview?.valid || !restoreFromBackup(restoreDraft)) {
        setRestoreMessage("Restore failed safely. Your current journal was not changed.");
        return;
      }
    } catch {
      setRestoreMessage("Restore failed safely. Your current journal was not changed.");
      return;
    } finally {
      setRestoreConfirming(false);
    }
    setRestoreDraft("");
    setRestorePreview(null);
    setRestoreDiff(null);
    setRestoreChanges(null);
    setRestoreOpen(false);
    setRestoreReviewOpen(false);
    setRestoreMessage("Local backup restored safely.");
  };

  const shareLocalBackup = async () => {
    if (backupSaving || isSaving) return;
    if (!isHydrated) {
      setBackupMessage("Your local journal is still loading. Try again when loading finishes.");
      return;
    }
    if (storageError) {
      setBackupMessage("Local storage needs attention. Retry before exporting a backup.");
      return;
    }
    if (isSaving) {
      setBackupMessage("Your latest journal changes are still saving. Try exporting again in a moment.");
      return;
    }
    setBackupSaving(true);
    setBackupMessage(null);
    try {
      const payload = buildLocalBackupPayload({ sermons, streak, activeHabit });
      if (!payload) {
        setBackupMessage("Could not prepare a local backup. Your journal is still stored on this device.");
        return;
      }
      await Share.share({ title: "Bible Note Taker backup", message: payload });
      setBackupMessage("Local backup is ready to share.");
    } catch {
      setBackupMessage("The local backup could not be shared. Your journal is still stored on this device.");
    } finally {
      setBackupSaving(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    loadLanguagePreference()
      .then((value) => { if (!cancelled) setLanguage(value); })
      .catch(() => { if (!cancelled) setLanguageError("Language preference could not be loaded. English is being used."); });
    return () => { cancelled = true; };
  }, []);

  const toggleReducedMotion = (value: boolean) => {
    if (motionSaving) return;
    setMotionMessage(null);
    setMotionStatus("saving");
    void setReducedMotion(value).then((saved) => {
      setMotionStatus(saved ? "saved" : "error");
      setMotionMessage(saved ? (value ? "Reduced motion is on." : "Reduced motion is off.") : "Could not save this preference on the device. Your previous setting was kept.");
    }).catch(() => { setMotionStatus("error"); setMotionMessage("Could not save this preference on the device. Your previous setting was kept."); });
  };

  const replayOnboarding = () => {
    if (replayingOnboarding) return;
    setReplayingOnboarding(true);
    setOnboardingMessage(null);
    void resetOnboardingComplete().then((saved) => {
      if (!saved) {
        setOnboardingMessage("Could not reset onboarding on this device. Your practice was not changed.");
        return;
      }
      setOnboardingMessage("Onboarding will open again now.");
      router.replace("/onboarding");
    }).catch(() => setOnboardingMessage("Could not reset onboarding on this device. Your practice was not changed.")).finally(() => setReplayingOnboarding(false));
  };

  const cycleLanguage = () => {
    if (languageSaving) return;
    const previous = language;
    const index = SUPPORTED_LANGUAGES.indexOf(language);
    const next = SUPPORTED_LANGUAGES[(index + 1) % SUPPORTED_LANGUAGES.length];
    setLanguage(next);
    setLanguageError(null);
    setLanguageSavedMessage(null);
    setLanguageRetry(null);
    setLanguageSaving(true);
    void saveLanguagePreference(next).then(() => { setLanguageRetry(null); setLanguageSavedMessage(`${languageLabel(next)} saved on this device.`); }).catch(() => {
      setLanguage(previous);
      setLanguageRetry({ next, previous });
      setLanguageError("Could not save the language preference on this device. Your previous language was kept.");
    }).finally(() => setLanguageSaving(false));
  };

  const retryLanguageSave = () => {
    if (!languageRetry || languageSaving) return;
    const { next, previous } = languageRetry;
    setLanguage(next);
    setLanguageError(null);
    setLanguageSavedMessage(null);
    setLanguageSaving(true);
    void saveLanguagePreference(next).then(() => { setLanguageRetry(null); setLanguageSavedMessage(`${languageLabel(next)} saved on this device.`); }).catch(() => {
      setLanguage(previous);
      setLanguageRetry({ next, previous });
      setLanguageError("Language save failed again. Your previous language was kept.");
    }).finally(() => setLanguageSaving(false));
  };

  return <ScreenContainer className="px-5 pt-3"><Text style={[styles.eyebrow, { color: colors.muted }]}>YOUR PRACTICE</Text><Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>{storageError && <View style={[styles.inlineRecovery, { backgroundColor: colors.surface, borderColor: colors.error }]}><Text accessibilityRole="alert" style={[styles.inlineRecoveryText, { color: colors.error }]}>{storageError}</Text><Pressable accessibilityRole="button" accessibilityLabel="Retry loading local journal" accessibilityHint="Attempts to reload your saved journal from this device." onPress={retryPersistence}><Text style={[styles.retryLink, { color: colors.primary }]}>Retry</Text></Pressable></View>}<View style={[styles.profileCard, { backgroundColor: colors.primary }]}><View style={styles.avatar}><Text style={[styles.avatarText, { color: colors.primary }]}>J</Text></View><View><Text style={styles.name}>Jordan</Text><Text style={styles.email}>{!isHydrated ? "Loading your local journal…" : sermons.length === 0 ? "Your local journal is ready" : `${sermons.length} sermon${sermons.length === 1 ? "" : "s"} · ${totalNotes} note${totalNotes === 1 ? "" : "s"}`}</Text></View></View><View style={styles.stats}><View><Text style={[styles.stat, { color: colors.foreground }]}>{streak}</Text><Text style={[styles.label, { color: colors.muted }]}>day streak</Text></View><View><Text style={[styles.stat, { color: colors.foreground }]}>{isSampleData ? "Sample" : "Local"}</Text><Text style={[styles.label, { color: colors.muted }]}>{isSampleData ? "fallback mode" : "storage mode"}</Text></View></View><View style={[styles.premiumCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.premiumHeader}><Text style={[styles.premiumTitle, { color: colors.foreground }]}>{isSampleData ? "Sample journal preview" : "Local journal snapshot"}</Text><Text style={[styles.premiumBadge, { color: colors.primary }]}>{openActions} open</Text></View><Text style={[styles.premiumBody, { color: colors.muted }]}>{openActions > 0 ? "Your next actions are ready to revisit. Use the Library or Home to keep moving." : sermons.length > 0 ? "Your open actions are clear. Export a backup when you want an extra copy." : "Start with one sermon note. Everything here stays on this device."}</Text></View><View style={[styles.premiumCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.premiumHeader}><Text style={[styles.premiumTitle, { color: colors.foreground }]}>{monetizationReadiness.label}</Text><Text style={[styles.premiumBadge, { color: colors.success }]}>{entitlement.tier.toUpperCase()}</Text></View><Text style={[styles.premiumBody, { color: colors.muted }]}>{monetizationReadiness.message} {entitlement.message}</Text><Pressable accessibilityRole="button" accessibilityLabel="Premium access unavailable" accessibilityHint={premiumUnavailableMessage} accessibilityState={{ disabled: true }} disabled style={[styles.button, { borderColor: colors.border, opacity: 0.55 }]}><Text style={[styles.buttonText, { color: colors.muted }]}>Premium access unavailable</Text></Pressable></View><Text style={[styles.section, { color: colors.foreground }]}>Settings</Text><View style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.border }]}><Pressable accessibilityRole="button" accessibilityLabel="Change language" accessibilityHint="Saves the next available language preference on this device." accessibilityState={{ disabled: languageSaving }} onPress={cycleLanguage} style={[styles.row, languageSaving && { opacity: 0.65 }]} ><Text style={[styles.rowTitle, { color: colors.foreground }]}>Language</Text><Text style={[styles.rowValue, { color: colors.primary }]}>{languageSaving ? "Saving…" : languageLabel(language)}</Text><Text style={[styles.chevron, { color: colors.muted }]}>›</Text></Pressable>{languageError && <Text accessibilityRole="alert" style={[styles.inlineError, { color: colors.error }]}>{languageError}</Text>}{languageSavedMessage && <Text accessibilityRole="alert" style={[styles.inlineError, { color: colors.success }]}>{languageSavedMessage}</Text>}{languageRetry && <Pressable accessibilityRole="button" accessibilityLabel="Retry language save" accessibilityHint="Attempts to save the selected language again on this device." onPress={retryLanguageSave}><Text style={[styles.retryLink, { color: colors.primary }]}>{languageSaving ? "Saving…" : "Retry save"}</Text></Pressable>}<View style={styles.divider} /><View style={styles.row}><View style={styles.settingCopy}><Text style={[styles.rowTitle, { color: colors.foreground }]}>Reduced motion</Text><Text style={[styles.settingHint, { color: colors.muted }]}>Use fewer entrance transitions.</Text><Text style={[styles.settingStatus, { color: motionStatus === "error" ? colors.error : motionStatus === "saving" || motionSaving ? colors.warning : colors.success }]}>{motionSaving || motionStatus === "saving" ? "Saving locally…" : motionStatus === "error" ? "Not saved" : "Saved on this device"}</Text></View><Switch accessibilityLabel="Reduced motion" value={reducedMotion} disabled={motionSaving} onValueChange={toggleReducedMotion} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.background} /></View>{(motionMessage || preferenceError) && <Text accessibilityRole="alert" style={[styles.inlineError, { color: preferenceError || motionMessage?.includes("Could") || motionMessage?.includes("could") ? colors.error : colors.success }]}>{preferenceError ?? motionMessage}</Text>}{preferenceError && <Pressable accessibilityRole="button" accessibilityState={{ disabled: motionSaving }} onPress={() => void reloadPreferences()}><Text style={[styles.retryLink, { color: colors.primary }]}>{motionSaving ? "Loading…" : "Retry preference load"}</Text></Pressable>}<View style={styles.divider} /><View style={styles.row}><Text style={[styles.rowTitle, { color: colors.foreground }]}>Journal notes</Text><Text style={[styles.rowValue, { color: colors.muted }]}>{totalNotes} saved</Text></View><View style={styles.divider} /><View style={styles.row}><Text style={[styles.rowTitle, { color: colors.foreground }]}>Open action items</Text><Text style={[styles.rowValue, { color: openActions > 0 ? colors.warning : colors.success }]}>{openActions > 0 ? `${openActions} to revisit` : "All clear"}</Text></View><View style={styles.divider} /><View style={styles.row}><Text style={[styles.rowTitle, { color: colors.foreground }]}>Prayer Lock</Text><Text style={[styles.rowValue, { color: colors.muted }]}>{streak} day{streak === 1 ? "" : "s"}</Text></View></View><Pressable accessibilityRole="button" accessibilityLabel="Share local backup" accessibilityHint={!isHydrated ? "Wait for local journal loading to finish before exporting." : storageError ? "Retry local storage before exporting a backup." : isSaving ? "Wait for the latest journal changes to finish saving before exporting." : "Prepares the current on-device journal for the system share sheet."} accessibilityState={{ disabled: backupSaving || isSaving || !isHydrated || Boolean(storageError) }} onPress={shareLocalBackup} style={({ pressed }) => [styles.button, { borderColor: colors.primary }, (backupSaving || isSaving) && { opacity: 0.65 }, pressed && { opacity: 0.7 }]}><Text style={[styles.buttonText, { color: colors.primary }]}>{backupSaving ? "Preparing backup…" : "Share local backup"}</Text></Pressable>{backupMessage && <Text accessibilityRole="alert" style={[styles.inlineError, { color: backupMessage.includes("ready") ? colors.success : colors.error }]}>{backupMessage}</Text>}{isSampleData && <><Pressable accessibilityRole="button" accessibilityLabel="Use blank journal" accessibilityHint="Removes the clearly labeled sample journal and starts an empty local journal. This does not affect a personal journal." accessibilityState={{ disabled: !isHydrated || Boolean(storageError) || isSaving }} disabled={!isHydrated || Boolean(storageError) || isSaving} onPress={useBlankJournalSafely} style={({ pressed }) => [styles.button, { borderColor: colors.warning }, (!isHydrated || Boolean(storageError) || isSaving) && { opacity: 0.55 }, pressed && { opacity: 0.7 }]}><Text style={[styles.buttonText, { color: colors.warning }]}>Use blank journal</Text></Pressable>{blankJournalMessage && <Text accessibilityRole="alert" style={[styles.inlineError, { color: blankJournalMessage.includes("started") ? colors.success : colors.error }]}>{blankJournalMessage}</Text>}</>}<Pressable accessibilityRole="button" accessibilityLabel={restoreOpen ? "Close restore" : "Restore local backup"} accessibilityHint="Opens or closes the local backup restore workflow." onPress={() => { setRestoreOpen((value) => !value); setRestoreReviewOpen(false); setRestoreMessage(null); setRestorePreview(null); setRestoreDiff(null); setRestoreChanges(null); setSelectedRestoreChange(null); }} style={({ pressed }) => [styles.button, { borderColor: colors.border }, pressed && { opacity: 0.7 }]}><Text style={[styles.buttonText, { color: colors.foreground }]}>{restoreOpen ? "Close restore" : "Restore local backup"}</Text></Pressable>{restoreOpen && <View style={[styles.restoreCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.restoreHint, { color: colors.muted }]}>Paste a backup JSON export. Existing local notes will be replaced only after validation.</Text><TextInput value={restoreDraft} onChangeText={(value) => { setRestoreDraft(value); setRestoreReviewOpen(false); setRestorePreview(null); setRestoreDiff(null); setRestoreChanges(null); setSelectedRestoreChange(null); setRestoreMessage(null); }} multiline placeholder="Paste backup JSON here" placeholderTextColor={colors.muted} style={[styles.restoreInput, { borderColor: colors.border, color: colors.foreground }]} /><Pressable accessibilityRole="button" accessibilityLabel="Preview local backup" accessibilityHint={!isHydrated ? "Wait for local journal loading to finish before validating a backup." : storageError ? "Retry local storage before validating a backup." : "Validates the pasted backup without changing your journal."} accessibilityState={{ disabled: !isHydrated || Boolean(storageError) || restoreConfirming }} disabled={!isHydrated || Boolean(storageError) || restoreConfirming} onPress={restoreLocalBackup} style={[styles.button, { borderColor: colors.primary }, (!isHydrated || Boolean(storageError) || restoreConfirming) && { opacity: 0.55 }]}><Text style={[styles.buttonText, { color: colors.primary }]}>Preview backup</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Clear restore draft" accessibilityHint="Removes the pasted backup and closes its review state." onPress={clearRestoreDraft} style={[styles.button, { borderColor: colors.border }]}><Text style={[styles.buttonText, { color: colors.foreground }]}>Clear draft</Text></Pressable>{restorePreview?.valid && <View style={[styles.previewBox, { borderColor: colors.border }]}><Text style={[styles.restoreHint, { color: colors.foreground }]}>This backup contains {restorePreview.sermonCount} sermon{restorePreview.sermonCount === 1 ? "" : "s"} and a {restorePreview.streak}-day streak.</Text>{restorePreview.exportedAt && <Text style={[styles.restoreHint, { color: colors.muted }]}>Exported: {restorePreview.exportedAt}</Text>}{restoreDiff?.valid && <Text style={[styles.restoreHint, { color: colors.foreground }]}>Changes: {restoreDiff.added} added · {restoreDiff.updated} updated · {restoreDiff.removed} removed · {restoreDiff.unchanged} unchanged.</Text>}{restoreChanges?.valid && restoreChanges.changes.length > 0 && <View style={[styles.changeList, { borderColor: colors.border }]}><Text style={[styles.restoreHint, { color: colors.foreground }]}>First changes</Text>{restoreChanges.changes.map((change) => <Pressable accessibilityRole="button" accessibilityLabel={`${change.kind} ${change.title}`} key={`${change.kind}-${change.id}`} onPress={() => setSelectedRestoreChange(formatBackupChange(change))} style={({ pressed }) => [styles.changeRow, pressed && { opacity: 0.65 }]}><View style={styles.changeCopy}><Text style={[styles.restoreHint, { color: colors.foreground }]}>{change.kind === "added" ? "+" : change.kind === "removed" ? "−" : "↻"} {change.title}</Text><Text style={[styles.changeMeta, { color: colors.muted }]}>{change.speaker} · {change.date} · {change.noteCount} note{change.noteCount === 1 ? "" : "s"}</Text></View></Pressable>)}{restoreChanges.truncated && <Text style={[styles.restoreHint, { color: colors.muted }]}>More changes are included in the totals above.</Text>}{selectedRestoreChange && <Text style={[styles.restoreHint, { color: colors.primary }]}>{selectedRestoreChange}</Text>}</View>}<Pressable accessibilityRole="button" accessibilityLabel="Review backup before replacing journal" accessibilityHint="Opens a confirmation review before replacing the current local journal." accessibilityState={{ disabled: !restorePreview?.valid || !isHydrated || Boolean(storageError) || restoreConfirming }} disabled={!restorePreview?.valid || !isHydrated || Boolean(storageError) || restoreConfirming} onPress={() => setRestoreReviewOpen(true)} style={[styles.button, { borderColor: colors.warning }, (!restorePreview?.valid || !isHydrated || Boolean(storageError) || restoreConfirming) && { opacity: 0.55 }]}><Text style={[styles.buttonText, { color: colors.warning }]}>Review before replacing</Text></Pressable><Modal visible={restoreReviewOpen} transparent animationType="slide" onRequestClose={() => setRestoreReviewOpen(false)}><View style={styles.modalBackdrop}><View accessibilityViewIsModal accessibilityRole="alert" style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text accessibilityRole="header" style={[styles.modalTitle, { color: colors.foreground }]}>Replace local journal?</Text><Text style={[styles.restoreHint, { color: colors.muted }]}>This will replace the current on-device sermons with the validated backup. This action cannot be undone from the app.</Text>{restoreDiff?.valid && <Text style={[styles.restoreHint, { color: colors.foreground }]}>{restoreDiff.added} added · {restoreDiff.updated} updated · {restoreDiff.removed} removed · {restoreDiff.unchanged} unchanged</Text>}<Pressable accessibilityRole="button" accessibilityState={{ disabled: restoreConfirming }} onPress={confirmRestoreLocalBackup} style={[styles.button, { borderColor: colors.warning }, restoreConfirming && { opacity: 0.65 }]}><Text style={[styles.buttonText, { color: colors.warning }]}>{restoreConfirming ? "Restoring…" : "Confirm replacement"}</Text></Pressable><Pressable accessibilityRole="button" onPress={() => setRestoreReviewOpen(false)} style={[styles.button, { borderColor: colors.border }]}><Text style={[styles.buttonText, { color: colors.foreground }]}>Keep current journal</Text></Pressable></View></View></Modal></View>}{restoreMessage && <Text accessibilityRole="alert" style={[styles.inlineError, { color: restoreMessage.includes("safely") || restoreMessage.includes("validated") ? colors.success : colors.error }]}>{restoreMessage}</Text>}</View>}<Pressable accessibilityRole="button" accessibilityLabel="Open Bible Stories" accessibilityHint="Opens the local Bible story reflection library." onPress={() => router.push("/stories" as any)} style={({ pressed }) => [styles.button, { borderColor: colors.primary }, pressed && { opacity: 0.7 }]}><Text style={[styles.buttonText, { color: colors.primary }]}>Open Bible Stories</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Open Prayer Lock" accessibilityHint="Opens your local prayer habit tracker." onPress={() => router.push("/prayer-lock" as any)} style={({ pressed }) => [styles.button, { borderColor: colors.primary }, pressed && { opacity: 0.7 }]}><Text style={[styles.buttonText, { color: colors.primary }]}>Open Prayer Lock</Text></Pressable><Pressable accessibilityRole="button" accessibilityState={{ disabled: replayingOnboarding }} onPress={replayOnboarding} style={({ pressed }) => [styles.button, { borderColor: colors.border }, replayingOnboarding && { opacity: 0.65 }, pressed && { opacity: 0.7 }]}><Text style={[styles.buttonText, { color: colors.foreground }]}>{replayingOnboarding ? "Preparing onboarding…" : "Replay onboarding"}</Text></Pressable>{onboardingMessage && <Text accessibilityRole="alert" style={[styles.inlineError, { color: onboardingMessage.includes("Could") || onboardingMessage.includes("could") ? colors.error : colors.success }]}>{onboardingMessage}</Text>}<Pressable accessibilityRole="button" accessibilityLabel="Open Lock Screen and Live Activity status" accessibilityHint="Shows the current local availability status for these surfaces." onPress={() => router.push("/integrations" as any)} style={({ pressed }) => [styles.button, { borderColor: colors.border }, pressed && { opacity: 0.7 }]}><Text style={[styles.buttonText, { color: colors.foreground }]}>Lock Screen & Live Activity status</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Open capability center" accessibilityHint="Shows which local capabilities are currently available." onPress={() => router.push("/capabilities" as any)} style={({ pressed }) => [styles.button, { borderColor: colors.border }, pressed && { opacity: 0.7 }]}><Text style={[styles.buttonText, { color: colors.foreground }]}>Capability center</Text></Pressable><Text style={[styles.footer, { color: colors.muted }]}>Your journal is stored on this device. Export a local backup whenever you want an extra copy.</Text></ScreenContainer>;
}

const styles = StyleSheet.create({ eyebrow: { fontSize: 11, letterSpacing: 1.5, fontWeight: "800" }, title: { fontSize: 32, lineHeight: 38, fontWeight: "700", marginTop: 4, marginBottom: 18 }, profileCard: { borderRadius: 22, padding: 20, flexDirection: "row", alignItems: "center", gap: 14 }, avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFFDF8", alignItems: "center", justifyContent: "center" }, avatarText: { fontSize: 24, fontWeight: "800" }, name: { color: "#FFFDF8", fontSize: 20, fontWeight: "700" }, email: { color: "#DDE8D8", fontSize: 13, marginTop: 3 }, stats: { flexDirection: "row", gap: 52, paddingVertical: 22 }, stat: { fontSize: 24, fontWeight: "800" }, label: { fontSize: 12, marginTop: 2 }, section: { fontSize: 20, fontWeight: "700", marginBottom: 12 }, premiumCard: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 8, marginBottom: 20 }, premiumHeader: { flexDirection: "row", justifyContent: "space-between", gap: 10 }, premiumTitle: { fontSize: 16, fontWeight: "800" }, premiumBadge: { fontSize: 11, fontWeight: "800" }, premiumBody: { fontSize: 12, lineHeight: 18 }, inlineRecovery: { borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }, inlineRecoveryText: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: "600" }, list: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 16 }, row: { minHeight: 57, flexDirection: "row", alignItems: "center", gap: 10 }, rowTitle: { fontSize: 15, fontWeight: "600", flex: 1 }, settingCopy: { flex: 1, gap: 3 },   settingHint: { fontSize: 11, lineHeight: 15 }, settingStatus: { fontSize: 11, lineHeight: 15, fontWeight: "700" }, rowValue: { fontSize: 12 }, chevron: { fontSize: 24 }, inlineError: { fontSize: 12, lineHeight: 17, paddingBottom: 10 }, retryLink: { fontSize: 12, fontWeight: "800", paddingBottom: 10 }, divider: { height: 1, backgroundColor: "#E2E4D9" }, button: { minHeight: 52, borderWidth: 1, borderRadius: 15, alignItems: "center", justifyContent: "center", marginTop: 18 }, buttonText: { fontSize: 15, fontWeight: "700" }, restoreCard: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 10, marginTop: 18 }, restoreHint: { fontSize: 12, lineHeight: 18 }, restoreInput: { minHeight: 110, borderWidth: 1, borderRadius: 13, padding: 12, fontSize: 12, textAlignVertical: "top" }, previewBox: { borderWidth: 1, borderRadius: 13, padding: 10, gap: 4 }, changeList: { borderWidth: 1, borderRadius: 10, padding: 8, gap: 2 }, changeRow: { minHeight: 44, justifyContent: "center" }, changeCopy: { gap: 2 }, changeMeta: { fontSize: 11, lineHeight: 15 }, modalBackdrop: { flex: 1, backgroundColor: "rgba(20, 28, 22, 0.38)", justifyContent: "flex-end" }, modalCard: { borderWidth: 1, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 10 }, modalTitle: { fontSize: 22, fontWeight: "800" }, footer: { textAlign: "center", fontSize: 12, lineHeight: 18, marginTop: 18 } });
