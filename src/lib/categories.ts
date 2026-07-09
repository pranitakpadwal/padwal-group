import type { Leaderboard, RankedBillionaire } from "@/lib/net-worth";
import { selectMovers } from "@/lib/net-worth";

export const CATEGORIES = ["world", "india", "women", "young"] as const;
export type Category = (typeof CATEGORIES)[number];

export const YOUNG_AGE_THRESHOLD = 45;

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function categoryLabel(category: Category): string {
  switch (category) {
    case "world":
      return "World";
    case "india":
      return "India";
    case "women":
      return "Women";
    case "young":
      return `Under ${YOUNG_AGE_THRESHOLD}`;
  }
}

export function categoryDescription(category: Category): string {
  switch (category) {
    case "world":
      return "The full tracked roster, ranked by estimated net worth.";
    case "india":
      return "Billionaires based in India.";
    case "women":
      return "Women billionaires across every industry we track.";
    case "young":
      return `Billionaires under age ${YOUNG_AGE_THRESHOLD}.`;
  }
}

export interface CategoryView {
  category: Category;
  people: RankedBillionaire[];
  topGainers: RankedBillionaire[];
  topLosers: RankedBillionaire[];
}

function filterByCategory(people: RankedBillionaire[], category: Category): RankedBillionaire[] {
  switch (category) {
    case "world":
      return people;
    case "india":
      return people.filter((person) => person.country === "India");
    case "women":
      return people.filter((person) => person.gender === "female");
    case "young":
      return people.filter((person) => person.age <= YOUNG_AGE_THRESHOLD);
  }
}

/**
 * Derives a category-scoped view from the full (world) leaderboard: filters
 * the roster, re-ranks 1..N within that subset, and recomputes gainers/
 * losers scoped to the same subset.
 */
export function getCategoryView(leaderboard: Leaderboard, category: Category): CategoryView {
  const filtered = filterByCategory(leaderboard.people, category);
  const rankedWithinCategory = filtered
    .slice()
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .map((person, index) => ({ ...person, rank: index + 1 }));

  const { topGainers, topLosers } = selectMovers(rankedWithinCategory);

  return { category, people: rankedWithinCategory, topGainers, topLosers };
}
