import type { CategoryView } from "@/lib/categories";
import type { RankedBillionaire } from "@/lib/net-worth";

export interface RankedFact {
  id: string;
  name: string;
  netWorthUsd: number;
  rank: number;
  /** Optional so older stored articles (generated before this field existed) still parse. */
  primarySource?: string;
}

export interface MoverFact extends RankedFact {
  deltaUsd: number;
  deltaPercent: number;
  ticker?: string | null;
  stockChangePercent?: number | null;
}

export interface RankJumpFact {
  id: string;
  name: string;
  fromRank: number;
  toRank: number;
  rankDelta: number;
}

export interface ArticleFacts {
  personCount: number;
  totalNetWorthUsd: number;
  totalNetWorthDeltaUsd: number | null;
  hasComparison: boolean;
  topByNetWorth: RankedFact[];
  gainers: MoverFact[];
  losers: MoverFact[];
  risers: RankJumpFact[];
  fallers: RankJumpFact[];
}

const TOP_N = 10;
const MOVERS_N = 5;
const RANK_JUMPS_N = 3;

function toRankedFact(person: RankedBillionaire): RankedFact {
  return {
    id: person.id,
    name: person.name,
    netWorthUsd: person.netWorthUsd,
    rank: person.rank,
    primarySource: person.primarySource,
  };
}

export function computeArticleFacts(
  today: CategoryView,
  yesterday: CategoryView | null,
): ArticleFacts {
  const totalNetWorthUsd = today.people.reduce((sum, person) => sum + person.netWorthUsd, 0);
  const topByNetWorth = today.people.slice(0, TOP_N).map(toRankedFact);

  if (!yesterday || yesterday.people.length === 0) {
    return {
      personCount: today.people.length,
      totalNetWorthUsd,
      totalNetWorthDeltaUsd: null,
      hasComparison: false,
      topByNetWorth,
      gainers: [],
      losers: [],
      risers: [],
      fallers: [],
    };
  }

  const yesterdayById = new Map(yesterday.people.map((person) => [person.id, person]));
  const previousTotalNetWorthUsd = yesterday.people.reduce((sum, p) => sum + p.netWorthUsd, 0);

  const movers: MoverFact[] = [];
  const rankChanges: RankJumpFact[] = [];

  for (const person of today.people) {
    const previous = yesterdayById.get(person.id);
    if (!previous) {
      continue;
    }

    const deltaUsd = person.netWorthUsd - previous.netWorthUsd;
    if (deltaUsd !== 0) {
      movers.push({
        ...toRankedFact(person),
        deltaUsd,
        deltaPercent: previous.netWorthUsd > 0 ? (deltaUsd / previous.netWorthUsd) * 100 : 0,
        ticker: person.ticker,
        stockChangePercent: person.stockChangePercent,
      });
    }

    const rankDelta = previous.rank - person.rank; // positive = moved up
    if (rankDelta !== 0) {
      rankChanges.push({
        id: person.id,
        name: person.name,
        fromRank: previous.rank,
        toRank: person.rank,
        rankDelta,
      });
    }
  }

  const gainers = [...movers].sort((a, b) => b.deltaUsd - a.deltaUsd).slice(0, MOVERS_N);
  const losers = [...movers].sort((a, b) => a.deltaUsd - b.deltaUsd).slice(0, MOVERS_N);
  const risers = [...rankChanges].sort((a, b) => b.rankDelta - a.rankDelta).slice(0, RANK_JUMPS_N);
  const fallers = [...rankChanges].sort((a, b) => a.rankDelta - b.rankDelta).slice(0, RANK_JUMPS_N);

  return {
    personCount: today.people.length,
    totalNetWorthUsd,
    totalNetWorthDeltaUsd: totalNetWorthUsd - previousTotalNetWorthUsd,
    hasComparison: true,
    topByNetWorth,
    gainers,
    losers,
    risers,
    fallers,
  };
}
