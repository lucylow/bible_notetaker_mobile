import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/use-colors";

export function PressScale({ children, onPress, disabled = false }: { children: React.ReactNode; onPress: () => void; disabled?: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  return <Pressable disabled={disabled} onPress={onPress} onPressIn={() => Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }).start()} onPressOut={() => Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start()}><Animated.View style={{ transform: [{ scale }], opacity: disabled ? 0.5 : 1 }}>{children}</Animated.View></Pressable>;
}

export function UXPrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  const colors = useColors();
  return <PressScale onPress={onPress} disabled={disabled}><View style={[styles.primary, { backgroundColor: disabled ? colors.border : colors.primary }]}><Text style={styles.primaryText}>{label}</Text></View></PressScale>;
}

export function UXSecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const colors = useColors();
  return <PressScale onPress={onPress}><View style={[styles.secondary, { borderColor: colors.border }]}><Text style={[styles.secondaryText, { color: colors.foreground }]}>{label}</Text></View></PressScale>;
}

export function UXChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const colors = useColors();
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border }]}><Text style={{ color: selected ? "#FFFDF8" : colors.muted, fontSize: 12, fontWeight: "800" }}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({ primary: { minHeight: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }, primaryText: { color: "#FFFDF8", fontSize: 16, fontWeight: "800" }, secondary: { minHeight: 50, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 18 }, secondaryText: { fontSize: 15, fontWeight: "800" }, chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 9 } });
