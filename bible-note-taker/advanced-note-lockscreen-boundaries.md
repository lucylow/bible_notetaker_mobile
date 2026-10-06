# Advanced Note and Lock-Screen Boundaries

The local-first MVP now exposes readiness labels and validation helpers for the advanced note-taking and lock-screen specifications. It does **not** claim that native widgets, Dynamic Island controls, Android AppWidgets, rich-media file uploads, AI enhancement, or cloud synchronization are active.

## Lock-screen features

Prayer status, verse, sermon preview, and streak payloads can be serialized locally. Widget routes are allow-listed and unknown routes fall back to the Prayer Lock destination. Interactive controls, Live Activities, Dynamic Island updates, Android widgets, widget customization, and shared-state refresh still require platform targets, App Groups or Android shared storage, lifecycle handling, and native build configuration.

## Advanced notes

The local safety normalizer accepts only bounded text, known rich-block types, valid verse and tag strings, and local or HTTPS attachment URIs. Unsupported or malformed attachments are skipped and counted rather than being executed or persisted blindly. Rich formatting, templates, links, comments, multimedia processing, AI enhancement, and synchronization remain gated until native file handling, privacy/consent flows, conflict policies, and backend contracts are available.

## Error policy

Malformed imported or persisted data is converted to safe defaults. Unknown capability entries are ignored or restored from known defaults. Language storage falls back to English on read failure, while write failures are surfaced to the Profile screen without discarding the in-memory selection. These boundaries are intentional and should remain in place until the corresponding integrations are tested in a development build.
