import type { Metadata } from "next";
import Link from "next/link";
import { getCompanyCaps, getRosterNetWorths } from "@/lib/calculator-data";
import { getDisplayRates } from "@/lib/fx";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import OwnACompanyCalculator from "@/components/OwnACompanyCalculator";
import FaqBlock from "@/components/FaqBlock";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "If You Owned a Piece of Tesla, Nvidia, Reliance or Apple — Wealth Calculator",
  description:
    "Interactive calculator: pick any global company and a percentage or number of shares to see what that stake is worth today, in USD or INR, plus growth and cash-out tax estimates.",
  keywords: [
    "if I owned 5% of Tesla",
    "how much is 1% of Nvidia worth",
    "how much would I be worth if I owned Reliance",
    "own a piece of a company calculator",
    "company stake value calculator",
    "share value calculator in INR",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/own-a-company` },
};

const FAQS = [
  {
    question: "How is the value of a company stake calculated?",
    answer:
      "For a percentage, we multiply the company's current market capitalization by the percentage you own. For a share count, we multiply the number of shares by the current share price. Both use live market data, converted to your chosen currency.",
  },
  {
    question: "Can I calculate a stake in global companies, not just US ones?",
    answer:
      "Yes. The calculator includes major companies from the US, India, Europe, the Middle East, and Asia. Non-US prices and market caps are converted to US dollars (and then your display currency) using live exchange rates.",
  },
  {
    question: "Can I see the value in Indian Rupees (INR)?",
    answer:
      "Yes — use the currency switcher to view any result in INR, USD, EUR, GBP, and other currencies, using live foreign-exchange rates, without leaving the page.",
  },
  {
    question: "How much tax would I pay if I sold the shares?",
    answer:
      "The cash-out section applies a capital gains tax rate you choose (with presets for the US, India, and UK) to the full value, showing the estimated tax and what you'd keep. Real tax depends on your cost basis, holding period, and country — treat it as a rough guide, not tax advice.",
  },
];

export default async function OwnACompanyPage() {
  const [companies, roster, rates] = await Promise.all([
    getCompanyCaps(),
    getRosterNetWorths(),
    getDisplayRates(),
  ]);

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
            Choose any major company worldwide and either a percentage or a
            number of shares. We&apos;ll show what that stake is worth at
            today&apos;s live price — in your currency — where it would rank you
            among billionaires, how it could grow, and what a cash-out would
            cost in tax.
          </p>
          <Link
            href="/calculators/articles/what-the-worlds-richest-persons-fortune-could-buy-outright"
            className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
          >
            Read: What the world&apos;s richest person&apos;s fortune could buy outright &rarr;
          </Link>
        </header>

        <OwnACompanyCalculator companies={companies} roster={roster} rates={rates} />

        <section className="rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed text-foreground/70 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-foreground">
            How the &quot;own a piece of a company&quot; calculator works
          </h2>
          <p className="mt-3">
            Owning a share of a company means owning a slice of its total
            value. If a company is worth $1 trillion and you own 1% of it, your
            stake is worth $10 billion. That&apos;s exactly how the world&apos;s
            billionaires built their fortunes — most of their wealth is simply a
            large percentage of a company they founded or backed early.
          </p>
          <p className="mt-3">
            This tool lets you flip that around: pick a company, choose how much
            of it you own, and instantly see the value and where it would place
            you on the real-time billionaires list. Switch to &quot;number of
            shares&quot; to value a specific holding, change the currency to see
            it in rupees or dollars, and use the growth and tax panels to
            explore what it could become or cost.
          </p>
        </section>

        <FaqBlock faqs={FAQS} />

        <p className="text-xs text-[--muted]">
          Live market and FX data via Yahoo Finance; for illustration only, not
          investment or tax advice.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
