/**
 * Minimal in-memory sliding-window rate limiter. Suitable for the single
 * long-lived Node process Zink runs in; not shared across replicas.
 */
const WINDOW_MS = 60_000;

const hits = new Map<string, number[]>();

export function rateLimitExceeded(key: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
  if (recent.length >= maxPerMinute) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  // Bound memory: drop stale keys opportunistically.
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= cutoff)) hits.delete(k);
    }
  }
  return false;
}
