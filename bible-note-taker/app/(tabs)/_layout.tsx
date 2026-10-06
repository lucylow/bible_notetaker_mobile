import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { StorageHealthBanner } from "@/components/storage-health-banner";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  return <><StorageHealthBanner /><Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarButton: HapticTab, tabBarStyle: { paddingTop: 8, paddingBottom: bottomPadding, height: 56 + bottomPadding, backgroundColor: colors.background, borderTopColor: colors.border, borderTopWidth: 0.5 } }}>
    <Tabs.Screen name="index" options={{ title: "Home", tabBarAccessibilityLabel: "Home tab", tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} /> }} />
    <Tabs.Screen name="library" options={{ title: "Library", tabBarAccessibilityLabel: "Library tab", tabBarIcon: ({ color }) => <IconSymbol size={24} name="books.vertical.fill" color={color} /> }} />
    <Tabs.Screen name="bible" options={{ title: "Bible", tabBarAccessibilityLabel: "Bible tab", tabBarIcon: ({ color }) => <IconSymbol size={24} name="book.closed.fill" color={color} /> }} />
    <Tabs.Screen name="profile" options={{ title: "Profile", tabBarAccessibilityLabel: "Profile tab", tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.crop.circle" color={color} /> }} />
  </Tabs></>;
}
