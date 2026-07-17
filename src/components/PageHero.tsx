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
  coverageOverride,
}: {
  h1: string;
  lede: string;
  people: RankedBillionaire[];
  topGainer?: RankedBillionaire;
  /**
   * Use when "People Tracked", "Combined Wealth", and "#1 Richest" should
   * reflect more than this page's live roster (e.g. the homepage counting
   * the Estimated tier too). All three come from the same wider set so
   * they never drift out of sync with each other. "Top Mover Today" always
   * stays live-only — the Estimated tier has no daily change to report.
   */
  coverageOverride?: { peopleLabel: string; peopleValue: string; combinedWealthUsd: number; topRichestName: string };
}) {
  const totalWealth = coverageOverride?.combinedWealthUsd ?? people.reduce((sum, person) => sum + person.netWorthUsd, 0);
  const leaderName = coverageOverride?.topRichestName ?? people[0]?.name;

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand-soft to-surface p-6 sm:p-9">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {h1}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/70">{lede}</p>

      <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-line pt-5 sm:grid-cols-4">
        <Stat
          label={coverageOverride?.peopleLabel ?? "People Tracked"}
          value={coverageOverride?.peopleValue ?? String(people.length)}
        />
        <Stat label="Combined Wealth" value={formatUsdCompact(totalWealth)} />
        {leaderName && <Stat label="#1 Richest" value={leaderName} />}
        {topGainer && <Stat label="Top Mover Today" value={topGainer.name} />}
      </dl>
    </section>
  );
}
