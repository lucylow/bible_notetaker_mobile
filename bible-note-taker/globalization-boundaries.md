# Globalization Boundaries

The app may store validated translation bundles locally, but it must not treat malformed or partial bundles as trusted UI copy. A requested language falls back to English when a supported bundle is missing or a cache entry cannot be parsed.

Dynamic translation loading requires a configured backend, versioned bundles, privacy review, cache invalidation, and an offline fallback. Machine translation requires explicit user consent before personal sermon notes leave the device, usage limits, retry behavior, and a provider contract. Voice translation additionally requires native microphone and speech output support.

Glossaries and cultural adaptation require review by qualified language owners. Bible translation content requires licensing or a configured provider. The local-first MVP therefore exposes readiness states rather than showing fabricated translations or silently uploading user content.
