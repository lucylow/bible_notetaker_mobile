import * as Haptics from "expo-haptics";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fallbackFeedbackMessage, sanitizeFeedbackMessage } from "@/lib/feedback-safety";
import { AccessibilityInfo, Platform, StyleSheet, Text, View } from "react-native";

type FeedbackTone = "info" | "success" | "warning" | "error";
type FeedbackContextValue = { showFeedback: (message: string, tone?: FeedbackTone) => void };
const FeedbackContext = createContext<FeedbackContextValue | null>(null);

function triggerFeedback(tone: FeedbackTone) {
  if (Platform.OS === "web") return;
  const task = tone === "success" ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) : tone === "warning" ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning) : tone === "error" ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  void task.catch(() => undefined);
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedback, setFeedback] = useState<{ message: string; tone: FeedbackTone } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showFeedback = useCallback((message: string, tone: FeedbackTone = "info") => {
    const safeMessage = sanitizeFeedbackMessage(message, fallbackFeedbackMessage(tone));
    triggerFeedback(tone);
    try {
      void Promise.resolve(AccessibilityInfo.announceForAccessibility?.(safeMessage)).catch(() => undefined);
    } catch {
      // Accessibility services can be unavailable on simulators and restricted devices.
    }
    setFeedback({ message: safeMessage, tone });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { timeoutRef.current = null; setFeedback(null); }, 2200);
  }, []);
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);
  const value = useMemo(() => ({ showFeedback }), [showFeedback]);
  return <FeedbackContext.Provider value={value}>{children}{feedback && <FeedbackBanner message={feedback.message} tone={feedback.tone} />}</FeedbackContext.Provider>;
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useFeedback must be used inside FeedbackProvider");
  return context;
}

function FeedbackBanner({ message, tone }: { message: string; tone: FeedbackTone }) {
  const color = tone === "success" ? "#48634B" : tone === "warning" ? "#C88A3D" : tone === "error" ? "#A85D4A" : "#24312B";
  return <View accessibilityRole="alert" style={[styles.banner, { backgroundColor: color }]}><Text style={styles.message}>{message}</Text></View>;
}

const styles = StyleSheet.create({
  banner: { position: "absolute", left: 20, right: 20, bottom: 78, zIndex: 20, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(36,49,43,0.12)" },
  message: { color: "#FFFDF8", fontSize: 14, fontWeight: "700" },
});
