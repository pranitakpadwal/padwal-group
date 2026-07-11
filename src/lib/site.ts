export function siteUrl(): string {
  // NEXT_PUBLIC_SITE_URL overrides in any environment; the fallback is the
  // live production domain so canonicals / OG tags / sitemap are correct
  // even if the env var isn't set.
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.realtimebillionaire.com";
}
