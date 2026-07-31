import type { MetadataRoute } from "next";
import { billionaires } from "@/data/billionaires";
import { listCountries, listRegions } from "@/lib/countries";
import { listUniversities } from "@/lib/universities";
import { listCities } from "@/lib/cities";
import { listIndustries } from "@/lib/industries";
import { listFamilies } from "@/lib/families";
import { listEstimatedBillionaires } from "@/data/estimated-billionaires";
import { netWorthUrl, hasOwnNetWorthContent } from "@/lib/net-worth-explainer";
import { listArticles } from "@/lib/articles";
import { DAILY_CATEGORY } from "@/lib/generate-article";
import { listNews } from "@/lib/news";
import { listAuthors } from "@/data/authors";
import { siteUrl } from "@/lib/site";

// Must be dynamic: article and news URLs live in SQLite, which is empty at
// build time. Statically prerendering this shipped a sitemap that permanently
// omitted every daily article, so Google never saw them from here.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  // Honest freshness signal: these pages re-fetch live leaderboard/market
  // data on every request (force-dynamic), so "now" is accurate, not gamed.
  const now = new Date();

  const liveCategoryRoutes: MetadataRoute.Sitemap = ["", "/india", "/women", "/young", "/crypto", "/energy"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const staticCategoryRoutes: MetadataRoute.Sitemap = ["/why", "/articles"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const calculatorRoutes: MetadataRoute.Sitemap = [
    "/calculators",
    "/calculators/own-a-company",
    "/calculators/net-worth-rank",
    "/calculators/spend",
    "/calculators/birthday",
    "/calculators/billionaire-by-age",
    "/calculators/inflation",
    "/calculators/wealth-race",
    "/about",
    "/privacy",
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: 0.6 }));

  const authorRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/author`, changeFrequency: "monthly" as const, priority: 0.4 },
    ...listAuthors().map((author) => ({
      url: `${base}/author/${author.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];

  const countryRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/countries`, changeFrequency: "weekly" as const, priority: 0.7 },
    ...listRegions().map((r) => ({
      url: `${base}/region/${r.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    // India excluded: /country/india redirects to /india, the canonical page.
    ...listCountries()
      .filter((c) => c.country !== "India")
      .map((c) => ({
        url: `${base}/country/${c.slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.6,
      })),
  ];

  const profileRoutes: MetadataRoute.Sitemap = billionaires.map((person) => ({
    url: `${base}/billionaire/${person.id}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const estimatedBillionaireRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/billionaire`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 },
    ...listEstimatedBillionaires().map((e) => ({
      url: `${base}/estimated/${e.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];


  const universityRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/universities`, changeFrequency: "weekly" as const, priority: 0.6 },
    ...listUniversities().map((u) => ({
      url: `${base}/university/${u.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const cityRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/cities`, changeFrequency: "weekly" as const, priority: 0.6 },
    ...listCities().map((c) => ({
      url: `${base}/city/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const industryRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/industries`, changeFrequency: "weekly" as const, priority: 0.6 },
    ...listIndustries().map((i) => ({
      url: `${base}/industry/${i.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const familyRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/families`, changeFrequency: "weekly" as const, priority: 0.6 },
    ...listFamilies().map((f) => ({
      url: `${base}/family/${f.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];



  // Only the net-worth pages carrying their own researched content are listed.
  // The template-only ones canonicalize to /billionaire/[id], and submitting a
  // URL that points its canonical elsewhere is a contradictory signal.
  const netWorthYear = new Date().getFullYear();
  const netWorthRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/net-worth`, lastModified: now, changeFrequency: "daily" as const, priority: 0.6 },
    ...billionaires
      .filter((person) => hasOwnNetWorthContent(person.id))
      .map((person) => ({
        url: `${base}${netWorthUrl(person.id, person.name, netWorthYear)}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.5,
      })),
  ];


  // Only the single daily article per day. The old india/women/young recap URLs
  // now 301 into it, so listing them here would submit redirecting URLs.
  const articleRoutes: MetadataRoute.Sitemap = listArticles({ limit: 1000 })
    .filter((article) => article.category === DAILY_CATEGORY)
    .map((article) => ({
    url: `${base}/articles/${article.date}/${article.category}`,
    lastModified: article.generatedAt,
    changeFrequency: "never",
    priority: 0.6,
  }));

  const newsRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/news`, changeFrequency: "hourly" as const, priority: 0.8 },
    ...listNews({ limit: 1000 }).map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: article.generatedAt,
      changeFrequency: "never" as const,
      priority: 0.7,
    })),
  ];




  // Page types marked NOINDEX (see src/lib/site.ts) are deliberately left out:
  // listing a noindexed URL in a sitemap sends Google contradictory signals.
  // Excluded here: /calculators/articles, profile sub-pages, /stock, /companies,
  // /expensive, /celebrity, /story, /quotes, /quote-of-the-day, /good-news.
  return [
    ...liveCategoryRoutes,
    ...staticCategoryRoutes,
    ...countryRoutes,
    ...calculatorRoutes,
    ...authorRoutes,
    ...profileRoutes,
    ...universityRoutes,
    ...cityRoutes,
    ...industryRoutes,
    ...familyRoutes,
    ...estimatedBillionaireRoutes,
    ...netWorthRoutes,
    ...articleRoutes,
    ...newsRoutes,
  ];
}
