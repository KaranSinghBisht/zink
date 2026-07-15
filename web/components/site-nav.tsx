import Link from "next/link";
import { getNetwork, isDemoMode } from "@/lib/config";
import { networkLabel } from "@/lib/network";

/** Shared header for dark (hero/protocol) and light (new/dash) surfaces. */
export function SiteNav({ tone }: { tone: "dark" | "light" }) {
  const demo = isDemoMode();
  const network = getNetwork();
  const base =
    tone === "dark"
      ? { text: "text-cream/60", hover: "hover:text-cream", logo: "" }
      : { text: "text-mute", hover: "hover:text-ink", logo: "" };
  return (
    <header className="flex items-center justify-between px-6 py-6 sm:px-10">
      <div className="flex items-center gap-2.5">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          zink<span className="text-gold">.</span>
        </Link>
        <span
          className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] ${
            tone === "dark"
              ? "border-cream/20 text-cream/55"
              : "border-line text-mute"
          }`}
        >
          {demo ? "showcase" : networkLabel(network)}
        </span>
      </div>
      <nav
        className={`flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.24em] ${base.text}`}
      >
        <Link
          href="/protocol"
          className={`hidden min-h-10 items-center transition-colors sm:inline-flex ${base.hover}`}
        >
          Protocol
        </Link>
        <Link
          href="/dash"
          className={`inline-flex min-h-10 items-center transition-colors ${base.hover}`}
        >
          Ledger
        </Link>
        <Link
          href="/new"
          className={`inline-flex min-h-10 items-center rounded-lg border px-3 py-1.5 transition-colors ${
            tone === "dark"
              ? "border-cream/25 text-cream/80 hover:border-gold hover:text-cream"
              : "border-line bg-card text-ink-soft hover:border-gold-deep hover:text-ink"
          }`}
        >
          New link <span aria-hidden>→</span>
        </Link>
      </nav>
    </header>
  );
}
