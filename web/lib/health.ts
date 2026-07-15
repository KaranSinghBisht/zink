export interface SyncHealth {
  lastSyncAt: number | null;
  lastAttemptAt: number | null;
  lastError: string | null;
}

type GlobalWithHealth = typeof globalThis & { __zinkSyncHealth?: SyncHealth };

function state(): SyncHealth {
  const g = globalThis as GlobalWithHealth;
  if (!g.__zinkSyncHealth) {
    g.__zinkSyncHealth = {
      lastSyncAt: null,
      lastAttemptAt: null,
      lastError: null,
    };
  }
  return g.__zinkSyncHealth;
}

export function recordSyncSuccess(): void {
  const s = state();
  s.lastSyncAt = Date.now();
  s.lastAttemptAt = s.lastSyncAt;
  s.lastError = null;
}

export function recordSyncFailure(err: unknown): void {
  const s = state();
  s.lastAttemptAt = Date.now();
  s.lastError = err instanceof Error ? err.message : "sync failed";
}

export function getSyncHealth(): SyncHealth {
  return { ...state() };
}

/** Human age of the last successful sync, e.g. "12s ago". */
export function syncAgeLabel(lastSyncAt: number): string {
  const ageSec = Math.max(0, Math.round((Date.now() - lastSyncAt) / 1000));
  return ageSec < 60 ? `${ageSec}s ago` : `${Math.round(ageSec / 60)}m ago`;
}

const STALE_AFTER_MS = 10 * 60 * 1000;

/** True while the background watcher is syncing successfully and recently. */
export function isWatcherHealthy(): boolean {
  const s = state();
  if (s.lastError != null) return false;
  if (s.lastSyncAt == null) return false;
  return Date.now() - s.lastSyncAt < STALE_AFTER_MS;
}
