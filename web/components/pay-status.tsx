"use client";

import { useEffect, useState } from "react";

export interface LinkStatusPayload {
  status: "unpaid" | "paid";
  txid: string | null;
  paidValueZats: number | null;
  minedHeight: number | null;
}

export function PayStatus({
  linkId,
  initial,
}: {
  linkId: string;
  initial: LinkStatusPayload;
}) {
  const [state, setState] = useState<LinkStatusPayload>(initial);
  const [watcherOk, setWatcherOk] = useState(true);

  useEffect(() => {
    if (state.status === "paid") return;
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`/api/links/${linkId}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as {
          link?: LinkStatusPayload;
          watcherOk?: boolean;
        };
        if (typeof data.watcherOk === "boolean") {
          setWatcherOk(data.watcherOk);
        }
        if (data.link?.status === "paid") {
          setState(data.link);
        }
      } catch {
        // Transient polling failure; the next tick retries.
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [linkId, state.status]);

  if (state.status === "paid") {
    return (
      <div className="flex flex-col items-center gap-4 py-2">
        <div
          role="status"
          aria-live="polite"
          className="stamp select-none rounded-md border-[3px] border-cleared px-6 py-2 text-center"
        >
          <div className="font-display text-4xl font-extrabold uppercase tracking-[0.14em] text-cleared">
            Paid
          </div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-cleared/80">
            mined on zcash mainnet
          </div>
        </div>
        <dl className="w-full space-y-1.5 border-t border-dashed border-line pt-4 font-mono text-[12px] text-ink-soft">
          {state.minedHeight != null ? (
            <div className="flex justify-between gap-4">
              <dt className="uppercase tracking-[0.18em] text-mute">Block</dt>
              <dd>{state.minedHeight.toLocaleString()}</dd>
            </div>
          ) : null}
          {state.txid ? (
            <div className="flex justify-between gap-4">
              <dt className="uppercase tracking-[0.18em] text-mute">Tx</dt>
              <dd className="max-w-[220px] truncate" title={state.txid}>
                {state.txid.slice(0, 18)}…
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-2 py-3"
    >
      <div className="flex items-center justify-center gap-3">
        <span
          aria-hidden
          className={`sonar h-2.5 w-2.5 rounded-full ${
            watcherOk ? "bg-gold-deep" : "bg-[#c23234]"
          }`}
        />
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-mute">
          {watcherOk
            ? "Watching the shielded pool…"
            : "Chain sync delayed — still watching"}
        </span>
      </div>
      {!watcherOk ? (
        <p className="max-w-xs text-center text-[11.5px] leading-relaxed text-faint">
          The payment watcher hasn&apos;t completed a mainnet sync recently.
          Your payment is safe on-chain; this page will update once sync
          recovers.
        </p>
      ) : null}
    </div>
  );
}
