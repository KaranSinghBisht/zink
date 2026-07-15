import path from "node:path";
import { readFileSync } from "node:fs";
import { parseZcashNetwork, type ZcashNetwork } from "./network";

export interface ZinkConfig {
  devtoolBin: string;
  walletDir: string;
  dbPath: string;
  network: ZcashNetwork;
  server: string;
  baseUrl: string;
  syncIntervalMs: number;
  minConfirmations: number;
}

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name]?.trim() || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function boundedIntegerEnv(
  name: string,
  fallback: string,
  min: number,
  max: number,
): number {
  const raw = requireEnv(name, fallback);
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new Error(
      `${name} must be an integer between ${min} and ${max} (received ${JSON.stringify(raw)})`,
    );
  }
  return value;
}

export function getNetwork(): ZcashNetwork {
  return parseZcashNetwork(process.env.ZINK_NETWORK);
}

/** Read the network persisted by the pinned zcash-devtool in keys.toml. */
export function getWalletNetwork(walletDir: string): ZcashNetwork {
  const keysPath = path.join(walletDir, "keys.toml");
  let source: string;
  try {
    source = readFileSync(
      /* turbopackIgnore: true */ keysPath,
      "utf8",
    );
  } catch (error) {
    throw new Error(`Unable to read wallet network from ${keysPath}`, {
      cause: error,
    });
  }
  const match = source.match(/^network\s*=\s*"([^"]+)"\s*$/m);
  // Older zcash-devtool wallets without a network field default to testnet.
  return parseZcashNetwork(match?.[1] ?? "test");
}

/**
 * Demo mode: no wallet configured (e.g. the hosted showcase on serverless).
 * The site serves sample ledger data and disables link creation; the real
 * product runs wherever the merchant's view-only wallet lives.
 */
export function isDemoMode(): boolean {
  return !process.env.ZINK_WALLET_DIR?.trim();
}

let cached: ZinkConfig | null = null;

export function getConfig(): ZinkConfig {
  if (cached) return cached;
  const walletDir = path.resolve(
    /* turbopackIgnore: true */ requireEnv("ZINK_WALLET_DIR"),
  );
  const network = getNetwork();
  const walletNetwork = getWalletNetwork(walletDir);
  if (walletNetwork !== network) {
    throw new Error(
      `ZINK_NETWORK=${network} does not match the ${walletNetwork} wallet at ${walletDir}`,
    );
  }
  cached = {
    devtoolBin: path.resolve(
      /* turbopackIgnore: true */ requireEnv("ZINK_DEVTOOL_BIN"),
    ),
    walletDir,
    dbPath: path.resolve(
      /* turbopackIgnore: true */
      requireEnv("ZINK_DB_PATH", path.join(walletDir, "zink.sqlite")),
    ),
    network,
    server: requireEnv("ZINK_SERVER", "zecrocks"),
    baseUrl: requireEnv("ZINK_BASE_URL", "http://localhost:3000"),
    syncIntervalMs: boundedIntegerEnv(
      "ZINK_SYNC_INTERVAL_MS",
      "20000",
      5_000,
      300_000,
    ),
    minConfirmations: boundedIntegerEnv(
      "ZINK_MIN_CONFIRMATIONS",
      "1",
      1,
      100,
    ),
  };
  return cached;
}

export function walletDataDb(config: ZinkConfig): string {
  return path.join(config.walletDir, "data.sqlite");
}
