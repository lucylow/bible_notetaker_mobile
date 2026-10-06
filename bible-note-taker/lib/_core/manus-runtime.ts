/**
 * Manus Runtime - Communication layer between Expo web app and parent container (next-agent-webapp)
 *
 * Simplified flow:
 * 1. initManusRuntime() called
 * 2. Send 'appDevServerReady' to parent to signal app is ready
 *
 * User will manually login via the app's login page - no automatic cookie injection.
 */

import { Platform } from "react-native";
import type { Metrics } from "react-native-safe-area-context";
import { isSafeAreaInsetsPayload } from "@/lib/_core/runtime-safety";

// Debug logging with timestamps
const DEBUG = true;
const log = (msg: string) => {
  if (!DEBUG) return;
  const ts = new Date().toISOString();
  console.log(`[ManusRuntime ${ts}] ${msg}`);
};

type MessageType = "appDevServerReady";
type SafeAreaCallback = (metrics: Metrics) => void;

interface SpacePreviewerMessage {
  type: "SpacePreviewerChannel";
  payload: {
    type: string;
    from: "container" | "content";
    to: "container" | "content";
    payload: Record<string, unknown>;
  };
}

function isInIframe(): boolean {
  if (Platform.OS !== "web") return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function isWeb(): boolean {
  return Platform.OS === "web";
}

function sendToParent(type: MessageType, payload: Record<string, unknown> = {}): void {
  // NOTE: Validate parent origin if we need to transfer sensitive data
  if (!isWeb() || !isInIframe()) return;

  const message: SpacePreviewerMessage = {
    type: "SpacePreviewerChannel",
    payload: { type, from: "content", to: "container", payload },
  };
  try {
    window.parent.postMessage(message, "*");
    log(`Sent to parent: ${type}`);
  } catch {
    // Preview containers can disappear during reloads; messaging must never crash the app.
  }
}

let initialized = false;
let safeAreaCallback: SafeAreaCallback | null = null;

function handleMessage(event: MessageEvent<unknown>): void {
  // NOTE: Validate event.origin if we need to transfer sensitive data
  const data = event.data as SpacePreviewerMessage | undefined;
  if (!data || data.type !== "SpacePreviewerChannel") return;

  const { payload } = data;
  if (!payload || payload.to !== "content") return;

  if (payload.type === "setSafeAreaInsets" && isSafeAreaInsetsPayload(payload.payload) && safeAreaCallback) {
    const insets = payload.payload;
    const frame = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
    try {
      safeAreaCallback({ insets, frame });
    } catch {
      // A stale consumer should not take down message handling or the root layout.
      safeAreaCallback = null;
      return;
    }
    log(
      `Received safe area insets from parent: top=${insets.top}, bottom=${insets.bottom}, left=${insets.left}, right=${insets.right}`,
    );
  }
}

/**
 * Subscribe to safe area updates from the parent container.
 */
export function subscribeSafeAreaInsets(callback: SafeAreaCallback): () => void {
  safeAreaCallback = callback;
  return () => {
    if (safeAreaCallback === callback) {
      safeAreaCallback = null;
    }
  };
}

/**
 * Initialize Manus Runtime - just notifies parent that app is ready
 */
export function initManusRuntime(): void {
  if (!isWeb() || !isInIframe()) return;
  if (initialized) return;
  log("initManusRuntime called");
  try {
    window.addEventListener("message", handleMessage);
    initialized = true;
    sendToParent("appDevServerReady", {});
  } catch {
    // The host may be unavailable during startup or hot reload; remain usable in standalone mode.
  }
}

/**
 * Check if running inside preview iframe
 */
export function isRunningInPreviewIframe(): boolean {
  return isWeb() && isInIframe();
}
