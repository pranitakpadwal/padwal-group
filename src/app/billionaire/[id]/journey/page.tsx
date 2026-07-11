import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { getPersonProfile } from "@/data/profiles";
import { formatUsdCompact } from "@/lib/format";
import ProfileSubpageLayout from "@/components/ProfileSubpageLayout";
import ProfileBreadcrumbJsonLd from "@/components/ProfileBreadcrumbJsonLd";

export const dynamic = "force-dynamic";

type RouteParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const person = findBillionaireById(id);
  if (!person) {
    return { title: "Not found" };
  }
  return {
    title: `${person.name}'s Journey — From the Start to Billionaire`,
    description: `The career timeline of ${person.name}: the milestones and companies that built the fortune, from the early days to today.`,
    keywords: [
      `${person.name} career`,
      `${person.name} success story`,
      `how ${person.name} became a billionaire`,
      `${person.name} timeline`,
    ],
  };
}

export default async function JourneyPage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const person = findBillionaireById(id);
  const profile = getPersonProfile(id);
  const timeline = profile?.careerTimeline;

  if (!person || !timeline || timeline.length === 0) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const ranked = leaderboard.people.find((p) => p.id === id);
  const firstName = person.name.split(" ")[0];

  return (
    <ProfileSubpageLayout personName={person.name} personId={person.id} sectionLabel="Journey">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {person.name}&apos;s Journey
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          The milestones that built the fortune — from the early days to{" "}
          {ranked ? `an estimated ${formatUsdCompact(ranked.netWorthUsd)} today` : "today"}.
        </p>
      </div>

      <ol className="relative flex flex-col gap-6 border-l border-line pl-6">
        {timeline.map((entry, index) => (
          <li key={index} className="relative">
            <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-surface bg-brand" />
            <div className="font-display text-lg font-semibold text-brand-dark">{entry.year}</div>
            <div className="font-medium text-foreground">{entry.title}</div>
            <p className="mt-0.5 text-sm text-foreground/70">{entry.description}</p>
          </li>
        ))}
        {ranked && (
          <li className="relative">
            <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-surface bg-brand-dark" />
            <div className="font-display text-lg font-semibold text-brand-dark">Today</div>
            <div className="font-medium text-foreground">
              Ranked #{ranked.rank} in the world
            </div>
            <p className="mt-0.5 text-sm text-foreground/70">
              {firstName}&apos;s net worth is an estimated {formatUsdCompact(ranked.netWorthUsd)},
              updated in real time from public holdings.
            </p>
          </li>
        )}
      </ol>

      <p className="text-xs text-neutral-400">
        Milestones are drawn from widely-reported public history. Dates reflect
        well-documented events; net worth is a real-time estimate.
      </p>

      <ProfileBreadcrumbJsonLd
        personName={person.name}
        personId={person.id}
        sectionLabel="Journey"
        sectionSlug="journey"
      />
    </ProfileSubpageLayout>
  );
}
