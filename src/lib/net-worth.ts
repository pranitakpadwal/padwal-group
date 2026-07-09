import YahooFinance from "yahoo-finance2";
import { billionaires, type Billionaire } from "@/data/billionaires";
import { calculateAge } from "@/lib/age";
import { getPhotoUrls } from "@/lib/photos";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export interface RankedBillionaire {
  rank: number;
  id: string;
  name: string;
  age: number;
  country: string;
  primarySource: string;
  industry: string;
  bio: string;
  photoUrl: string | null;
  ticker: string;
  netWorthUsd: number;
  dayChangeUsd: number;
  dayChangePercent: number;
  sharePrice: number | null;
  currency: string | null;
  marketState: string | null;
}

export interface Leaderboard {
  people: RankedBillionaire[];
  topGainers: RankedBillionaire[];
  topLosers: RankedBillionaire[];
  asOf: string;
  stale: boolean;
  warning: string | null;
}

const CACHE_TTL_MS = 20_000;
const MOVERS_COUNT = 5;

let cache: { leaderboard: Leaderboard; expiresAt: number } | null = null;
let inFlight: Promise<Leaderboard> | null = null;

type QuoteInfo = { price: number; change: number; currency?: string; marketState?: string };

function computeLeaderboard(
  people: Billionaire[],
  quotesBySymbol: Map<string, QuoteInfo>,
  photosByTitle: Map<string, string | null>,
): Leaderboard {
  const ranked = people.map((person) => {
    const quote = quotesBySymbol.get(person.ticker);
    const price = quote?.price ?? null;
    const changePerShare = quote?.change ?? 0;

    const netWorthUsd = price !== null ? person.sharesHeld * price + person.otherAssetsUsd : person.otherAssetsUsd;
    const dayChangeUsd = person.sharesHeld * changePerShare;
    const previousNetWorth = netWorthUsd - dayChangeUsd;
    const dayChangePercent = previousNetWorth > 0 ? (dayChangeUsd / previousNetWorth) * 100 : 0;

    return {
      id: person.id,
      name: person.name,
      age: calculateAge(person.birthDate),
      country: person.country,
      primarySource: person.primarySource,
      industry: person.industry,
      bio: person.bio,
      photoUrl: photosByTitle.get(person.wikipediaTitle) ?? null,
      ticker: person.ticker,
      netWorthUsd,
      dayChangeUsd,
      dayChangePercent,
      sharePrice: price,
      currency: quote?.currency ?? null,
      marketState: quote?.marketState ?? null,
    };
  });

  ranked.sort((a, b) => b.netWorthUsd - a.netWorthUsd);
  const rankedWithPositions = ranked.map((person, index) => ({ ...person, rank: index + 1 }));

  const movers = rankedWithPositions.filter((person) => person.dayChangeUsd !== 0);
  const topGainers = [...movers]
    .sort((a, b) => b.dayChangeUsd - a.dayChangeUsd)
    .slice(0, MOVERS_COUNT);
  const topLosers = [...movers]
    .sort((a, b) => a.dayChangeUsd - b.dayChangeUsd)
    .slice(0, MOVERS_COUNT);

  return {
    people: rankedWithPositions,
    topGainers,
    topLosers,
    asOf: new Date().toISOString(),
    stale: false,
    warning: null,
  };
}

async function fetchLeaderboard(): Promise<Leaderboard> {
  const symbols = Array.from(new Set(billionaires.map((b) => b.ticker)));
  const wikipediaTitles = billionaires.map((b) => b.wikipediaTitle);

  const [quotes, photosByTitle] = await Promise.all([
    yahooFinance.quote(symbols, { return: "map" }),
    getPhotoUrls(wikipediaTitles),
  ]);

  const quotesBySymbol = new Map<string, QuoteInfo>();
  for (const [symbol, quote] of quotes.entries()) {
    const price = quote.regularMarketPrice;
    if (typeof price === "number") {
      quotesBySymbol.set(symbol, {
        price,
        change: quote.regularMarketChange ?? 0,
        currency: quote.currency,
        marketState: quote.marketState,
      });
    }
  }

  return computeLeaderboard(billionaires, quotesBySymbol, photosByTitle);
}

/**
 * Returns a leaderboard, serving a short-lived cache to keep us well under
 * Yahoo Finance's unofficial rate limits even if many browser tabs are
 * polling this endpoint at once. Falls back to the last good snapshot
 * (marked stale) if a refresh fails.
 */
export async function getLeaderboard(): Promise<Leaderboard> {
  const now = Date.now();

  if (cache && cache.expiresAt > now) {
    return cache.leaderboard;
  }

  if (inFlight) {
    return inFlight;
  }

  inFlight = fetchLeaderboard()
    .then((leaderboard) => {
      cache = { leaderboard, expiresAt: Date.now() + CACHE_TTL_MS };
      return leaderboard;
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : String(error);

      if (cache) {
        return {
          ...cache.leaderboard,
          stale: true,
          warning: `Live prices unavailable, showing last known snapshot: ${message}`,
        };
      }

      // No cache yet (e.g. first request, or the quote provider is
      // unreachable) — degrade to the "other assets" estimate only rather
      // than failing the whole page. Cache the degraded result briefly too,
      // so a sustained outage doesn't retry the upstream on every request.
      const degraded: Leaderboard = {
        ...computeLeaderboard(billionaires, new Map(), new Map()),
        stale: true,
        warning: `Live prices unavailable: ${message}`,
      };
      cache = { leaderboard: degraded, expiresAt: Date.now() + CACHE_TTL_MS };
      return degraded;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function findBillionaireById(id: string): Billionaire | undefined {
  return billionaires.find((person) => person.id === id);
}
