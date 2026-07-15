import { afterEach, describe, expect, it, vi } from "vitest";
import { clientRateLimitKey } from "../lib/ratelimit";

afterEach(() => vi.unstubAllEnvs());

describe("rate-limit identity", () => {
  it("ignores caller-controlled proxy headers by default", () => {
    vi.stubEnv("ZINK_TRUST_PROXY", "0");
    expect(
      clientRateLimitKey(
        "auth",
        new Headers({ "x-forwarded-for": "203.0.113.5" }),
      ),
    ).toBe("auth:shared");
  });

  it("uses the final proxy hop only when explicitly trusted", () => {
    vi.stubEnv("ZINK_TRUST_PROXY", "1");
    expect(
      clientRateLimitKey(
        "auth",
        new Headers({ "x-forwarded-for": "spoofed, 203.0.113.5" }),
      ),
    ).toBe("auth:203.0.113.5");
  });
});
