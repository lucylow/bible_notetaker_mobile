export type SafePricingOption = {
  id: string;
  title: string;
  priceLabel: string;
  currency: string;
  available: false;
};

export type SafeEntitlementState = {
  tier: "free";
  active: false;
  source: "local-first";
  message: string;
};

export type SafeMonetizationReadiness = {
  mode: "free-local";
  canPurchase: false;
  canRestore: false;
  label: string;
  message: string;
};

function safeText(value: unknown, fallback: string, max = 100): string {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}

export function normalizePricingOptions(value: unknown): SafePricingOption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((candidate, index) => {
    if (!candidate || typeof candidate !== "object") return [];
    const item = candidate as Record<string, unknown>;
    return [{
      id: safeText(item.id, `unconfigured-${index}`),
      title: safeText(item.title, "Premium access"),
      priceLabel: safeText(item.priceLabel, "Unavailable"),
      currency: safeText(item.currency, ""),
      available: false as const,
    }];
  }).slice(0, 10);
}

export function normalizeEntitlementState(value: unknown): SafeEntitlementState {
  return {
    tier: "free",
    active: false,
    source: "local-first",
    message: "Premium access is not active until billing, receipt validation, and entitlement sync are configured.",
  };
}

export function unavailableMonetizationMessage(action = "This premium action"): string {
  return `${safeText(action, "This premium action")} is unavailable in the local-first MVP. No purchase or charge was attempted.`;
}

export function getMonetizationReadiness(): SafeMonetizationReadiness {
  return {
    mode: "free-local",
    canPurchase: false,
    canRestore: false,
    label: "Free local plan",
    message: "Your journal is available without a subscription. Purchases and restore are not enabled in this local-first build.",
  };
}
