import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { industries } from "@/lib/industries";
import { roles } from "@/lib/roles";
import { markets } from "@/lib/markets";
import { articles } from "@/lib/insights";
import { showClients, showJobs } from "@/lib/site";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "", "/services", "/industries", "/roles", "/markets", "/government", "/insights", "/about", "/about/leadership", "/about/approach",
    "/candidates", "/faq", "/contact", "/privacy", "/terms",
    ...(showClients ? ["/clients"] : []),
    ...(showJobs ? ["/jobs"] : []),
    ...services.map((s) => `/services/${s.slug}`),
    ...industries.map((s) => `/industries/${s.slug}`),
    ...roles.map((s) => `/roles/${s.slug}`),
    ...markets.map((s) => `/markets/${s.slug}`),
    ...articles.map((s) => `/insights/${s.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
