import type { Metadata } from "next";
import Link from "next/link";
import { getCompanyCaps, getRosterNetWorths } from "@/lib/calculator-data";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import OwnACompanyCalculator from "@/components/OwnACompanyCalculator";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "If You Owned a Piece of Tesla, Nvidia or Amazon — Wealth Calculator",
  description:
    "Interactive calculator: pick a company and a percentage to see what that stake would be worth at today's live price, and where it would rank you among the world's billionaires.",
  keywords: [
    "if I owned 5% of Tesla",
    "how much is 1% of Nvidia worth",
    "own a piece of a company calculator",
    "company stake value calculator",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/own-a-company` },
};

export default async function OwnACompanyPage() {
  const [companies, roster] = await Promise.all([getCompanyCaps(), getRosterNetWorths()]);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <nav className="text-sm text-[--muted]" aria-label="Breadcrumb">
          <Link href="/calculators" className="hover:text-brand">
            Calculators
          </Link>{" "}
          &rsaquo; Own a Piece of a Company
        </nav>

        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            If You Owned a Piece of a Company
          </h1>
          <p className="mt-2 text-foreground/70">
            Choose a company and how much of it you own. We&apos;ll show what
            that stake is worth at today&apos;s live market cap — and where it
            would place you among the billionaires we track.
          </p>
        </header>

        <OwnACompanyCalculator companies={companies} roster={roster} />

        <p className="text-xs text-[--muted]">
          Value = the company&apos;s current market capitalization × your chosen
          percentage. Live market data via Yahoo Finance; for illustration
          only.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
