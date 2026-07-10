import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export interface StockSummary {
  symbol: string;
  name: string | null;
  price: number | null;
  currency: string | null;
  changePercent: number | null;
  /** Market cap in the stock's native currency. */
  marketCap: number | null;
}

/**
 * Live summary for a single ticker, used by the /stock/[ticker] pages.
 * Returns null on any failure (unknown symbol, network) so the page can
 * degrade instead of erroring.
 */
export async function getStockSummary(ticker: string): Promise<StockSummary | null> {
  try {
    const quote = await yahooFinance.quote(ticker);
    if (!quote || !quote.symbol) {
      return null;
    }
    return {
      symbol: quote.symbol,
      name: quote.longName ?? quote.shortName ?? null,
      price: typeof quote.regularMarketPrice === "number" ? quote.regularMarketPrice : null,
      currency: quote.currency ?? null,
      changePercent:
        typeof quote.regularMarketChangePercent === "number"
          ? quote.regularMarketChangePercent
          : null,
      marketCap: typeof quote.marketCap === "number" ? quote.marketCap : null,
    };
  } catch {
    return null;
  }
}
