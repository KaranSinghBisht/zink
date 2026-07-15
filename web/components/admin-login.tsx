"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin({
  configurationError = false,
}: {
  configurationError?: boolean;
}) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showToken, setShowToken] = useState(false);

  if (configurationError) {
    return (
      <main className="veil flex flex-1 items-center justify-center px-4 py-10">
        <div className="veil-lines" />
        <div className="rise w-full max-w-md rounded-3xl border border-line bg-card p-7 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-deep">
            Configuration required
          </p>
          <h1 className="mt-2 font-display text-xl font-semibold">
            Dashboard locked safely
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-mute">
            A real wallet is configured, but{" "}
            <code className="font-mono">ZINK_ADMIN_TOKEN</code> is missing. Set
            a random token of at least 24 characters and restart Zink; merchant
            routes remain closed until then.
          </p>
        </div>
      </main>
    );
  }

  async function submit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Sign-in failed");
        setPending(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — is the Zink server running?");
      setPending(false);
    }
  }

  return (
    <main className="veil flex flex-1 items-center justify-center px-4 py-10">
      <div className="veil-lines" />
      <form
        onSubmit={submit}
        className="rise w-full max-w-sm rounded-3xl border border-line bg-card p-7 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-deep">
          Private area <span className="text-faint">[ merchant only ]</span>
        </p>
        <h1 className="mt-2 font-display text-xl font-semibold">
          Merchant sign-in
        </h1>
        <p className="mb-5 mt-1 text-[13px] text-mute">
          This dashboard shows your private ledger. Enter the admin token
          configured in <code className="font-mono">ZINK_ADMIN_TOKEN</code>.
        </p>
        <label
          htmlFor="admin-token"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute"
        >
          Admin token
        </label>
        <div className="relative mt-1.5">
          <input
            id="admin-token"
            type={showToken ? "text" : "password"}
            autoComplete="current-password"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 pr-16 font-mono text-[15px] text-ink placeholder:text-faint focus:border-gold-deep"
          />
          <button
            type="button"
            onClick={() => setShowToken((value) => !value)}
            aria-label={showToken ? "Hide admin token" : "Show admin token"}
            className="absolute inset-y-0 right-0 min-w-14 px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-mute hover:text-ink"
          >
            {showToken ? "Hide" : "Show"}
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full cursor-pointer rounded-xl bg-ink px-4 py-3 font-display text-[15px] font-bold text-paper transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Checking…" : "Unlock dashboard"}
        </button>
      </form>
    </main>
  );
}
