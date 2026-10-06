# Native Surface Roadmap

## Expo-compatible work included now

The app now produces a compact `bible-note-widget-state` snapshot in local storage whenever the local sermon, prayer streak, or active habit changes. The snapshot contains the prayer-lock status, current habit title, streak, latest sermon title, and verse-of-the-day content. This gives future native targets a stable data contract without coupling WidgetKit code to React Native rendering.

The app also includes centralized feedback behavior with platform-safe haptics, visual banners, and accessibility announcements. This follows the supplied UX direction while remaining usable in Expo Go and on web.

## Native-only work for a development build

The supplied WidgetKit and ActivityKit SwiftUI implementations require an iOS widget extension target, an App Group, native entitlements, and an EAS/development build. They cannot render React Native components inside the widget extension. A future native bridge should copy the serialized widget snapshot into shared App Group `UserDefaults`, call `WidgetCenter.shared.reloadAllTimelines()`, and start or update `ActivityKit` activities from a native module.

FamilyControls, Screen Time, Control Center controls, Dynamic Island presentations, and background audio also require native entitlements, platform review, and a development build. They are intentionally not enabled in the Expo Go MVP so the current project remains portable and testable.

## Suggested native bridge contract

| Operation | React Native input | Native responsibility |
|---|---|---|
| `syncWidgetState` | Serialized widget snapshot | Write App Group data and reload timelines |
| `startPrayerActivity` | Habit title, duration, streak | Start ActivityKit Live Activity |
| `updatePrayerActivity` | Remaining time, completion state | Update the Live Activity content state |
| `endPrayerActivity` | Completion result | End the Live Activity and refresh widgets |
| `openPrayerLock` | Deep-link route | Navigate from widget or Control Center into the app |

## Important limitation

The current app communicates the native integration status honestly in-app. It does not claim to block other applications or show true Lock Screen widgets until the required native extension and entitlement work is completed.
