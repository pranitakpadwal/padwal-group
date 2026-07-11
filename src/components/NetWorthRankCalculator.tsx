"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { RosterEntry } from "@/lib/calculator-data";
import { formatUsdCompact } from "@/lib/format";

export default function NetWorthRankCalculator({ roster }: { roster: RosterEntry[] }) {
  const [amount, setAmount] = useState<number>(1_000_000_000);

  const result = useMemo(() => {
    const richerThan = roster.filter((r) => r.netWorthUsd < amount).length;
    const rank = roster.filter((r) => r.netWorthUsd > amount).length + 1;
    // The next person up the list you haven't passed yet.
    const above = roster
      .filter((r) => r.netWorthUsd > amount)
      .sort((a, b) => a.netWorthUsd - b.netWorthUsd)[0];
    return { richerThan, rank, above };
  }, [amount, roster]);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Your net worth (USD)</span>
        <input
          type="number"
          min={0}
          step={1_000_000}
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
          className="rounded-lg border border-line bg-background px-3 py-2 text-lg text-foreground tabular-nums"
        />
        <span className="text-xs text-[--muted]">
          Entered: {formatUsdCompact(amount)}
        </span>
      </label>

      <div className="rounded-xl bg-brand-soft/60 p-5 text-center">
        {result.rank <= roster.length ? (
          <>
            <div className="text-xs uppercase tracking-wide text-[--muted]">
              You&apos;d rank
            </div>
            <div className="font-display text-4xl font-semibold text-brand-dark sm:text-5xl">
              #{result.rank}
            </div>
            <p className="mt-3 text-sm text-foreground/80">
              of {roster.length} tracked billionaires — richer than{" "}
              {result.richerThan} of them.
              {result.above && (
                <>
                  {" "}
                  You&apos;d need{" "}
                  <strong>{formatUsdCompact(result.above.netWorthUsd - amount)}</strong> more to
                  pass{" "}
                  <Link href={`/billionaire/${result.above.id}`} className="text-brand hover:underline">
                    {result.above.name}
                  </Link>
                  .
                </>
              )}
            </p>
          </>
        ) : (
          <p className="text-sm text-foreground/80">
            That&apos;s below everyone we currently track — but you&apos;re
            closing in on the list.
          </p>
        )}
      </div>
    </div>
  );
}
