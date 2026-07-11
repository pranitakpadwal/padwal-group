import Link from "next/link";
import type { RankedBillionaire } from "@/lib/net-worth";
import { formatPercentChange, formatUsdChange } from "@/lib/format";
import PersonAvatar from "@/components/PersonAvatar";

function MoverCard({ person, isGainer }: { person: RankedBillionaire; isGainer: boolean }) {
  const color = isGainer ? "text-emerald-500" : "text-rose-500";
  const arrow = isGainer ? "▲" : "▼";

  return (
    <Link
      href={`/billionaire/${person.id}`}
      className="flex min-w-[180px] shrink-0 flex-col gap-2 rounded-lg border border-line bg-surface p-3 transition-colors hover:border-brand"
    >
      <div className="flex items-center gap-2">
        <PersonAvatar name={person.name} photoUrl={person.photoUrl} size={28} />
        <span className="truncate text-sm font-medium">{person.name}</span>
      </div>
      <div className={`flex items-center gap-1 text-sm font-semibold tabular-nums ${color}`}>
        <span>{arrow}</span>
        <span>{formatUsdChange(person.dayChangeUsd)}</span>
        <span className="text-xs font-normal opacity-80">
          {formatPercentChange(person.dayChangePercent)}
        </span>
      </div>
    </Link>
  );
}

export default function MoversStrip({
  topGainers,
  topLosers,
}: {
  topGainers: RankedBillionaire[];
  topLosers: RankedBillionaire[];
}) {
  if (topGainers.length === 0 && topLosers.length === 0) {
    return null;
  }

  return (
    <section className="w-full rounded-2xl border border-line bg-brand-soft/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-dark">
          Today&apos;s Biggest Movers
        </h2>
        <Link href="/why" className="text-xs font-medium text-brand hover:underline">
          Why? &rarr;
        </Link>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {topGainers.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-500">
              Gainers
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {topGainers.map((person) => (
                <MoverCard key={person.id} person={person} isGainer />
              ))}
            </div>
          </div>
        )}
        {topLosers.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-500">
              Losers
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {topLosers.map((person) => (
                <MoverCard key={person.id} person={person} isGainer={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
