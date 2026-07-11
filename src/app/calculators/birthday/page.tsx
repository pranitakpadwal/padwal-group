import type { Metadata } from "next";
import { getLeaderboard } from "@/lib/net-worth";
import { siteUrl } from "@/lib/site";
import BirthdayCalculator from "@/components/BirthdayCalculator";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Who Was the Richest Person When You Were Born? — Birthday Calculator",
  description:
    "Enter your birth year and see who topped the world's rich list the year you were born, when you turned 18 and 30, and who's #1 right now — live.",
  keywords: [
    "richest person the year I was born",
    "who was the richest person in 1990",
    "billionaire birthday calculator",
    "richest person by year",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/birthday` },
};

export default async function BirthdayPage() {
  const leaderboard = await getLeaderboard();
  const top = leaderboard.people[0];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Calculators", href: "/calculators" }, { label: "Richest on Your Birthday" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Who Was the Richest Person When You Were Born?
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Wealth at the top turns over more than you&apos;d think. Enter
            your birth year and watch the crown change hands across your
            lifetime.
          </p>
        </header>
        <BirthdayCalculator
          todayName={top.name}
          todayPersonId={top.id}
          todayNetWorthUsd={top.netWorthUsd}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
