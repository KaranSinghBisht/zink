import { describe, expect, it } from "vitest";
import { isSettled } from "../lib/detect";

describe("isSettled", () => {
  it("rejects unmined (mempool) outputs", () => {
    expect(isSettled({ minedHeight: null }, 3_000_000, 1)).toBe(false);
  });

  it("rejects outputs when the wallet has never synced", () => {
    expect(isSettled({ minedHeight: 2_999_999 }, null, 1)).toBe(false);
  });

  it("accepts a mined output at the required confirmation depth", () => {
    // mined at tip height => exactly 1 confirmation
    expect(isSettled({ minedHeight: 3_000_000 }, 3_000_000, 1)).toBe(true);
    expect(isSettled({ minedHeight: 3_000_000 }, 3_000_000, 2)).toBe(false);
    expect(isSettled({ minedHeight: 2_999_999 }, 3_000_000, 2)).toBe(true);
  });
});
