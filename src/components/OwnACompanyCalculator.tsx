"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CompanyCap, RosterEntry } from "@/lib/calculator-data";
import type { DisplayRates } from "@/lib/fx";
import { formatCurrencyCompact } from "@/lib/format";

const QUICK_PERCENTS = [0.1, 1, 5, 10, 25, 50, 100];

const TAX_PRESETS = [
  { label: "US long-term (20%)", rate: 20 },
  { label: "India LTCG (12.5%)", rate: 12.5 },
  { label: "UK CGT (24%)", rate: 24 },
  { label: "None (0%)", rate: 0 },
];

type Mode = "percent" | "shares";

export default function OwnACompanyCalculator({
  companies,
  roster,
  rates,
}: {
  companies: CompanyCap[];
  roster: RosterEntry[];
  rates: DisplayRates;
}) {
  const currencyOptions = Object.keys(rates);
  const [ticker, setTicker] = useState(companies[0]?.ticker ?? "");
  const [mode, setMode] = useState<Mode>("percent");
  const [percent, setPercent] = useState(5);
  const [shares, setShares] = useState(1_000_000);
  const [currency, setCurrency] = useState("USD");
  const [growthRate, setGrowthRate] = useState(8);
  const [taxRate, setTaxRate] = useState(20);

  const company = companies.find((c) => c.ticker === ticker) ?? companies[0];
  const rate = rates[currency] ?? 1;
  const money = (usd: number) => formatCurrencyCompact(usd * rate, currency);

  const result = useMemo(() => {
    if (!company) return null;
    const valueUsd =
      mode === "percent"
        ? company.marketCapUsd * (percent / 100)
        : shares * company.priceUsd;
    const richerThan = roster.filter((r) => r.netWorthUsd < valueUsd).length;
    const rank = roster.filter((r) => r.netWorthUsd > valueUsd).length + 1;
    const closest = roster.reduce<RosterEntry | null>((best, r) => {
      if (!best) return r;
      return Math.abs(r.netWorthUsd - valueUsd) < Math.abs(best.netWorthUsd - valueUsd) ? r : best;
    }, null);
    const project = (years: number) => valueUsd * Math.pow(1 + growthRate / 100, years);
    const taxUsd = valueUsd * (taxRate / 100);
    return { valueUsd, richerThan, rank, closest, project, taxUsd, netUsd: valueUsd - taxUsd };
  }, [company, mode, percent, shares, roster, growthRate, taxRate]);

  if (companies.length === 0 || !company || !result) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-sm text-[--muted]">
        Live market data is unavailable right now. Please try again shortly.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        {/* Company + currency */}
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
                  {c.name} ({c.ticker}) · {c.country}
                </option>
              ))}
            </select>
            <span className="text-xs text-[--muted]">
              Market cap {money(company.marketCapUsd)} · {money(company.priceUsd)}/share
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Show values in</span>
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
            <span className="text-xs text-[--muted]">
              {currencyOptions.length > 1
                ? "Live exchange rates — no need to convert elsewhere."
                : "Live FX unavailable; showing USD."}
            </span>
          </label>
        </div>

        {/* Mode toggle */}
        <div className="inline-flex w-fit rounded-full border border-line p-0.5 text-sm">
          {(["percent", "shares"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
                mode === m ? "bg-brand text-white" : "text-foreground/70 hover:text-brand"
              }`}
            >
              {m === "percent" ? "% of company" : "Number of shares"}
            </button>
          ))}
        </div>

        {mode === "percent" ? (
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-foreground">
              You own <span className="text-brand">{percent}%</span> of {company.name}
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
                    percent === p ? "border-brand bg-brand text-white" : "border-line text-foreground/70 hover:border-brand"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        ) : (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Number of shares you own</span>
            <input
              type="number"
              min={0}
              step={1000}
              value={shares}
              onChange={(e) => setShares(Math.max(0, Number(e.target.value)))}
              className="rounded-lg border border-line bg-background px-3 py-2 text-lg text-foreground tabular-nums"
            />
          </label>
        )}

        {/* Result */}
        <div className="rounded-xl bg-brand-soft/60 p-5 text-center">
          <div className="text-xs uppercase tracking-wide text-[--muted]">You&apos;d be worth</div>
          <div className="font-display text-4xl font-semibold text-brand-dark sm:text-5xl">
            {money(result.valueUsd)}
          </div>
          <p className="mt-3 text-sm text-foreground/80">
            That would rank you{" "}
            <strong>
              #{result.rank} of {roster.length}
            </strong>{" "}
            on our real-time list — richer than {result.richerThan} of the billionaires we track.
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

      {/* Growth projection */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">If it keeps growing</h3>
          <span className="text-sm text-[--muted]">
            assuming <span className="text-brand">{growthRate}%</span> / year
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={30}
          step={0.5}
          value={growthRate}
          onChange={(e) => setGrowthRate(Number(e.target.value))}
          className="accent-brand"
        />
        <div className="grid grid-cols-3 gap-3 text-center">
          {[5, 10, 20].map((years) => (
            <div key={years} className="rounded-lg bg-brand-soft/50 p-3">
              <div className="text-xs uppercase tracking-wide text-[--muted]">In {years} yrs</div>
              <div className="font-display text-lg font-semibold text-brand-dark tabular-nums">
                {money(result.project(years))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[--muted]">
          Hypothetical compounding at a rate you choose — not a prediction or
          investment advice. Real returns vary and can be negative.
        </p>
      </div>

      {/* Withdrawal tax */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6">
        <h3 className="font-display text-lg font-semibold text-foreground">If you cashed out today</h3>
        <div className="flex flex-wrap gap-1.5">
          {TAX_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setTaxRate(preset.rate)}
              className={`rounded-full border px-3 py-1 text-xs ${
                taxRate === preset.rate ? "border-brand bg-brand text-white" : "border-line text-foreground/70 hover:border-brand"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-[--muted]">Capital gains tax rate</span>
          <input
            type="number"
            min={0}
            max={60}
            step={0.5}
            value={taxRate}
            onChange={(e) => setTaxRate(Math.min(60, Math.max(0, Number(e.target.value))))}
            className="w-20 rounded-lg border border-line bg-background px-2 py-1 text-foreground tabular-nums"
          />
          <span className="text-[--muted]">%</span>
        </label>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-rose-500/10 p-3">
            <div className="text-xs uppercase tracking-wide text-[--muted]">Estimated tax</div>
            <div className="font-display text-lg font-semibold text-rose-600 tabular-nums dark:text-rose-400">
              {money(result.taxUsd)}
            </div>
          </div>
          <div className="rounded-lg bg-emerald-500/10 p-3">
            <div className="text-xs uppercase tracking-wide text-[--muted]">You keep</div>
            <div className="font-display text-lg font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
              {money(result.netUsd)}
            </div>
          </div>
        </div>
        <p className="text-xs text-[--muted]">
          A simple estimate that taxes the full amount at your chosen rate.
          Real capital gains tax depends on your cost basis, holding period,
          and country. Not tax advice.
        </p>
      </div>
    </div>
  );
}
