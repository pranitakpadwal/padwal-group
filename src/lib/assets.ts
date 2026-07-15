import { billionaires } from "@/data/billionaires";
import { getPersonProfile, type NotableAsset } from "@/data/profiles";
import type { Leaderboard } from "@/lib/net-worth";

export type AssetCategory = NotableAsset["category"];

export const ASSET_CATEGORY_LABEL: Record<AssetCategory, string> = {
  residence: "Mansions & Homes",
  vehicle: "Cars",
  yacht: "Yachts",
  jet: "Private Jets",
  island: "Private Islands",
  other: "Other Notable Assets",
};

export const ASSET_CATEGORY_SLUG: Record<AssetCategory, string> = {
  residence: "mansions",
  vehicle: "cars",
  yacht: "yachts",
  jet: "jets",
  island: "islands",
  other: "other",
};

const SLUG_TO_CATEGORY: Record<string, AssetCategory> = Object.fromEntries(
  Object.entries(ASSET_CATEGORY_SLUG).map(([category, slug]) => [slug, category as AssetCategory]),
);

export function categoryFromSlug(slug: string): AssetCategory | null {
  return SLUG_TO_CATEGORY[slug] ?? null;
}

export interface OwnedAsset extends NotableAsset {
  personId: string;
  personName: string;
}

/** Every notable asset across all profiles, tagged with its owner. */
export function listAllAssets(): OwnedAsset[] {
  const assets: OwnedAsset[] = [];
  for (const person of billionaires) {
    const profile = getPersonProfile(person.id);
    if (!profile?.notableAssets) continue;
    for (const asset of profile.notableAssets) {
      assets.push({ ...asset, personId: person.id, personName: person.name });
    }
  }
  return assets;
}

export interface AssetCategoryInfo {
  category: AssetCategory;
  slug: string;
  label: string;
  count: number;
}

/** Every category that has at least one asset, most populated first. */
export function listAssetCategories(): AssetCategoryInfo[] {
  const counts = new Map<AssetCategory, number>();
  for (const asset of listAllAssets()) {
    counts.set(asset.category, (counts.get(asset.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({
      category,
      slug: ASSET_CATEGORY_SLUG[category],
      label: ASSET_CATEGORY_LABEL[category],
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Assets in one category, ordered by the owner's current net worth (a reasonable prominence proxy). */
export function getAssetsByCategory(category: AssetCategory, leaderboard: Leaderboard): OwnedAsset[] {
  const netWorthById = new Map(leaderboard.people.map((p) => [p.id, p.netWorthUsd]));
  return listAllAssets()
    .filter((a) => a.category === category)
    .sort((a, b) => (netWorthById.get(b.personId) ?? 0) - (netWorthById.get(a.personId) ?? 0));
}
