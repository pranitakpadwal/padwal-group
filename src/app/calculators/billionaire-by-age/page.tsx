import type { Metadata } from "next";
import Link from "next/link";
import { getLeaderboard } from "@/lib/net-worth";
import { billionaires } from "@/data/billionaires";
import { personProfiles } from "@/data/profiles";
import { calculateAge } from "@/lib/age";
import { siteUrl } from "@/lib/site";
import BillionaireByAge, { type AgePerson } from "@/components/BillionaireByAge";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "When Elon Musk Was Your Age... — Billionaire by Age",
  description:
    "Pick a billionaire and an age, and see exactly what they'd achieved by then — founded companies, IPOs, acquisitions — against where they are today.",
  keywords: [
    "when Elon Musk was my age",
    "what did Jeff Bezos do at 30",
    "billionaire milestones by age",
    "billionaire at my age",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/billionaire-by-age` },
};

export default async function BillionaireByAgePage() {
  const leaderboard = await getLeaderboard();

  const people: AgePerson[] = billionaires
    .map((person) => {
      const timeline = personProfiles[person.id]?.careerTimeline;
      if (!timeline || timeline.length === 0) {
        return null;
      }
      const ranked = leaderboard.people.find((p) => p.id === person.id);
      return {
        id: person.id,
        name: person.name,
        birthYear: Number(person.birthDate.slice(0, 4)),
        currentAge: calculateAge(person.birthDate),
        netWorthUsd: ranked?.netWorthUsd ?? null,
        timeline,
      };
    })
    .filter((person) => person !== null)
    .sort((a, b) => (b.netWorthUsd ?? 0) - (a.netWorthUsd ?? 0));

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Calculators", href: "/calculators" }, { label: "When They Were Your Age" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            When They Were Your Age...
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Slide to any age and see what the world&apos;s richest people had
            — and hadn&apos;t — done by then. Spoiler: several of them had
            done nothing remarkable yet.
          </p>
          <Link
            href="/calculators/articles/what-the-richest-people-had-done-by-age-30"
            className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
          >
            Read: What the world&apos;s richest people had actually done by age 30 &rarr;
          </Link>
        </header>
        <BillionaireByAge people={people} />
        <p className="text-xs text-neutral-400">
          Milestone ages are computed from birth year and the documented year
          of each event, so they can be off by one depending on birthdays.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
