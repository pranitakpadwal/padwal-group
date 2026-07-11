import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

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
  try {
    const quotes = await yahooFinance.quote(
      unique.map((c) => `${c}USD=X`),
      { return: "map" },
    );
    for (const c of unique) {
      const rate = quotes.get(`${c}USD=X`)?.regularMarketPrice;
      if (typeof rate === "number") map.set(c, rate);
    }
  } catch {
    // leave whatever resolved
  }
  return map;
}

/**
 * How many units of each display currency one US dollar buys
 * (e.g. USD -> INR ~83). Used to show values in the user's currency.
 * Always includes USD -> 1; unavailable currencies are omitted so the UI
 * can offer only what actually resolved.
 */
export async function getDisplayRates(): Promise<DisplayRates> {
  const rates: DisplayRates = { USD: 1 };
  const targets = DISPLAY_CURRENCIES.filter((c) => c !== "USD");
  try {
    const quotes = await yahooFinance.quote(
      targets.map((c) => `USD${c}=X`),
      { return: "map" },
    );
    for (const c of targets) {
      const rate = quotes.get(`USD${c}=X`)?.regularMarketPrice;
      if (typeof rate === "number") rates[c] = rate;
    }
  } catch {
    // USD-only fallback
  }
  return rates;
}
