import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useBibleNoteStore } from "@/lib/bible-note-store";
import { useColors } from "@/hooks/use-colors";
import { useFeedback } from "@/lib/feedback";
import { filterActionItems, flattenActionItems, type ActionListFilter, type ActionListItem } from "@/lib/action-list";

export default function ActionsScreen() {
  const colors = useColors();
  const { sermons, toggleAction } = useBibleNoteStore();
  const { showFeedback } = useFeedback();
  const [filter, setFilter] = useState<ActionListFilter>("open");
  const items = useMemo(() => filterActionItems(flattenActionItems(sermons), filter), [sermons, filter]);

  const renderItem = ({ item }: { item: ActionListItem }) => (
    <Pressable accessibilityRole="button" accessibilityLabel={`Open action: ${item.description}`} onPress={() => router.push({ pathname: "/sermon/[id]", params: { id: item.sermonId } })} style={({ pressed }) => [styles.row, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${item.completed ? "Reopen" : "Complete"} ${item.description}`} onPress={(event) => { event.stopPropagation(); const success = toggleAction(item.sermonId, item.id); showFeedback(success ? (item.completed ? "Action reopened." : "Action completed.") : "This action is no longer available. Nothing changed.", success ? (item.completed ? "info" : "success") : "warning"); }} style={[styles.check, { borderColor: item.completed ? colors.success : colors.border, backgroundColor: item.completed ? colors.success : "transparent" }]}><Text style={styles.checkText}>{item.completed ? "✓" : ""}</Text></Pressable>
      <View style={styles.copy}><Text style={[styles.kicker, { color: colors.muted }]}>{item.sermonTitle}</Text><Text style={[styles.description, { color: colors.foreground }, item.completed && styles.completed]}>{item.description}</Text></View><Text style={[styles.chevron, { color: colors.muted }]}>›</Text>
    </Pressable>
  );

  return <ScreenContainer className="px-5 pt-3"><View style={styles.header}><Pressable accessibilityRole="button" onPress={() => router.back()}><Text style={[styles.back, { color: colors.primary }]}>‹ Back</Text></Pressable><Text style={[styles.title, { color: colors.foreground }]}>Action steps</Text><Text style={[styles.subtitle, { color: colors.muted }]}>{items.length} {filter === "all" ? "total" : filter}</Text></View><View style={styles.filters}>{(["open", "completed", "all"] as ActionListFilter[]).map((value) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: filter === value }} onPress={() => setFilter(value)} style={[styles.filter, { backgroundColor: filter === value ? colors.primary : colors.surface, borderColor: filter === value ? colors.primary : colors.border }]}><Text style={[styles.filterText, { color: filter === value ? "#FFFDF8" : colors.muted }]}>{value[0].toUpperCase() + value.slice(1)}</Text></Pressable>)}</View>{items.length === 0 ? <View style={styles.empty}><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{filter === "open" ? "You’re all caught up." : "Nothing here yet."}</Text><Text style={[styles.emptyBody, { color: colors.muted }]}>Completed and open steps stay on this device and can be revisited anytime.</Text><Pressable accessibilityRole="button" onPress={() => setFilter(filter === "open" ? "all" : "open")}><Text style={[styles.emptyLink, { color: colors.primary }]}>{filter === "open" ? "View all steps" : "View open steps"}</Text></Pressable></View> : <FlatList data={items} keyExtractor={(item) => `${item.sermonId}-${item.id}`} renderItem={renderItem} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />}</ScreenContainer>;
}

const styles = StyleSheet.create({ header: { gap: 6, marginBottom: 14 }, back: { fontSize: 16, fontWeight: "700", marginBottom: 10 }, title: { fontSize: 32, lineHeight: 38, fontWeight: "700" }, subtitle: { fontSize: 13 }, filters: { flexDirection: "row", gap: 8, marginBottom: 14 }, filter: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8 }, filterText: { fontSize: 12, fontWeight: "800" }, list: { gap: 10, paddingBottom: 32 }, row: { borderWidth: 1, borderRadius: 17, padding: 14, flexDirection: "row", alignItems: "center", gap: 11 }, check: { width: 24, height: 24, borderRadius: 8, borderWidth: 1, alignItems: "center", justifyContent: "center" }, checkText: { color: "#FFFDF8", fontSize: 14, fontWeight: "800" }, copy: { flex: 1, gap: 3 }, kicker: { fontSize: 12, fontWeight: "700" }, description: { fontSize: 15, lineHeight: 21, fontWeight: "600" }, completed: { textDecorationLine: "line-through", opacity: 0.55 }, chevron: { fontSize: 27 }, empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10, padding: 24 }, emptyTitle: { fontSize: 22, fontWeight: "800", textAlign: "center" }, emptyBody: { fontSize: 14, lineHeight: 20, textAlign: "center" }, emptyLink: { fontSize: 14, fontWeight: "800", marginTop: 4 }, pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] } });
