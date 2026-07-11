"use client";

import { useState } from "react";
import Link from "next/link";
import { RICHEST_BY_YEAR, FIRST_RANKED_YEAR, richestInYear, type RichestOfYear } from "@/data/richest-by-year";
import { formatUsdCompact } from "@/lib/format";
import ShareBar from "@/components/ShareBar";

const LATEST_YEAR = RICHEST_BY_YEAR[RICHEST_BY_YEAR.length - 1].year;

function RichestCard({ label, entry }: { label: string; entry: RichestOfYear }) {
  const name = entry.personId ? (
    <Link href={`/billionaire/${entry.personId}`} className="hover:underline">
      {entry.name}
    </Link>
  ) : (
    entry.name
  );
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="text-xs uppercase tracking-wide text-[--muted]">{label}</div>
      <div className="mt-1 font-display text-xl font-semibold text-brand-dark">{name}</div>
      <div className="mt-1 text-sm text-foreground/70">
        {entry.source} · {entry.country}
        {entry.netWorthUsd ? ` · ${formatUsdCompact(entry.netWorthUsd)} that year` : ""}
      </div>
    </div>
  );
}

export default function BirthdayCalculator({
  todayName,
  todayPersonId,
  todayNetWorthUsd,
}: {
  todayName: string;
  todayPersonId: string;
  todayNetWorthUsd: number;
}) {
  const [birthYear, setBirthYear] = useState<number>(1990);

  const validYear = Number.isInteger(birthYear) && birthYear >= 1900 && birthYear <= LATEST_YEAR;
  const bornEntry = validYear ? richestInYear(birthYear) : undefined;
  const at18 = validYear ? richestInYear(birthYear + 18) : undefined;
  const at30 = validYear ? richestInYear(birthYear + 30) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-6 sm:max-w-sm">
        <label htmlFor="birth-year" className="text-sm font-medium text-foreground">
          Your birth year
        </label>
        <input
          id="birth-year"
          type="number"
          min={1900}
          max={LATEST_YEAR}
          value={birthYear}
          onChange={(event) => setBirthYear(Number(event.target.value))}
          className="rounded-lg border border-line bg-background px-3 py-2 text-lg tabular-nums text-foreground outline-none focus:border-brand"
        />
        {!validYear && (
          <p className="text-xs text-rose-500">Enter a year between 1900 and {LATEST_YEAR}.</p>
        )}
      </div>

      {validYear && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {bornEntry ? (
            <RichestCard label={`Richest person the year you were born (${birthYear})`} entry={bornEntry} />
          ) : (
            <div className="rounded-2xl border border-line bg-surface p-5">
              <div className="text-xs uppercase tracking-wide text-[--muted]">
                The year you were born ({birthYear})
              </div>
              <p className="mt-1 text-sm text-foreground/70">
                Global wealth rankings didn&apos;t exist yet — Forbes published
                its first World&apos;s Billionaires list in {FIRST_RANKED_YEAR},
                topped by Japanese rail-and-real-estate magnate Yoshiaki
                Tsutsumi.
              </p>
            </div>
          )}
          {at18 && <RichestCard label={`When you turned 18 (${birthYear + 18})`} entry={at18} />}
          {at30 && <RichestCard label={`When you turned 30 (${birthYear + 30})`} entry={at30} />}
          <div className="rounded-2xl border border-brand/40 bg-brand-soft/50 p-5">
            <div className="text-xs uppercase tracking-wide text-[--muted]">Right now</div>
            <div className="mt-1 font-display text-xl font-semibold text-brand-dark">
              <Link href={`/billionaire/${todayPersonId}`} className="hover:underline">
                {todayName}
              </Link>
            </div>
            <div className="mt-1 text-sm text-foreground/70">
              An estimated {formatUsdCompact(todayNetWorthUsd)} — live from public holdings.
            </div>
          </div>
        </div>
      )}

      {validYear && (
        <ShareBar
          text={
            bornEntry
              ? `The year I was born, ${bornEntry.name} was the richest person on Earth. Who topped the list when YOU were born? Find out:`
              : `I was born before the world even ranked its richest people (the first list was ${FIRST_RANKED_YEAR}). Who was #1 when you were born? Find out:`
          }
        />
      )}

      <p className="text-xs text-neutral-400">
        Historical #1s are from Forbes&apos; annual World&apos;s Billionaires
        list (published each spring since 1987); annual-list net worth figures
        shown where reliably documented. Today&apos;s figure is our own
        real-time estimate.
      </p>
    </div>
  );
}
