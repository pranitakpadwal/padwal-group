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
    href: "/calculators/wealth-race",
    articleHref: "/calculators/articles/how-often-is-the-worlds-richest-person-actually-in-first",
    title: "Wealth Race",
    description:
      "Elon vs Zuckerberg, or anyone vs anyone — pick two billionaires and race their net worth over time, live.",
  },
  {
    href: "/calculators/spend",
    articleHref: "/calculators/articles/how-far-the-richest-persons-fortune-goes-on-real-billionaire-purchases",
    title: "Spend a Billionaire's Fortune",
    description:
      "Their live net worth is your budget. Buy superyachts, NFL teams, islands — even Twitter — and see how hard it is to run out.",
  },
  {
    href: "/calculators/birthday",
    articleHref: "/calculators/articles/everyone-whos-been-the-worlds-richest-person-since-1987",
    title: "Richest Person When You Were Born",
    description:
      "Enter your birth year and see who wore the crown when you arrived, when you turned 18 and 30 — and who holds it right now.",
  },
  {
    href: "/calculators/billionaire-by-age",
    articleHref: "/calculators/articles/what-the-richest-people-had-done-by-age-30",
    title: "When They Were Your Age...",
    description:
      "Pick a billionaire and an age. See exactly what they'd achieved by then — and how much runway you still have.",
  },
  {
    href: "/calculators/inflation",
    articleHref: "/calculators/articles/what-old-billionaire-fortunes-are-worth-in-todays-dollars",
    title: "Wealth Inflation Calculator",
    description:
      "What does $100M in 1980 — or Rockefeller's first billion — equal in today's dollars? Convert any historical fortune.",
  },
  {
    href: "/calculators/own-a-company",
    articleHref: "/calculators/articles/what-the-worlds-richest-persons-fortune-could-buy-outright",
    title: "If You Owned a Piece of a Company",
    description:
      "Pick a company and a percentage — see what that stake is worth at today's price, and where it would rank you among billionaires.",
  },
  {
    href: "/calculators/net-worth-rank",
    articleHref: "/calculators/articles/net-worth-it-takes-to-crack-the-top-10-billionaires",
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
            <div
              key={calc.href}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-brand"
            >
              <Link href={calc.href} className="flex flex-col gap-2">
                <h2 className="font-display text-xl font-semibold text-foreground">{calc.title}</h2>
                <p className="text-sm text-foreground/70">{calc.description}</p>
                <span className="mt-1 text-sm font-medium text-brand">Try it &rarr;</span>
              </Link>
              <Link href={calc.articleHref} className="text-xs font-medium text-foreground/60 hover:text-brand hover:underline">
                Read the article &rarr;
              </Link>
            </div>
          ))}
        </div>

        <p className="text-sm">
          <Link href="/calculators/articles" className="font-medium text-brand hover:underline">
            See all calculator articles &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
