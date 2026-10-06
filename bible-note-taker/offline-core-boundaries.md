# Offline-First Core Boundaries

The latest core-functionality specification proposes local data storage, queued cloud synchronization, notification permissions, background tasks, deep links, import/export, and robust error handling. In the current MVP, local AsyncStorage remains the source of truth. Cloud sync is not enabled because it requires backend ownership, conflict resolution, privacy, and retry contracts. Notifications and background tasks remain native-build readiness items because they require permissions and platform lifecycle validation.

The safe implementation surface is local import/export validation, explicit sync readiness labels, supported deep-link route validation with a root fallback, and user-visible recovery when storage or optional integrations fail. No cloud upload, push-token registration, background task, or placeholder remote data should be activated by the local MVP.
