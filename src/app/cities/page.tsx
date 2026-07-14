import type { Metadata } from "next";
import Link from "next/link";
import { listCities } from "@/lib/cities";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billionaires by City — Where the World's Richest Live",
  description:
    "Browse billionaires by home city — Mumbai, Austin, Paris, Dubai, and more — ranked live by real-time net worth.",
  keywords: [
    "billionaires by city",
    "richest people in Mumbai",
    "billionaires in Dubai",
    "where do billionaires live",
  ],
  alternates: { canonical: `${siteUrl()}/cities` },
};

export default function CitiesIndex() {
  const cities = listCities();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Billionaires by City
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Where the world&apos;s richest people actually live, city by city.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cities.map((c) => (
            <Link
              key={c.slug}
              href={`/city/${c.slug}`}
              className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-brand"
            >
              <span className="font-medium text-foreground">{c.city}</span>
              <span className="text-sm text-[--muted]">
                {c.personIds.length} {c.personIds.length === 1 ? "billionaire" : "billionaires"}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
