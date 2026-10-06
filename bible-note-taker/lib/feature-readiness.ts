export type FeatureReadiness = "available" | "planned" | "native_build" | "backend_required";

export type FeatureReadinessItem = {
  key: string;
  title: string;
  description: string;
  readiness: FeatureReadiness;
};

const DEFAULT_FEATURES: FeatureReadinessItem[] = [
  { key: "prayer_lock", title: "Prayer Lock", description: "Complete guided prayer, gratitude, and reflection habits inside the app.", readiness: "available" },
  { key: "sermon_notes", title: "Sermon notes", description: "Capture timestamped insights, action items, tags, and series locally.", readiness: "available" },
  { key: "rich_note_formatting", title: "Rich note formatting", description: "Use headings, lists, quotes, and structured note blocks after the rich editor surface is connected.", readiness: "planned" },
  { key: "note_attachments", title: "Note attachments", description: "Attach media only after native file access, size limits, cleanup, and privacy handling are configured.", readiness: "native_build" },
  { key: "note_templates", title: "Note templates", description: "Create reusable sermon, prayer, devotional, and study structures with local validation.", readiness: "planned" },
  { key: "note_links_comments", title: "Note links and comments", description: "Cross-reference notes and add threaded comments after stable local models and sync conflict rules are defined.", readiness: "planned" },
  { key: "ai_note_enhancement", title: "AI note enhancement", description: "Suggest tags, summaries, and verse links only after explicit consent, privacy controls, and AI backend contracts are configured.", readiness: "backend_required" },
  { key: "audio_recording", title: "Audio recording", description: "Record and align sermon audio with timestamps.", readiness: "planned" },
  { key: "audio_playback", title: "Audio playback", description: "Play saved recordings and seek from focused notes after the native audio pass.", readiness: "native_build" },
  { key: "waveforms_and_trimming", title: "Waveforms and trimming", description: "Edit saved recordings with native-compatible waveform and trimming tools.", readiness: "native_build" },
  { key: "ai_summaries", title: "AI summaries", description: "Generate concise sermon summaries and suggested next steps.", readiness: "backend_required" },
  { key: "transcription_translation", title: "Transcription and translation", description: "Transcribe, diarize, and translate sermons only after backend, privacy, and language contracts are configured.", readiness: "backend_required" },
  { key: "text_to_speech", title: "Text to speech", description: "Read selected reflections aloud after native voice availability and language settings are confirmed.", readiness: "native_build" },
  { key: "voice_commands", title: "Voice commands", description: "Recognize a small set of safe navigation commands with unknown-command fallback.", readiness: "native_build" },
  { key: "voice_input", title: "Voice note input", description: "Convert spoken notes to text only after microphone permissions, recording lifecycle, and backend transcription contracts are configured.", readiness: "backend_required" },
  { key: "dynamic_translation", title: "Dynamic translation bundles", description: "Load validated language bundles from a configured backend and fall back to cached English safely.", readiness: "backend_required" },
  { key: "offline_translation_models", title: "Offline translation models", description: "Download and verify language models only after native file storage, checksums, lifecycle cleanup, and model licensing are configured.", readiness: "native_build" },
  { key: "translation_memory", title: "Translation memory", description: "Reuse locally validated translation pairs with bounded storage and privacy-aware import/export rules.", readiness: "planned" },
  { key: "machine_translation", title: "Machine translation", description: "Translate user content only with explicit consent, privacy controls, and a configured AI provider.", readiness: "backend_required" },
  { key: "voice_translation", title: "Voice translation", description: "Combine speech input, translation, and speech output only after native audio and backend contracts are configured.", readiness: "backend_required" },
  { key: "language_preference", title: "Language preference", description: "Choose a local language preference with a safe English fallback.", readiness: "planned" },
  { key: "lock_screen_widgets", title: "Lock Screen widgets", description: "Show prayer status, verse, and streak at a glance after native WidgetKit or Android AppWidget integration.", readiness: "native_build" },
  { key: "interactive_lock_screen", title: "Interactive Lock Screen controls", description: "Start, pause, resume, or complete prayer from a widget only after platform intents and shared-state synchronization are implemented.", readiness: "native_build" },
  { key: "dynamic_island_live_activity", title: "Dynamic Island and Live Activity", description: "Display multi-state prayer progress on iOS after ActivityKit capabilities, lifecycle handling, and deep-link routing are configured.", readiness: "native_build" },
  { key: "android_lock_screen_widgets", title: "Android lock-screen widgets", description: "Expose prayer and sermon previews through Android AppWidgets after a native Android build and platform-specific synchronization layer.", readiness: "native_build" },
  { key: "widget_customization", title: "Widget customization", description: "Choose widget types and order after native widget configuration storage and migration rules are defined.", readiness: "native_build" },
  { key: "widget_data_sync", title: "Widget data synchronization", description: "Refresh widget payloads from local state only after App Groups or Android shared storage contracts are implemented.", readiness: "native_build" },
  { key: "export_notes", title: "Export notes", description: "Share a sermon reflection as a document or text file.", readiness: "planned" },
  { key: "offline_import_export", title: "Offline import and export", description: "Validate local journal backups and recover safely from malformed files.", readiness: "available" },
  { key: "cloud_sync", title: "Cloud sync", description: "Sync pending local changes only after backend, ownership, conflict, and privacy contracts are configured.", readiness: "backend_required" },
  { key: "notifications_background", title: "Notifications and background tasks", description: "Schedule reminders and background checks only after permissions and native task behavior are configured.", readiness: "native_build" },
  { key: "deep_linking", title: "Deep links", description: "Open supported sermon and Bible routes with safe fallback for unknown destinations.", readiness: "available" },
  { key: "subscriptions", title: "Premium subscriptions", description: "Optional paid access through a configured App Store billing provider; purchases remain disabled in this local-first MVP.", readiness: "backend_required" },
  { key: "bible_story_library", title: "Bible story library", description: "Curated Bible stories with bounded local metadata are ready for a future story-reading surface; cloud content is not active.", readiness: "planned" },
  { key: "story_progress", title: "Story reading progress", description: "Local progress models can safely track a future story-reading flow after the library surface is added.", readiness: "planned" },
  { key: "ai_story_generation", title: "AI story generation", description: "Generate narrative content only after explicit consent, privacy controls, and a configured AI backend contract.", readiness: "backend_required" },
  { key: "story_media", title: "Story audio and video", description: "Story media remains gated until licensed assets, native playback, caching, and cleanup contracts are configured.", readiness: "native_build" },
  { key: "story_sharing", title: "Story sharing and community", description: "Public story publishing, likes, comments, and sharing require authenticated backend ownership and moderation rules.", readiness: "backend_required" },
];

export const featureReadiness: FeatureReadinessItem[] = DEFAULT_FEATURES;

const READINESS_VALUES: readonly FeatureReadiness[] = ["available", "planned", "native_build", "backend_required"];

export function normalizeFeatureReadiness(value: unknown): FeatureReadinessItem[] {
  if (!Array.isArray(value)) return DEFAULT_FEATURES;
  const defaultsByKey = new Map(DEFAULT_FEATURES.map((item) => [item.key, item]));
  const normalized: FeatureReadinessItem[] = [];
  const seen = new Set<string>();
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object") continue;
    const item = candidate as Record<string, unknown>;
    const key = typeof item.key === "string" ? item.key.trim() : "";
    if (!key || seen.has(key)) continue;
    const fallback = defaultsByKey.get(key);
    const readiness = READINESS_VALUES.includes(item.readiness as FeatureReadiness)
      ? item.readiness as FeatureReadiness
      : fallback?.readiness;
    if (!fallback || !readiness) continue;
    normalized.push({
      key,
      title: typeof item.title === "string" && item.title.trim() ? item.title.trim() : fallback.title,
      description: typeof item.description === "string" && item.description.trim() ? item.description.trim() : fallback.description,
      readiness,
    });
    seen.add(key);
  }
  return normalized.length ? normalized : DEFAULT_FEATURES;
}

export function getReadinessLabel(readiness: FeatureReadiness) {
  return { available: "Available now", planned: "Planned", native_build: "Native build", backend_required: "Backend setup" }[readiness];
}

export function isFeatureAvailable(readiness: FeatureReadiness) {
  return readiness === "available";
}
