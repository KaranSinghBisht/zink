import { getConfig } from "./config";
import { syncWallet } from "./devtool";
import { runDetection } from "./detect";
import { recordSyncFailure, recordSyncSuccess } from "./health";
import { log } from "./log";

type GlobalWithPoller = typeof globalThis & { __zinkPollerStarted?: boolean };

let tickRunning = false;

async function tick(): Promise<void> {
  if (tickRunning) return;
  tickRunning = true;
  try {
    await syncWallet();
    recordSyncSuccess();
    const paid = runDetection();
    if (paid > 0) {
      log.info(`detected ${paid} newly paid link(s)`);
    }
  } catch (err) {
    recordSyncFailure(err);
    log.error("poller tick failed", err);
  } finally {
    tickRunning = false;
  }
}

/** Start the background sync/detect loop. Idempotent across hot reloads. */
export function startPoller(): void {
  const g = globalThis as GlobalWithPoller;
  if (g.__zinkPollerStarted) return;
  g.__zinkPollerStarted = true;
  const { syncIntervalMs } = getConfig();
  setInterval(() => void tick(), syncIntervalMs);
  void tick();
  log.info(`poller started (interval ${syncIntervalMs}ms)`);
}
