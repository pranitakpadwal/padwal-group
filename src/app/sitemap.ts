import type { MetadataRoute } from "next";
import { billionaires } from "@/data/billionaires";
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

  const profileRoutes: MetadataRoute.Sitemap = billionaires.map((person) => ({
    url: `${base}/billionaire/${person.id}`,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const articleRoutes: MetadataRoute.Sitemap = listArticles({ limit: 1000 }).map((article) => ({
    url: `${base}/articles/${article.date}/${article.category}`,
    lastModified: article.generatedAt,
    changeFrequency: "never",
    priority: 0.6,
  }));

  return [...categoryRoutes, ...profileRoutes, ...articleRoutes];
}
