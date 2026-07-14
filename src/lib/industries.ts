import { billionaires } from "@/data/billionaires";
import type { Leaderboard, RankedBillionaire } from "@/lib/net-worth";
import { selectMovers } from "@/lib/net-worth";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Every raw `industry` string in billionaires.ts, mapped to one or more
 * broader categories. This only re-groups a field we've already verified
 * per person — it doesn't assert anything new about anyone. Compound
 * strings ("Diversified (Energy, Telecom, Retail)") map to every category
 * they genuinely describe.
 */
const INDUSTRY_MAP: Record<string, string[]> = {
  "Automotive & Aerospace": ["Automotive", "Aerospace"],
  "Technology & E-commerce": ["Technology", "Retail"],
  "Technology & Social Media": ["Technology", "Social Media"],
  "Technology & Software": ["Technology"],
  "Technology & Internet": ["Technology"],
  Technology: ["Technology"],
  "Finance & Investments": ["Finance & Investments"],
  "Fashion & Luxury Goods": ["Fashion", "Luxury Goods"],
  "Technology & Semiconductors": ["Technology"],
  "Technology & Computer Hardware": ["Technology"],
  "Fashion & Retail": ["Fashion", "Retail"],
  Retail: ["Retail"],
  "Diversified Conglomerate": ["Diversified Conglomerate"],
  "Beauty & Cosmetics": ["Luxury Goods"],
  "Gaming & Hospitality": ["Gaming & Hospitality"],
  "Food & Confectionery": ["Food & Beverage"],
  Mining: ["Mining"],
  Automotive: ["Automotive"],
  "Technology & Dating Apps": ["Technology"],
  "Diversified (Energy, Telecom, Retail)": ["Oil & Energy", "Telecom", "Retail", "Diversified Conglomerate"],
  "Diversified (Ports, Energy, Infrastructure)": ["Oil & Energy", "Diversified Conglomerate"],
  "Technology & IT Services": ["Technology"],
  "Diversified (Cement, Metals, Telecom)": ["Industrial & Manufacturing", "Telecom", "Diversified Conglomerate"],
  "Steel & Power": ["Industrial & Manufacturing", "Oil & Energy"],
  "Pharmaceuticals & Vaccines": ["Healthcare & Pharmaceuticals"],
  "Technology & Music Streaming": ["Technology"],
  "Technology & Travel": ["Technology"],
  "Telecom & Diversified": ["Telecom", "Diversified Conglomerate"],
  Investments: ["Finance & Investments"],
  "Cement & Manufacturing": ["Industrial & Manufacturing"],
  "Telecom & Oil": ["Telecom", "Oil & Energy"],
  "Chemicals & Investments": ["Industrial & Manufacturing", "Finance & Investments"],
  "Telecom & Investments": ["Telecom", "Finance & Investments"],
  "Beverages & Pharmaceuticals": ["Food & Beverage", "Healthcare & Pharmaceuticals"],
  "Technology & Gaming": ["Technology", "Gaming & Hospitality"],
  Cryptocurrency: ["Crypto"],
};

/**
 * A few people whose AI involvement is already documented in their own
 * profile bio/keyFacts (not a new claim, just surfacing it as a category):
 * - Elon Musk: profiles.ts careerTimeline 2023 entry, "Founded xAI"
 * - Jensen Huang: profiles.ts longBio, "central figure in the AI hardware boom"
 * - Sergey Brin: profiles.ts longBio, "involved in Alphabet's AI ... projects"
 */
const AI_TAGGED_IDS = new Set(["elon-musk", "jensen-huang", "sergey-brin"]);

function categoriesForPerson(personId: string, industry: string): string[] {
  const base = INDUSTRY_MAP[industry] ?? [industry];
  const categories = new Set(base);
  if (AI_TAGGED_IDS.has(personId)) {
    categories.add("AI");
  }
  return Array.from(categories);
}

export interface IndustryInfo {
  industry: string;
  slug: string;
  personIds: string[];
}

/** Every category with at least one tracked person, most people first. */
export function listIndustries(): IndustryInfo[] {
  const byCategory = new Map<string, string[]>();
  for (const person of billionaires) {
    for (const category of categoriesForPerson(person.id, person.industry)) {
      const ids = byCategory.get(category) ?? [];
      ids.push(person.id);
      byCategory.set(category, ids);
    }
  }
  return Array.from(byCategory.entries())
    .map(([industry, personIds]) => ({ industry, slug: slugify(industry), personIds }))
    .sort((a, b) => b.personIds.length - a.personIds.length || a.industry.localeCompare(b.industry));
}

export function industryFromSlug(slug: string): IndustryInfo | null {
  return listIndustries().find((i) => i.slug === slug) ?? null;
}

export interface IndustryView {
  industry: string;
  people: RankedBillionaire[];
  topGainers: RankedBillionaire[];
  topLosers: RankedBillionaire[];
}

export function getIndustryView(leaderboard: Leaderboard, info: IndustryInfo): IndustryView {
  const idSet = new Set(info.personIds);
  const ranked = leaderboard.people
    .filter((p) => idSet.has(p.id))
    .slice()
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .map((person, index) => ({ ...person, rank: index + 1 }));
  const { topGainers, topLosers } = selectMovers(ranked);
  return { industry: info.industry, people: ranked, topGainers, topLosers };
}
