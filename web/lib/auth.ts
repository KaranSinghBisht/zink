import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { isDemoMode } from "./config";

export const ADMIN_COOKIE = "zink_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const SESSION_PURPOSE = "zink-admin-session-v1";
const MIN_ADMIN_TOKEN_LENGTH = 24;

// Read directly from the environment (not getConfig) so auth also works in
// demo mode, where the wallet-related variables are absent.
function adminToken(): string | null {
  const token = process.env.ZINK_ADMIN_TOKEN?.trim();
  return token && token.length >= MIN_ADMIN_TOKEN_LENGTH ? token : null;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function secretMatches(candidate: string | undefined | null): boolean {
  const token = adminToken();
  if (!token) return false;
  if (!candidate) return false;
  return timingSafeEqual(digest(candidate), digest(token));
}

/**
 * The hosted showcase may stay open because it contains synthetic sample data
 * and cannot create links. Any process with a real wallet fails closed.
 */
export function isLocalMode(): boolean {
  return adminToken() === null && isDemoMode();
}

export function isAuthMisconfigured(): boolean {
  return adminToken() === null && !isDemoMode();
}

function sessionSignature(expiresAt: number, token: string): Buffer {
  return createHmac("sha256", token)
    .update(`${SESSION_PURPOSE}:${expiresAt}`, "utf8")
    .digest();
}

/** Create a signed, expiring session that never exposes the root admin token. */
export function createAdminSession(now = Date.now()): string {
  const token = adminToken();
  if (!token) throw new Error("ZINK_ADMIN_TOKEN is not configured");
  const expiresAt = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  return `${expiresAt}.${sessionSignature(expiresAt, token).toString("base64url")}`;
}

export function sessionMatches(
  candidate: string | undefined | null,
  now = Date.now(),
): boolean {
  const token = adminToken();
  if (!token || !candidate) return false;
  const [expiresRaw, signatureRaw, extra] = candidate.split(".");
  if (!expiresRaw || !signatureRaw || extra !== undefined) return false;
  const expiresAt = Number(expiresRaw);
  const nowSeconds = Math.floor(now / 1000);
  if (!Number.isSafeInteger(expiresAt) || expiresAt < nowSeconds) return false;
  if (expiresAt > nowSeconds + SESSION_TTL_SECONDS + 60) return false;
  let candidateSignature: Buffer;
  try {
    candidateSignature = Buffer.from(signatureRaw, "base64url");
  } catch {
    return false;
  }
  const expected = sessionSignature(expiresAt, token);
  return (
    candidateSignature.length === expected.length &&
    timingSafeEqual(candidateSignature, expected)
  );
}

/**
 * Merchant authorization for API routes. Accepts the session cookie set by
 * /api/auth or an `Authorization: Bearer <token>` header (for curl/scripts).
 */
export function isAuthorizedRequest(request: NextRequest): boolean {
  if (isLocalMode()) return true;
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ") && secretMatches(header.slice(7))) {
    return true;
  }
  return sessionMatches(request.cookies.get(ADMIN_COOKIE)?.value);
}

/** Merchant authorization for server components, via next/headers cookies. */
export function isAuthorizedCookie(cookieValue: string | undefined): boolean {
  if (isLocalMode()) return true;
  return sessionMatches(cookieValue);
}
