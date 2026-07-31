import type { Metadata } from "next";
import Link from "next/link";
import { listAssetCategories } from "@/lib/assets";
import { siteUrl, NOINDEX } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Most Expensive Things Billionaires Own",
  description:
    "Superyachts, private jets, mansions, private islands, and rare cars owned by the world's richest people — each one sourced, not guessed at.",
  keywords: [
    "most expensive things billionaires own",
    "billionaire yachts",
    "billionaire mansions",
    "billionaire private jets",
    "billionaire cars",
  ],
  alternates: { canonical: `${siteUrl()}/expensive` },
  robots: NOINDEX,
};

export default function ExpensiveIndex() {
  const categories = listAssetCategories();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What Billionaires Actually Own
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Yachts, jets, mansions, islands, and cars — each entry here is
            traced to a named source, not a guess. Coverage grows as we
            verify more.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/expensive/${c.slug}`}
              className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-brand"
            >
              <span className="font-medium text-foreground">{c.label}</span>
              <span className="text-sm text-[--muted]">
                {c.count} {c.count === 1 ? "entry" : "entries"}
              </span>
            </Link>
          ))}
        </div>

        <p className="text-xs text-neutral-400">
          Prices are as reported by the linked source at the time of
          reporting, not our own valuations — and ownership can change.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
