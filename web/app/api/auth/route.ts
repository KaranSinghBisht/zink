import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSession,
  isAuthMisconfigured,
  isLocalMode,
  secretMatches,
} from "@/lib/auth";
import { clientRateLimitKey, rateLimitExceeded } from "@/lib/ratelimit";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (isLocalMode()) {
    return NextResponse.json({ ok: true, localMode: true });
  }
  if (isAuthMisconfigured()) {
    return NextResponse.json(
      {
        error:
          "Server misconfigured — ZINK_ADMIN_TOKEN must be at least 24 characters",
      },
      { status: 503 },
    );
  }
  if (
    rateLimitExceeded("auth:global", 60) ||
    rateLimitExceeded(clientRateLimitKey("auth", request.headers), 10)
  ) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { token } = (body ?? {}) as { token?: unknown };
  if (typeof token !== "string" || !secretMatches(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
