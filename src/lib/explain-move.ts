import type { RankedBillionaire } from "@/lib/net-worth";
import { formatPercentChange, formatPercentMagnitude, formatUsdCompact } from "@/lib/format";

function companyName(person: RankedBillionaire): string {
  // "Tesla, SpaceX" -> "Tesla"; leave single names untouched.
  return person.primarySource.split(",")[0].trim();
}

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

/**
 * A headline-style, one-line explanation in the form:
 *   "Nvidia rose 4.2%, adding $6.1B to Jensen Huang's net worth."
 *   "Tesla fell 1.3%, cutting $9.5B from Elon Musk's net worth."
 */
export function moveHeadline(person: RankedBillionaire): string | null {
  if (!person.ticker || person.dayChangeUsd === 0 || person.stockChangePercent === null) {
    return null;
  }

  const up = person.dayChangeUsd > 0;
  const stockVerb = person.stockChangePercent >= 0 ? "rose" : "fell";
  const pct = formatPercentMagnitude(person.stockChangePercent);
  const impactVerb = up ? "adding" : "cutting";
  const prep = up ? "to" : "from";
  const amount = formatUsdCompact(Math.abs(person.dayChangeUsd));

  return `${companyName(person)} ${stockVerb} ${pct}, ${impactVerb} ${amount} ${prep} ${person.name}'s net worth.`;
}
