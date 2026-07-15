/**
 * Minimal in-memory sliding-window rate limiter. Suitable for the single
 * long-lived Node process Zink runs in; not shared across replicas.
 */
const WINDOW_MS = 60_000;

const hits = new Map<string, number[]>();

function cleanForwardedValue(value: string | null): string | null {
  const cleaned = value?.trim();
  if (!cleaned || cleaned.length > 128 || /[\r\n]/.test(cleaned)) return null;
  return cleaned;
}

/**
 * Derive a limiter key without trusting spoofable forwarding headers by
 * default. ZINK_TRUST_PROXY=1 is only safe when exactly one configured reverse
 * proxy strips/overwrites X-Real-IP or appends the real client as the final
 * X-Forwarded-For hop.
 */
export function clientRateLimitKey(scope: string, headers: Headers): string {
  if (process.env.ZINK_TRUST_PROXY !== "1") return `${scope}:shared`;
  const realIp = cleanForwardedValue(headers.get("x-real-ip"));
  if (realIp) return `${scope}:${realIp}`;
  const chain = headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const forwardedIp = cleanForwardedValue(chain?.at(-1) ?? null);
  return `${scope}:${forwardedIp ?? "unknown"}`;
}

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
