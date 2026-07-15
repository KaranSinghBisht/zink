import path from "node:path";

export interface ZinkConfig {
  devtoolBin: string;
  walletDir: string;
  dbPath: string;
  server: string;
  baseUrl: string;
  syncIntervalMs: number;
  adminToken: string | null;
  minConfirmations: number;
}

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let cached: ZinkConfig | null = null;

export function getConfig(): ZinkConfig {
  if (cached) return cached;
  const walletDir = path.resolve(requireEnv("ZINK_WALLET_DIR"));
  cached = {
    devtoolBin: path.resolve(requireEnv("ZINK_DEVTOOL_BIN")),
    walletDir,
    dbPath: path.resolve(
      requireEnv("ZINK_DB_PATH", path.join(walletDir, "zink.sqlite")),
    ),
    server: requireEnv("ZINK_SERVER", "zecrocks"),
    baseUrl: requireEnv("ZINK_BASE_URL", "http://localhost:3000"),
    syncIntervalMs: Number(requireEnv("ZINK_SYNC_INTERVAL_MS", "20000")),
    adminToken: process.env.ZINK_ADMIN_TOKEN?.trim() || null,
    minConfirmations: Math.max(
      1,
      Number(requireEnv("ZINK_MIN_CONFIRMATIONS", "1")),
    ),
  };
  return cached;
}

export function walletDataDb(config: ZinkConfig): string {
  return path.join(config.walletDir, "data.sqlite");
}
