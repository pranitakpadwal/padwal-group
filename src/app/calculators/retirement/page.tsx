import type { Metadata } from "next";
import { getRosterNetWorths } from "@/lib/calculator-data";
import { getDisplayRates } from "@/lib/fx";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/Breadcrumbs";
import RetirementCalculator from "@/components/RetirementCalculator";
import FaqBlock from "@/components/FaqBlock";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Retirement Calculator — When Can You Retire With ₹10 Crore?",
  description:
    "See your projected retirement corpus from your investments and monthly SIP, what it's worth after capital gains tax, and whether your loans clear before you retire.",
  keywords: [
    "retirement calculator india",
    "how to retire with 10 crore",
    "sip retirement calculator",
    "retirement corpus calculator",
    "loan payoff calculator",
    "financial independence calculator india",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/retirement` },
};

const FAQS = [
  {
    question: "How is the retirement amount calculated?",
    answer:
      "From what you spend today, adjusted for the lifestyle you pick and inflated to your retirement age, we work out the corpus that lets you withdraw that (inflation-rising) amount every month without running out before the age you choose to plan until. It's not the crude \"25x your expenses\" rule — it's a real month-by-month simulation of the drawdown, not just the buildup.",
  },
  {
    question: "How much do I need to retire with ₹10 crore?",
    answer:
      "Open \"Customize assumptions\" and type ₹10 crore into \"Set your own goal instead\" — the calculator then shows the monthly investment needed to hit that exact number by your retirement age, using your current savings and chosen return rate.",
  },
  {
    question: "How is the tax estimate calculated?",
    answer:
      "It applies your chosen capital-gains rate (India's current LTCG rate on equity is 12.5% above a ₹1.25 lakh exemption, per current tax law) to your full gains as a single lump-sum withdrawal — the honest worst case. In practice, withdrawing over multiple financial years re-uses the exemption each year and usually owes less. This isn't tax advice.",
  },
  {
    question: "Does it account for my home loan or car loan?",
    answer:
      "Yes — open the advanced options and add any loans with their outstanding balance, interest rate, and EMI. It shows exactly how many months until each is paid off, and whether that happens before or after your retirement age.",
  },
];

export default async function RetirementCalculatorPage() {
  const [roster, rates] = await Promise.all([getRosterNetWorths(), getDisplayRates()]);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Calculators", href: "/calculators" }, { label: "Retirement" }]} />

        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Retirement Calculator
          </h1>
          <p className="mt-2 text-foreground/70">
            One calculator for the whole picture: what your investments and monthly SIP grow to by the age you
            want to retire, what it&apos;s worth after tax, and whether your loans are cleared by then.
          </p>
        </header>

        <RetirementCalculator roster={roster} rates={rates} />

        <FaqBlock faqs={FAQS} />

        <p className="text-xs text-[--muted]">
          Live billionaire comparison data is real and updates continuously; the retirement projection itself is
          a simulation based on assumptions you choose, not investment or tax advice.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
