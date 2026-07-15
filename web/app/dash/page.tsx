import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { listLinks } from "@/lib/links";
import { isDemoMode } from "@/lib/config";
import { requestOrigin } from "@/lib/origin";
import { zatsToDecimalZec } from "@/lib/zec";
import { getSyncHealth, syncAgeLabel } from "@/lib/health";
import { ADMIN_COOKIE, isAuthorizedCookie } from "@/lib/auth";
import { AutoRefresh } from "@/components/auto-refresh";
import { AdminLogin } from "@/components/admin-login";
import { CopyButton } from "@/components/copy-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — Zink",
};

function StatusBadge({ status }: { status: "unpaid" | "paid" }) {
  if (status === "paid") {
    return (
      <span className="rounded-md border border-cleared/30 bg-cleared/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cleared">
        Paid
      </span>
    );
  }
  return (
    <span className="rounded-md border border-line bg-paper-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
      Unpaid
    </span>
  );
}

function SyncHealthBadge() {
  if (isDemoMode()) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md border border-gold-deep/30 bg-gold-pale/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gold-deep">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-deep" />
        Hosted showcase — sample ledger
      </span>
    );
  }
  const { lastSyncAt, lastError } = getSyncHealth();
  if (lastError) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md border border-[#c23234]/30 bg-[#c23234]/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c23234]">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#c23234]" />
        Sync error — retrying
      </span>
    );
  }
  if (lastSyncAt == null) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md border border-line bg-paper-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-faint" />
        First sync pending…
      </span>
    );
  }
  const age = syncAgeLabel(lastSyncAt);
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-cleared/30 bg-cleared/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cleared">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cleared" />
      Synced {age}
    </span>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  if (!isAuthorizedCookie(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return <AdminLogin />;
  }

  const links = listLinks();
  const baseUrl = await requestOrigin();
  const paid = links.filter((link) => link.status === "paid");
  const collectedZats = paid.reduce(
    (sum, link) => sum + (link.paidValueZats ?? 0),
    0,
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 sm:px-8">
      <AutoRefresh />
      <header className="flex items-center justify-between py-6">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight"
        >
          zink<span className="text-gold-deep">.</span>
        </Link>
        <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
          <Link href="/new" className="transition-colors hover:text-ink">
            New link
          </Link>
          <a
            href="/api/export"
            className="rounded-lg border border-line bg-card px-2.5 py-1.5 transition-colors hover:border-gold-deep hover:text-ink"
          >
            Export CSV
          </a>
        </nav>
      </header>

      <main className="flex-1 pb-14">
        <div className="pb-6 pt-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
            The ledger{" "}
            <span className="text-faint">[ view-only · reconciled live ]</span>
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            every payment lands.{" "}
            <span className="text-mute">nothing leaks.</span>
          </h1>
        </div>
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="panel-gold rounded-2xl p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
              Collected
            </p>
            <p className="mt-1.5 font-mono text-3xl font-semibold text-ink">
              {zatsToDecimalZec(BigInt(collectedZats))}
              <span className="ml-1.5 text-sm font-medium text-ink/60">
                ZEC
              </span>
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
              Paid invoices
            </p>
            <p className="mt-1.5 font-mono text-3xl font-semibold text-ink">
              {paid.length}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
              Awaiting payment
            </p>
            <p className="mt-1.5 font-mono text-3xl font-semibold text-ink">
              {links.length - paid.length}
            </p>
          </div>
        </section>

        <section className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Block</th>
                <th className="px-4 py-3 font-medium">Link</th>
                <th className="px-4 py-3 font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {links.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-mute">
                    No links yet.{" "}
                    <Link
                      href="/new"
                      className="font-semibold text-gold-deep underline"
                    >
                      Create your first payment link
                    </Link>{" "}
                    to start getting paid shielded.
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr
                    key={link.id}
                    className="border-b border-line/60 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-[12px] text-mute">
                      {new Date(link.createdAt).toISOString().slice(0, 10)}
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-ink-soft">
                      {link.description || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-ink">
                      {zatsToDecimalZec(BigInt(link.amountZats))}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={link.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-mute">
                      {link.minedHeight?.toLocaleString() ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/l/${link.id}`}
                        className="font-mono text-[12px] font-medium text-gold-deep hover:underline"
                      >
                        /l/{link.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <CopyButton
                        text={`${baseUrl}/l/${link.id}`}
                        label="Copy link"
                        className="text-mute hover:text-ink"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            Reconciled live from the shielded pool via your viewing key.
          </p>
          <SyncHealthBadge />
        </div>
      </main>
    </div>
  );
}
