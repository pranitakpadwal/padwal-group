import YahooFinance from "yahoo-finance2";
import { withTimeout } from "@/lib/with-timeout";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

/**
 * Was previously fetched fresh from Yahoo on EVERY request to every
 * calculator page — 3 pages, each triggering a fresh outbound quote() call,
 * with no timeout, so a slow upstream response blocked the whole page
 * response. FX doesn't move meaningfully minute to minute for a display
 * conversion, so a 5-minute cache (plus a hard timeout below) removes that
 * as a source of slow/hung responses without costing any real accuracy.
 */
const CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8_000;

/** Currencies offered in the on-page currency switcher. */
export const DISPLAY_CURRENCIES = [
  "USD",
  "INR",
  "EUR",
  "GBP",
  "AED",
  "CAD",
  "AUD",
  "SGD",
  "JPY",
  "CNY",
] as const;

export type DisplayRates = Record<string, number>;

let usdRatesCache: { key: string; map: Map<string, number>; expiresAt: number } | null = null;

/**
 * How many US dollars one unit of each given currency is worth
 * (e.g. EUR -> ~1.08). Used to normalize foreign market caps/prices to USD.
 * Always includes USD -> 1. Missing/failed lookups are simply omitted.
 */
export async function getUsdRates(currencies: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>([["USD", 1]]);
  const unique = Array.from(new Set(currencies)).filter((c) => c && c !== "USD");
  if (unique.length === 0) {
    return map;
  }

  const key = unique.slice().sort().join(",");
  if (usdRatesCache && usdRatesCache.key === key && usdRatesCache.expiresAt > Date.now()) {
    return usdRatesCache.map;
  }

  const quotes = await withTimeout(
    yahooFinance.quote(
      unique.map((c) => `${c}USD=X`),
      { return: "map" },
    ),
    FETCH_TIMEOUT_MS,
    null,
  ).catch(() => null);

  if (quotes) {
    for (const c of unique) {
      const rate = quotes.get(`${c}USD=X`)?.regularMarketPrice;
      if (typeof rate === "number") map.set(c, rate);
    }
  } else if (usdRatesCache && usdRatesCache.key === key) {
    // Fetch failed/timed out — a stale rate beats no rate.
    return usdRatesCache.map;
  }

  usdRatesCache = { key, map, expiresAt: Date.now() + CACHE_TTL_MS };
  return map;
}

let displayRatesCache: { rates: DisplayRates; expiresAt: number } | null = null;

/**
 * How many units of each display currency one US dollar buys
 * (e.g. USD -> INR ~83). Used to show values in the user's currency.
 * Always includes USD -> 1; unavailable currencies are omitted so the UI
 * can offer only what actually resolved.
 */
export async function getDisplayRates(): Promise<DisplayRates> {
  if (displayRatesCache && displayRatesCache.expiresAt > Date.now()) {
    return displayRatesCache.rates;
  }

  const rates: DisplayRates = { USD: 1 };
  const targets = DISPLAY_CURRENCIES.filter((c) => c !== "USD");

  const quotes = await withTimeout(
    yahooFinance.quote(
      targets.map((c) => `USD${c}=X`),
      { return: "map" },
    ),
    FETCH_TIMEOUT_MS,
    null,
  ).catch(() => null);

  if (quotes) {
    for (const c of targets) {
      const rate = quotes.get(`USD${c}=X`)?.regularMarketPrice;
      if (typeof rate === "number") rates[c] = rate;
    }
  } else if (displayRatesCache) {
    // Fetch failed/timed out — serve the last good rates rather than USD-only.
    return displayRatesCache.rates;
  }

  displayRatesCache = { rates, expiresAt: Date.now() + CACHE_TTL_MS };
  return rates;
}
