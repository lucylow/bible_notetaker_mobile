import AsyncStorage from "@react-native-async-storage/async-storage";

export const ONBOARDING_KEY = "bible-note-onboarding-complete";

type OnboardingStorage = Pick<typeof AsyncStorage, "getItem" | "setItem">;

export async function loadOnboardingComplete(storage: OnboardingStorage = AsyncStorage): Promise<boolean> {
  try {
    return (await storage.getItem(ONBOARDING_KEY)) === "1";
  } catch {
    return false;
  }
}

export async function resetOnboardingComplete(storage: OnboardingStorage = AsyncStorage): Promise<boolean> {
  try {
    await storage.setItem(ONBOARDING_KEY, "0");
    return (await storage.getItem(ONBOARDING_KEY)) !== "1";
  } catch {
    return false;
  }
}

export async function saveOnboardingComplete(storage: OnboardingStorage = AsyncStorage): Promise<boolean> {
  try {
    await storage.setItem(ONBOARDING_KEY, "1");
    return (await storage.getItem(ONBOARDING_KEY)) === "1";
  } catch {
    return false;
  }
}
