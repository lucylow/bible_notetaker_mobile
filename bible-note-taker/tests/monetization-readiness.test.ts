import { describe, expect, it } from "vitest";
import { getMonetizationReadiness, normalizeEntitlementState, normalizePricingOptions, unavailableMonetizationMessage } from "../lib/monetization-readiness";

describe("monetization readiness", () => {
  it("normalizes malformed pricing without activating purchases", () => {
    const options = normalizePricingOptions([{ id: "pro", title: " Pro ", priceLabel: "$4.99" }, null, "invalid"]);
    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({ id: "pro", title: "Pro", priceLabel: "$4.99", available: false });
  });

  it("always falls back to a free local-first entitlement", () => {
    const entitlement = normalizeEntitlementState({ tier: "premium", active: true });
    expect(entitlement).toMatchObject({ tier: "free", active: false, source: "local-first" });
    expect(unavailableMonetizationMessage("Restore purchases")).toContain("No purchase or charge was attempted");
  });

  it("exposes a safe readiness summary without enabling billing", () => {
    expect(getMonetizationReadiness()).toMatchObject({ mode: "free-local", canPurchase: false, canRestore: false, label: "Free local plan" });
  });
});
