import type { MetadataRoute } from "next";
import { billionaires } from "@/data/billionaires";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  const categoryRoutes: MetadataRoute.Sitemap = ["", "/india", "/women", "/young"].map(
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

  return [...categoryRoutes, ...profileRoutes];
}
