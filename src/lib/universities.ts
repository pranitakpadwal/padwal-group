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

/**
 * Business/law schools grouped under their parent university — these are
 * genuinely the same institution, not a judgment call about unrelated
 * people. Applied after stripping "(dropped out)"-style parentheticals.
 */
const UNIVERSITY_ALIASES: Record<string, string> = {
  "Harvard Business School": "Harvard University",
  "Stanford Graduate School of Business": "Stanford University",
  "Columbia Business School": "Columbia University",
  "Columbia Law School": "Columbia University",
};

/** Strips "(dropped out)"/"(MBA)"/"(MD)" style suffixes, then applies known school aliases. */
function normalizeUniversity(raw: string): string {
  const stripped = raw.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return UNIVERSITY_ALIASES[stripped] ?? stripped;
}

export interface UniversityInfo {
  university: string;
  slug: string;
  personIds: string[];
}

/** Every university with at least one tracked alum, most alumni first. */
export function listUniversities(): UniversityInfo[] {
  const byUniversity = new Map<string, string[]>();
  for (const person of billionaires) {
    const education = getPersonProfile(person.id)?.education;
    if (!education) continue;
    const university = normalizeUniversity(education);
    const ids = byUniversity.get(university) ?? [];
    ids.push(person.id);
    byUniversity.set(university, ids);
  }
  return Array.from(byUniversity.entries())
    .map(([university, personIds]) => ({ university, slug: slugify(university), personIds }))
    .sort((a, b) => b.personIds.length - a.personIds.length || a.university.localeCompare(b.university));
}

export function universityFromSlug(slug: string): UniversityInfo | null {
  return listUniversities().find((u) => u.slug === slug) ?? null;
}

export interface UniversityView {
  university: string;
  people: RankedBillionaire[];
  topGainers: RankedBillionaire[];
  topLosers: RankedBillionaire[];
}

export function getUniversityView(leaderboard: Leaderboard, info: UniversityInfo): UniversityView {
  const idSet = new Set(info.personIds);
  const ranked = leaderboard.people
    .filter((p) => idSet.has(p.id))
    .slice()
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .map((person, index) => ({ ...person, rank: index + 1 }));
  const { topGainers, topLosers } = selectMovers(ranked);
  return { university: info.university, people: ranked, topGainers, topLosers };
}
