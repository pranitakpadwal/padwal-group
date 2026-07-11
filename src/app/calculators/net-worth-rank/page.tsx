import type { Metadata } from "next";
import Link from "next/link";
import { getRosterNetWorths } from "@/lib/calculator-data";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NetWorthRankCalculator from "@/components/NetWorthRankCalculator";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Where Would Your Net Worth Rank Among Billionaires?",
  description:
    "Enter any net worth and see where it would rank on the real-time billionaires list — including who you'd need to pass next to move up.",
  keywords: [
    "net worth rank calculator",
    "where would I rank among billionaires",
    "billionaire net worth comparison",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/net-worth-rank` },
};

export default async function NetWorthRankPage() {
  const roster = await getRosterNetWorths();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <nav className="text-sm text-[--muted]" aria-label="Breadcrumb">
          <Link href="/calculators" className="hover:text-brand">
            Calculators
          </Link>{" "}
          &rsaquo; Net Worth Rank
        </nav>

        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Where Would Your Net Worth Rank?
          </h1>
          <p className="mt-2 text-foreground/70">
            Enter a net worth to see exactly where it would land on our
            real-time billionaires list, and who&apos;s next above you.
          </p>
        </header>

        <NetWorthRankCalculator roster={roster} />
      </main>
      <SiteFooter />
    </div>
  );
}
