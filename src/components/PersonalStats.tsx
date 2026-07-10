import type { RankedBillionaire } from "@/lib/net-worth";
import type { PersonProfile } from "@/data/profiles";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-neutral-200 py-2 first:border-t-0 dark:border-neutral-800">
      <dt className="shrink-0 text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

export default function PersonalStats({
  person,
  profile,
}: {
  person: RankedBillionaire;
  profile?: PersonProfile;
}) {
  const wealthOrigin = profile?.wealthOrigin;
  const residence = profile?.residenceCity ?? person.country;
  const citizenship = profile?.citizenship ?? person.country;

  return (
    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Personal Stats
      </h2>
      <dl className="text-sm">
        <Row label="Source of Wealth" value={person.primarySource} />
        <Row label="Industry" value={person.industry} />
        {wealthOrigin && <Row label="Self-Made" value={wealthOrigin} />}
        <Row label="Age" value={String(person.age)} />
        <Row label="Residence" value={residence} />
        <Row label="Citizenship" value={citizenship} />
        {profile?.education && <Row label="Education" value={profile.education} />}
        {profile?.family?.maritalStatus && (
          <Row label="Marital Status" value={profile.family.maritalStatus} />
        )}
        {profile?.family?.childrenCount !== undefined && (
          <Row label="Children" value={String(profile.family.childrenCount)} />
        )}
      </dl>
    </div>
  );
}
