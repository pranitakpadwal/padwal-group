"use client";

import { useMemo, useState } from "react";
import { SPEND_ITEMS } from "@/data/spend-items";
import { formatUsdCompact } from "@/lib/format";

export interface SpendBudget {
  id: string;
  name: string;
  netWorthUsd: number;
}

export default function SpendBillionaireMoney({ budgets }: { budgets: SpendBudget[] }) {
  const [budgetId, setBudgetId] = useState(budgets[0]?.id ?? "");
  const [counts, setCounts] = useState<Record<string, number>>({});

  const budget = useMemo(
    () => budgets.find((b) => b.id === budgetId) ?? budgets[0],
    [budgets, budgetId],
  );

  if (!budget) {
    return null;
  }

  const spent = SPEND_ITEMS.reduce(
    (total, item) => total + item.priceUsd * (counts[item.id] ?? 0),
    0,
  );
  const remaining = budget.netWorthUsd - spent;
  const spentPercent = Math.min(100, (spent / budget.netWorthUsd) * 100);

  const adjust = (itemId: string, delta: number, priceUsd: number) => {
    setCounts((previous) => {
      const current = previous[itemId] ?? 0;
      const next = Math.max(0, current + delta);
      if (delta > 0 && priceUsd > remaining) {
        return previous;
      }
      return { ...previous, [itemId]: next };
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-[64px] z-10 flex flex-col gap-3 rounded-2xl border border-line bg-surface/95 p-5 backdrop-blur sm:top-[72px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground">Spending</span>
            <select
              value={budget.id}
              onChange={(event) => {
                setBudgetId(event.target.value);
                setCounts({});
              }}
              className="rounded-lg border border-line bg-background px-3 py-1.5 text-foreground outline-none focus:border-brand"
            >
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}&apos;s fortune ({formatUsdCompact(b.netWorthUsd)})
                </option>
              ))}
            </select>
          </label>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-[--muted]">Left to spend</div>
            <div className="font-display text-xl font-semibold tabular-nums text-brand-dark">
              {formatUsdCompact(remaining)}
            </div>
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-brand-soft">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${spentPercent}%` }}
          />
        </div>
        <div className="text-xs text-foreground/60">
          You&apos;ve spent {formatUsdCompact(spent)} ({spentPercent.toFixed(spentPercent < 1 ? 2 : 0)}% of the fortune).
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SPEND_ITEMS.map((item) => {
          const count = counts[item.id] ?? 0;
          const canAfford = item.priceUsd <= remaining;
          return (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
            >
              <div className="min-w-0">
                <div className="font-medium text-foreground">
                  <span aria-hidden className="mr-1.5">{item.emoji}</span>
                  {item.name}
                </div>
                <div className="text-sm font-semibold tabular-nums text-brand-dark">
                  {formatUsdCompact(item.priceUsd)}
                </div>
                <div className="text-xs text-foreground/60">{item.note}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjust(item.id, -1, item.priceUsd)}
                  disabled={count === 0}
                  aria-label={`Sell one ${item.name}`}
                  className="h-9 w-9 rounded-full border border-line text-lg font-medium text-foreground disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-8 text-center tabular-nums font-semibold">{count}</span>
                <button
                  type="button"
                  onClick={() => adjust(item.id, 1, item.priceUsd)}
                  disabled={!canAfford}
                  aria-label={`Buy one ${item.name}`}
                  className="h-9 w-9 rounded-full border border-brand bg-brand text-lg font-medium text-white disabled:border-line disabled:bg-transparent disabled:text-foreground disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-neutral-400">
        Net worth is our live estimate; item prices are rounded public figures
        or documented deal prices — for fun, not financial data.
      </p>
    </div>
  );
}
