import { describe, expect, it } from "vitest";
import { featureReadiness, getReadinessLabel, isFeatureAvailable, normalizeFeatureReadiness } from "../lib/feature-readiness";
import { buildSafeWidgetUrl, validateWidgetRoute } from "../lib/widget-state";

describe("feature readiness", () => {
  it("keeps current MVP features available and future integrations explicit", () => {
    expect(isFeatureAvailable(featureReadiness.find((feature) => feature.key === "prayer_lock")!.readiness)).toBe(true);
    expect(getReadinessLabel(featureReadiness.find((feature) => feature.key === "lock_screen_widgets")!.readiness)).toBe("Native build");
    expect(getReadinessLabel(featureReadiness.find((feature) => feature.key === "subscriptions")!.readiness)).toBe("Backend setup");
    expect(getReadinessLabel(featureReadiness.find((feature) => feature.key === "offline_translation_models")!.readiness)).toBe("Native build");
    expect(getReadinessLabel(featureReadiness.find((feature) => feature.key === "translation_memory")!.readiness)).toBe("Planned");
  });

  it("drops malformed entries and restores safe defaults", () => {
    const normalized = normalizeFeatureReadiness([{ key: "lock_screen_widgets", title: null, readiness: "invalid" }, null, { key: "lock_screen_widgets" }]);
    expect(normalized).toHaveLength(1);
    expect(normalized[0].title).toBe("Lock Screen widgets");
    expect(normalized[0].readiness).toBe("native_build");
  });

  it("allows only known widget routes", () => {
    expect(validateWidgetRoute("biblenotetaker://prayer-lock?source=widget")).toBe("prayer-lock");
    expect(validateWidgetRoute("biblenotetaker://unknown")).toBeNull();
    expect(buildSafeWidgetUrl("unknown")).toBe("biblenotetaker://prayer-lock");
  });
});
