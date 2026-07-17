import type { Metadata } from "next";
import Link from "next/link";
import { getLeaderboard } from "@/lib/net-worth";
import { getCombinedRoster } from "@/lib/combined-roster";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import PersonAvatar from "@/components/PersonAvatar";
import FaqBlock from "@/components/FaqBlock";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LiveWebPageJsonLd from "@/components/LiveWebPageJsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Full Billionaires List — Live-Tracked & Researched Estimates",
  description:
    "Every billionaire we cover, ranked together: the live-tracked core (real-time net worth from public stock holdings) plus a wider tier of researched, sourced estimates.",
  keywords: [
    "full billionaires list",
    "all billionaires ranked",
    "billionaires list like forbes",
    "world's richest people list",
  ],
  alternates: { canonical: `${siteUrl()}/billionaire` },
};

export default async function BillionairesIndex() {
  const leaderboard = await getLeaderboard();
  const roster = getCombinedRoster(leaderboard);
  const liveCount = roster.filter((r) => r.isLive).length;
  const estimatedCount = roster.length - liveCount;

  const faqs = [
    {
      question: "How many billionaires does this site track?",
      answer: `We track ${roster.length} people on this page: ${liveCount} in our live-tracked core (real-time net worth from public stock holdings) and ${estimatedCount} in a wider, researched tier with sourced but static estimates.`,
    },
    {
      question: "What's the difference between \"Live\" and \"Est.\" on this list?",
      answer: `"Live" means we've verified that person's public shareholdings and price their net worth from the current share price, so it moves with the market. "Est." means we're citing a single named source's (Forbes' or Bloomberg's) already-published figure at a point in time — it doesn't update between our research passes.`,
    },
    {
      question: "How does this compare to Forbes' billionaires list?",
      answer:
        "Forbes tracks over 3,300 billionaires; we're building toward covering more of that list over time, starting with the live core and adding researched, sourced estimates for well-known names we haven't verified live holdings for yet. This is an independent project, not affiliated with Forbes or Bloomberg.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Full Billionaires List",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: roster.length,
    itemListElement: roster.map((entry) => ({
      "@type": "ListItem",
      position: entry.rank,
      url: `${siteUrl()}${entry.profileUrl}`,
      name: entry.name,
    })),
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Full List" }]} />

        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The Full Billionaires List
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            {roster.length} people, ranked together: {liveCount} tracked live from public
            stock holdings, plus {estimatedCount} more from researched, sourced
            estimates. We&apos;re growing this toward Forbes&apos; ~3,300 over time.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="border-b border-line bg-brand-soft/60 text-xs uppercase tracking-wide text-brand-dark">
              <tr>
                <th className="px-2 py-3 font-semibold sm:px-4">#</th>
                <th className="px-2 py-3 font-semibold sm:px-4">Name</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Source / Industry</th>
                <th className="px-2 py-3 text-right font-semibold sm:px-4">Net Worth</th>
                <th className="px-2 py-3 text-right font-semibold sm:px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {roster.map((entry) => (
                <tr key={entry.id} className="transition-colors hover:bg-brand-soft/40">
                  <td className="px-2 py-3 text-sm font-semibold text-[--muted] tabular-nums sm:px-4">
                    {entry.rank}
                  </td>
                  <td className="w-full px-2 py-3 sm:px-4">
                    <Link href={entry.profileUrl} className="group flex items-center gap-2 sm:gap-3">
                      <PersonAvatar name={entry.name} photoUrl={entry.photoUrl} size={36} />
                      <div>
                        <div className="font-medium leading-tight text-foreground group-hover:text-brand">
                          {entry.name}
                        </div>
                        <div className="text-xs text-[--muted]">{entry.country}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-foreground/70 md:table-cell">
                    {entry.primarySource}
                    <div className="text-xs text-[--muted]">{entry.industry}</div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-3 text-right text-sm font-semibold tabular-nums text-foreground sm:px-4">
                    {formatUsdCompact(entry.netWorthUsd)}
                  </td>
                  <td className="px-2 py-3 text-right sm:px-4">
                    {entry.isLive ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        Live
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                        Est.
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed text-foreground/70 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Two tiers, clearly labeled
          </h2>
          <p className="mt-4">
            <strong className="text-foreground">Live</strong> entries are our
            core roster: we&apos;ve verified each person&apos;s public
            shareholdings, so their net worth is recalculated from the
            current share price every time you load the page.{" "}
            <strong className="text-foreground">Est.</strong> entries are a
            wider tier we&apos;re building out — real, named billionaires
            whose public holdings we haven&apos;t verified in enough depth
            to price live yet, so we cite one dated, named source (Forbes or
            Bloomberg) instead. People move from Est. to Live as we research
            their actual holdings.
          </p>
        </section>

        <FaqBlock faqs={faqs} />

        <p className="text-xs text-neutral-400">
          Independent estimates only, not affiliated with Forbes or
          Bloomberg.{" "}
          <Link href="/" className="text-brand hover:underline">
            See the live World leaderboard &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/billionaire`}
        name="The Full Billionaires List"
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
