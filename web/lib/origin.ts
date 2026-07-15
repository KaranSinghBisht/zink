import { headers } from "next/headers";
import { getConfig, isDemoMode } from "./config";

/**
 * Absolute origin for shareable links, derived from the incoming request
 * (works behind proxies and on any deployment host). Falls back to the
 * configured base URL.
 */
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto") ??
      (host.startsWith("localhost") || host.startsWith("127.")
        ? "http"
        : "https");
    return `${proto}://${host}`;
  }
  return isDemoMode() ? "" : getConfig().baseUrl;
}
