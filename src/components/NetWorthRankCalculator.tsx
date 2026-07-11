"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { RosterEntry } from "@/lib/calculator-data";
import type { DisplayRates } from "@/lib/fx";
import { formatCurrencyCompact } from "@/lib/format";

export default function NetWorthRankCalculator({
  roster,
  rates,
}: {
  roster: RosterEntry[];
  rates: DisplayRates;
}) {
  const currencyOptions = Object.keys(rates);
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState<number>(1_000_000_000);

  const rate = rates[currency] ?? 1;
  const amountUsd = amount / rate;
  const money = (usd: number) => formatCurrencyCompact(usd * rate, currency);

  const result = useMemo(() => {
    const richerThan = roster.filter((r) => r.netWorthUsd < amountUsd).length;
    const rank = roster.filter((r) => r.netWorthUsd > amountUsd).length + 1;
    const above = roster
      .filter((r) => r.netWorthUsd > amountUsd)
      .sort((a, b) => a.netWorthUsd - b.netWorthUsd)[0];
    return { richerThan, rank, above };
  }, [amountUsd, roster]);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_auto]">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Your net worth</span>
          <input
            type="number"
            min={0}
            step={1_000_000}
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="rounded-lg border border-line bg-background px-3 py-2 text-lg text-foreground tabular-nums"
          />
          <span className="text-xs text-[--muted]">Entered: {money(amountUsd)}</span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Currency</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-lg border border-line bg-background px-3 py-2 text-foreground"
          >
            {currencyOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-xl bg-brand-soft/60 p-5 text-center">
        {result.rank <= roster.length ? (
          <>
            <div className="text-xs uppercase tracking-wide text-[--muted]">You&apos;d rank</div>
            <div className="font-display text-4xl font-semibold text-brand-dark sm:text-5xl">
              #{result.rank}
            </div>
            <p className="mt-3 text-sm text-foreground/80">
              of {roster.length} tracked billionaires — richer than {result.richerThan} of them.
              {result.above && (
                <>
                  {" "}
                  You&apos;d need <strong>{money(result.above.netWorthUsd - amountUsd)}</strong> more
                  to pass{" "}
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
