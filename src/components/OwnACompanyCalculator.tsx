"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CompanyCap } from "@/lib/calculator-data";
import type { RosterEntry } from "@/lib/calculator-data";
import { formatUsdCompact } from "@/lib/format";

const QUICK_PERCENTS = [1, 5, 10, 25, 50, 100];

export default function OwnACompanyCalculator({
  companies,
  roster,
}: {
  companies: CompanyCap[];
  roster: RosterEntry[];
}) {
  const [ticker, setTicker] = useState(companies[0]?.ticker ?? "");
  const [percent, setPercent] = useState(5);

  const company = companies.find((c) => c.ticker === ticker) ?? companies[0];

  const result = useMemo(() => {
    if (!company) return null;
    const value = company.marketCapUsd * (percent / 100);
    const richerThan = roster.filter((r) => r.netWorthUsd < value).length;
    const rank = roster.filter((r) => r.netWorthUsd > value).length + 1;
    const closest = roster.reduce<RosterEntry | null>((best, r) => {
      if (!best) return r;
      return Math.abs(r.netWorthUsd - value) < Math.abs(best.netWorthUsd - value) ? r : best;
    }, null);
    return { value, richerThan, rank, closest };
  }, [company, percent, roster]);

  if (companies.length === 0 || !company || !result) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-sm text-[--muted]">
        Live market data is unavailable right now. Please try again shortly.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Company</span>
          <select
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="rounded-lg border border-line bg-background px-3 py-2 text-foreground"
          >
            {companies.map((c) => (
              <option key={c.ticker} value={c.ticker}>
                {c.name} ({c.ticker})
              </option>
            ))}
          </select>
          <span className="text-xs text-[--muted]">
            Market cap: {formatUsdCompact(company.marketCapUsd)}
          </span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">
            You own <span className="text-brand">{percent}%</span>
          </span>
          <input
            type="range"
            min={0.1}
            max={100}
            step={0.1}
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            className="accent-brand"
          />
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PERCENTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPercent(p)}
                className={`rounded-full border px-2.5 py-0.5 text-xs ${
                  percent === p
                    ? "border-brand bg-brand text-white"
                    : "border-line text-foreground/70 hover:border-brand"
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="rounded-xl bg-brand-soft/60 p-5 text-center">
        <div className="text-xs uppercase tracking-wide text-[--muted]">
          You&apos;d be worth
        </div>
        <div className="font-display text-4xl font-semibold text-brand-dark sm:text-5xl">
          {formatUsdCompact(result.value)}
        </div>
        <p className="mt-3 text-sm text-foreground/80">
          That would rank you{" "}
          <strong>
            #{result.rank} of {roster.length}
          </strong>{" "}
          on our real-time list — richer than {result.richerThan} of the
          billionaires we track.
          {result.closest && (
            <>
              {" "}
              Closest to{" "}
              <Link href={`/billionaire/${result.closest.id}`} className="text-brand hover:underline">
                {result.closest.name}
              </Link>
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
}
