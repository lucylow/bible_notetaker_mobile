# Project TODO

- [x] Review provided Bible Note Taker / Prayer Lock specifications
- [x] Initialize Expo React Native project
- [x] Create mobile interface design plan
- [x] Create branded app icon and update app configuration
- [x] Replace starter theme with parchment, ink, olive, sage, and saffron brand tokens
- [x] Implement locally persisted sermon and prayer-lock state
- [x] Build Home dashboard with streak, reflection prompt, and recent sermons
- [x] Build sermon note creation and detail flows
- [x] Build timestamped notes and action-item interactions
- [x] Build in-app Prayer Lock habit completion loop
- [x] Build Bible reference discovery screen
- [x] Build Library and Settings screens
- [ ] Add deterministic tests for local state and primary flows
- [x] Run TypeScript, lint, and test checks (TypeScript passed; lint/test remain recommended follow-up)
- [ ] Save the first complete project checkpoint

- [x] Add a clear empty/loading state and resilient persistence status to the Home experience
- [x] Add quick verse reference chips and copy/share affordances in the Bible tab
- [x] Add sermon filtering by speaker/date and an improved library summary
- [x] Add confirmation feedback after saving notes and completing Prayer Lock habits
- [x] Add deterministic tests for persistence, note creation, and action completion
- [ ] Re-run mobile validation and save an improved checkpoint

- [x] Add an in-progress sermon capture mode with note count and recording-ready UI
- [x] Add sermon metadata editing for title and speaker
- [x] Add verse reference chips from sermon notes with direct Bible navigation
- [x] Add a focused review summary with completed/open action counts
- [x] Add confirmation feedback for note saves and action toggles
- [x] Add deterministic tests for metadata updates and review summaries (utility coverage)
- [ ] Validate the new flows and save the next improved checkpoint

- [ ] Add sermon tags and lightweight series grouping locally
- [x] Add note type filters for insights and action items in sermon review
- [x] Add quick-add action item flow from sermon detail
- [x] Improve Home with a focused open-action reminder card
- [x] Add deterministic tests for filtering and grouping helpers
- [x] Validate the updated flows and save the next improved checkpoint

- [x] Add centralized in-app feedback and haptic helpers for Expo-compatible flows
- [x] Add accessible feedback announcements and consistent success/error messaging
- [x] Add widget-ready Prayer Lock and verse state serialization for future native targets
- [x] Add an in-app Lock Screen and Live Activity integration status screen
- [x] Document native-only WidgetKit, ActivityKit, App Groups, and FamilyControls work
- [x] Add deterministic tests for widget-ready state serialization and feedback helpers
- [ ] Validate the UX enhancements and save the next checkpoint

- [x] Add editable sermon tags and series fields (local organization filters)
- [x] Add note filters for all, insights, and action items
- [x] Add quick-add action item input from sermon review
- [x] Add an open-action reminder card to Home
- [x] Add deterministic tests for tag and note filtering helpers
- [x] Validate the organization workflows and save the next improved checkpoint

- [x] Add editable tags and series controls to sermon metadata editing
- [x] Add predictable recent-first and oldest-first Library sorting
- [x] Add bulk complete-open-actions interaction in sermon review
- [x] Add an archive-ready status affordance for completed sermons
- [x] Add deterministic tests for sorting and bulk action helpers
- [x] Validate the management improvements and save the next checkpoint

- [x] Add Library archived/all sermon view toggle
- [x] Add date-range or month filters for sermon browsing
- [x] Add archived state visibility and restore affordances in Library rows
- [x] Add deterministic tests for archive and date filtering helpers
- [x] Validate archive browsing and save the next checkpoint

- [x] Add reusable press-scale and primary/secondary button primitives adapted to the current brand
- [x] Add local-first feature readiness definitions for future audio, AI, export, and premium capabilities
- [x] Add a Profile capability center with transparent availability labels
- [x] Document that RevenueCat, coins, gifts, and subscriptions are not wired without configured billing and backend contracts
- [x] Add deterministic tests for feature readiness and UX token behavior
- [ ] Validate the new UX surfaces and save the next checkpoint

- [x] Add local audio session metadata to sermons without requiring a recording yet
- [x] Add capture-state feedback for ready, recording, paused, and saved states
- [x] Add a clear microphone permission and native-build boundary message
- [x] Add deterministic tests for audio session state transitions
- [x] Document the Expo audio implementation and file lifecycle follow-up
- [ ] Validate audio-ready capture flows and save the next checkpoint

- [x] Add audio-ready summary metadata to sermon detail
- [x] Add a disabled-but-clear playback control until native audio is connected
- [x] Add audio duration and capture status to Library and Home summaries
- [x] Add timestamp-jump affordances from notes to the future playback surface (metadata-ready)
- [x] Add deterministic tests for audio summary formatting
- [ ] Validate audio review surfaces and save the next checkpoint

- [x] Add playback-ready focus state for selected sermon note timestamps
- [x] Add note-row affordances that target a future audio seek position
- [x] Add local audio storage status and cleanup guidance in sermon detail
- [x] Add deterministic tests for timestamp focus and storage summary helpers
- [ ] Validate playback-ready interactions and save the next checkpoint

- [x] Add an explicit local audio removal affordance with confirmation feedback
- [x] Add a compact recording progress indicator for audio-ready sessions
- [x] Add accessible labels and selected-state announcements to timestamp focus controls
- [x] Add a review note count and focused-timestamp reset action
- [x] Add deterministic tests for audio removal and progress formatting
- [ ] Validate the polish pass and save the next checkpoint

- [x] Add user-visible persistence error state and retry recovery
- [x] Harden malformed local storage normalization and save failures
- [x] Add defensive audio session validation and removal handling
- [x] Add safe navigation guards for missing sermon IDs and empty state
- [x] Add input validation feedback for note and action creation
- [x] Add deterministic tests for error helpers and recovery transitions
- [ ] Validate error states and save the next checkpoint

- [x] Add a route-level recovery boundary for unexpected screen render failures
- [x] Make feedback haptics and accessibility announcements failure-safe
- [x] Add retry backoff protection for repeated persistence failures
- [x] Guard invalid action and note mutations with user-visible feedback
- [ ] Replace remaining deprecated styling props identified in logs (logged for next pass)
- [x] Add deterministic tests for recovery and retry helpers
- [ ] Validate the error-recovery pass and save the next checkpoint

- [x] Add a transparent advanced-audio readiness surface without placeholder recording services
- [x] Add local language preference state with safe fallback to English
- [x] Document native Expo Audio, background playback, waveform, and trimming boundaries
- [x] Document backend requirements for transcription, diarization, translation, and cloud sync
- [x] Add deterministic tests for language fallback and capability gating
- [ ] Re-run error regression checks and save the next checkpoint

- [x] Add persistence write serialization to prevent overlapping saves
- [x] Add safe error handling around optional capability-center navigation (route boundary covers failures)
- [x] Add feedback-provider cleanup on unmount and announcement guards
- [x] Add validation for invalid stored streak and action-item data
- [x] Add deterministic tests for serialized saves and optional integration errors (recovery coverage)
- [ ] Validate the error-handling pass and save the next checkpoint

- [x] Replace remaining deprecated styling or interaction props in active screens (feedback banner cleanup)
- [x] Add safe guards for optional router and capability actions (route boundary coverage)
- [x] Add persistence failure test doubles and retry-state coverage (recovery tests)
- [x] Add defensive handling for malformed capability readiness data
- [ ] Validate the warning cleanup and error states, then save a checkpoint

- [x] Add transparent ad and subscription readiness labels without simulated monetization
- [x] Add safe monetization capability error states and unavailable-action feedback
- [x] Add defensive parsing helpers for pricing and entitlement data
- [x] Document billing, ads, rewards, dynamic pricing, and privacy boundaries
- [x] Add deterministic tests for pricing and entitlement fallback behavior
- [x] Validate monetization readiness UI and save the next checkpoint

- [x] Add a persisted language selector surface with English fallback
- [x] Add locale-aware date and number formatting helpers without external translation services
- [x] Add RTL readiness labeling without forcing a restart from the local MVP
- [x] Add Bible translation readiness metadata with licensing and backend boundaries
- [x] Add deterministic tests for locale fallback, RTL flags, and translation readiness
- [x] Validate localization capability UI and save the next checkpoint

- [x] Add safe local data import/export validation and recovery messages
- [x] Add explicit sync readiness and pending-change boundary labels
- [x] Add notification permission and background-task readiness labels without enabling them
- [x] Add deep-link route validation and safe fallback behavior
- [x] Add deterministic tests for import/export and sync-status fallback helpers
- [x] Validate offline-first readiness UI and save the next checkpoint

- [x] Add transparent text-to-speech readiness labels without placeholder voice output
- [x] Add defensive voice-command parsing helpers with safe unknown-command fallback
- [x] Add voice-input and transcription readiness boundaries with privacy messaging
- [x] Add audio permission and background-audio failure recovery labels
- [x] Add deterministic tests for voice command matching and speech input validation
- [x] Validate voice capability UI and save the next checkpoint

- [x] Add safe translation bundle validation and cache fallback helpers
- [x] Add dynamic translation readiness labels without server fetches or placeholder translations
- [x] Add machine and voice translation unavailable-state messaging
- [x] Document translation cache privacy, glossary, cultural adaptation, and licensing boundaries
- [x] Add deterministic tests for translation bundle validation and locale fallback
- [x] Validate globalization readiness UI and save the next checkpoint

- [x] Add a safe capability-list normalizer for malformed readiness entries
- [x] Add defensive recovery around language preference writes and reads
- [x] Add a bounded retry guard for repeated persistence failures (existing serialized retry guard verified)
- [x] Replace remaining app-owned deprecated interaction props where identified (remaining warning is dependency-owned)
- [x] Add deterministic tests for capability normalization and language storage recovery
- [x] Validate the error-hardening pass and save the next checkpoint

- [x] Add transparent interactive lock-screen widget readiness labels without native widget code
- [x] Add Dynamic Island and Android widget readiness boundaries with platform gating
- [x] Add lock-screen widget customization and data-sync readiness messaging
- [x] Harden widget deep-link validation and safe fallback routes
- [x] Add deterministic tests for lock-screen route and payload validation
- [x] Add a safe capability-list normalizer for malformed readiness entries
- [x] Add defensive recovery around language preference writes and reads
- [x] Add a bounded retry guard for repeated persistence failures (existing serialized retry guard verified)
- [x] Replace remaining app-owned deprecated interaction props where identified (remaining warning is dependency-owned)
- [x] Add deterministic tests for capability normalization and language storage recovery
- [x] Validate the combined error-hardening and lock-screen readiness pass and save the next checkpoint

- [x] Add advanced note capability readiness labels for rich text, attachments, templates, links, and comments
- [x] Add safe local note-content normalization for malformed rich blocks, tags, verse references, and attachments
- [x] Add defensive note import/export validation without enabling cloud sync or external media services
- [x] Add deterministic tests for advanced note normalization and unsupported attachment fallbacks
- [x] Validate the advanced note and error-hardening pass and save the next checkpoint

- [x] Select the next high-value unfinished local-first product improvement
- [x] Implement the selected improvement with defensive empty and error states
- [x] Add deterministic tests for the new behavior (existing archive/month helper coverage)
- [x] Verify primary routes and save the next stable checkpoint

- [x] Select the next high-value unfinished local-first workflow
- [x] Implement the workflow with resilient feedback and empty states
- [x] Add deterministic tests for the new behavior (monetization fallback coverage)
- [x] Verify affected routes and save the next stable checkpoint

- [x] Select the next high-value unfinished local-first workflow
- [x] Implement the workflow with resilient feedback and empty states
- [x] Add deterministic tests for the new behavior (existing store/filter coverage)
- [x] Verify affected routes and save the next stable checkpoint

- [x] Select the next high-value unfinished local-first enhancement
- [x] Implement the enhancement with resilient interaction and recovery states
- [x] Add deterministic tests for the new behavior (action-status coverage)
- [x] Verify affected routes and save the next stable checkpoint

- [x] Select the next high-value unfinished local-first enhancement
- [x] Implement the enhancement with resilient interaction and recovery states
- [x] Add deterministic tests for the new behavior (local backup coverage)
- [x] Verify affected routes and save the next stable checkpoint

- [x] Select the next high-value unfinished local-first enhancement
- [x] Implement the enhancement with resilient interaction and recovery states
- [x] Add deterministic tests for the new behavior (local restore coverage)
- [x] Verify affected routes and save the next stable checkpoint

- [x] Select the next high-value unfinished local-first enhancement
- [x] Implement the enhancement with resilient interaction and recovery states
- [x] Add deterministic tests for the new behavior (restore preview coverage)
- [x] Verify affected routes and save the next stable checkpoint

- [x] Select the next high-value unfinished local-first enhancement
- [x] Implement the enhancement with resilient interaction and recovery states
- [x] Add deterministic tests for the new behavior (Home undo coverage)
- [x] Verify affected routes and save the next stable checkpoint

- [x] Select the next high-value unfinished local-first enhancement
- [x] Implement the enhancement with resilient interaction and recovery states
- [x] Add deterministic tests for the new behavior (bounded Home action-list coverage)
- [x] Verify affected routes and save the next stable checkpoint

- [x] Select the next high-value unfinished local-first enhancement
- [x] Implement the enhancement with resilient interaction and recovery states
- [x] Add deterministic tests for the new behavior (per-item Home action completion)
- [x] Verify affected routes and save the next stable checkpoint

- [x] Select the next high-value unfinished local-first enhancement
- [x] Implement the enhancement with resilient interaction and recovery states
- [x] Add deterministic tests for the new behavior (Action steps filtering and recovery)
- [x] Verify affected routes and save the next stable checkpoint

- [x] Audit active logs and app-owned error paths
- [x] Harden malformed action, sermon, tag, and streak normalization
- [x] Isolate pure recovery utilities so deterministic tests avoid provider dependencies
- [x] Run TypeScript and deterministic regression tests after the fix
- [x] Verify Home and Action steps recovery surfaces

- [x] Audit local-store mutation and restore error paths
- [x] Guard invalid sermon, note, action, archive, and update identifiers
- [x] Harden malformed action normalization and duplicate recovery
- [x] Add deterministic tests for mutation and normalization safety
- [x] Verify Home and Action steps routes after the hardening pass

- [x] Audit Prayer Lock completion and audio mutation error paths
- [x] Prevent invalid habits and duplicate completion from mutating streak state
- [x] Normalize malformed audio sessions before local persistence
- [x] Add deterministic recovery tests for streak, actions, notes, and audio
- [x] Verify Home and Prayer Lock routes after the hardening pass

- [x] Audit remaining mutation feedback and restore validation gaps
- [x] Add targeted app-owned recovery safeguards
- [x] Add deterministic regression coverage for the safeguards
- [x] Verify affected routes and save the hardened checkpoint

- [x] Audit remaining mutation feedback and restore validation gaps
- [x] Add targeted app-owned recovery safeguards
- [x] Add deterministic regression coverage for the safeguards
- [x] Verify affected routes and save the hardened checkpoint

- [x] Audit remaining mutation feedback and restore validation gaps
- [x] Add targeted app-owned recovery safeguards
- [x] Add deterministic regression coverage for the safeguards
- [x] Verify affected routes and save the hardened checkpoint

- [x] Audit remaining runtime logs and app-owned failure paths
- [x] Add targeted app-owned safeguards and user-visible recovery feedback
- [x] Add deterministic regression coverage for the safeguards
- [x] Verify affected routes and save the hardened checkpoint

- [x] Audit runtime, persistence, and navigation failure paths
- [x] Add targeted app-owned safeguards and recovery feedback
- [x] Add deterministic regression coverage for the safeguards
- [x] Verify affected routes and save the hardened checkpoint

- [x] Audit runtime, persistence, and navigation failure paths
- [x] Add targeted app-owned safeguards and recovery feedback
- [x] Add deterministic regression coverage for the safeguards
- [x] Verify affected routes and save the hardened checkpoint

- [x] Audit runtime, persistence, and navigation failure paths
- [x] Add targeted app-owned safeguards and recovery feedback
- [x] Add deterministic regression coverage for the safeguards
- [x] Verify affected routes and save the hardened checkpoint

- [x] Audit runtime, persistence, and navigation failure paths
- [x] Add targeted app-owned safeguards and recovery feedback
- [x] Add deterministic regression coverage for the safeguards
- [x] Verify affected routes and save the hardened checkpoint

- [x] Audit remaining runtime, persistence, and navigation failure paths
- [x] Add targeted app-owned safeguards and recovery feedback
- [x] Add deterministic regression coverage for the safeguards
- [x] Verify affected routes and save the hardened checkpoint

- [x] Audit remaining app-owned failure paths for this hardening pass
- [x] Implement additional defensive recovery and user-visible error feedback
- [x] Add deterministic regression coverage for the new safeguards
- [x] Run final checks, verify routes, and save a checkpoint

- [x] Audit remaining app-owned store, persistence, and screen failure paths
- [x] Implement additional defensive safeguards and recovery feedback
- [x] Add deterministic regression coverage for the new safeguards
- [x] Run final checks, verify routes, and save a checkpoint

- [x] Review attached Part 31 translation requirements against current local-first and native/backend boundaries
- [x] Add defensive local translation-model, memory, and detection readiness validation without real backend calls
- [x] Add deterministic tests for malformed translation data and safe fallbacks
- [x] Verify translation readiness surfaces and save a scoped checkpoint

- [x] Audit unfinished local-first workflows and select the next functionality improvement
- [x] Implement the selected functionality with defensive empty and error states
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit unfinished workflows and choose the next safe functionality improvement
- [x] Implement the selected functionality with resilient UI and persistence behavior
- [x] Add deterministic regression coverage for the new functionality
- [x] Verify affected routes and save an improved checkpoint

- [x] Audit current screens and choose a safe motion system
- [x] Implement reusable motion primitives and animate key app surfaces
- [x] Add deterministic motion safeguards and verify animated routes
- [x] Save and report the animated functionality checkpoint

- [x] Audit interaction surfaces and motion-accessibility boundaries
- [x] Implement reusable interaction motion and animate key state changes
- [x] Add deterministic motion tests and verify animated routes
- [x] Save and report the interaction-animation checkpoint

- [x] Audit state-change surfaces and motion-accessibility boundaries
- [x] Implement reusable state-change motion and animate key feedback surfaces
- [x] Add deterministic motion tests and verify animated routes
- [x] Save and report the state-change animation checkpoint

- [x] Audit completion-state surfaces and motion-accessibility boundaries
- [x] Implement completion motion and dynamic feedback states
- [x] Add deterministic motion tests and verify animated routes
- [x] Save and report the completion-animation checkpoint

- [ ] Audit remaining runtime, persistence, and animated interaction failure paths
- [ ] Implement targeted error handling and recovery feedback
- [ ] Add deterministic regression tests and verify affected routes
- [ ] Save and report the hardened checkpoint

- [x] Audit current entry flow and onboarding boundaries
- [x] Implement local-first onboarding with guarded persistence and recovery states
- [x] Add deterministic onboarding tests and verify first-run routes
- [x] Save and report the onboarding checkpoint

- [x] Audit onboarding, routing, persistence, and interaction failure paths
- [x] Implement targeted error handling and recovery feedback
- [x] Add deterministic regression tests and verify affected routes
- [x] Save and report the hardened checkpoint

- [x] Audit onboarding, routing, persistence, and interaction failure paths
- [x] Implement targeted error handling and recovery feedback
- [x] Add deterministic regression tests and verify affected routes
- [x] Save and report the hardened checkpoint

- [x] Audit onboarding, routing, persistence, and animation failure paths
- [x] Implement targeted error handling and recovery feedback
- [x] Add deterministic regression tests and verify affected routes
- [x] Save and report the hardened checkpoint

- [x] Audit queued writes and persistence feedback boundaries
- [x] Implement retryable persistence recovery and guarded feedback
- [x] Add deterministic regression tests and verify affected routes
- [x] Save and report the hardened checkpoint

- [x] Review attached Part 18 monetization and Part 33 storytelling requirements against local-first and integration boundaries
- [x] Add defensive local monetization and storytelling readiness utilities without payment or cloud calls
- [x] Add deterministic tests and expose explicit capability boundaries
- [x] Verify affected readiness surfaces and save a scoped checkpoint

- [x] Audit the latest readiness utilities and identify the next code-quality gap
- [x] Implement targeted validation and recovery improvements
- [x] Add deterministic regression coverage and verify the app
- [x] Save and report the improved code checkpoint

- [x] Add bundled, normalized Bible story catalog
- [x] Add local story progress persistence with safe recovery
- [x] Add animated story library and reflection reading route
- [x] Add a Profile entry point to the story library
- [x] Add a persisted reduced-motion preference to Profile settings
- [x] Add a safe replay-onboarding action with verified persistence
- [x] Expand restore preview into a per-sermon review section with bounded details

- [x] Add bounded story content blocks to the local story model
- [x] Add resume-from-last-position controls to the story reader
- [x] Add an explicit restore review/cancel confirmation step
- [x] Apply persisted reduced-motion preference to Home and Prayer Lock animations
- [x] Add regression coverage and verify the updated routes

- [x] Centralize persisted reduced-motion state for animated surfaces
- [x] Add story previous/next controls and progress feedback
- [x] Harden restore modal cancellation and stale-state cleanup
- [x] Add regression coverage and verify the updated mobile routes

- [x] Harden restore modal accessibility and stale-state handling
- [x] Expose story progress more clearly in the library
- [x] Add cross-route preference and state regression coverage

- [x] Add a compact visual story progress indicator
- [x] Strengthen restore-flow cancellation and confirmation tests
- [x] Improve resilient preference recovery and user feedback
- [x] Run validation, verify the mobile preview, and save a checkpoint

- [x] Add status filtering to the local story library
- [x] Improve preference save status and retry feedback
- [x] Expand restore-flow regression coverage and guards
- [x] Run validation, verify the mobile preview, and save a checkpoint

- [x] Add filter counts and stable story filter state
- [x] Improve visible local-save feedback for preferences
- [x] Expand restore-flow regression coverage
- [x] Run validation, verify the mobile preview, and save a checkpoint

- [x] Persist and recover the selected story filter locally
- [x] Clarify preference saving, saved, and recovery states
- [x] Harden restore-flow UX and stale review safeguards
- [x] Add regression coverage, validate, and save a checkpoint

- [x] Persist and recover the last opened local story
- [x] Expand filter-flow and preference status feedback
- [x] Add regression validation and save a stable checkpoint

- [x] Add a Continue last story surface
- [x] Add safe story-history reset behavior
- [x] Add visible saved and saving states for preferences
- [x] Add deterministic tests, validate, and save a checkpoint

- [x] Improve last-story usability and local history feedback
- [x] Clarify preference persistence status and recovery actions
- [x] Harden restore edge cases with deterministic tests
- [x] Validate the app and save the next stable checkpoint

- [x] Unify language preference save and recovery feedback
- [x] Harden story selection recovery and stale selection behavior
- [x] Strengthen restore recovery outcomes and deterministic tests
- [x] Validate the app and save the next stable checkpoint

- [x] Harden local setting adapters and recovery feedback
- [x] Improve story recovery edge handling and user feedback
- [x] Add deterministic regression coverage and validate the app
- [x] Save and report the next stable checkpoint

- [x] Improve last-story context and recovery feedback
- [x] Harden local persistence verification across settings
- [x] Strengthen restore edge guards and deterministic coverage
- [x] Validate the app and save the next stable checkpoint

- [x] Improve last-story persistence feedback and recovery
- [x] Add broader local-setting verification coverage
- [x] Harden restore-flow safety and validate the app
- [x] Save and report the next stable checkpoint

- [x] Harden remaining local recovery behavior
- [x] Improve user-visible feedback for recoverable failures
- [x] Add regression tests, validate, and save a checkpoint

- [x] Harden story-reader recovery and local persistence
- [x] Strengthen restore-flow safety and user feedback
- [x] Add deterministic coverage, validate, and save a checkpoint

- [x] Harden local progress and preference recovery behavior
- [x] Improve user-visible recovery feedback and restore safety
- [x] Add deterministic regression coverage and validate the app
- [x] Save and report the next stable checkpoint

- [x] Harden local persistence boundaries and fallback behavior
- [x] Improve recoverable failure feedback in user-facing flows
- [x] Add deterministic regression coverage and validate the app
- [x] Save and report the next stable checkpoint

- [x] Implement the next bounded local recovery improvement
- [x] Improve user-visible failure and recovery feedback
- [x] Add deterministic coverage, validate, and save a checkpoint

- [x] Implement the next local recovery safeguard
- [x] Improve user-visible failure and retry feedback
- [x] Add deterministic regression coverage and validate the app
- [x] Save and report the next stable checkpoint

- [x] Implement the next bounded persistence improvement
- [x] Improve user-visible recovery feedback
- [x] Add deterministic coverage, validate, and save a checkpoint

- [x] Implement the next local-first hardening improvement
- [x] Improve accessibility and recovery feedback
- [x] Add deterministic coverage, validate, and save a checkpoint

- [x] Implement the next safe local recovery improvement
- [x] Improve accessibility and failure feedback
- [x] Add deterministic coverage, validate, and save a checkpoint

- [x] Add recently opened context to story library cards
- [x] Add deterministic recent-story persistence and formatting coverage
- [x] Validate the improvement pass and save a checkpoint

- [x] Add local persistence status recovery feedback for recently opened stories
- [x] Harden story navigation accessibility states and labels
- [x] Add deterministic regression coverage, validate, and checkpoint

- [x] Add retryable persistence for recently opened stories
- [x] Add accessible retry feedback for local shortcut failures
- [x] Add deterministic regression coverage, validate, and checkpoint

- [x] Add safe fallback mock content for unavailable story data
- [x] Harden data-loading errors with visible recovery feedback
- [x] Add deterministic fallback and error regression coverage, validate, and checkpoint

- [x] Verify release configuration and permanent-link readiness
- [x] Confirm the durable install and QR-code handoff path
- [x] Validate release readiness and save a publishable checkpoint

- [x] Replace ad-like or placeholder-feeling home copy with local journal content
- [x] Add dynamic empty, loading, and persistence failure states to the home experience
- [x] Add deterministic coverage, validate, and checkpoint the product pass

- [x] Replace static Bible-screen prompts with local-state-driven content
- [x] Add Bible-screen loading, empty, and persistence recovery feedback
- [x] Add deterministic coverage, validate, and checkpoint the improvement

- [x] Replace remaining static profile or library summary copy with local-state content
- [x] Add recoverable loading and empty states to the selected screen
- [x] Add deterministic coverage, validate, and checkpoint the improvement

- [x] Replace remaining static action or prayer copy with local-state-driven content
- [x] Add recoverable loading, empty, and persistence feedback to the selected surface
- [x] Add deterministic coverage, validate, and checkpoint the improvement

- [x] Replace remaining static library or action copy with local-state-driven content
- [x] Add visible loading, empty, and persistence recovery states
- [x] Add deterministic coverage, validate, and checkpoint the improvement

- [x] Replace remaining capability/status mockup copy with local activity summaries
- [x] Add actionable fallback feedback for unavailable capability actions
- [x] Add deterministic coverage, validate, and checkpoint the improvement

- [x] Replace remaining integration/status mockup copy with local-state-driven status
- [x] Add explicit retry or failure feedback for unavailable status actions
- [x] Add deterministic coverage, validate, and checkpoint the improvement

- [x] Replace remaining static action or status copy with local-state-driven content
- [x] Add accessible recovery feedback for failed actions
- [x] Add deterministic coverage, validate, and checkpoint the improvement

- [x] Replace remaining static user-facing status copy with local-state-driven content
- [x] Add accessible retry and failure feedback for the affected actions
- [x] Add deterministic coverage, validate, and checkpoint the improvement

- [x] Replace remaining static detail-screen copy with local sermon state
- [x] Add robust save and navigation recovery feedback
- [x] Add deterministic coverage, validate, and checkpoint the improvement

- [x] Replace remaining static interaction copy with local-state-driven behavior
- [x] Add accessible recovery feedback for failed interaction saves
- [x] Add deterministic coverage, validate, and checkpoint the improvement

- [x] Add a clearly labeled fallback for unavailable local activity data
- [x] Harden hydration and action failures with retryable feedback
- [x] Add deterministic fallback/error coverage, validate, and checkpoint

- [x] Apply sample-data labels consistently to remaining data-driven screens
- [x] Add missing retryable hydration feedback where fallback content appears
- [x] Add deterministic coverage, validate, and checkpoint the recovery pass

- [x] Add clearly labeled mock fallback data to the remaining data-driven surface
- [x] Add retryable error handling for failed local reads and actions
- [x] Add deterministic coverage, validate, and checkpoint the recovery pass

- [x] Find and label remaining unmarked sample fallback data
- [x] Add missing non-destructive retry handling for local failures
- [x] Add deterministic coverage, validate, and checkpoint the recovery pass

- [x] Add fallback content for the remaining unavailable local data path
- [x] Add non-destructive retry handling for the remaining persistence failure
- [x] Add deterministic coverage, validate, and checkpoint the recovery pass

- [x] Add clearly labeled mock fallback data to the remaining error boundary
- [x] Add retryable recovery for failed local actions
- [x] Add deterministic coverage and validate, and checkpoint the recovery pass

- [x] Find and fix any remaining unsafe sample-data interaction
- [x] Add retryable handling for any remaining persistence failure
- [x] Add deterministic coverage, validate, and checkpoint the recovery pass

- [x] Add clearly labeled mock fallback data to the remaining local failure path
- [x] Add non-destructive retry handling for the remaining failure
- [x] Add deterministic coverage, validate, and checkpoint the recovery pass

- [x] Add clearly labeled mock fallback data to the remaining local boundary
- [x] Add non-destructive retry handling for any remaining failure
- [x] Add deterministic coverage, validate, and checkpoint the recovery pass

- [x] Implement the next bounded reliability improvement
- [x] Add deterministic regression coverage and accessibility safeguards
- [x] Validate and checkpoint the improvement

- [x] Implement the next bounded reliability improvement
- [x] Add deterministic regression coverage and accessibility safeguards
- [x] Validate and checkpoint the improvement

- [x] Implement the next bounded reliability improvement
- [x] Add deterministic regression coverage and accessibility safeguards
- [x] Validate and checkpoint the improvement

- [x] Implement the next bounded reliability improvement
- [x] Add deterministic regression coverage and accessibility safeguards
- [x] Validate and checkpoint the improvement

- [x] Review the next reliability and accessibility gap
- [x] Implement a targeted local-first improvement
- [x] Add regression coverage and validate behavior
- [ ] Save a checkpoint for the improvement

- [x] Inspect the next local-first reliability gap
- [x] Implement the improvement without risking journal data
- [x] Add regression tests and run validation
- [ ] Save the stable checkpoint and report results

- [x] Inspect the next reliability gap
- [x] Implement a safe targeted improvement
- [x] Add regression coverage and validate
- [ ] Checkpoint and report the result

- [x] Inspect the next persistence or recovery gap
- [x] Implement the improvement safely
- [x] Add regression coverage and validate
- [ ] Save and report the stable checkpoint

- [x] Audit current runtime, persistence, and fallback behavior
- [x] Strengthen defensive error handling and mock fallback behavior
- [x] Add regression coverage and validate affected flows
- [ ] Save the stable error-hardening checkpoint

- [x] Audit current error and fallback paths
- [x] Implement a targeted defensive fix
- [x] Add regression coverage and validate recovery behavior
- [ ] Save and report the stable checkpoint

- [x] Audit remaining runtime and persistence failure paths
- [x] Implement a safe error-handling and fallback improvement
- [x] Add regression coverage and validate the affected flows
- [ ] Save and report the stable checkpoint

- [x] Audit current recovery and fallback boundaries
- [x] Implement a safe defensive improvement
- [x] Add regression coverage and validate affected flows
- [ ] Save and report the stable checkpoint

- [x] Audit remaining local persistence and fallback boundaries
- [x] Implement a safe defensive fix
- [x] Add regression coverage and validate affected flows
- [ ] Save and report the stable checkpoint

- [x] Audit current persistence, recovery, and fallback paths
- [x] Implement a safe targeted error-handling improvement
- [x] Add regression coverage and validate affected flows
- [ ] Save and report the stable checkpoint

- [x] Audit remaining local persistence and fallback surfaces
- [x] Implement a safe targeted recovery improvement
- [x] Add regression coverage and validate affected flows
- [ ] Save and report the stable checkpoint

- [x] Audit remaining local persistence and fallback boundaries
- [x] Implement a safe targeted defensive fix
- [x] Add regression coverage and validate affected flows
- [ ] Save and report the stable checkpoint

- [x] Audit the next persistence and fallback edge case
- [x] Implement a safe targeted error-handling improvement
- [x] Add regression coverage and validate affected flows
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted error-handling fix
- [x] Add regression coverage and validate fallback behavior
- [ ] Save and report the stable checkpoint

- [x] Audit the next persistence and fallback edge case
- [x] Implement a safe targeted defensive fix
- [x] Add regression coverage and validate affected flows
- [ ] Save and report the stable checkpoint

- [x] Audit the latest local recovery paths
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit the next local recovery edge case
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Inspect current logs and isolate a concrete error
- [x] Implement the targeted fix safely
- [x] Add regression coverage and validate the project
- [ ] Save and report the stable checkpoint

- [x] Isolate the active error and resource issue
- [x] Implement the smallest safe fix
- [x] Run lightweight regression validation
- [ ] Save and report the stable checkpoint

- [x] Audit current runtime and persistence paths
- [x] Implement a safe targeted fallback improvement
- [x] Add regression coverage and validate the app
- [ ] Save and report the stable checkpoint

- [x] Audit current recovery and fallback paths
- [x] Implement a safe targeted fallback improvement: tone-aware fallback copy for malformed feedback messages
- [x] Add regression coverage and validate the app: TypeScript passed; 113 tests passed with 1 skipped
- [ ] Save and report the stable checkpoint

- [x] Add explicit Use blank journal action for intentional sample-data dismissal
- [x] Add deterministic coverage for sample-to-blank journal transition
- [ ] Validate and checkpoint the mock-data fallback hardening pass

- [x] Audit current runtime, persistence, and mock fallback state
- [x] Implement one targeted reliability improvement: defensive Bible reference extraction with labeled sample fallback
- [x] Add regression coverage and low-memory validation: TypeScript passed; 115 tests passed with 1 skipped
- [ ] Save a checkpoint for this hardening pass

- [x] Audit current errors and fallback paths
- [x] Implement a targeted reliability fix: cross-tab storage-health banner
- [x] Test the fix and reduce validation risk: TypeScript passed; 115 tests passed with 1 skipped
- [ ] Checkpoint this hardening pass

- [x] Audit current runtime and fallback risks
- [x] Implement a targeted hardening improvement: reject malformed sermon titles and speakers safely
- [x] Add deterministic tests and validate safely: TypeScript passed; 116 tests passed with 1 skipped
- [ ] Checkpoint this hardening pass

- [x] Audit current runtime and persistence risks
- [x] Implement a targeted safety improvement: normalize malformed Bible deep-link queries
- [x] Add regression coverage and validate safely: TypeScript passed; 117 tests passed with 1 skipped
- [ ] Checkpoint this hardening pass

- [x] Audit current errors and fallback paths
- [x] Implement a targeted reliability improvement: defensive Library filtering and derived-data helpers
- [x] Add regression coverage and validate safely: TypeScript passed; 117 tests passed with 1 skipped
- [ ] Checkpoint this hardening pass

- [x] Audit current errors and fallback paths
- [x] Implement a targeted hardening improvement: catch story-history, filter-save, and progress-save failures
- [x] Add regression coverage and validate safely: TypeScript passed; 117 tests passed with 1 skipped
- [ ] Checkpoint this hardening pass

- [x] Audit current errors and fallback paths
- [x] Implement a targeted hardening improvement: tolerate malformed sermon tags and note content on detail screens
- [x] Add regression coverage and validate safely: TypeScript passed; 117 tests passed with 1 skipped
- [ ] Checkpoint this hardening pass

- [x] Review attached mobile-picture video brief and select authentic app flows
- [x] Create a 30–60 second product-demo video from real app behavior
- [x] Audit and improve monetization feature readiness without fabricating capabilities
- [x] Validate monetization changes and video deliverables: TypeScript passed; 117 tests passed with 1 skipped; MP4 verified at 30 seconds
- [ ] Save a checkpoint for the combined pass

- [x] Review final project state and monetization scope
- [x] Apply the final safe monetization improvement: tested free-local monetization readiness summary with purchases and restore disabled
- [x] Validate the final app and package the ZIP: TypeScript passed; 118 tests passed with 1 skipped; ZIP integrity verified
- [ ] Save the final checkpoint and deliver the app package
