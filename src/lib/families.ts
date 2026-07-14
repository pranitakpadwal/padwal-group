import type { Leaderboard, RankedBillionaire } from "@/lib/net-worth";
import { selectMovers } from "@/lib/net-worth";

/**
 * Genuine multi-generation/multi-sibling families where we track two or
 * more members. This is deliberately short — we only group people who are
 * ACTUALLY in the roster and ACTUALLY related (Walton siblings; the
 * Sawiris brothers, sons of Onsi Sawiris). Families like Mars, Ambani, or
 * Hermès only have one tracked member each right now, so they don't get a
 * page yet — that needs adding more of their family members to the
 * roster, not a template change.
 */
export interface FamilyGroup {
  id: string;
  name: string;
  description: string;
  personIds: string[];
}

export const FAMILY_GROUPS: FamilyGroup[] = [
  {
    id: "walton",
    name: "Walton Family",
    description:
      "The children of Walmart founder Sam Walton, who together control the majority of the retailer through the family holding company, Walton Enterprises.",
    personIds: ["jim-walton", "rob-walton", "alice-walton"],
  },
  {
    id: "sawiris",
    name: "Sawiris Family",
    description:
      "Sons of Egyptian businessman Onsi Sawiris, who built the Orascom conglomerate — Nassef leads its construction and chemicals arms, Naguib built out its telecom business.",
    personIds: ["nassef-sawiris", "naguib-sawiris"],
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface FamilyInfo extends FamilyGroup {
  slug: string;
}

export function listFamilies(): FamilyInfo[] {
  return FAMILY_GROUPS.map((f) => ({ ...f, slug: slugify(f.id) }));
}

export function familyFromSlug(slug: string): FamilyInfo | null {
  return listFamilies().find((f) => f.slug === slug) ?? null;
}

export interface FamilyView {
  family: FamilyInfo;
  people: RankedBillionaire[];
  topGainers: RankedBillionaire[];
  topLosers: RankedBillionaire[];
}

export function getFamilyView(leaderboard: Leaderboard, family: FamilyInfo): FamilyView {
  const idSet = new Set(family.personIds);
  const ranked = leaderboard.people
    .filter((p) => idSet.has(p.id))
    .slice()
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .map((person, index) => ({ ...person, rank: index + 1 }));
  const { topGainers, topLosers } = selectMovers(ranked);
  return { family, people: ranked, topGainers, topLosers };
}
