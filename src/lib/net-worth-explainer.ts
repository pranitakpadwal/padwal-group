import { billionaires } from "@/data/billionaires";
import { getPersonProfile } from "@/data/profiles";
import { slugifyTitle } from "@/lib/schema";
import { siteUrl } from "@/lib/site";

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

/**
 * The <title>/H1 shown on the page — deliberately NOT netWorthHeadline, which
 * is frozen because it generates the URL slug (changing it would 404 every
 * indexed /net-worth URL).
 *
 * These pages and /billionaire/[id] were both targeting "{name} net worth" and
 * "how rich is {name}", so our own two pages split the ranking signal for the
 * same query. This side owns the explainer intent ("how did X make their
 * money", "net worth breakdown"); the live profile owns "net worth today".
 * Where a person has a researched hook, that unique angle leads instead of a
 * generic net-worth phrase.
 */
export function netWorthPageTitle(personId: string, personName: string, year: number): string {
  const hook = getPersonProfile(personId)?.netWorthHook;
  return hook
    ? `${personName}: ${hook.title}`
    : `How ${personName} Got Rich — ${year} Net Worth Breakdown`;
}

export function netWorthUrl(personId: string, personName: string, year: number): string {
  return `/net-worth/${netWorthSlug(personId, personName, year)}`;
}

/**
 * True when this person's /net-worth page carries researched content the live
 * profile doesn't have (a sourced deep dive or a netWorthHook angle).
 *
 * Only 15 of the 51 do. The other 36 are the generic template: the same live
 * figure and the same breakdown already on /billionaire/[id], which makes them
 * genuine near-duplicates rather than separate articles.
 */
export function hasOwnNetWorthContent(personId: string): boolean {
  const profile = getPersonProfile(personId);
  return Boolean(profile?.deepDive?.length || profile?.netWorthHook);
}

/**
 * Template-only net-worth pages canonicalize to the live profile, so Google
 * consolidates the duplicate signal onto the page that actually earns the
 * impressions instead of splitting it between two of ours. Pages with real
 * researched content stay self-canonical — a canonical between genuinely
 * different pages is a hint Google routinely ignores, and it would bury the
 * deep dives entirely.
 */
export function netWorthCanonical(personId: string, personName: string, year: number): string {
  const base = siteUrl();
  return hasOwnNetWorthContent(personId)
    ? `${base}${netWorthUrl(personId, personName, year)}`
    : `${base}/billionaire/${personId}`;
}

/** Resolves a /net-worth/[slug] URL back to a billionaire id, for the current year's slugs. */
export function personIdFromNetWorthSlug(slug: string, year: number): string | null {
  const match = billionaires.find((b) => netWorthSlug(b.id, b.name, year) === slug);
  return match?.id ?? null;
}
