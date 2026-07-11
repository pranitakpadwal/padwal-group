import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billionaire Wealth Calculators — Real-Time Billionaires",
  description:
    "Interactive billionaire wealth calculators: see what owning a slice of Tesla, Nvidia, or Amazon would be worth, and where your net worth would rank among the world's richest people.",
  keywords: [
    "billionaire calculator",
    "how much would I be worth if I owned Tesla",
    "net worth rank calculator",
    "wealth calculator",
  ],
  alternates: { canonical: `${siteUrl()}/calculators` },
};

const CALCULATORS = [
  {
    href: "/calculators/own-a-company",
    title: "If You Owned a Piece of a Company",
    description:
      "Pick a company and a percentage — see what that stake is worth at today's price, and where it would rank you among billionaires.",
  },
  {
    href: "/calculators/net-worth-rank",
    title: "Where Would Your Net Worth Rank?",
    description:
      "Enter a net worth and find out where you'd sit on the real-time billionaires list — and who you'd need to pass next.",
  },
];

export default function CalculatorsIndex() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Wealth Calculators
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Interactive tools that turn live market data into something you can
            actually feel — powered by the same real-time prices behind the
            leaderboard.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-brand"
            >
              <h2 className="font-display text-xl font-semibold text-foreground">{calc.title}</h2>
              <p className="text-sm text-foreground/70">{calc.description}</p>
              <span className="mt-1 text-sm font-medium text-brand">Try it &rarr;</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
