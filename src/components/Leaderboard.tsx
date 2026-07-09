"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Leaderboard as LeaderboardData } from "@/lib/net-worth";
import {
  formatClock,
  formatPercentChange,
  formatUsdChange,
  formatUsdCompact,
} from "@/lib/format";
import PersonAvatar from "@/components/PersonAvatar";
import MoversStrip from "@/components/MoversStrip";

const POLL_INTERVAL_MS = 20_000;

function ChangeCell({ usd, percent }: { usd: number; percent: number }) {
  const isUp = usd > 0;
  const isDown = usd < 0;
  const color = isUp
    ? "text-emerald-500"
    : isDown
      ? "text-rose-500"
      : "text-neutral-400";
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

export default function Leaderboard({
  initialData,
}: {
  initialData: LeaderboardData;
}) {
  const [data, setData] = useState<LeaderboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [secondsToNextRefresh, setSecondsToNextRefresh] = useState(
    POLL_INTERVAL_MS / 1000,
  );
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      setIsRefreshing(true);
      try {
        const response = await fetch("/api/billionaires", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const next: LeaderboardData = await response.json();
        if (!cancelled) {
          setData(next);
          setFetchError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setFetchError(error instanceof Error ? error.message : String(error));
        }
      } finally {
        if (!cancelled) {
          setIsRefreshing(false);
          setSecondsToNextRefresh(POLL_INTERVAL_MS / 1000);
        }
      }
    }

    const pollTimer = setInterval(refresh, POLL_INTERVAL_MS);
    const countdownTimer = setInterval(() => {
      setSecondsToNextRefresh((seconds) => (seconds > 1 ? seconds - 1 : 0));
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(pollTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isRefreshing ? "bg-amber-400 animate-pulse" : "bg-emerald-500"
            }`}
          />
          <span>
            Last updated {formatClock(data.asOf)} &middot; next refresh in{" "}
            {secondsToNextRefresh}s
          </span>
        </div>
        {(data.stale || fetchError) && (
          <span className="text-amber-500">
            {data.warning ?? fetchError ?? "Showing last known data."}
          </span>
        )}
      </div>

      <MoversStrip topGainers={data.topGainers} topLosers={data.topLosers} />

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">
                Source / Industry
              </th>
              <th className="px-4 py-3 font-medium text-right">Net Worth</th>
              <th className="px-4 py-3 font-medium text-right">Today</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {data.people.map((person) => (
              <tr
                key={person.id}
                className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
              >
                <td className="px-4 py-3 text-sm font-semibold text-neutral-500 tabular-nums">
                  {person.rank}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/billionaire/${person.id}`}
                    className="flex items-center gap-3"
                  >
                    <PersonAvatar name={person.name} photoUrl={person.photoUrl} size={36} />
                    <div>
                      <div className="font-medium hover:underline">{person.name}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {person.country}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm tabular-nums text-neutral-600 dark:text-neutral-300">
                  {person.age}
                </td>
                <td className="hidden px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 sm:table-cell">
                  {person.primarySource}
                  <div className="text-xs text-neutral-400">{person.industry}</div>
                  {person.sharePrice !== null && (
                    <div className="text-xs text-neutral-400">
                      {person.ticker} @ {person.sharePrice.toFixed(2)}{" "}
                      {person.currency ?? ""}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums">
                  {formatUsdCompact(person.netWorthUsd)}
                </td>
                <td className="px-4 py-3 text-right">
                  <ChangeCell usd={person.dayChangeUsd} percent={person.dayChangePercent} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
