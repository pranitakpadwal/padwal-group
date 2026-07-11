import type { Metadata } from "next";
import Link from "next/link";
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
    title: `${person.name}'s Family — Real-Time Billionaires`,
    description: `Marital status and family size reported for ${person.name}.`,
  };
}

export default async function FamilyPage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const person = findBillionaireById(id);
  const profile = getPersonProfile(id);
  const family = profile?.family;

  if (!person || !family) {
    notFound();
  }

  return (
    <ProfileSubpageLayout personName={person.name} personId={person.id} sectionLabel="Family">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
          {person.name}&apos;s Family
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          We deliberately keep this to marital status and number of
          children — never names, ages, or other details about children,
          out of respect for their privacy and safety.
        </p>
      </div>

      <dl className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="flex justify-between py-2">
          <dt className="text-neutral-500 dark:text-neutral-400">Marital status</dt>
          <dd className="font-medium">{family.maritalStatus}</dd>
        </div>
        {family.spouseName && (
          <div className="flex justify-between border-t border-neutral-200 py-2 dark:border-neutral-800">
            <dt className="text-neutral-500 dark:text-neutral-400">Spouse</dt>
            <dd className="font-medium">
              {family.spouseId ? (
                <Link href={`/billionaire/${family.spouseId}`} className="hover:underline">
                  {family.spouseName}
                </Link>
              ) : (
                family.spouseName
              )}
            </dd>
          </div>
        )}
        {family.formerSpouseName && (
          <div className="flex justify-between border-t border-neutral-200 py-2 dark:border-neutral-800">
            <dt className="text-neutral-500 dark:text-neutral-400">Former spouse</dt>
            <dd className="font-medium">
              {family.formerSpouseId ? (
                <Link href={`/billionaire/${family.formerSpouseId}`} className="text-brand hover:underline">
                  {family.formerSpouseName}
                </Link>
              ) : (
                family.formerSpouseName
              )}
            </dd>
          </div>
        )}
        {family.childrenCount !== undefined && (
          <div className="flex justify-between border-t border-neutral-200 py-2 dark:border-neutral-800">
            <dt className="text-neutral-500 dark:text-neutral-400">Children</dt>
            <dd className="font-medium">{family.childrenCount}</dd>
          </div>
        )}
        {family.note && (
          <p className="mt-3 border-t border-neutral-200 pt-3 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
            {family.note}
          </p>
        )}
      </dl>

      <p className="text-xs text-neutral-400">
        Curated from public reporting at a point in time, not a live feed —
        marital status in particular can change quickly.
      </p>

      <ProfileBreadcrumbJsonLd
        personName={person.name}
        personId={person.id}
        sectionLabel="Family"
        sectionSlug="family"
      />
    </ProfileSubpageLayout>
  );
}
