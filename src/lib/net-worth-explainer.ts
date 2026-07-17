import { billionaires } from "@/data/billionaires";
import { getPersonProfile } from "@/data/profiles";
import { slugifyTitle } from "@/lib/schema";

/**
 * Full-title, ET/Times-of-India-style URLs for the /net-worth section —
 * matching the site's existing pattern for /news and /quote-of-the-day.
 * Unlike those, this content is live (net worth changes every request),
 * so the slug is deterministic and recomputed on the fly rather than
 * stored — no database row to go stale or drift from the live figure.
 */

export function netWorthHeadline(personId: string, personName: string, year: number): string {
  const hook = getPersonProfile(personId)?.netWorthHook;
  const firstName = personName.split(" ")[0];
  return hook
    ? `${personName} Net Worth in ${year}: ${hook.title}`
    : `${personName} Net Worth in ${year}: How Rich Is ${firstName}?`;
}

export function netWorthSlug(personId: string, personName: string, year: number): string {
  return slugifyTitle(netWorthHeadline(personId, personName, year));
}

export function netWorthUrl(personId: string, personName: string, year: number): string {
  return `/net-worth/${netWorthSlug(personId, personName, year)}`;
}

/** Resolves a /net-worth/[slug] URL back to a billionaire id, for the current year's slugs. */
export function personIdFromNetWorthSlug(slug: string, year: number): string | null {
  const match = billionaires.find((b) => netWorthSlug(b.id, b.name, year) === slug);
  return match?.id ?? null;
}
