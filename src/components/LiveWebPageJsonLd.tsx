import { SITE_NAME } from "@/lib/schema";
import { siteUrl } from "@/lib/site";

/**
 * Marks a page as genuinely live for search engines: `dateModified` is set
 * to the moment this request was rendered, which is honest for any page
 * whose content is re-fetched from the live leaderboard/market data on
 * every request (force-dynamic, no stale cache at the routing layer).
 * This is what lets Google show "X minutes ago" instead of the last crawl
 * date in search snippets. Only use this on pages that actually update
 * that often — static content should keep a real, fixed dateModified.
 */
export default function LiveWebPageJsonLd({
  url,
  name,
  description,
  asOf,
}: {
  url: string;
  name: string;
  description?: string;
  /** Pass the data source's own last-refresh timestamp when available (e.g. leaderboard.asOf); falls back to now. */
  asOf?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    ...(description ? { description } : {}),
    dateModified: asOf ?? new Date().toISOString(),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: siteUrl() },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
