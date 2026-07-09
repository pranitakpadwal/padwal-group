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
      className="flex min-w-[180px] shrink-0 flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
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
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {topGainers.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Biggest Gainers Today
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {topGainers.map((person) => (
              <MoverCard key={person.id} person={person} isGainer />
            ))}
          </div>
        </div>
      )}
      {topLosers.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Biggest Losers Today
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {topLosers.map((person) => (
              <MoverCard key={person.id} person={person} isGainer={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
