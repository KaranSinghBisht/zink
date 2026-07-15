import { NextRequest, NextResponse } from "next/server";
import { listLinks } from "@/lib/links";
import { zatsToDecimalZec } from "@/lib/zec";
import { csvField } from "@/lib/csv";
import { isAuthorizedRequest } from "@/lib/auth";
import { log } from "@/lib/log";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(
      { error: "Unauthorized — merchant token required" },
      { status: 401 },
    );
  }
  try {
    const header =
      "id,description,amount_zec,status,paid_zec,txid,mined_height,paid_at_utc,created_at_utc";
    const rows = listLinks().map((link) =>
      [
        link.id,
        csvField(link.description),
        zatsToDecimalZec(BigInt(link.amountZats)),
        link.status,
        link.paidValueZats != null
          ? zatsToDecimalZec(BigInt(link.paidValueZats))
          : "",
        link.txid ?? "",
        link.minedHeight?.toString() ?? "",
        link.blockTime != null
          ? new Date(link.blockTime * 1000).toISOString()
          : "",
        new Date(link.createdAt).toISOString(),
      ].join(","),
    );
    const csv = [header, ...rows].join("\n") + "\n";
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="zink-links.csv"',
      },
    });
  } catch (err) {
    log.error("csv export failed", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
