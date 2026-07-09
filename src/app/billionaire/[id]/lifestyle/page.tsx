import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findBillionaireById } from "@/lib/net-worth";
import { getPersonProfile, type NotableAsset } from "@/data/profiles";
import ProfileSubpageLayout from "@/components/ProfileSubpageLayout";
import ProfileBreadcrumbJsonLd from "@/components/ProfileBreadcrumbJsonLd";

export const dynamic = "force-dynamic";

type RouteParams = { id: string };

const CATEGORY_LABEL: Record<NotableAsset["category"], string> = {
  residence: "Residence",
  vehicle: "Vehicle",
  yacht: "Yacht",
  jet: "Private Jet",
  other: "Notable Asset",
};

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
    title: `${person.name}'s Homes, Jets & Notable Assets — Real-Time Billionaires`,
    description: `Publicly reported homes, yachts, jets, and other notable assets for ${person.name}, each with a source.`,
  };
}

export default async function LifestylePage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const person = findBillionaireById(id);
  const profile = getPersonProfile(id);
  const assets = profile?.notableAssets;

  if (!person || !assets || assets.length === 0) {
    notFound();
  }

  return (
    <ProfileSubpageLayout personName={person.name} personId={person.id} sectionLabel="Lifestyle & Assets">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
          {person.name}&apos;s Homes, Jets &amp; Notable Assets
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Widely and credibly reported assets — not our own valuations, and
          not a complete inventory. Home locations are kept to city/region
          level, not exact addresses.
        </p>
      </div>

      <ul className="flex flex-col gap-5">
        {assets.map((asset) => (
          <li
            key={asset.name}
            className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h2 className="text-lg font-semibold">{asset.name}</h2>
              <span className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {CATEGORY_LABEL[asset.category]}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{asset.description}</p>
            <a
              href={asset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-2 inline-block text-xs text-neutral-400 hover:underline"
            >
              Source: {asset.sourceName}
            </a>
          </li>
        ))}
      </ul>

      <p className="text-xs text-neutral-400">
        Curated from public reporting at a point in time — not a live feed.
        Assets may have since been sold, replaced, or reported differently
        elsewhere. Verify against the linked sources before relying on it.
      </p>

      <ProfileBreadcrumbJsonLd
        personName={person.name}
        personId={person.id}
        sectionLabel="Lifestyle & Assets"
        sectionSlug="lifestyle"
      />
    </ProfileSubpageLayout>
  );
}
