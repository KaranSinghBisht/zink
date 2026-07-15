import { describe, expect, it } from "vitest";
import { buildPaymentUri } from "../lib/zip321";

const ADDR = "u1testaddressvalue";

describe("buildPaymentUri", () => {
  it("encodes address, decimal amount, and base64url memo", () => {
    const uri = buildPaymentUri(ADDR, 500_000n, "zink:abc123");
    const url = new URL(uri);
    expect(uri.startsWith(`zcash:${ADDR}?`)).toBe(true);
    expect(url.searchParams.get("amount")).toBe("0.005");
    const memo = url.searchParams.get("memo")!;
    // base64url alphabet only, no padding
    expect(memo).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(Buffer.from(memo, "base64url").toString("utf8")).toBe("zink:abc123");
  });

  it("omits the memo parameter when absent", () => {
    const uri = buildPaymentUri(ADDR, 100_000_000n);
    expect(uri).toBe(`zcash:${ADDR}?amount=1`);
  });

  it("rejects oversized memos and missing addresses", () => {
    expect(() => buildPaymentUri("", 1n)).toThrow();
    expect(() => buildPaymentUri(ADDR, 1n, "x".repeat(513))).toThrow();
  });
});
