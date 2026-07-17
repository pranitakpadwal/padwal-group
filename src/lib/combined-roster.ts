import type { Leaderboard } from "@/lib/net-worth";
import { listEstimatedBillionaires } from "@/data/estimated-billionaires";

/**
 * Merges the live-tracked core with the wider, static-estimate tier into
 * one ranked list — display only. Nothing else on the site (category
 * pages, country pages, etc.) reads from this; they stay pure-live so
 * their numbers and rankings never mix live and estimated figures.
 */
export interface RosterEntry {
  id: string;
  name: string;
  rank: number;
  country: string;
  industry: string;
  primarySource: string;
  netWorthUsd: number;
  isLive: boolean;
  profileUrl: string;
  photoUrl: string | null;
  /** Estimated-tier only: when the cited figure is from. */
  netWorthAsOf?: string;
}

export function getCombinedRoster(leaderboard: Leaderboard): RosterEntry[] {
  const live: RosterEntry[] = leaderboard.people.map((p) => ({
    id: p.id,
    name: p.name,
    rank: 0,
    country: p.country,
    industry: p.industry,
    primarySource: p.primarySource,
    netWorthUsd: p.netWorthUsd,
    isLive: true,
    profileUrl: `/billionaire/${p.id}`,
    photoUrl: p.photoUrl,
  }));

  const estimated: RosterEntry[] = listEstimatedBillionaires().map((e) => ({
    id: e.id,
    name: e.name,
    rank: 0,
    country: e.country,
    industry: e.industry,
    primarySource: e.primarySource,
    netWorthUsd: e.netWorthUsd,
    isLive: false,
    profileUrl: `/estimated/${e.id}`,
    photoUrl: null,
    netWorthAsOf: e.netWorthAsOf,
  }));

  return [...live, ...estimated]
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
