import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createAdminSession,
  isAuthMisconfigured,
  isLocalMode,
  sessionMatches,
} from "../lib/auth";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("merchant authentication", () => {
  it("only opens an unconfigured wallet-free showcase", () => {
    vi.stubEnv("ZINK_ADMIN_TOKEN", "");
    vi.stubEnv("ZINK_WALLET_DIR", "");
    expect(isLocalMode()).toBe(true);
    expect(isAuthMisconfigured()).toBe(false);
  });

  it("fails closed when a wallet has no admin token", () => {
    vi.stubEnv("ZINK_ADMIN_TOKEN", "");
    vi.stubEnv("ZINK_WALLET_DIR", "/private/zink-view");
    expect(isLocalMode()).toBe(false);
    expect(isAuthMisconfigured()).toBe(true);
  });

  it("rejects a weak merchant token", () => {
    vi.stubEnv("ZINK_ADMIN_TOKEN", "too-short");
    vi.stubEnv("ZINK_WALLET_DIR", "/private/zink-view");
    expect(isLocalMode()).toBe(false);
    expect(isAuthMisconfigured()).toBe(true);
  });

  it("issues an expiring signed session instead of storing the root token", () => {
    vi.stubEnv("ZINK_ADMIN_TOKEN", "correct-horse-battery-staple");
    vi.stubEnv("ZINK_WALLET_DIR", "/private/zink-view");
    const now = 1_700_000_000_000;
    const session = createAdminSession(now);
    expect(session).not.toContain("correct-horse-battery-staple");
    expect(sessionMatches(session, now)).toBe(true);
    expect(sessionMatches(session, now + 13 * 60 * 60 * 1000)).toBe(false);
    expect(sessionMatches(`${session}x`, now)).toBe(false);
  });
});
