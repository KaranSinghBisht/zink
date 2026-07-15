import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLink } from "@/lib/links";
import { createDemoPreviewLink } from "@/lib/demo";
import { requestOrigin } from "@/lib/origin";
import { zatsToDecimalZec } from "@/lib/zec";
import { Qr } from "@/components/qr";
import { CopyButton } from "@/components/copy-button";
import { PayStatus } from "@/components/pay-status";
import { VeilBends } from "@/components/veil-bends";
import {
  getNetwork,
  isDemoMode,
} from "@/lib/config";
import { networkLabel, networkTicker } from "@/lib/network";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invoice — Zink",
  robots: { index: false, follow: false },
};

const ID_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    amount?: string | string[];
    description?: string | string[];
  }>;
}) {
  const { id } = await params;
  if (!ID_PATTERN.test(id)) notFound();
  const storedLink = getLink(id);
  if (!storedLink) notFound();

  const demo = isDemoMode();
  let link = storedLink;
  let previewQuery = "";
  if (demo && id === "demo-preview") {
    const query = await searchParams;
    const amountInput =
      typeof query.amount === "string" ? query.amount : undefined;
    const descriptionInput =
      typeof query.description === "string" ? query.description : undefined;
    link = createDemoPreviewLink(amountInput, descriptionInput);

    const canonicalQuery = new URLSearchParams({
      amount: zatsToDecimalZec(BigInt(link.amountZats)),
    });
    if (descriptionInput?.trim()) {
      canonicalQuery.set("description", link.description);
    }
    previewQuery = `?${canonicalQuery.toString()}`;
  }
  const network = getNetwork();
  const networkName = networkLabel(network);
  const ticker = networkTicker(network);
  const amount = zatsToDecimalZec(BigInt(link.amountZats));
  const shortAddress = `${link.address.slice(0, 20)}…${link.address.slice(-10)}`;
  const shareUrl = `${await requestOrigin()}/l/${link.id}${previewQuery}`;

  return (
    <div className="veil flex flex-1 items-center justify-center px-4 py-10">
      <VeilBends intensity={1} speed={0.1} />
      <main className="rise w-full max-w-md">
        <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-cream/45">
          {demo ? "Hosted showcase" : "Shielded"}{" "}
          <span className="text-cream/25">·</span>{" "}
          {demo
            ? "[ product preview · no chain ]"
            : `[ Orchard · ${networkName} ]`}
        </p>
        <div className="perf-edge h-3 text-card" aria-hidden />
        <div className="bg-card px-7 py-8 text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] sm:px-9">
          <header className="flex items-start justify-between gap-4 border-b border-dashed border-line pb-5">
            <div>
              <span className="font-display text-lg font-bold tracking-tight">
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

          {demo ? (
            <div className="mt-5 rounded-xl border border-gold-deep/40 bg-gold-pale/35 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-deep">
                {id === "demo-preview"
                  ? "Your synthetic preview · do not pay"
                  : "Illustrative sample · do not pay"}
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
                This invoice is synthetic. The hosted site has no wallet and
                cannot receive or detect payments.
              </p>
            </div>
          ) : null}

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
              <span className="ml-2 text-lg font-medium text-mute">{ticker}</span>
            </p>
          </div>

          {link.status === "unpaid" ? (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="relative rounded-xl border border-line bg-card p-3">
                <Qr
                  value={demo ? shareUrl : link.uri}
                  label={demo ? "Showcase page QR code" : "Payment QR code"}
                />
                {demo ? (
                  <span className="absolute inset-x-3 bottom-3 rounded-md bg-ink/90 px-2 py-1 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-paper">
                    Opens this showcase page
                  </span>
                ) : null}
              </div>
              {demo ? (
                <div className="w-full rounded-xl border border-gold-deep/35 bg-gold-pale/25 px-4 py-3 text-center font-display text-[14px] font-semibold text-gold-deep">
                  Wallet payment disabled in showcase
                </div>
              ) : (
                <>
                  <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                    <a
                      href={link.uri}
                      className="flex min-h-11 items-center justify-center rounded-xl bg-ink px-4 py-3 text-center font-display text-[15px] font-bold text-paper transition-opacity duration-100 ease-out hover:opacity-90 active:translate-y-px"
                    >
                      Open in wallet
                    </a>
                    <CopyButton
                      text={link.uri}
                      label="Copy ZIP-321"
                      className="min-h-11 justify-center rounded-xl border border-line bg-paper px-4 py-3 font-semibold text-ink-soft hover:border-gold-deep hover:text-ink"
                    />
                  </div>
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
                </>
              )}
              <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-gold-deep/40 bg-paper px-3 py-2.5">
                <span className="truncate font-mono text-[11px] text-ink-soft">
                  {shareUrl.replace(/^https?:\/\//, "")}
                </span>
                <CopyButton
                  text={shareUrl}
                  label={demo ? "Copy showcase link" : "Copy payment link"}
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
              network={network}
              demo={demo}
            />
          </div>

          <footer className="mt-6 border-t border-dashed border-line pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              Orchard-only · unique address · viewing-key monitored · encrypted
              memo
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-faint">
              {demo
                ? "This is a non-payable product preview. Run a real instance to derive a fresh shielded address."
                : "This address was derived for this invoice alone. Public chain observers cannot link it to the merchant's wallet, balance, or other invoices through the address itself."}
            </p>
          </footer>
        </div>
        <div className="perf-edge h-3 rotate-180 text-card" aria-hidden />
      </main>
    </div>
  );
}
