import Database from "better-sqlite3";
import { getConfig, walletDataDb } from "./config";

export interface ReceivedOutput {
  toAddress: string | null;
  valueZats: number;
  memoText: string | null;
  minedHeight: number | null;
  blockTime: number | null;
  txid: string;
}

interface RawRow {
  to_address: string | null;
  value: number;
  memo: Buffer | null;
  mined_height: number | null;
  block_time: number | null;
  txid: Buffer;
}

type GlobalWithWalletDb = typeof globalThis & {
  __zinkWalletDb?: Database.Database;
};

function getWalletDb(): Database.Database {
  const g = globalThis as GlobalWithWalletDb;
  if (!g.__zinkWalletDb) {
    const db = new Database(walletDataDb(getConfig()), {
      readonly: true,
      fileMustExist: true,
    });
    db.pragma("busy_timeout = 5000");
    g.__zinkWalletDb = db;
  }
  return g.__zinkWalletDb;
}

/** ZIP-302: memos whose first byte is <= 0xF4 are UTF-8 text, zero-padded. */
function decodeMemo(memo: Buffer | null): string | null {
  if (!memo || memo.length === 0) return null;
  if (memo[0] > 0xf4) return null;
  let end = memo.length;
  while (end > 0 && memo[end - 1] === 0) end -= 1;
  if (end === 0) return null;
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(
      memo.subarray(0, end),
    );
  } catch {
    return null;
  }
}

/** Zcash txids display byte-reversed relative to their stored order. */
function txidToHex(raw: Buffer): string {
  return Buffer.from(raw).reverse().toString("hex");
}

/** Highest block height the view wallet has scanned, or null before first sync. */
export function getSyncedHeight(): number | null {
  const row = getWalletDb()
    .prepare("SELECT MAX(height) AS height FROM blocks")
    .get() as { height: number | null } | undefined;
  return row?.height ?? null;
}

/** All external (non-change) outputs received by the view wallet. */
export function listReceivedOutputs(): ReceivedOutput[] {
  const rows = getWalletDb()
    .prepare(
      `SELECT o.to_address, o.value, o.memo, t.mined_height, t.block_time, t.txid
       FROM v_tx_outputs o
       JOIN v_transactions t ON t.txid = o.txid
       WHERE o.to_account_uuid IS NOT NULL
         AND o.is_change = 0
         AND o.from_account_uuid IS NULL`,
    )
    .all() as RawRow[];

  return rows.map((row) => ({
    toAddress: row.to_address,
    valueZats: row.value,
    memoText: decodeMemo(row.memo),
    minedHeight: row.mined_height,
    blockTime: row.block_time,
    txid: txidToHex(row.txid),
  }));
}
