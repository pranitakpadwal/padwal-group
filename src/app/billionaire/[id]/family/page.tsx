import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NOINDEX } from "@/lib/site";
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
    robots: NOINDEX,
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
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {person.name}&apos;s Family
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          We deliberately keep this to marital status and number of
          children — never names, ages, or other details about children,
          out of respect for their privacy and safety.
        </p>
      </div>

      <dl className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex justify-between py-2">
          <dt className="text-[--muted]">Marital status</dt>
          <dd className="font-medium text-foreground">{family.maritalStatus}</dd>
        </div>
        {family.spouseName && (
          <div className="flex justify-between border-t border-line py-2">
            <dt className="text-[--muted]">Spouse</dt>
            <dd className="font-medium text-foreground">
              {family.spouseId ? (
                <Link href={`/billionaire/${family.spouseId}`} className="text-brand hover:underline">
                  {family.spouseName}
                </Link>
              ) : (
                family.spouseName
              )}
            </dd>
          </div>
        )}
        {family.formerSpouseName && (
          <div className="flex justify-between border-t border-line py-2">
            <dt className="text-[--muted]">Former spouse</dt>
            <dd className="font-medium text-foreground">
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
          <div className="flex justify-between border-t border-line py-2">
            <dt className="text-[--muted]">Children</dt>
            <dd className="font-medium text-foreground">{family.childrenCount}</dd>
          </div>
        )}
        {family.note && (
          <p className="mt-3 border-t border-line pt-3 text-sm text-foreground/70">
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
