# Monetization and Feature-Gating Boundary

The supplied monetization specification describes RevenueCat, subscription tiers, spiritual coins, gifting, referrals, and server-backed transactions. Those systems are intentionally not activated in this Expo MVP because no billing connector, entitlement contract, or server-side transaction schema has been configured.

The app now exposes a local capability center that distinguishes features available now from work requiring a native build, backend setup, or future implementation. This avoids presenting fake premium limits, simulated purchases, or misleading paywalls.

Before enabling monetization, the project should define the product identifiers, entitlement names, purchase and restore flows, server receipt validation, transaction idempotency, refund handling, privacy disclosures, and platform review requirements. Coin balances and gifts must be authorized server-side; they should never rely only on client-side local storage.

| Capability | Current state | Required next boundary |
|---|---|---|
| Prayer Lock and sermon notes | Available locally | None for MVP |
| Audio recording | Planned | Expo audio implementation and local file lifecycle |
| AI summaries | Backend setup | Built-in server LLM route and usage policy |
| Lock Screen widgets | Native build | WidgetKit extension, App Group, native bridge |
| Subscriptions | Backend setup | RevenueCat connector, product catalog, entitlement sync |
| Spiritual coins and gifts | Not activated | Authenticated server ledger and idempotent transactions |
