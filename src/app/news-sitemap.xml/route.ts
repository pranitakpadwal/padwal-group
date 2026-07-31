import { listNews } from "@/lib/news";
import { listArticles } from "@/lib/articles";
import { DAILY_CATEGORY } from "@/lib/generate-article";
import { siteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/schema";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Google News sitemap: only articles from the last 48 hours belong here
 * (per Google's spec), each tagged with publication name, language, date,
 * and title. Referenced from robots.txt alongside the main sitemap.
 */
export async function GET() {
  const base = siteUrl();
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;

  const newsItems = listNews({ limit: 200 })
    .filter((article) => new Date(article.generatedAt).getTime() >= cutoff)
    .map((article) => ({
      url: `${base}/news/${article.slug}`,
      title: article.title,
      publishedAt: article.generatedAt,
    }));

  const recapItems = listArticles({ limit: 20 })
    .filter((article) => article.category === DAILY_CATEGORY)
    .filter((article) => new Date(article.generatedAt).getTime() >= cutoff)
    .map((article) => ({
      url: `${base}/articles/${article.date}/${article.category}`,
      title: article.title,
      publishedAt: article.generatedAt,
    }));

  // /quote-of-the-day is marked NOINDEX (see src/lib/site.ts), so it's left
  // out here too — submitting a noindexed URL to Google News contradicts it.
  const entries = [...newsItems, ...recapItems]
    .map(
      (item) => `  <url>
    <loc>${escapeXml(item.url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${SITE_NAME}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${item.publishedAt}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
