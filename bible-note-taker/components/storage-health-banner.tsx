import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/use-colors";
import { useBibleNoteStore } from "@/lib/bible-note-store";

export function StorageHealthBanner() {
  const colors = useColors();
  const { isHydrated, isSaving, storageError, retryPersistence } = useBibleNoteStore();

  if (isHydrated && !storageError && !isSaving) return null;

  const isLoading = !isHydrated;
  const message = isLoading ? "Loading local journal…" : storageError ? "Local journal needs attention." : "Saving locally…";
  const detail = isLoading ? "Sample content remains available until local recovery finishes." : storageError ? "Your journal is still on this device. Retry to recover local storage." : "Keep this screen open while your latest changes are saved.";

  return (
    <View accessibilityRole="alert" style={[styles.banner, { backgroundColor: colors.surface, borderColor: storageError ? colors.error : colors.border }]}>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: storageError ? colors.error : colors.foreground }]}>{message}</Text>
        <Text style={[styles.detail, { color: colors.muted }]}>{detail}</Text>
      </View>
      {storageError && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry local journal"
          accessibilityHint="Attempts to recover and reload the journal stored on this device."
          onPress={retryPersistence}
          style={({ pressed }) => [styles.retry, { borderColor: colors.primary }, pressed && { opacity: 0.65 }]}
        >
          <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 8,
    left: 12,
    right: 12,
    zIndex: 50,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  copy: { flex: 1, gap: 2 },
  title: { fontSize: 12, lineHeight: 16, fontWeight: "800" },
  detail: { fontSize: 11, lineHeight: 15 },
  retry: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  retryText: { fontSize: 11, fontWeight: "800" },
});

export default StorageHealthBanner;

