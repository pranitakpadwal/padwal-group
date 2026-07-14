import type { HistoryPoint } from "@/lib/snapshots";

interface Series {
  name: string;
  color: string;
  points: HistoryPoint[];
}

/** Dual-line comparison chart, aligned on the dates both series share. */
export default function RaceChart({
  seriesA,
  seriesB,
  width = 640,
  height = 220,
}: {
  seriesA: Series;
  seriesB: Series;
  width?: number;
  height?: number;
}) {
  const datesA = new Map(seriesA.points.map((p) => [p.date, p.netWorthUsd]));
  const datesB = new Map(seriesB.points.map((p) => [p.date, p.netWorthUsd]));
  const commonDates = seriesA.points
    .map((p) => p.date)
    .filter((date) => datesB.has(date))
    .sort();

  if (commonDates.length < 2) {
    return (
      <p className="text-sm text-[--muted]">
        Not enough overlapping history yet to chart this pair — check back
        after a few more days of snapshots.
      </p>
    );
  }

  const values = commonDates.flatMap((date) => [datesA.get(date)!, datesB.get(date)!]);
  const min = Math.min(...values, 0);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 6;

  const toPoints = (dates: string[], series: Map<string, number>) =>
    dates
      .map((date, index) => {
        const value = series.get(date);
        if (value === undefined) return null;
        const x = (index / (dates.length - 1)) * (width - padding * 2) + padding;
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .filter((point): point is string => point !== null)
      .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Net worth comparison over time: ${seriesA.name} vs ${seriesB.name}`}
    >
      <polyline
        points={toPoints(commonDates, datesA)}
        fill="none"
        stroke={seriesA.color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline
        points={toPoints(commonDates, datesB)}
        fill="none"
        stroke={seriesB.color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
