import { billionaires } from "@/data/billionaires";
import type { Leaderboard, RankedBillionaire } from "@/lib/net-worth";
import { selectMovers } from "@/lib/net-worth";

export function countrySlug(country: string): string {
  return country
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Nationality adjective for headlines, e.g. "Indian", "Emirati". Falls back to the country name. */
const DEMONYMS: Record<string, string> = {
  "United States": "American",
  India: "Indian",
  China: "Chinese",
  Japan: "Japanese",
  Mexico: "Mexican",
  Nigeria: "Nigerian",
  Egypt: "Egyptian",
  France: "French",
  Germany: "German",
  Australia: "Australian",
  Sweden: "Swedish",
  "Saudi Arabia": "Saudi",
  "United Arab Emirates": "Emirati",
};

export function demonym(country: string): string {
  return DEMONYMS[country] ?? country;
}

export interface CountryInfo {
  country: string;
  slug: string;
  count: number;
}

/** Every country present in the roster, with how many people we track there, most first. */
export function listCountries(): CountryInfo[] {
  const counts = new Map<string, number>();
  for (const person of billionaires) {
    counts.set(person.country, (counts.get(person.country) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([country, count]) => ({ country, slug: countrySlug(country), count }))
    .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
}

export function countryFromSlug(slug: string): string | null {
  return listCountries().find((c) => c.slug === slug)?.country ?? null;
}

export interface CountryView {
  country: string;
  people: RankedBillionaire[];
  topGainers: RankedBillionaire[];
  topLosers: RankedBillionaire[];
}

/** Filters the ranked roster to one country and re-ranks 1..N within it. */
export function getCountryView(leaderboard: Leaderboard, country: string): CountryView {
  const ranked = leaderboard.people
    .filter((p) => p.country === country)
    .slice()
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .map((person, index) => ({ ...person, rank: index + 1 }));
  const { topGainers, topLosers } = selectMovers(ranked);
  return { country, people: ranked, topGainers, topLosers };
}
