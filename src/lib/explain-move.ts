import type { RankedBillionaire } from "@/lib/net-worth";
import { formatPercentChange } from "@/lib/format";

/**
 * A plain-language explanation of why someone's net worth moved today.
 *
 * We can only honestly explain the *mechanical* driver — the move in their
 * main publicly-traded holding — not the news behind it (no news feed).
 * Returns null when there's nothing to explain (no ticker, no move, or a
 * privately-held fortune that doesn't tick intraday).
 */
export function explainMove(person: RankedBillionaire): string | null {
  if (!person.ticker || person.dayChangeUsd === 0 || person.stockChangePercent === null) {
    return null;
  }

  const direction = person.dayChangeUsd > 0 ? "rose" : "fell";
  const firstName = person.name.split(" ")[0];

  return `${firstName}'s net worth ${direction} because ${person.primarySource} shares (${person.ticker}) moved ${formatPercentChange(person.stockChangePercent)} today.`;
}
