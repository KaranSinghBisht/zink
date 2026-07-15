"use client";

import { useEffect, useState } from "react";

// Real diversified addresses generated from one viewing key on mainnet —
// mutually unlinkable per ZIP 316, which is the entire point.
const ADDRESSES = [
  {
    who: "Customer A pays",
    addr: "u19mjy3n3gv0krgzlyvrefzx4s3r3erhru7cvrrcl4zwxz6ygszdxk8pyyzrpup5awcsjhq2d8cpascfs6v0apclvxr5jzqtggmnkkgvd9h06fzkntl585dpatajmj8mmly7se82xyfyux0jlk7muw5nukjm9rjvq56gn95u4tn30h6rnkd5hz42ujk0f8u8xqghh7jktm97w2v5df8za",
  },
  {
    who: "Customer B pays",
    addr: "u153agyrzaxvfvzurkyn5k6qxv0nptwgr8n0wcu97xm9q7dhr83zf8pf0pp3trh5p99dxq02mdwytgmqtgwhtszew96ffff4jddg4gr62zvmzdyla54cmdk9q3auuq39k5hq3x5ywv7t6hdmr94snyqlvhp5qdjjvtsnpe5xavhw8vzuge0mdxnj2spt0cpu275hc7k6ts4x2sca4n7l6",
  },
  {
    who: "Customer C pays",
    addr: "u1cal5v83m48r0pr8wlpk02ky5dk8uymy59axdwuvxj5cku0g6ydgsj65lazsqnxz3trc0z8990f4wwj4v297lwcc067d5wxr707cn0l68xpgu54gqkdhesdx9e4j2guc9y6u5apvq0phy0t83fcrhhkp2z3rcnt7dg060w8h42qqm30chz8epv0lz9efju6n5mwcvasldw6n4utcc0qz",
  },
];

export function AddressTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % ADDRESSES.length),
      3200,
    );
    return () => clearInterval(timer);
  }, []);

  const current = ADDRESSES[index];

  return (
    <div className="rounded-2xl border border-cream/15 bg-night/40 p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
          one link · one viewing key
        </span>
        <span className="hidden font-mono text-[11px] text-cream/35 sm:inline">
          zink.cash/l/9km2xq
        </span>
      </div>
      <div key={index} className="addr-swap mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50">
          {current.who}
        </div>
        <div className="mt-1 break-all font-mono text-[12.5px] leading-relaxed text-cream/90">
          {current.addr}
        </div>
      </div>
      <div className="mt-3 border-t border-cream/15 pt-3 text-[13px] font-medium text-cream/60">
        Three customers, three addresses, zero connection between them — and all
        of it lands in one wallet.
      </div>
    </div>
  );
}
