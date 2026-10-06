# Voice Feature Boundaries

The current MVP does not enable simulated speech recognition, placeholder transcription, or background microphone behavior. Text-to-speech and voice commands require a native development build and explicit device capability checks. Unknown commands must fail safely without navigation or mutation.

Voice note input requires microphone permission, an interruptible recording lifecycle, a maximum duration, local cleanup, and clear handling for denied permissions. Server transcription requires a privacy notice, upload limits, retry behavior, language selection, and explicit user consent before audio leaves the device.

AI voice assistance should never invent a prayer, Bible passage, or transcription result when the service is unavailable. The user should see a readiness or unavailable state instead.
