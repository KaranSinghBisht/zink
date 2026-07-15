import type { PaymentLink } from "./links";

/**
 * Sample ledger for the hosted showcase (demo mode). Addresses are real
 * mainnet Orchard-only diversified addresses derived from the project's
 * view-only wallet; the "paid" entry is illustrative sample data.
 */
export const DEMO_LINKS: PaymentLink[] = [
  {
    id: "demo-paid-1",
    amountZats: 450_000,
    description: "Sample — design retainer",
    address:
      "u1598r47umlxz4839kmyjr6yv02w9fv3ggg08pa6wptm3ku90mk5ekmh5sjedarca8mgg4eec83gdm6wz2e3p8tlh8u0pc29e8as6sj0t2",
    uri: "zcash:u1598r47umlxz4839kmyjr6yv02w9fv3ggg08pa6wptm3ku90mk5ekmh5sjedarca8mgg4eec83gdm6wz2e3p8tlh8u0pc29e8as6sj0t2?amount=0.0045&memo=emluazpkZW1vLXBhaWQtMQ",
    status: "paid",
    txid: "9d1f4c0e7b2a58c3d6f0a1b4e8c25d7f3a690b1c4d8e2f5a7b0c3d6e9f124a5b",
    paidValueZats: 450_000,
    paidMemo: "zink:demo-paid-1",
    minedHeight: 3_412_681,
    blockTime: 1_784_070_000,
    createdAt: 1_784_020_000_000,
  },
  {
    id: "demo-open-1",
    amountZats: 1_200_000,
    description: "Sample — consulting invoice",
    address:
      "u10maj250lrzm0zkkr9huxxj6sk8z927mg5vnpnlwal6d5js8zescdwudu6dgvpzlr6zhn9hcaxfkm9swaqgy38s42kx6ptq3ajgqkx82r",
    uri: "zcash:u10maj250lrzm0zkkr9huxxj6sk8z927mg5vnpnlwal6d5js8zescdwudu6dgvpzlr6zhn9hcaxfkm9swaqgy38s42kx6ptq3ajgqkx82r?amount=0.012&memo=emluazpkZW1vLW9wZW4tMQ",
    status: "unpaid",
    txid: null,
    paidValueZats: null,
    paidMemo: null,
    minedHeight: null,
    blockTime: null,
    createdAt: 1_784_083_000_000,
  },
  {
    id: "demo-open-2",
    amountZats: 250_000,
    description: "Sample — workshop seat",
    address:
      "u19mjy3n3gv0krgzlyvrefzx4s3r3erhru7cvrrcl4zwxz6ygszdxk8pyyzrpup5awcsjhq2d8cpascfs6v0apclvxr5jzqtggmnkkgvd9h06fzkntl585dpatajmj8mmly7se82xyfyux0jlk7muw5nukjm9rjvq56gn95u4tn30h6rnkd5hz42ujk0f8u8xqghh7jktm97w2v5df8za",
    uri: "zcash:u19mjy3n3gv0krgzlyvrefzx4s3r3erhru7cvrrcl4zwxz6ygszdxk8pyyzrpup5awcsjhq2d8cpascfs6v0apclvxr5jzqtggmnkkgvd9h06fzkntl585dpatajmj8mmly7se82xyfyux0jlk7muw5nukjm9rjvq56gn95u4tn30h6rnkd5hz42ujk0f8u8xqghh7jktm97w2v5df8za?amount=0.0025&memo=emluazpkZW1vLW9wZW4tMg",
    status: "unpaid",
    txid: null,
    paidValueZats: null,
    paidMemo: null,
    minedHeight: null,
    blockTime: null,
    createdAt: 1_784_089_500_000,
  },
];

export class DemoModeError extends Error {
  constructor() {
    super(
      "This is the hosted showcase — link creation runs on the merchant's own instance with a view-only wallet. Clone the repo to create real links.",
    );
    this.name = "DemoModeError";
  }
}
