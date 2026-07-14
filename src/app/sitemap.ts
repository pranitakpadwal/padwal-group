import type { MetadataRoute } from "next";
import { billionaires } from "@/data/billionaires";
import { getPersonProfile } from "@/data/profiles";
import { getAllTickers } from "@/lib/holdings";
import { listCountries, listRegions } from "@/lib/countries";
import { listUniversities } from "@/lib/universities";
import { listCities } from "@/lib/cities";
import { listIndustries } from "@/lib/industries";
import { listFamilies } from "@/lib/families";
import { listArticles } from "@/lib/articles";
import { listNews } from "@/lib/news";
import { listQuoteOfDay } from "@/lib/quote-of-day";
import { listQuotePeopleIds } from "@/data/quotes";
import { isSpotlightEligible } from "@/lib/spotlight";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  const categoryRoutes: MetadataRoute.Sitemap = ["", "/india", "/women", "/young", "/why", "/articles", "/crypto", "/energy"].map(
    (path) => ({
      url: `${base}${path}`,
      changeFrequency: "hourly",
      priority: path === "" ? 1 : 0.8,
    }),
  );

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
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: 0.6 }));

  const profileRoutes: MetadataRoute.Sitemap = billionaires.map((person) => ({
    url: `${base}/billionaire/${person.id}`,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const profileSubpageRoutes: MetadataRoute.Sitemap = billionaires.flatMap((person) => {
    const profile = getPersonProfile(person.id);
    if (!profile) {
      return [];
    }
    const slugs: string[] = [];
    if (profile.careerTimeline && profile.careerTimeline.length > 0) slugs.push("journey");
    if (profile.ventures && profile.ventures.length > 0) slugs.push("ventures");
    if (profile.notableAssets && profile.notableAssets.length > 0) slugs.push("lifestyle");
    if (profile.family) slugs.push("family");

    return slugs.map((slug) => ({
      url: `${base}/billionaire/${person.id}/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));
  });

  const countryRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/countries`, changeFrequency: "weekly" as const, priority: 0.7 },
    ...listRegions().map((r) => ({
      url: `${base}/region/${r.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...listCountries().map((c) => ({
      url: `${base}/country/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];

  const stockRoutes: MetadataRoute.Sitemap = getAllTickers().map((ticker) => ({
    url: `${base}/stock/${ticker}`,
    changeFrequency: "daily",
    priority: 0.4,
  }));

  const companyRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/companies`, changeFrequency: "weekly" as const, priority: 0.7 },
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


  const articleRoutes: MetadataRoute.Sitemap = listArticles({ limit: 1000 }).map((article) => ({
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

  const storyRoutes: MetadataRoute.Sitemap = billionaires
    .filter((person) => {
      const profile = getPersonProfile(person.id);
      return profile?.careerTimeline && profile.careerTimeline.length > 0;
    })
    .map((person) => ({
      url: `${base}/story/${person.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const quoteRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/quotes`, changeFrequency: "weekly" as const, priority: 0.7 },
    ...listQuotePeopleIds().map((id) => ({
      url: `${base}/quotes/${id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  const quoteOfDayRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/quote-of-the-day`, changeFrequency: "daily" as const, priority: 0.8 },
    ...listQuoteOfDay(1000).map((entry) => ({
      url: `${base}/quote-of-the-day/${entry.slug}`,
      lastModified: entry.generatedAt,
      changeFrequency: "never" as const,
      priority: 0.6,
    })),
  ];

  const goodNewsRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/good-news`, changeFrequency: "weekly" as const, priority: 0.7 },
    ...billionaires
      .filter((person) => isSpotlightEligible(getPersonProfile(person.id)))
      .map((person) => ({
        url: `${base}/good-news/${person.id}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];

  return [
    ...categoryRoutes,
    ...countryRoutes,
    ...calculatorRoutes,
    ...profileRoutes,
    ...profileSubpageRoutes,
    ...stockRoutes,
    ...companyRoutes,
    ...universityRoutes,
    ...cityRoutes,
    ...industryRoutes,
    ...familyRoutes,
    ...articleRoutes,
    ...newsRoutes,
    ...storyRoutes,
    ...quoteRoutes,
    ...quoteOfDayRoutes,
    ...goodNewsRoutes,
  ];
}
