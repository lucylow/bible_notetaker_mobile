# Localization Boundaries

The MVP supports a local language preference with a safe English fallback. The preference is stored on-device and does not claim to translate the current interface until a complete translation catalog is added.

RTL readiness is documented but does not force an app restart or mutate global layout direction from a single screen. A production RTL milestone should coordinate `I18nManager`, navigation restart behavior, mirrored spacing, and accessibility review.

Bible translations require a licensed source corpus or a configured backend provider. AI translation of user notes requires a privacy notice, usage limits, retry handling, and explicit confirmation that content may leave the device. No placeholder translation text is shown as real output in this MVP.
