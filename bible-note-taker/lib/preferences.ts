import AsyncStorage from "@react-native-async-storage/async-storage";

export const REDUCED_MOTION_KEY = "bible-note-reduced-motion";
type PreferenceStorage = Pick<typeof AsyncStorage, "getItem" | "setItem">;

export async function loadReducedMotionPreference(storage: PreferenceStorage = AsyncStorage): Promise<boolean> {
  try {
    return (await storage.getItem(REDUCED_MOTION_KEY)) === "1";
  } catch {
    return false;
  }
}

export async function saveReducedMotionPreference(value: boolean, storage: PreferenceStorage = AsyncStorage): Promise<boolean> {
  try {
    const serialized = value ? "1" : "0";
    await storage.setItem(REDUCED_MOTION_KEY, serialized);
    return (await storage.getItem(REDUCED_MOTION_KEY)) === serialized;
  } catch {
    return false;
  }
}
