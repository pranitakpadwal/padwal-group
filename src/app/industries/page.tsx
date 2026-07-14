import type { Metadata } from "next";
import Link from "next/link";
import { listIndustries } from "@/lib/industries";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billionaires by Industry — Technology, Retail, Crypto & More",
  description:
    "Browse billionaires by industry: technology, AI, retail, mining, fashion, crypto, and more, ranked live by real-time net worth.",
  keywords: [
    "billionaires by industry",
    "technology billionaires",
    "crypto billionaires",
    "richest people by industry",
  ],
  alternates: { canonical: `${siteUrl()}/industries` },
};

export default function IndustriesIndex() {
  const industries = listIndustries();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Billionaires by Industry
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Where the world&apos;s richest people made their fortunes, grouped
            by industry.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {industries.map((i) => (
            <Link
              key={i.slug}
              href={`/industry/${i.slug}`}
              className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-brand"
            >
              <span className="font-medium text-foreground">{i.industry}</span>
              <span className="text-sm text-[--muted]">
                {i.personIds.length} {i.personIds.length === 1 ? "billionaire" : "billionaires"}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
