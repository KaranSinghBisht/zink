import Database from "better-sqlite3";
import { getConfig } from "./config";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  amount_zats INTEGER NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL UNIQUE,
  uri TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid',
  txid TEXT,
  paid_value_zats INTEGER,
  paid_memo TEXT,
  mined_height INTEGER,
  block_time INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_links_status ON links(status);
`;

type GlobalWithDb = typeof globalThis & { __zinkDb?: Database.Database };

export function getDb(): Database.Database {
  const g = globalThis as GlobalWithDb;
  if (!g.__zinkDb) {
    const db = new Database(getConfig().dbPath);
    db.pragma("journal_mode = WAL");
    db.exec(SCHEMA);
    g.__zinkDb = db;
  }
  return g.__zinkDb;
}
