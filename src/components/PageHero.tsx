import type { RankedBillionaire } from "@/lib/net-worth";
import { formatUsdCompact } from "@/lib/format";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs uppercase tracking-wide text-[--muted]">{label}</dt>
      <dd className="font-display text-xl font-semibold text-foreground tabular-nums sm:text-2xl">
        {value}
      </dd>
    </div>
  );
}

export default function PageHero({
  h1,
  lede,
  people,
  topGainer,
  peopleTrackedOverride,
}: {
  h1: string;
  lede: string;
  people: RankedBillionaire[];
  topGainer?: RankedBillionaire;
  /** Use when "People Tracked" should reflect more than this page's live roster (e.g. homepage counting the Estimated tier too). */
  peopleTrackedOverride?: { label: string; value: string };
}) {
  const totalWealth = people.reduce((sum, person) => sum + person.netWorthUsd, 0);
  const leader = people[0];

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand-soft to-surface p-6 sm:p-9">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {h1}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/70">{lede}</p>

      <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-line pt-5 sm:grid-cols-4">
        <Stat
          label={peopleTrackedOverride?.label ?? "People Tracked"}
          value={peopleTrackedOverride?.value ?? String(people.length)}
        />
        <Stat label="Combined Wealth" value={formatUsdCompact(totalWealth)} />
        {leader && <Stat label="#1 Richest" value={leader.name} />}
        {topGainer && <Stat label="Top Mover Today" value={topGainer.name} />}
      </dl>
    </section>
  );
}
