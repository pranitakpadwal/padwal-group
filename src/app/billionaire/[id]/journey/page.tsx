import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NOINDEX } from "@/lib/site";
import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { getPersonProfile } from "@/data/profiles";
import { formatUsdCompact } from "@/lib/format";
import ProfileSubpageLayout from "@/components/ProfileSubpageLayout";
import ProfileBreadcrumbJsonLd from "@/components/ProfileBreadcrumbJsonLd";
import CareerTimelineTable from "@/components/CareerTimelineTable";

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
    robots: NOINDEX,
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

  const rows = ranked
    ? [
        ...timeline,
        {
          year: "Today",
          title: `Ranked #${ranked.rank} in the world`,
          description: `${firstName}'s net worth is an estimated ${formatUsdCompact(ranked.netWorthUsd)}, updated in real time from public holdings.`,
        },
      ]
    : timeline;

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

      <CareerTimelineTable timeline={rows} />

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
