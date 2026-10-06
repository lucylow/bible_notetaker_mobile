# Advanced Audio and Multilingual Boundaries

The current MVP remains local-first and does not introduce placeholder recording services, cloud transcription, or unconfigured third-party billing. The existing capture model records readiness, duration, timestamp focus, and storage state without pretending that a microphone file or playback engine is active.

A native audio milestone should use the installed Expo Audio module for microphone permission, recording, playback, background behavior, cleanup, and error recovery. Waveform generation, trimming, pitch shifting, and speed controls require native-compatible libraries and should be added only after the file lifecycle is tested on iOS and Android.

Transcription, speaker diarization, AI translation, and cloud sync require explicit backend contracts, upload limits, privacy disclosures, authentication or ownership rules, and retry behavior. The app should never show generated placeholder text as if it were a real transcript.

Multilingual support can safely begin with a local language preference and English fallback. Bible translation content and AI translation should be added only after the source corpus, licensing, cache policy, and offline behavior are defined.
