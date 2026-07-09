"use client";

import { useEffect, useRef, useState } from "react";
import type { Leaderboard as LeaderboardData } from "@/lib/net-worth";
import {
  formatClock,
  formatPercentChange,
  formatUsdChange,
  formatUsdCompact,
} from "@/lib/format";

const POLL_INTERVAL_MS = 20_000;

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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
    <div className="w-full max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-500 dark:text-neutral-400">
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

      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full border-collapse text-left">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">
                Source
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
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
                      {initials(person.name)}
                    </span>
                    <div>
                      <div className="font-medium">{person.name}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {person.country}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 sm:table-cell">
                  {person.primarySource}
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
