import { describe, expect, it } from "vitest";
import { MAX_MONEY_ZATS, decimalZecToZats, zatsToDecimalZec } from "../lib/zec";

describe("decimalZecToZats", () => {
  it("parses whole and fractional ZEC", () => {
    expect(decimalZecToZats("1")).toBe(100_000_000n);
    expect(decimalZecToZats("0.00000001")).toBe(1n);
    expect(decimalZecToZats("0.005")).toBe(500_000n);
    expect(decimalZecToZats("21000000")).toBe(MAX_MONEY_ZATS);
  });

  it("rejects malformed input", () => {
    expect(() => decimalZecToZats("")).toThrow();
    expect(() => decimalZecToZats("-1")).toThrow();
    expect(() => decimalZecToZats("1.123456789")).toThrow(); // 9 places
    expect(() => decimalZecToZats("1e8")).toThrow();
    expect(() => decimalZecToZats("0x10")).toThrow();
  });

  it("rejects amounts above MAX_MONEY", () => {
    expect(() => decimalZecToZats("21000000.00000001")).toThrow();
    expect(() => decimalZecToZats("99999999999999999999")).toThrow();
  });

  it("stays within Number.MAX_SAFE_INTEGER for all accepted values", () => {
    expect(Number(MAX_MONEY_ZATS)).toBeLessThan(Number.MAX_SAFE_INTEGER);
  });
});

describe("zatsToDecimalZec", () => {
  it("round-trips", () => {
    for (const value of ["1", "0.00000001", "0.005", "12345.6789"]) {
      expect(zatsToDecimalZec(decimalZecToZats(value))).toBe(value);
    }
  });
});
