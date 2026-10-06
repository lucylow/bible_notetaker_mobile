import { useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useBibleNoteStore } from "@/lib/bible-note-store";
import { getBibleReferences, normalizeBibleQuery } from "@/lib/bible-references";

export default function BibleScreen() {
  const colors = useColors();
  const { sermons, isHydrated, storageError, retryPersistence } = useBibleNoteStore();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(() => normalizeBibleQuery(q));
  const [copiedReference, setCopiedReference] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const references = useMemo(() => getBibleReferences(sermons), [sermons]);
  const filtered = useMemo(() => references.filter((item) => `${item.reference} ${item.text}`.toLowerCase().includes(query.toLowerCase())), [query, references]);
  const shareVerse = async (reference: string, text: string) => {
    try {
      await Share.share({ message: `${reference}\n“${text}”` });
      setShareError(null);
      setCopiedReference(reference);
    } catch {
      setShareError("Sharing is unavailable right now. Your notes remain saved on this device.");
    }
    setTimeout(() => setCopiedReference(null), 1800);
  };
  const featured = references[0];
  return <ScreenContainer className="px-5 pt-3"><Text style={[styles.eyebrow, { color: colors.muted }]}>SCRIPTURE & STUDY</Text><Text style={[styles.title, { color: colors.foreground }]}>Bible</Text>{!isHydrated && <Text accessibilityLiveRegion="polite" style={[styles.feedback, { color: colors.muted }]}>Loading local references…</Text>}{storageError && <View style={[styles.errorCard, { backgroundColor: colors.surface, borderColor: colors.error }]}><Text style={[styles.feedback, { color: colors.error }]}>{storageError}</Text><Pressable accessibilityRole="button" accessibilityLabel="Retry loading local references" accessibilityHint="Attempts to load your saved sermon notes again." onPress={retryPersistence}><Text style={[styles.share, { color: colors.primary }]}>Retry</Text></Pressable></View>}<View style={[styles.hero, { backgroundColor: colors.primary }]}><Text style={styles.heroLabel}>{featured.source === "local" ? "FROM YOUR SERMON NOTES" : "SAMPLE REFERENCE"}</Text><Text style={styles.heroText}>“{featured.text}”</Text><Text style={styles.heroRef}>{featured.reference}</Text></View><TextInput value={query} onChangeText={setQuery} placeholder="Search a verse reference" placeholderTextColor={colors.muted} style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]} /><View style={styles.chips}>{["All", "Hope", "Faith", "Action"].map((chip) => <Pressable key={chip} accessibilityRole="button" accessibilityLabel={`Filter Bible references by ${chip}`} onPress={() => setQuery(chip === "All" ? "" : chip)} style={[styles.chip, { borderColor: colors.border, backgroundColor: (chip === "All" && !query) ? colors.primary : colors.surface }]}><Text style={{ color: chip === "All" && !query ? "#FFFDF8" : colors.muted, fontSize: 12, fontWeight: "700" }}>{chip}</Text></Pressable>)}</View><Text style={[styles.section, { color: colors.foreground }]}>{references.some((item) => item.source === "local") ? "From your notes" : "Sample references"}</Text><FlatList data={filtered} keyExtractor={(item) => item.reference} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={[styles.verse, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={styles.verseHeader}><Text style={[styles.reference, { color: colors.primary }]}>{item.reference}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Share ${item.reference}`} accessibilityHint="Opens the system share sheet for this reference." onPress={() => void shareVerse(item.reference, item.text)}><Text style={[styles.share, { color: colors.primary }]}>{copiedReference === item.reference ? "Shared" : "Share"}</Text></Pressable></View><Text style={[styles.verseText, { color: colors.foreground }]}>{item.text}</Text></View>} />{shareError && <Text accessibilityRole="alert" style={[styles.feedback, { color: colors.error }]}>{shareError}</Text>}</ScreenContainer>;
}
const styles = StyleSheet.create({ eyebrow: { fontSize: 11, letterSpacing: 1.5, fontWeight: "800" }, title: { fontSize: 32, lineHeight: 38, fontWeight: "700", marginTop: 4, marginBottom: 18 }, hero: { borderRadius: 22, padding: 22, gap: 12, marginBottom: 18 }, heroLabel: { color: "#DDE8D8", fontSize: 11, letterSpacing: 1.3, fontWeight: "800" }, heroText: { color: "#FFFDF8", fontSize: 23, lineHeight: 31, fontWeight: "600" }, heroRef: { color: "#E3B36E", fontSize: 14, fontWeight: "700" }, search: { minHeight: 50, borderWidth: 1, borderRadius: 15, paddingHorizontal: 16, fontSize: 15, marginBottom: 10 }, chips: { flexDirection: "row", gap: 8, marginBottom: 20 }, chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8 }, section: { fontSize: 20, fontWeight: "700", marginBottom: 12 }, list: { gap: 12, paddingBottom: 28 }, verse: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 6 }, verseHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, reference: { fontSize: 13, fontWeight: "800" }, share: { fontSize: 12, fontWeight: "700" }, verseText: { fontSize: 16, lineHeight: 23 }, feedback: { fontSize: 13, lineHeight: 18, fontWeight: "600", marginBottom: 8 }, errorCard: { borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 } });
