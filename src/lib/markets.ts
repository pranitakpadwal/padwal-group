import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketState: string | null;
}

const CACHE_TTL_MS = 20_000;

const cache = new Map<string, { quotes: Map<string, MarketQuote>; expiresAt: number }>();

/**
 * Fetch live quotes for arbitrary Yahoo Finance symbols (crypto pairs,
 * futures contracts, ...). Same posture as the leaderboard fetcher:
 * short-lived cache, and on failure an empty map so pages can degrade
 * gracefully instead of erroring.
 */
export async function getMarketQuotes(symbols: string[]): Promise<Map<string, MarketQuote>> {
  const key = symbols.join(",");
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.quotes;
  }

  const quotes = new Map<string, MarketQuote>();
  try {
    const results = await yahooFinance.quote(symbols, { return: "map" });
    for (const [symbol, quote] of results.entries()) {
      const price = quote.regularMarketPrice;
      if (typeof price !== "number") {
        continue;
      }
      quotes.set(symbol, {
        symbol,
        price,
        change: quote.regularMarketChange ?? 0,
        changePercent: quote.regularMarketChangePercent ?? 0,
        marketState: quote.marketState ?? null,
      });
    }
    cache.set(key, { quotes, expiresAt: Date.now() + CACHE_TTL_MS });
  } catch {
    // Leave the map empty (or serve nothing new); callers render a
    // "prices unavailable" state rather than crashing the page.
    if (cached) {
      return cached.quotes;
    }
  }
  return quotes;
}
