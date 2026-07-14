"use client";

import { useMemo, useState } from "react";
import type { HistoryPoint } from "@/lib/snapshots";
import { formatUsdCompact } from "@/lib/format";
import RaceChart from "@/components/RaceChart";
import ShareBar from "@/components/ShareBar";

export interface RacePerson {
  id: string;
  name: string;
  netWorthUsd: number;
  rank: number;
  primarySource: string;
}

const COLOR_A = "#0b6b4f";
const COLOR_B = "#c2410c";

export default function WealthRaceCalculator({
  roster,
  history,
}: {
  roster: RacePerson[];
  history: Record<string, HistoryPoint[]>;
}) {
  const [idA, setIdA] = useState(roster[0]?.id ?? "");
  const [idB, setIdB] = useState(roster[1]?.id ?? "");

  const personA = useMemo(() => roster.find((p) => p.id === idA), [roster, idA]);
  const personB = useMemo(() => roster.find((p) => p.id === idB), [roster, idB]);

  if (!personA || !personB) {
    return null;
  }

  const gap = Math.abs(personA.netWorthUsd - personB.netWorthUsd);
  const leader = personA.netWorthUsd >= personB.netWorthUsd ? personA : personB;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium" style={{ color: COLOR_A }}>
            Racer 1
          </span>
          <select
            value={idA}
            onChange={(event) => setIdA(event.target.value)}
            className="rounded-lg border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-brand"
          >
            {roster.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium" style={{ color: COLOR_B }}>
            Racer 2
          </span>
          <select
            value={idB}
            onChange={(event) => setIdB(event.target.value)}
            className="rounded-lg border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-brand"
          >
            {roster.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="text-xs uppercase tracking-wide" style={{ color: COLOR_A }}>
            {personA.name}
          </div>
          <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
            {formatUsdCompact(personA.netWorthUsd)}
          </div>
          <div className="text-xs text-[--muted]">
            #{personA.rank} in the world · {personA.primarySource}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="text-xs uppercase tracking-wide" style={{ color: COLOR_B }}>
            {personB.name}
          </div>
          <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
            {formatUsdCompact(personB.netWorthUsd)}
          </div>
          <div className="text-xs text-[--muted]">
            #{personB.rank} in the world · {personB.primarySource}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-brand/40 bg-brand-soft/50 p-5 text-center">
        <span className="font-display text-lg font-semibold text-brand-dark">{leader.name}</span>{" "}
        <span className="text-foreground/70">is ahead by</span>{" "}
        <span className="font-display text-lg font-semibold text-brand-dark">
          {formatUsdCompact(gap)}
        </span>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Net Worth Over Time</h2>
        <RaceChart
          seriesA={{ name: personA.name, color: COLOR_A, points: history[personA.id] ?? [] }}
          seriesB={{ name: personB.name, color: COLOR_B, points: history[personB.id] ?? [] }}
        />
      </div>

      <ShareBar
        text={`${leader.name} is currently ahead of ${leader === personA ? personB.name : personA.name} by ${formatUsdCompact(gap)} in the wealth race. Watch it live:`}
      />

      <p className="text-xs text-neutral-400">
        History builds up one snapshot per day, so the chart deepens over
        time. Net worth is our real-time estimate from public stock holdings
        plus a static estimate for private assets.
      </p>
    </div>
  );
}
