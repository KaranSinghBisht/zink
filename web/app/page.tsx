import Link from "next/link";
import { AddressTicker } from "@/components/address-ticker";
import { CreateLinkForm } from "@/components/create-link-form";

const PRIVACY_FACTS = [
  {
    label: "Viewing key only",
    body: "Zink watches payments arrive. It cannot spend — the server never sees a key that moves money.",
  },
  {
    label: "Fresh address per link",
    body: "ZIP-316 diversified addresses: billions per wallet, cryptographically unlinkable from one another.",
  },
  {
    label: "Shielded end-to-end",
    body: "Amounts, senders and receivers are encrypted on mainnet. Your revenue is your business alone.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 sm:px-8">
      <header className="flex items-center justify-between py-6">
        <span className="font-display text-2xl font-extrabold tracking-tight">
          zink<span className="text-gold-deep">.</span>
        </span>
        <nav className="flex items-center gap-5 font-mono text-[12px] uppercase tracking-[0.16em] text-mute">
          <Link href="/dash" className="transition-colors hover:text-ink">
            Dashboard
          </Link>
          <a
            href="https://zips.z.cash/zip-0316"
            className="hidden transition-colors hover:text-ink sm:inline"
          >
            ZIP-316
          </a>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="grid gap-6 py-6 md:grid-cols-[1.15fr_1fr] md:gap-8 md:py-10">
          <div className="panel-gold flex flex-col justify-center rounded-3xl p-7 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">
              Non-custodial · Zcash mainnet
            </p>
            <h1 className="mt-4 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-tight text-ink sm:text-[3.4rem]">
              Payment links that never link back.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed font-medium text-ink/70">
              Zink turns a Zcash viewing key into invoices. Every customer pays
              a fresh shielded address — you keep one wallet, they learn
              nothing about your balance, your history, or each other.
            </p>
            <div className="mt-7">
              <AddressTicker />
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-card p-6 shadow-[0_1px_2px_rgba(23,27,40,0.04),0_12px_32px_-16px_rgba(23,27,40,0.18)] sm:p-7 md:self-center">
            <h2 className="font-display text-xl font-bold">
              New payment link
            </h2>
            <p className="mb-5 mt-1 text-[13px] text-mute">
              Takes one second. Lives on mainnet.
            </p>
            <CreateLinkForm />
          </div>
        </section>

        <section className="grid gap-4 pb-4 sm:grid-cols-3">
          {PRIVACY_FACTS.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl border border-line bg-card p-5"
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-deep">
                {fact.label}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                {fact.body}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 py-8 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
        <span>Built for ZecHub Hackathon 3.0</span>
        <span>Zcash mainnet · MIT license</span>
      </footer>
    </div>
  );
}
