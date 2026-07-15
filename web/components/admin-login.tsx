"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-line bg-card p-7"
      >
        <h1 className="font-display text-xl font-bold">Merchant sign-in</h1>
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
        <input
          id="admin-token"
          type="password"
          autoComplete="current-password"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 font-mono text-[15px] text-ink placeholder:text-faint focus:border-gold-deep"
        />
        {error ? (
          <p role="alert" className="mt-3 text-sm font-medium text-[#c23234]">
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
    </div>
  );
}
