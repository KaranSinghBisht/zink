import { nanoid } from "nanoid";
import { getDb } from "./db";
import { generateShieldedAddress } from "./devtool";
import { buildPaymentUri } from "./zip321";
import { isDemoMode } from "./config";
import { DEMO_LINKS, DEMO_PREVIEW_LINK, DemoModeError } from "./demo";

export type LinkStatus = "unpaid" | "paid";

export interface PaymentLink {
  id: string;
  amountZats: number;
  description: string;
  address: string;
  uri: string;
  status: LinkStatus;
  txid: string | null;
  paidValueZats: number | null;
  paidMemo: string | null;
  minedHeight: number | null;
  blockTime: number | null;
  createdAt: number;
}

interface LinkRow {
  id: string;
  amount_zats: number;
  description: string;
  address: string;
  uri: string;
  status: LinkStatus;
  txid: string | null;
  paid_value_zats: number | null;
  paid_memo: string | null;
  mined_height: number | null;
  block_time: number | null;
  created_at: number;
}

function toLink(row: LinkRow): PaymentLink {
  return {
    id: row.id,
    amountZats: row.amount_zats,
    description: row.description,
    address: row.address,
    uri: row.uri,
    status: row.status,
    txid: row.txid,
    paidValueZats: row.paid_value_zats,
    paidMemo: row.paid_memo,
    minedHeight: row.mined_height,
    blockTime: row.block_time,
    createdAt: row.created_at,
  };
}

/**
 * Redacted view of a link safe to serve to anyone holding the invoice URL.
 * Never includes the decrypted memo (the payer may have appended private
 * text) or merchant-internal fields.
 */
export interface PublicLinkStatus {
  id: string;
  status: LinkStatus;
  txid: string | null;
  paidValueZats: number | null;
  minedHeight: number | null;
}

export function toPublicStatus(link: PaymentLink): PublicLinkStatus {
  return {
    id: link.id,
    status: link.status,
    txid: link.txid,
    paidValueZats: link.paidValueZats,
    minedHeight: link.minedHeight,
  };
}

export function memoRefFor(id: string): string {
  return `zink:${id}`;
}

export async function createLink(input: {
  amountZats: bigint;
  description: string;
}): Promise<PaymentLink> {
  if (isDemoMode()) {
    throw new DemoModeError();
  }
  if (input.amountZats <= 0n) {
    throw new Error("Amount must be positive");
  }
  if (input.description.length > 200) {
    throw new Error("Description too long (200 chars max)");
  }
  const id = nanoid(10);
  const address = await generateShieldedAddress();
  const uri = buildPaymentUri(address, input.amountZats, memoRefFor(id));
  getDb()
    .prepare(
      `INSERT INTO links (id, amount_zats, description, address, uri, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      Number(input.amountZats),
      input.description,
      address,
      uri,
      Date.now(),
    );
  return getLink(id)!;
}

export function getLink(id: string): PaymentLink | null {
  if (isDemoMode()) {
    if (id === DEMO_PREVIEW_LINK.id) return DEMO_PREVIEW_LINK;
    return DEMO_LINKS.find((link) => link.id === id) ?? null;
  }
  const row = getDb().prepare("SELECT * FROM links WHERE id = ?").get(id) as
    LinkRow | undefined;
  return row ? toLink(row) : null;
}

export function listLinks(): PaymentLink[] {
  if (isDemoMode()) {
    return [...DEMO_LINKS].sort((a, b) => b.createdAt - a.createdAt);
  }
  const rows = getDb()
    .prepare("SELECT * FROM links ORDER BY created_at DESC")
    .all() as LinkRow[];
  return rows.map(toLink);
}

export function listUnpaidLinks(): PaymentLink[] {
  if (isDemoMode()) {
    return DEMO_LINKS.filter((link) => link.status === "unpaid");
  }
  const rows = getDb()
    .prepare("SELECT * FROM links WHERE status = 'unpaid'")
    .all() as LinkRow[];
  return rows.map(toLink);
}

export function markPaid(
  id: string,
  payment: {
    txid: string;
    valueZats: number;
    memo: string | null;
    minedHeight: number | null;
    blockTime: number | null;
  },
): boolean {
  const result = getDb()
    .prepare(
      `UPDATE links
       SET status = 'paid', txid = ?, paid_value_zats = ?, paid_memo = ?,
           mined_height = ?, block_time = ?
       WHERE id = ? AND status = 'unpaid'`,
    )
    .run(
      payment.txid,
      payment.valueZats,
      payment.memo,
      payment.minedHeight,
      payment.blockTime,
      id,
    );
  return result.changes > 0;
}
