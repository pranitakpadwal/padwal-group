import Link from "next/link";
import type { RankedBillionaire } from "@/lib/net-worth";
import { formatPercentChange, formatUsdChange, formatUsdCompact } from "@/lib/format";
import PersonAvatar from "@/components/PersonAvatar";

function ChangeCell({ usd, percent }: { usd: number; percent: number }) {
  const isUp = usd > 0;
  const isDown = usd < 0;
  const color = isUp ? "text-emerald-600 dark:text-emerald-400" : isDown ? "text-rose-600 dark:text-rose-400" : "text-[--muted]";
  const arrow = isUp ? "▲" : isDown ? "▼" : "•";
  return (
    <div className={`flex flex-col items-end tabular-nums ${color}`}>
      <span className="text-sm font-medium">
        {arrow} {formatUsdChange(usd)}
      </span>
      <span className="text-xs opacity-80">{formatPercentChange(percent)}</span>
    </div>
  );
}

/** Server-rendered, non-polling leaderboard table used by country pages. */
export default function LeaderboardTable({ people }: { people: RankedBillionaire[] }) {
  if (people.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center text-sm text-[--muted]">
        No one in this tracker matches this list yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <table className="w-full table-auto border-collapse text-left">
        <thead className="border-b border-line bg-brand-soft/60 text-xs uppercase tracking-wide text-brand-dark">
          <tr>
            <th className="px-2 py-3 font-semibold sm:px-4">#</th>
            <th className="px-2 py-3 font-semibold sm:px-4">Name</th>
            <th className="hidden px-4 py-3 font-semibold sm:table-cell">Age</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">Source / Industry</th>
            <th className="px-2 py-3 text-right font-semibold sm:px-4">Net Worth</th>
            <th className="px-2 py-3 text-right font-semibold sm:px-4">Today</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {people.map((person) => (
            <tr key={person.id} className="transition-colors hover:bg-brand-soft/40">
              <td className="px-2 py-3 text-sm font-semibold text-[--muted] tabular-nums sm:px-4">
                {person.rank}
              </td>
              <td className="w-full px-2 py-3 sm:px-4">
                <Link href={`/billionaire/${person.id}`} className="group flex items-center gap-2 sm:gap-3">
                  <PersonAvatar name={person.name} photoUrl={person.photoUrl} size={36} />
                  <div>
                    <div className="font-medium leading-tight text-foreground group-hover:text-brand">
                      {person.name}
                    </div>
                    <div className="text-xs text-[--muted]">{person.country}</div>
                  </div>
                </Link>
              </td>
              <td className="hidden px-4 py-3 text-sm tabular-nums text-foreground/70 sm:table-cell">
                {person.age}
              </td>
              <td className="hidden px-4 py-3 text-sm text-foreground/70 md:table-cell">
                {person.primarySource}
                <div className="text-xs text-[--muted]">{person.industry}</div>
              </td>
              <td className="whitespace-nowrap px-2 py-3 text-right text-sm font-semibold tabular-nums text-foreground sm:px-4">
                {formatUsdCompact(person.netWorthUsd)}
              </td>
              <td className="px-2 py-3 text-right sm:px-4">
                <ChangeCell usd={person.dayChangeUsd} percent={person.dayChangePercent} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
