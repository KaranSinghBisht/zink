# zink.

**Payment links that never link back.**

Zink is non-custodial payment-link infrastructure for Zcash. A merchant configures a
view-only wallet from their **Unified Full Viewing Key** — never a spending key — and
gets Stripe-style payment links. Every link derives a **fresh diversified shielded address** ([ZIP-316](https://zips.z.cash/zip-0316)),
so no customer can connect one invoice to another, to the merchant's balance, or to
anyone else who has ever paid them. Payments are detected live on **Zcash mainnet**
through the viewing key and reconciled into a dashboard with CSV export.

Built for **ZecHub Hackathon 3.0** — Accounting track (payment management).

**Live showcase:** [zink-bice.vercel.app](https://zink-bice.vercel.app) — a hosted,
read-only deployment with a sample ledger (serverless hosts can't run the wallet
sync). The full mainnet flow — real link creation, live payment detection — runs
locally next to a view-only wallet; see [Quick start](#quick-start) below.

## Why this is only possible on Zcash

On transparent chains a payment link *is* your address: every customer can read your
balance, your revenue history, and everyone else who paid you. Stripe solves that with
custody — they hold your money and see everything. Zcash solves it in the protocol:

- **Diversified addresses** (ZIP-316): one wallet key yields billions of shielded
  addresses that are cryptographically unlinkable — and one incoming viewing key scans
  *all of them* in a single pass. Zink assigns one per invoice.
- **Viewing keys**: Zink's server can *watch* payments arrive but can never spend.
  Non-custodial by construction, not by promise.
- **Encrypted memos** ([ZIP-302](https://zips.z.cash/zip-0302)): each payment carries its
  invoice reference (`zink:<id>`), visible only to payer and merchant, enabling automatic
  reconciliation with zero public metadata.
- **ZIP-321 payment URIs**: the QR your customer scans encodes address + amount + memo;
  works with Zashi, YWallet, and any standards-compliant wallet.

## How it works

```
┌────────────┐   POST /api/links    ┌──────────────────────────────┐
│  Next.js   │ ───────────────────▶ │ zcash-devtool (vendored)     │
│  web + API │   generate-address   │ · derives UA at next         │
│            │ ◀─────────────────── │   diversifier index          │
│  pay page  │                      │   (--shielded-only, Orchard) │
│  dashboard │   sync loop (20s)    │ · syncs view-only wallet     │
│  CSV       │ ───────────────────▶ │   from lightwalletd (Tor)    │
└─────┬──────┘                      └──────────────┬───────────────┘
      │         SQL: v_tx_outputs ⋈ v_transactions │
      └────────────◀ data.sqlite (zcash_client_sqlite) ◀───────────┘
```

- The wallet database (`zcash_client_sqlite`) is the single source of truth: the sync
  loop scans mainnet through the viewing key, and payment detection is a SQL query over
  received outputs (`to_address`, `value`, decrypted `memo`), matched to issued links.
- The devtool connects to lightwalletd **over Tor** by default.

## Quick start

Prerequisites: Rust (1.87+), Node 22+, `pnpm`.

### 1. Build the wallet backend

```bash
git clone https://github.com/zcash/zcash-devtool.git vendor/zcash-devtool
cd vendor/zcash-devtool
git checkout c8322f7e71ae46ab24801a721523ba83b27d911b
git apply ../../patches/zcash-devtool-zink.patch
cargo build --release
cd ../..
```

The patch (~90 lines) adds two things: a `--shielded-only` flag for
`generate-address` (Orchard-only receivers, required for unlinkability), and tolerance
for lightwalletd servers that reject Ironwood subtree-root requests.

### 2. Create wallets (mainnet)

```bash
DEVTOOL=vendor/zcash-devtool/target/release/zcash-devtool

# Merchant wallet — generates a 24-word mnemonic, encrypted with an age identity.
# Press Enter at the prompt to generate a fresh mnemonic.
$DEVTOOL wallet -w wallets/merchant init --name merchant -i wallets/merchant.age -n main -s zecrocks

# Print the account's UFVK (viewing key), then import it into a view-only wallet:
$DEVTOOL wallet -w wallets/merchant list-accounts
$DEVTOOL wallet -w wallets/zink-view init-fvk --name zink --fvk "uview1..." -s zecrocks
```

Already have a wallet (YWallet, Zashi, zallet)? Export its UFVK and start at `init-fvk`.
Zink only ever touches the view-only wallet.

### 3. Run Zink

```bash
cd web
cp .env.example .env.local   # adjust paths if you changed them
pnpm install
pnpm dev                     # http://localhost:3000
```

## Usage

1. **Create a link** on the home page: amount in ZEC plus a description.
2. **Share** `http://<host>/l/<id>` — the pay page shows a ZIP-321 QR, an
   `Open in wallet` deep link, and the shielded address with copy button.
3. **Customer pays** from any shielded-capable wallet (Zashi, YWallet, …).
4. Within a sync cycle of the transaction being mined, the pay page **stamps PAID**
   (block height + txid shown) and the dashboard updates totals.
5. **Export CSV** from the dashboard for bookkeeping.

## Configuration

| Variable | Meaning | Default |
|---|---|---|
| `ZINK_DEVTOOL_BIN` | Path to the patched `zcash-devtool` binary | — (required) |
| `ZINK_WALLET_DIR` | View-only wallet directory | — (required) |
| `ZINK_DB_PATH` | Zink's own SQLite (links) | `<wallet dir>/zink.sqlite` |
| `ZINK_SERVER` | lightwalletd server set (`zecrocks`, `ywallet`) | `zecrocks` |
| `ZINK_BASE_URL` | Public base URL for links | `http://localhost:3000` |
| `ZINK_SYNC_INTERVAL_MS` | Sync/detect loop interval | `20000` |
| `ZINK_MIN_CONFIRMATIONS` | Confirmations required before an invoice is marked paid | `1` |
| `ZINK_ADMIN_TOKEN` | Merchant token gating the dashboard, link creation/listing, and CSV export. **Required for any non-local deployment.** | unset (open, local use only) |

## Security notes

- The server holds a **viewing key only**. A total compromise of the Zink host can leak
  payment *metadata* (who was invoiced what), never funds.
- Spending keys stay in the merchant wallet (age-encrypted mnemonic) and are never read
  by Zink. Keep wallet directories and key/database files owner-only (`chmod 700` /
  `chmod 600`), and keep the spending wallet off the Zink host entirely in production.
- Invoice addresses are Orchard-only unified addresses: no transparent receiver, so a
  paying wallet cannot accidentally make the payment public.
- Merchant surfaces (dashboard, link list, CSV export, link creation) are gated by
  `ZINK_ADMIN_TOKEN`; only the pay page and a redacted status endpoint are public.
  The public status endpoint never returns decrypted memo contents.
- An invoice is only marked **paid** once the payment is mined with at least
  `ZINK_MIN_CONFIRMATIONS` confirmations — mempool transactions never settle a link.
- Amounts are validated against the ZEC decimal format and Zcash's monetary range
  before an address is derived. Link creation is rate-limited.
- CSV export neutralizes spreadsheet formula prefixes, and responses carry standard
  browser security headers (CSP, frame denial, nosniff, no-referrer).
- Inputs are validated at the API boundary; errors never echo key material.

## Limitations & roadmap

- One merchant account per instance (multi-tenant would need per-tenant wallet dirs).
- Detection requires the payment to be mined (~75 s block time); mempool detection is a
  natural next step via lightwalletd mempool streaming.
- Fiat display, partial payments, and an embeddable checkout widget are out of scope for
  the hackathon build.

## License

[MIT](./LICENSE)

## Credits

Built on [zcash-devtool](https://github.com/zcash/zcash-devtool),
[librustzcash](https://github.com/zcash/librustzcash) (`zcash_client_sqlite`,
`zcash_keys`), [lightwalletd infrastructure by zec.rocks](https://zec.rocks), and the
ZIPs. Thanks to ZecHub for running the hackathon.
