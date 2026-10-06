# Bible Note Taker / Prayer Lock — Mobile Interface Design

## Product direction

The first milestone is an offline-first, portrait-oriented iOS-style experience that helps a user capture a sermon insight and immediately turn it into a prayerful action. The visual language is calm and editorial rather than overly ornamental: warm parchment surfaces, deep ink typography, olive accents, and a small amount of saffron for active spiritual habits.

## Screen list

| Screen | Primary content and functionality |
|---|---|
| Home | Greeting, current prayer streak, “Continue reflection” card, recent sermons, and a prominent “New sermon note” action. |
| Sermon note editor | Sermon title, speaker, date, recording status, quick note input, verse reference chips, and action-item toggle. Notes are saved locally as they are added. |
| Sermon detail | Summary, key takeaways, linked scripture references, timestamped notes, and action items. Includes “Pray about this” entry point. |
| Prayer Lock | Focused lock state with a scripture prompt, selected habit (Prayer, Gratitude, Reflection), progress indicator, and a time-bounded completion action. The MVP simulates the lock flow in-app; native app blocking requires platform entitlements and custom native modules. |
| Bible | Searchable scripture landing screen with verse of the day, recent references, and a compact offline-ready reading affordance. |
| Library | Search and filter sermons by series, speaker, or date; empty state explains how to create the first note. |
| Profile / Settings | Prayer streak, habit preferences, quiet-time settings, and future native permission status. |

## Key user flows

1. User opens Home, reviews the current reflection prompt, and taps “New sermon note”.
2. User enters a sermon title, optionally adds speaker details, then saves the note. A new sermon detail record appears in Recent sermons.
3. User adds a timestamped note, optionally marks it as an action item, and saves. The new note immediately appears in the sermon timeline.
4. User taps “Pray about this” from the sermon detail screen, selects a habit, and begins a short guided completion loop.
5. User completes the loop, receives confirmation and a streak update, then returns to Home.
6. User searches Bible references from the Bible tab and can copy the reference into a sermon note. Full offline scripture data and native app blocking are later milestones.

## Content and interaction decisions

The app uses large tap targets, bottom-tab navigation, bottom-sheet-like in-flow cards, and compact top headers to support one-handed use. Primary actions use one accent color and haptic feedback; secondary actions are outlined or text-based. Lists use flat, readable rows instead of dense dashboards.

## Color choices

| Token | Color | Role |
|---|---|---|
| Ink | `#24312B` | Primary text and navigation icons |
| Parchment | `#F7F4ED` | Main background |
| Linen | `#FFFDF8` | Elevated cards and input surfaces |
| Olive | `#48634B` | Primary actions and active navigation |
| Sage | `#DDE8D8` | Calm supporting surfaces |
| Saffron | `#C88A3D` | Streaks, prayer progress, and highlights |
| Clay | `#A85D4A` | Destructive or caution states |
| Muted ink | `#718078` | Secondary copy |

## MVP boundary

This first implementation prioritizes the navigable interface, locally persisted sermon notes, action items, prayer completion loop, and Bible reference discovery. Audio capture, transcription, cloud sync, AI summaries, FamilyControls, Android UsageStats, and social features remain explicit follow-up work so the initial build stays testable in Expo Go.
