/**
 * Grouping pages (city/university/industry/family/country/region) re-slice
 * the same roster many different ways. With a roster this size, most slices
 * land at 1-2 people behind an otherwise-identical paragraph template —
 * exactly the "thin, scaled content" pattern search engines and ad review
 * penalize. Pages below this threshold stay live for visitors (real people,
 * real data) but are marked noindex so they aren't judged as part of the
 * site's core indexed content until the roster grows enough to fill them
 * out. Raise this as the roster grows.
 */
export const MIN_INDEXABLE_GROUP_SIZE = 3;

export function isGroupIndexable(personCount: number): boolean {
  return personCount >= MIN_INDEXABLE_GROUP_SIZE;
}
