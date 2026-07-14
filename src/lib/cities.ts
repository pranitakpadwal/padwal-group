import { billionaires } from "@/data/billionaires";
import { getPersonProfile } from "@/data/profiles";
import type { Leaderboard, RankedBillionaire } from "@/lib/net-worth";
import { selectMovers } from "@/lib/net-worth";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface CityInfo {
  city: string;
  slug: string;
  personIds: string[];
}

/**
 * Every city with at least one tracked resident, most residents first.
 * Only entries with an actual "City, Region" value count as a city — a
 * bare state/region ("California", "Oregon") isn't specific enough to
 * be its own page.
 */
export function listCities(): CityInfo[] {
  const byCity = new Map<string, string[]>();
  for (const person of billionaires) {
    const residenceCity = getPersonProfile(person.id)?.residenceCity;
    if (!residenceCity || !residenceCity.includes(",")) continue;
    const ids = byCity.get(residenceCity) ?? [];
    ids.push(person.id);
    byCity.set(residenceCity, ids);
  }
  return Array.from(byCity.entries())
    .map(([city, personIds]) => ({ city, slug: slugify(city), personIds }))
    .sort((a, b) => b.personIds.length - a.personIds.length || a.city.localeCompare(b.city));
}

export function cityFromSlug(slug: string): CityInfo | null {
  return listCities().find((c) => c.slug === slug) ?? null;
}

export interface CityView {
  city: string;
  people: RankedBillionaire[];
  topGainers: RankedBillionaire[];
  topLosers: RankedBillionaire[];
}

export function getCityView(leaderboard: Leaderboard, info: CityInfo): CityView {
  const idSet = new Set(info.personIds);
  const ranked = leaderboard.people
    .filter((p) => idSet.has(p.id))
    .slice()
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .map((person, index) => ({ ...person, rank: index + 1 }));
  const { topGainers, topLosers } = selectMovers(ranked);
  return { city: info.city, people: ranked, topGainers, topLosers };
}
