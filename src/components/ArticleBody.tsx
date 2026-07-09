import Link from "next/link";
import type { ArticleFacts, MoverFact, RankJumpFact } from "@/lib/article-facts";
import { formatPercentChange, formatUsdChange, formatUsdCompact } from "@/lib/format";

function MoverRow({ mover }: { mover: MoverFact }) {
  const isUp = mover.deltaUsd > 0;
  return (
    <li className="flex items-center justify-between gap-3 py-2">
      <Link href={`/billionaire/${mover.id}`} className="hover:underline">
        {mover.name}
      </Link>
      <span className={`tabular-nums ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
        {formatUsdChange(mover.deltaUsd)} ({formatPercentChange(mover.deltaPercent)})
      </span>
    </li>
  );
}

function RankJumpRow({ jump }: { jump: RankJumpFact }) {
  const isUp = jump.rankDelta > 0;
  return (
    <li className="flex items-center justify-between gap-3 py-2">
      <Link href={`/billionaire/${jump.id}`} className="hover:underline">
        {jump.name}
      </Link>
      <span className={`tabular-nums ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
        #{jump.fromRank} &rarr; #{jump.toRank}
      </span>
    </li>
  );
}

export default function ArticleBody({ facts }: { facts: ArticleFacts }) {
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="top-ranked-heading">
        <h2 id="top-ranked-heading" className="mb-3 text-lg font-bold">
          Top {facts.topByNetWorth.length}
        </h2>
        <ol className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {facts.topByNetWorth.map((person) => (
            <li key={person.id} className="flex items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-3">
                <span className="w-6 text-sm text-neutral-500 tabular-nums">{person.rank}</span>
                <Link href={`/billionaire/${person.id}`} className="hover:underline">
                  {person.name}
                </Link>
              </span>
              <span className="tabular-nums font-medium">
                {formatUsdCompact(person.netWorthUsd)}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {facts.hasComparison ? (
        <>
          {facts.gainers.length > 0 && (
            <section aria-labelledby="gainers-heading">
              <h2 id="gainers-heading" className="mb-3 text-lg font-bold">
                Biggest Gainers
              </h2>
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {facts.gainers.map((mover) => (
                  <MoverRow key={mover.id} mover={mover} />
                ))}
              </ul>
            </section>
          )}

          {facts.losers.length > 0 && (
            <section aria-labelledby="losers-heading">
              <h2 id="losers-heading" className="mb-3 text-lg font-bold">
                Biggest Losers
              </h2>
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {facts.losers.map((mover) => (
                  <MoverRow key={mover.id} mover={mover} />
                ))}
              </ul>
            </section>
          )}

          {(facts.risers.length > 0 || facts.fallers.length > 0) && (
            <section aria-labelledby="rank-moves-heading">
              <h2 id="rank-moves-heading" className="mb-3 text-lg font-bold">
                Rank Moves
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {facts.risers.length > 0 && (
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Climbed
                    </h3>
                    <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {facts.risers.map((jump) => (
                        <RankJumpRow key={jump.id} jump={jump} />
                      ))}
                    </ul>
                  </div>
                )}
                {facts.fallers.length > 0 && (
                  <div>
                    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Slipped
                    </h3>
                    <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {facts.fallers.map((jump) => (
                        <RankJumpRow key={jump.id} jump={jump} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No prior-day snapshot was available yet, so day-over-day gainers,
          losers, and rank moves aren&apos;t shown for this date.
        </p>
      )}
    </div>
  );
}
