import type { Leaderboard, RankedBillionaire } from "@/lib/net-worth";
import { CATEGORIES, categoryArticleTitle, deriveCategoryView, type Category } from "@/lib/categories";

export interface ListAppearance {
  category: Category;
  label: string;
  rank: number;
  total: number;
}

/**
 * Every one of our lists this person ranks on, with their position on each.
 * World always includes everyone; the rest depend on country/gender/age.
 */
export function getListAppearances(leaderboard: Leaderboard, id: string): ListAppearance[] {
  const appearances: ListAppearance[] = [];

  for (const category of CATEGORIES) {
    const view = deriveCategoryView(leaderboard.people, category);
    const entry = view.people.find((person) => person.id === id);
    if (entry) {
      appearances.push({
        category,
        label: categoryArticleTitle(category),
        rank: entry.rank,
        total: view.people.length,
      });
    }
  }

  return appearances;
}

/**
 * Other tracked billionaires closest to this one: same primary company
 * first, then same industry, then same country — de-duplicated, ranked by
 * net worth, excluding the person themselves.
 */
export function getRelatedPeople(
  leaderboard: Leaderboard,
  person: RankedBillionaire,
  limit = 4,
): RankedBillionaire[] {
  const others = leaderboard.people.filter((candidate) => candidate.id !== person.id);

  const sameSource = others.filter((c) => c.primarySource === person.primarySource);
  const sameIndustry = others.filter((c) => c.industry === person.industry);
  const sameCountry = others.filter((c) => c.country === person.country);

  const seen = new Set<string>();
  const related: RankedBillionaire[] = [];
  for (const group of [sameSource, sameIndustry, sameCountry]) {
    for (const candidate of group) {
      if (related.length >= limit) break;
      if (!seen.has(candidate.id)) {
        seen.add(candidate.id);
        related.push(candidate);
      }
    }
  }

  return related.slice(0, limit);
}
