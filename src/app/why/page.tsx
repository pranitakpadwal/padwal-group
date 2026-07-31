import type { Metadata } from "next";
import Link from "next/link";
import { getLeaderboard, type RankedBillionaire } from "@/lib/net-worth";
import { moveHeadline } from "@/lib/explain-move";
import { siteUrl } from "@/lib/site";
import { todayDateString, formatDateLong } from "@/lib/dates";
import { formatUsdChange, formatUsdCompact } from "@/lib/format";
import PersonAvatar from "@/components/PersonAvatar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FaqBlock from "@/components/FaqBlock";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Why Did Billionaires Get Richer Today? — Live Daily Movers";
  const description =
    "A live, plain-English breakdown of why the world's billionaires gained or lost money today — which stock moved, by how much, and the dollar impact on each fortune.";
  return {
    title,
    description,
    keywords: [
      "why is elon musk richer today",
      "billionaire gainers today",
      "which billionaires lost money today",
      "why did billionaire net worth change today",
      "biggest billionaire movers today",
    ],
    alternates: { canonical: `${siteUrl()}/why` },
    openGraph: { title, description, type: "website" },
  };
}

function MoverRow({ person, isGain }: { person: RankedBillionaire; isGain: boolean }) {
  const headline = moveHeadline(person);
  return (
    <li className="flex items-start gap-3 py-4">
      <PersonAvatar name={person.name} photoUrl={person.photoUrl} size={40} />
      <div className="min-w-0 flex-1">
        <Link
          href={`/billionaire/${person.id}`}
          className="font-medium text-foreground hover:text-brand"
        >
          {person.name}
        </Link>
        <p className="mt-0.5 text-sm text-foreground/70">
          {headline}{" "}
          {/* ticker no longer links to /stock/[ticker] — that page is noindexed */}
          {person.ticker && <span className="text-foreground/60">{person.ticker}</span>}
        </p>
      </div>
      <div
        className={`shrink-0 text-right text-sm font-semibold tabular-nums ${
          isGain ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
        }`}
      >
        {formatUsdChange(person.dayChangeUsd)}
      </div>
    </li>
  );
}

export default async function WhyTodayPage() {
  const leaderboard = await getLeaderboard();
  const today = todayDateString();

  const movers = leaderboard.people.filter(
    (p) => p.ticker && p.dayChangeUsd !== 0 && p.stockChangePercent !== null,
  );
  const gainers = movers.filter((p) => p.dayChangeUsd > 0).sort((a, b) => b.dayChangeUsd - a.dayChangeUsd);
  const losers = movers.filter((p) => p.dayChangeUsd < 0).sort((a, b) => a.dayChangeUsd - b.dayChangeUsd);

  const totalAdded = gainers.reduce((s, p) => s + p.dayChangeUsd, 0);
  const totalLost = losers.reduce((s, p) => s + p.dayChangeUsd, 0);

  const faqs = [
    {
      question: "Why do billionaires get richer or poorer in a single day?",
      answer:
        "Most of a billionaire's fortune is held in publicly-traded company stock. When that stock's price rises or falls during the trading day, the value of their holdings — and therefore their net worth — moves with it, often by billions of dollars.",
    },
    {
      question: "How is the daily change in net worth calculated?",
      answer:
        "We take each person's estimated number of shares in their main public company and multiply the day's price move by that share count. That gives the dollar change to their public-equity wealth for the day.",
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <section className="rounded-2xl border border-line bg-gradient-to-br from-brand-soft to-surface p-6 sm:p-9">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Why Did Billionaires Get Richer Today?
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            A live breakdown of which fortunes moved today, which stock drove
            it, and the dollar impact — updated as markets move on{" "}
            <time dateTime={today}>{formatDateLong(today)}</time>.
          </p>
          {movers.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-line pt-5">
              <div>
                <dt className="text-xs uppercase tracking-wide text-[--muted]">Added Today</dt>
                <dd className="font-display text-2xl font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  {formatUsdCompact(totalAdded)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[--muted]">Wiped Out Today</dt>
                <dd className="font-display text-2xl font-semibold text-rose-600 tabular-nums dark:text-rose-400">
                  {formatUsdCompact(totalLost)}
                </dd>
              </div>
            </dl>
          )}
        </section>

        {movers.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-8 text-center text-sm text-[--muted]">
            No stock-driven moves to report right now — markets may be closed,
            or prices are flat. Check back while markets are open.
          </div>
        ) : (
          <>
            {gainers.length > 0 && (
              <section aria-labelledby="gainers-heading">
                <h2 id="gainers-heading" className="font-display text-2xl font-semibold text-foreground">
                  Who Got Richer Today
                </h2>
                <ul className="mt-2 divide-y divide-line rounded-2xl border border-line bg-surface px-5">
                  {gainers.map((person) => (
                    <MoverRow key={person.id} person={person} isGain />
                  ))}
                </ul>
              </section>
            )}

            {losers.length > 0 && (
              <section aria-labelledby="losers-heading">
                <h2 id="losers-heading" className="font-display text-2xl font-semibold text-foreground">
                  Who Got Poorer Today
                </h2>
                <ul className="mt-2 divide-y divide-line rounded-2xl border border-line bg-surface px-5">
                  {losers.map((person) => (
                    <MoverRow key={person.id} person={person} isGain={false} />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        <p className="text-sm text-[--muted]">
          Want the full ranked list?{" "}
          <Link href="/" className="text-brand hover:underline">
            See the real-time billionaires leaderboard
          </Link>{" "}
          or read{" "}
          <Link href={`/articles/${today}/world`} className="text-brand hover:underline">
            today&apos;s daily recap
          </Link>
          .
        </p>

        <FaqBlock faqs={faqs} />

        <p className="text-xs text-[--muted]">
          Explanations describe the mechanical driver (the underlying
          stock&apos;s move), not the news behind it. Figures are directional
          estimates from public holdings, not audited valuations.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
