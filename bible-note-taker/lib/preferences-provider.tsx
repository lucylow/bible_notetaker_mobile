import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { loadReducedMotionPreference, saveReducedMotionPreference } from "@/lib/preferences";

type PreferencesContextValue = {
  reducedMotion: boolean;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  setReducedMotion: (value: boolean) => Promise<boolean>;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [reducedMotion, setReducedMotionState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReducedMotionState(await loadReducedMotionPreference());
    } catch {
      setError("Reduced-motion preference could not be loaded. Animations remain available.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const setReducedMotion = useCallback(async (value: boolean) => {
    const previous = reducedMotion;
    setReducedMotionState(value);
    setLoading(true);
    setError(null);
    try {
      const saved = await saveReducedMotionPreference(value);
      if (!saved) {
        setReducedMotionState(previous);
        setError("Could not save this preference on the device. Your previous setting was kept.");
        return false;
      }
      return true;
    } catch {
      setReducedMotionState(previous);
      setError("Could not save this preference on the device. Your previous setting was kept.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [reducedMotion]);

  const value = useMemo(() => ({ reducedMotion, loading, error, reload, setReducedMotion }), [reducedMotion, loading, error, reload, setReducedMotion]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function useAppPreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("useAppPreferences must be used inside PreferencesProvider");
  return value;
}
