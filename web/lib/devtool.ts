import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getConfig } from "./config";
import { log } from "./log";

const execFileAsync = promisify(execFile);

const ADDRESS_PATTERN = /Address:\s+(u1[0-9a-z]+)/;

// All devtool invocations share one wallet SQLite database, so they are
// serialized through a single queue to avoid write-lock contention.
let queue: Promise<unknown> = Promise.resolve();

function runDevtool(args: string[], timeoutMs: number): Promise<string> {
  const run = queue.then(async () => {
    const { devtoolBin, walletDir } = getConfig();
    try {
      const { stdout } = await execFileAsync(
        devtoolBin,
        ["wallet", "-w", walletDir, ...args],
        { timeout: timeoutMs, maxBuffer: 16 * 1024 * 1024 },
      );
      return stdout;
    } catch (err) {
      const command = args[0] ?? "unknown";
      throw new Error(`devtool ${command} failed`, { cause: err });
    }
  });
  queue = run.catch(() => undefined);
  return run;
}

/**
 * Derive the next unused diversified unified address (shielded-only receivers,
 * so the address is unlinkable per ZIP 316). The wallet DB persists the
 * diversifier index, so subsequent syncs detect payments to it.
 */
export async function generateShieldedAddress(): Promise<string> {
  const stdout = await runDevtool(
    ["generate-address", "--shielded-only"],
    30_000,
  );
  const match = stdout.match(ADDRESS_PATTERN);
  if (!match) {
    throw new Error("devtool generate-address returned no parseable address");
  }
  return match[1];
}

/** Sync the view wallet against the configured lightwalletd. Serialized. */
export async function syncWallet(): Promise<void> {
  const { server } = getConfig();
  await runDevtool(["sync", "-s", server], 300_000);
  log.info("wallet sync complete");
}
