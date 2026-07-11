import type { MetadataRoute } from "next";
import { billionaires } from "@/data/billionaires";
import { getPersonProfile } from "@/data/profiles";
import { getAllTickers } from "@/lib/holdings";
import { listArticles } from "@/lib/articles";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  const categoryRoutes: MetadataRoute.Sitemap = ["", "/india", "/women", "/young", "/articles"].map(
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
    if (profile.ventures && profile.ventures.length > 0) slugs.push("ventures");
    if (profile.notableAssets && profile.notableAssets.length > 0) slugs.push("lifestyle");
    if (profile.family) slugs.push("family");

    return slugs.map((slug) => ({
      url: `${base}/billionaire/${person.id}/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));
  });

  const stockRoutes: MetadataRoute.Sitemap = getAllTickers().map((ticker) => ({
    url: `${base}/stock/${ticker}`,
    changeFrequency: "daily",
    priority: 0.4,
  }));

  const articleRoutes: MetadataRoute.Sitemap = listArticles({ limit: 1000 }).map((article) => ({
    url: `${base}/articles/${article.date}/${article.category}`,
    lastModified: article.generatedAt,
    changeFrequency: "never",
    priority: 0.6,
  }));

  return [
    ...categoryRoutes,
    ...calculatorRoutes,
    ...profileRoutes,
    ...profileSubpageRoutes,
    ...stockRoutes,
    ...articleRoutes,
  ];
}
