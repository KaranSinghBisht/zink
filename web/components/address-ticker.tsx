"use client";

import { useEffect, useState } from "react";
import { unifiedAddressPrefix, type ZcashNetwork } from "@/lib/network";

const ADDRESS_LABELS = [
  {
    who: "Customer A pays",
    suffix: "invoice-a…[redacted]",
  },
  {
    who: "Customer B pays",
    suffix: "invoice-b…[redacted]",
  },
  {
    who: "Customer C pays",
    suffix: "invoice-c…[redacted]",
  },
];

export function AddressTicker({ network }: { network: ZcashNetwork }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % ADDRESS_LABELS.length),
      3200,
    );
    return () => clearInterval(timer);
  }, []);

  const current = ADDRESS_LABELS[index];

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
          {unifiedAddressPrefix(network)}…{current.suffix}
        </div>
      </div>
      <div className="mt-3 border-t border-cream/15 pt-3 text-[13px] font-medium text-cream/60">
        Three customers, three unique addresses, no public address-level link —
        and all of it lands in one wallet.
      </div>
    </div>
  );
}
