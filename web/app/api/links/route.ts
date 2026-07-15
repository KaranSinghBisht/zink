import { NextRequest, NextResponse } from "next/server";
import { createLink, listLinks } from "@/lib/links";
import { DemoModeError } from "@/lib/demo";
import { decimalZecToZats } from "@/lib/zec";
import { isAuthorizedRequest } from "@/lib/auth";
import { rateLimitExceeded } from "@/lib/ratelimit";
import { log } from "@/lib/log";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 4096;

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(
      { error: "Unauthorized — merchant token required" },
      { status: 401 },
    );
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (rateLimitExceeded(`create:${ip}`, 12)) {
    return NextResponse.json(
      { error: "Too many links created — slow down" },
      { status: 429 },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Body too large" }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { amount, description } = (body ?? {}) as {
    amount?: unknown;
    description?: unknown;
  };
  if (typeof amount !== "string" || amount.length === 0) {
    return NextResponse.json(
      { error: "amount (decimal ZEC string) is required" },
      { status: 400 },
    );
  }
  if (description !== undefined && typeof description !== "string") {
    return NextResponse.json(
      { error: "description must be a string" },
      { status: 400 },
    );
  }

  let amountZats: bigint;
  try {
    amountZats = decimalZecToZats(amount);
  } catch {
    return NextResponse.json(
      {
        error:
          "amount must be a decimal ZEC value with up to 8 places, within the Zcash monetary range",
      },
      { status: 400 },
    );
  }
  if (amountZats <= 0n) {
    return NextResponse.json(
      { error: "amount must be positive" },
      { status: 400 },
    );
  }

  try {
    const link = await createLink({
      amountZats,
      description: (description ?? "").trim(),
    });
    return NextResponse.json({ link }, { status: 201 });
  } catch (err) {
    if (err instanceof DemoModeError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    log.error("link creation failed", err);
    return NextResponse.json(
      { error: "Failed to create payment link" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(
      { error: "Unauthorized — merchant token required" },
      { status: 401 },
    );
  }
  try {
    return NextResponse.json({ links: listLinks() });
  } catch (err) {
    log.error("link listing failed", err);
    return NextResponse.json(
      { error: "Failed to list payment links" },
      { status: 500 },
    );
  }
}
