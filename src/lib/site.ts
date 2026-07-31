/**
 * Keeps a page out of Google's index while still letting crawlers follow its
 * links (so internal link equity still flows to the pages we do want ranked).
 *
 * Applied to page types that Search Console showed earning effectively zero
 * clicks over three months — they added indexable surface area without
 * adding search value, which is what got the site flagged for thin content.
 * Every page below still works for humans; it's just not a ranking candidate.
 * Anything marked NOINDEX must also be left out of sitemap.ts, since listing
 * a noindexed URL in a sitemap is a contradictory signal to Google.
 */
export const NOINDEX = { index: false, follow: true } as const;

export function siteUrl(): string {
  // NEXT_PUBLIC_SITE_URL overrides in any environment; the fallback is the
  // live production domain so canonicals / OG tags / sitemap are correct
  // even if the env var isn't set.
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realtimebillionaire.com";
}
