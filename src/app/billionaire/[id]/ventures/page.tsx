import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findBillionaireById } from "@/lib/net-worth";
import { getPersonProfile } from "@/data/profiles";
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
    title: `${person.name}'s Ventures & Investments — Real-Time Billionaires`,
    description: `Business ventures and investments beyond ${person.primarySource} reported for ${person.name}, each with a source.`,
  };
}

export default async function VenturesPage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const person = findBillionaireById(id);
  const profile = getPersonProfile(id);
  const ventures = profile?.ventures;

  if (!person || !ventures || ventures.length === 0) {
    notFound();
  }

  return (
    <ProfileSubpageLayout personName={person.name} personId={person.id} sectionLabel="Ventures">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {person.name}&apos;s Ventures &amp; Investments
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          Beyond {person.primarySource}, publicly reported ventures and
          investments — each sourced.
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {ventures.map((venture) => (
          <li key={venture.name} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h2 className="font-display text-lg font-semibold text-foreground">{venture.name}</h2>
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand-dark">
                {venture.role}
              </span>
            </div>
            <p className="mt-2 text-sm text-foreground/70">{venture.description}</p>
            <a
              href={venture.sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-2 inline-block text-xs text-[--muted] hover:text-brand hover:underline"
            >
              Source: {venture.sourceName}
            </a>
          </li>
        ))}
      </ul>

      <p className="text-xs text-neutral-400">
        Curated from public reporting at a point in time — not a live feed.
        Verify against the linked sources before relying on it.
      </p>

      <ProfileBreadcrumbJsonLd
        personName={person.name}
        personId={person.id}
        sectionLabel="Ventures"
        sectionSlug="ventures"
      />
    </ProfileSubpageLayout>
  );
}
