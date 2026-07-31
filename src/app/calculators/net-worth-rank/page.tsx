import type { Metadata } from "next";
import Link from "next/link";
import { getRosterNetWorths } from "@/lib/calculator-data";
import { getDisplayRates } from "@/lib/fx";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NetWorthRankCalculator from "@/components/NetWorthRankCalculator";
import FaqBlock from "@/components/FaqBlock";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Where Would Your Net Worth Rank Among Billionaires?",
  description:
    "Enter any net worth in USD or INR and see where it would rank on the real-time billionaires list — including who you'd need to pass next to move up.",
  keywords: [
    "net worth rank calculator",
    "where would I rank among billionaires",
    "billionaire net worth comparison",
    "compare my net worth to billionaires",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/net-worth-rank` },
};

const FAQS = [
  {
    question: "How do I compare my net worth to billionaires?",
    answer:
      "Enter your net worth in your currency and the calculator places it against every billionaire we track, showing your rank, how many people you'd be richer than, and who is immediately above you.",
  },
  {
    question: "Can I enter my net worth in rupees?",
    answer:
      "Yes. Choose INR (or USD, EUR, GBP and others) and enter the amount in that currency; we convert it using live exchange rates before ranking.",
  },
  {
    question: "How much money do you need to make the billionaires list?",
    answer:
      "It depends on the day and the market, because the list is ranked in real time. Enter a number to see exactly where the current cut-off sits and how far you'd be from the last name on the list.",
  },
];

export default async function NetWorthRankPage() {
  const [roster, rates] = await Promise.all([getRosterNetWorths(), getDisplayRates()]);

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
            Enter a net worth in any currency to see exactly where it would land
            on our real-time billionaires list, and who&apos;s next above you.
          </p>
        </header>

        <NetWorthRankCalculator roster={roster} rates={rates} />

        <section className="rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed text-foreground/70 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-foreground">
            How your net worth compares to the world&apos;s richest
          </h2>
          <p className="mt-3">
            Billionaire net worth numbers are so large they can be hard to
            picture. This calculator turns them into a simple ranking: put in
            any amount and see where you&apos;d sit among the people we track,
            how many you&apos;d be richer than, and the exact gap to the next
            person up the list. Enter it in rupees or dollars — the result
            updates instantly using live exchange rates.
          </p>
        </section>

        <FaqBlock faqs={FAQS} />
      </main>
      <SiteFooter />
    </div>
  );
}
