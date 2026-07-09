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

/** Natural-language noun phrase for headlines, e.g. "India's Billionaires". */
export function categoryArticleTitle(category: Category): string {
  switch (category) {
    case "world":
      return "World's Billionaires";
    case "india":
      return "India's Billionaires";
    case "women":
      return "The World's Richest Women";
    case "young":
      return `The Youngest Billionaires (Under ${YOUNG_AGE_THRESHOLD})`;
  }
}

/** Fits "Who is the richest {phrase} on {date}?" */
export function categoryRichestPhrase(category: Category): string {
  switch (category) {
    case "world":
      return "billionaire in the world";
    case "india":
      return "billionaire in India";
    case "women":
      return "woman billionaire";
    case "young":
      return `billionaire under ${YOUNG_AGE_THRESHOLD}`;
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
 * Filters a ranked roster down to a category, re-ranking 1..N within that
 * subset and recomputing gainers/losers scoped to the same subset. Works
 * on any RankedBillionaire[] — a live leaderboard or a historical snapshot
 * hydrated back into the same shape.
 */
export function deriveCategoryView(people: RankedBillionaire[], category: Category): CategoryView {
  const filtered = filterByCategory(people, category);
  const rankedWithinCategory = filtered
    .slice()
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .map((person, index) => ({ ...person, rank: index + 1 }));

  const { topGainers, topLosers } = selectMovers(rankedWithinCategory);

  return { category, people: rankedWithinCategory, topGainers, topLosers };
}

/** Derives a category-scoped view from the full (world) live leaderboard. */
export function getCategoryView(leaderboard: Leaderboard, category: Category): CategoryView {
  return deriveCategoryView(leaderboard.people, category);
}
