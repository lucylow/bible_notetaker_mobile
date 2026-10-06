import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { MOTION } from "@/lib/motion";
import { saveOnboardingComplete } from "@/lib/onboarding";

const STEPS = [
  { number: "01", title: "Capture what you heard", body: "Keep sermon notes, Scripture references, and next steps together." },
  { number: "02", title: "Return to what matters", body: "Review your library and keep one faithful action in view." },
  { number: "03", title: "Make room to pray", body: "Use Prayer Lock for a small, repeatable moment of quiet." },
] as const;

export default function OnboardingScreen() {
  const colors = useColors();
  const reduceMotion = useReducedMotion();
  const entering = reduceMotion ? undefined : FadeInDown.duration(MOTION.duration);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const saved = await saveOnboardingComplete();
      if (!saved) {
        setSaveError("Could not save your onboarding choice. Please try again.");
        return;
      }
      router.replace("/(tabs)");
    } catch {
      setSaveError("Onboarding could not be completed safely. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="px-5 pt-8">
      <View style={styles.content}>
        <Animated.View entering={entering} style={styles.intro}>
          <View style={[styles.mark, { backgroundColor: colors.primary }]}><Text style={styles.markText}>✦</Text></View>
          <Text style={[styles.eyebrow, { color: colors.muted }]}>A QUIET PLACE TO RETURN</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Carry the message forward.</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Bible Note Taker helps you move from Sunday listening to Monday living—one note, one action, one prayer at a time.</Text>
        </Animated.View>
        <View style={styles.steps}>{STEPS.map((step, index) => <Animated.View key={step.number} entering={reduceMotion ? undefined : FadeInDown.delay(index * 65).duration(MOTION.duration)} style={[styles.step, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.stepNumber, { color: colors.warning }]}>{step.number}</Text><View style={styles.stepCopy}><Text style={[styles.stepTitle, { color: colors.foreground }]}>{step.title}</Text><Text style={[styles.stepBody, { color: colors.muted }]}>{step.body}</Text></View></Animated.View>)}</View>
        <Animated.View entering={reduceMotion ? undefined : FadeInDown.delay(240).duration(MOTION.duration)} style={styles.footer}>
          <Text style={[styles.localNote, { color: colors.muted }]}>Your journal starts on this device. You can export a local backup any time.</Text>
          {saveError && <Text accessibilityRole="alert" style={[styles.error, { color: colors.error }]}>{saveError}</Text>}
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: saving }} onPress={finish} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary }, saving && { opacity: 0.65 }, pressed && styles.pressed]}><Text style={styles.buttonText}>{saving ? "Saving your practice…" : "Begin your practice"}</Text></Pressable>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ content: { flex: 1, justifyContent: "space-between", paddingVertical: 20 }, intro: { gap: 14, paddingTop: 16 }, mark: { width: 64, height: 64, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 12 }, markText: { color: "#FFFDF8", fontSize: 30 }, eyebrow: { fontSize: 11, letterSpacing: 1.5, fontWeight: "800" }, title: { fontSize: 36, lineHeight: 42, fontWeight: "800", maxWidth: 360 }, subtitle: { fontSize: 16, lineHeight: 24, maxWidth: 390 }, steps: { gap: 12, marginVertical: 24 }, step: { borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: "row", gap: 14 }, stepNumber: { fontSize: 13, fontWeight: "800", paddingTop: 2 }, stepCopy: { flex: 1, gap: 4 }, stepTitle: { fontSize: 16, fontWeight: "800" }, stepBody: { fontSize: 13, lineHeight: 18 }, footer: { gap: 14 }, localNote: { fontSize: 12, lineHeight: 18, textAlign: "center" }, error: { fontSize: 12, lineHeight: 18, textAlign: "center", fontWeight: "700" }, button: { minHeight: 56, borderRadius: 17, alignItems: "center", justifyContent: "center" }, buttonText: { color: "#FFFDF8", fontSize: 16, fontWeight: "800" }, pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] } });
