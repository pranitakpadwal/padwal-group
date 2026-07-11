import type { Metadata } from "next";
import { getLeaderboard } from "@/lib/net-worth";
import { siteUrl } from "@/lib/site";
import SpendBillionaireMoney, { type SpendBudget } from "@/components/SpendBillionaireMoney";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spend a Billionaire's Fortune — Interactive Game",
  description:
    "Take Elon Musk's (or any top billionaire's) live net worth and try to spend it: superyachts, NFL teams, private islands, even Twitter. Harder than it sounds.",
  keywords: [
    "spend billionaire money",
    "spend Elon Musk's money",
    "spend Bill Gates money game",
    "billionaire spending game",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/spend` },
};

export default async function SpendPage() {
  const leaderboard = await getLeaderboard();
  const budgets: SpendBudget[] = leaderboard.people.slice(0, 8).map((person) => ({
    id: person.id,
    name: person.name,
    netWorthUsd: person.netWorthUsd,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Spend a Billionaire&apos;s Fortune
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            The budget is their real, live net worth estimate. Buy islands,
            teams, paintings, and social networks — and watch how little of a
            dent you make.
          </p>
        </header>
        <SpendBillionaireMoney budgets={budgets} />
      </main>
      <SiteFooter />
    </div>
  );
}
