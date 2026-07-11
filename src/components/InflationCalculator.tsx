"use client";

import { useState } from "react";
import { CPI_BY_YEAR, CPI_BASE_YEAR, inflationMultiplier } from "@/data/cpi";

const YEARS = Object.keys(CPI_BY_YEAR)
  .map(Number)
  .sort((a, b) => a - b);

const PRESETS: { label: string; amount: number; year: number }[] = [
  { label: "$100M in 1980", amount: 100_000_000, year: 1980 },
  { label: "$1M in 1950", amount: 1_000_000, year: 1950 },
  { label: "Gates' $12.9B in 1995", amount: 12_900_000_000, year: 1995 },
  { label: "Rockefeller's $1B in 1916", amount: 1_000_000_000, year: 1916 },
];

function formatMoney(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} trillion`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} billion`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)} million`;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export default function InflationCalculator() {
  const [amount, setAmount] = useState<number>(100_000_000);
  const [year, setYear] = useState<number>(1980);

  const multiplier = inflationMultiplier(year);
  const converted = multiplier !== null && amount > 0 ? amount * multiplier : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Amount (USD)</span>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="rounded-lg border border-line bg-background px-3 py-2 text-lg tabular-nums text-foreground outline-none focus:border-brand"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">In the year</span>
          <select
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="rounded-lg border border-line bg-background px-3 py-2 text-lg tabular-nums text-foreground outline-none focus:border-brand"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setAmount(preset.amount);
              setYear(preset.year);
            }}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:border-brand hover:text-brand"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {converted !== null && multiplier !== null && (
        <div className="rounded-2xl border border-brand/40 bg-brand-soft/50 p-6">
          <div className="text-sm text-foreground/70">
            {formatMoney(amount)} in {year} has the buying power of roughly
          </div>
          <div className="mt-1 font-display text-3xl font-semibold text-brand-dark">
            {formatMoney(converted)}
          </div>
          <div className="mt-1 text-sm text-foreground/70">
            in {CPI_BASE_YEAR} dollars — prices are about{" "}
            <span className="font-medium tabular-nums">{multiplier.toFixed(1)}×</span> higher.
          </div>
        </div>
      )}

      <p className="text-xs text-neutral-400">
        Based on US CPI-U annual averages from the Bureau of Labor Statistics
        (1913–{CPI_BASE_YEAR}, all-items index). CPI measures consumer prices,
        so this is buying power — comparing fortunes across eras also depends
        on the size of the economy, asset prices, and much more.
      </p>
    </div>
  );
}
