import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const temporaryWallets: string[] = [];

function walletFixture(network: "main" | "test"): string {
  const walletDir = mkdtempSync(path.join(tmpdir(), "zink-config-test-"));
  temporaryWallets.push(walletDir);
  writeFileSync(
    path.join(walletDir, "keys.toml"),
    `mnemonic = ""\nnetwork = "${network}"\nbirthday = 1\n`,
  );
  return walletDir;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  for (const walletDir of temporaryWallets.splice(0)) {
    rmSync(walletDir, { recursive: true, force: true });
  }
});

describe("configuration validation", () => {
  it("loads an explicit testnet configuration", async () => {
    vi.stubEnv("ZINK_DEVTOOL_BIN", "/tmp/zcash-devtool");
    vi.stubEnv("ZINK_WALLET_DIR", walletFixture("test"));
    vi.stubEnv("ZINK_NETWORK", "test");
    const { getConfig } = await import("../lib/config");
    expect(getConfig().network).toBe("test");
  });

  it("rejects malformed numeric safety settings", async () => {
    vi.stubEnv("ZINK_DEVTOOL_BIN", "/tmp/zcash-devtool");
    vi.stubEnv("ZINK_WALLET_DIR", walletFixture("main"));
    vi.stubEnv("ZINK_SYNC_INTERVAL_MS", "not-a-number");
    const { getConfig } = await import("../lib/config");
    expect(() => getConfig()).toThrow(/ZINK_SYNC_INTERVAL_MS/);
  });

  it("rejects a wallet from the wrong network", async () => {
    vi.stubEnv("ZINK_DEVTOOL_BIN", "/tmp/zcash-devtool");
    vi.stubEnv("ZINK_WALLET_DIR", walletFixture("main"));
    vi.stubEnv("ZINK_NETWORK", "test");
    const { getConfig } = await import("../lib/config");
    expect(() => getConfig()).toThrow(/does not match/);
  });
});
