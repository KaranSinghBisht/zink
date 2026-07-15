import { describe, expect, it } from "vitest";
import {
  networkLabel,
  networkTicker,
  parseZcashNetwork,
  unifiedAddressPrefix,
} from "../lib/network";
import { parseGeneratedShieldedAddress } from "../lib/devtool";

describe("Zcash network handling", () => {
  it("defaults to mainnet and accepts testnet", () => {
    expect(parseZcashNetwork()).toBe("main");
    expect(parseZcashNetwork(" TEST ")).toBe("test");
    expect(() => parseZcashNetwork("regtest")).toThrow(/main.*test/);
  });

  it("uses the correct user-facing network values", () => {
    expect(networkLabel("main")).toBe("mainnet");
    expect(networkTicker("main")).toBe("ZEC");
    expect(unifiedAddressPrefix("main")).toBe("u1");
    expect(networkLabel("test")).toBe("testnet");
    expect(networkTicker("test")).toBe("TAZ");
    expect(unifiedAddressPrefix("test")).toBe("utest1");
  });

  it("rejects an address from the wrong network", () => {
    expect(
      parseGeneratedShieldedAddress("Address: u1abc123", "main"),
    ).toBe("u1abc123");
    expect(
      parseGeneratedShieldedAddress("Address: utest1abc123", "test"),
    ).toBe("utest1abc123");
    expect(() =>
      parseGeneratedShieldedAddress("Address: u1abc123", "test"),
    ).toThrow(/test unified address/);
  });
});
