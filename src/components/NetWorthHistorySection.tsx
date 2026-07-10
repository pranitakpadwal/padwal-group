import type { HistoryPoint } from "@/lib/snapshots";
import { formatDateLong } from "@/lib/dates";
import { formatUsdCompact } from "@/lib/format";
import Sparkline from "@/components/Sparkline";

export default function NetWorthHistorySection({
  points,
  firstName,
}: {
  points: HistoryPoint[];
  firstName: string;
}) {
  if (points.length < 2) {
    return (
      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="mb-2 text-lg font-bold">
          Net Worth History
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          History builds up one snapshot per day. Once a couple of days have
          been recorded, {firstName}&apos;s net worth and rank over time will
          chart here.
        </p>
      </section>
    );
  }

  const recent = [...points].reverse().slice(0, 12);

  return (
    <section aria-labelledby="history-heading" className="flex flex-col gap-4">
      <h2 id="history-heading" className="text-lg font-bold">
        Net Worth History
      </h2>

      <Sparkline values={points.map((point) => point.netWorthUsd)} />

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full min-w-[360px] border-collapse text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium text-right">World Rank</th>
              <th className="px-4 py-2 font-medium text-right">Net Worth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {recent.map((point) => (
              <tr key={point.date}>
                <td className="px-4 py-2">
                  <time dateTime={point.date}>{formatDateLong(point.date)}</time>
                </td>
                <td className="px-4 py-2 text-right tabular-nums">#{point.rank}</td>
                <td className="px-4 py-2 text-right font-medium tabular-nums">
                  {formatUsdCompact(point.netWorthUsd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
