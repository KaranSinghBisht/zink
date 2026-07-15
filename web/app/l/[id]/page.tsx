import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLink } from "@/lib/links";
import { getConfig } from "@/lib/config";
import { zatsToDecimalZec } from "@/lib/zec";
import { Qr } from "@/components/qr";
import { CopyButton } from "@/components/copy-button";
import { PayStatus } from "@/components/pay-status";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invoice — Zink",
};

const ID_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!ID_PATTERN.test(id)) notFound();
  const link = getLink(id);
  if (!link) notFound();

  const amount = zatsToDecimalZec(BigInt(link.amountZats));
  const shortAddress = `${link.address.slice(0, 20)}…${link.address.slice(-10)}`;
  const shareUrl = `${getConfig().baseUrl}/l/${link.id}`;

  return (
    <div className="panel-gold flex flex-1 items-center justify-center px-4 py-10">
      <main className="w-full max-w-md">
        <div className="perf-edge h-3 text-card" aria-hidden />
        <div className="bg-card px-7 py-8 text-ink shadow-[0_24px_60px_-24px_rgba(23,27,40,0.45)] sm:px-9">
          <header className="flex items-start justify-between gap-4 border-b border-dashed border-line pb-5">
            <div>
              <span className="font-display text-lg font-extrabold tracking-tight">
                zink<span className="text-gold-deep">.</span>
              </span>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                Shielded invoice
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                Invoice Nº
              </p>
              <p className="font-mono text-[13px] font-medium">{link.id}</p>
            </div>
          </header>

          {link.description ? (
            <p className="mt-5 text-[15px] leading-snug text-ink-soft">
              {link.description}
            </p>
          ) : null}

          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              Amount due
            </p>
            <p className="mt-1 font-mono text-[2.4rem] font-semibold leading-none tracking-tight">
              {amount}
              <span className="ml-2 text-lg font-medium text-mute">ZEC</span>
            </p>
          </div>

          {link.status === "unpaid" ? (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="rounded-xl border border-line bg-card p-3">
                <Qr value={link.uri} />
              </div>
              <a
                href={link.uri}
                className="w-full rounded-xl bg-ink px-4 py-3 text-center font-display text-[15px] font-bold text-paper transition-opacity hover:opacity-90"
              >
                Open in wallet
              </a>
              <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-paper px-3 py-2.5">
                <span
                  className="truncate font-mono text-[11px] text-ink-soft"
                  title={link.address}
                >
                  {shortAddress}
                </span>
                <CopyButton
                  text={link.address}
                  label="Copy address"
                  className="shrink-0 text-mute hover:text-ink"
                />
              </div>
              <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-gold-deep/40 bg-paper px-3 py-2.5">
                <span className="truncate font-mono text-[11px] text-ink-soft">
                  {shareUrl.replace(/^https?:\/\//, "")}
                </span>
                <CopyButton
                  text={shareUrl}
                  label="Copy payment link"
                  className="shrink-0 font-semibold text-gold-deep hover:text-ink"
                />
              </div>
            </div>
          ) : null}

          <div className="mt-6 border-t border-dashed border-line pt-5">
            <PayStatus
              linkId={link.id}
              initial={{
                status: link.status,
                txid: link.txid,
                paidValueZats: link.paidValueZats,
                minedHeight: link.minedHeight,
              }}
            />
          </div>

          <footer className="mt-6 border-t border-dashed border-line pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Orchard-only · unique address · viewing-key monitored · encrypted
              memo
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-faint">
              This address was derived for this invoice alone. It cannot be
              linked to the merchant&apos;s wallet, balance, or any other
              invoice — a property of Zcash shielded addresses, not a promise.
            </p>
          </footer>
        </div>
        <div className="perf-edge h-3 rotate-180 text-card" aria-hidden />
      </main>
    </div>
  );
}
