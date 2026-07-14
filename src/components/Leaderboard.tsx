"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Leaderboard as LeaderboardData } from "@/lib/net-worth";
import type { Category } from "@/lib/categories";
import {
  formatClock,
  formatPercentChange,
  formatUsdChange,
  formatUsdCompact,
} from "@/lib/format";
import PersonAvatar from "@/components/PersonAvatar";
import MoversStrip from "@/components/MoversStrip";

const POLL_INTERVAL_MS = 20_000;
const COLLAPSED_ROW_COUNT = 10;

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
  category,
}: {
  initialData: LeaderboardData;
  category: Category;
}) {
  const [data, setData] = useState<LeaderboardData>(initialData);
  const [showAll, setShowAll] = useState(false);
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
        const response = await fetch(`/api/billionaires?category=${category}`, {
          cache: "no-store",
        });
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
  }, [category]);

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
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

      {data.people.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface p-8 text-center text-sm text-[--muted]">
          No one in this tracker matches this list right now.
        </div>
      ) : (
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <table className="w-full table-auto border-collapse text-left">
          <thead className="border-b border-line bg-brand-soft/60 text-xs uppercase tracking-wide text-brand-dark">
            <tr>
              <th className="px-2 py-3 font-semibold sm:px-4">#</th>
              <th className="px-2 py-3 font-semibold sm:px-4">Name</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">Age</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">
                Source / Industry
              </th>
              <th className="px-2 py-3 text-right font-semibold sm:px-4">Net Worth</th>
              <th className="px-2 py-3 text-right font-semibold sm:px-4">Today</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.people.map((person, index) => (
              <tr
                key={person.id}
                className={`transition-colors hover:bg-brand-soft/40 ${
                  !showAll && index >= COLLAPSED_ROW_COUNT ? "hidden" : ""
                }`}
              >
                <td className="px-2 py-3 text-sm font-semibold text-[--muted] tabular-nums sm:px-4">
                  {person.rank}
                </td>
                <td className="w-full px-2 py-3 sm:px-4">
                  <Link
                    href={`/billionaire/${person.id}`}
                    className="group flex items-center gap-2 sm:gap-3"
                  >
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
                  {person.ticker && person.sharePrice !== null && (
                    <div className="text-xs text-[--muted]">
                      {person.ticker} @ {person.sharePrice.toFixed(2)} USD
                    </div>
                  )}
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
      )}

      {data.people.length > COLLAPSED_ROW_COUNT && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="self-center rounded-full border border-line bg-surface px-5 py-2 text-sm font-medium text-brand transition-colors hover:border-brand"
        >
          Show all {data.people.length} &rarr;
        </button>
      )}
    </div>
  );
}
