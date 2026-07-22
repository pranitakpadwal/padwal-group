import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site";
import InflationCalculator from "@/components/InflationCalculator";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Wealth Inflation Calculator — What Old Fortunes Are Worth Today",
  description:
    "Convert any historical dollar amount into today's money using official US CPI data. See what $100M in 1980 — or Rockefeller's first billion — equals now.",
  keywords: [
    "wealth inflation calculator",
    "$100 million in 1980 today",
    "inflation calculator net worth",
    "historical fortune in today's dollars",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/inflation` },
};

export default function InflationPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Calculators", href: "/calculators" }, { label: "Wealth Inflation" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Wealth Inflation Calculator
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            A fortune from another era sounds smaller than it was. Convert any
            historical amount into today&apos;s dollars and see how the old
            money really stacks up.
          </p>
          <Link
            href="/calculators/articles/what-old-billionaire-fortunes-are-worth-in-todays-dollars"
            className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
          >
            Read: What Rockefeller&apos;s first billion is worth in today&apos;s dollars &rarr;
          </Link>
        </header>
        <InflationCalculator />
      </main>
      <SiteFooter />
    </div>
  );
}
