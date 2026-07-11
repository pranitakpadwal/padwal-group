import type { Metadata } from "next";
import Link from "next/link";
import { listCountries, listRegions } from "@/lib/countries";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billionaires by Country — Richest People in Every Country",
  description:
    "Browse the world's billionaires by country. See the richest people in the US, India, China, Saudi Arabia, Nigeria, the UAE, and more, ranked live by net worth.",
  keywords: [
    "billionaires by country",
    "richest person in every country",
    "richest people by country",
    "country billionaires list",
  ],
  alternates: { canonical: `${siteUrl()}/countries` },
};

export default function CountriesIndex() {
  const countries = listCountries();
  const regions = listRegions();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Billionaires by Place
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Explore the world&apos;s richest people by region or country, each
            ranked live by net worth.
          </p>
        </header>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">By Region</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {regions.map((r) => (
              <Link
                key={r.slug}
                href={`/region/${r.slug}`}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-brand"
              >
                <span className="font-medium text-foreground">{r.region}</span>
                <span className="text-sm text-[--muted]">
                  {r.count} {r.count === 1 ? "person" : "people"}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">By Country</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {countries.map((c) => (
              <Link
                key={c.slug}
                href={`/country/${c.slug}`}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-brand"
              >
                <span className="font-medium text-foreground">{c.country}</span>
                <span className="text-sm text-[--muted]">
                  {c.count} {c.count === 1 ? "person" : "people"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
