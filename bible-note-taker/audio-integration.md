# Audio Capture Integration Boundary

The current sermon capture screen includes a local recording-ready timer and explicit ready, recording, paused, and saved states. It does not request microphone permission or create an audio file yet.

The next native implementation should use Expo Audio to request microphone permission, configure the recording mode, create and start a recorder, stop and unload it safely, and persist the returned local URI with the sermon metadata. The app should show permission-denied and storage-failure feedback without losing the written sermon notes.

Audio files should be treated as device-local data in the first milestone. A later export or cloud-sync feature must define file size limits, background behavior, deletion semantics, and privacy disclosure before uploading recordings.
