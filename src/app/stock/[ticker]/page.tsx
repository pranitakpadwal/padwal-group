import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { getTickerHolders } from "@/lib/holdings";
import { getStockSummary } from "@/lib/stock";
import { siteUrl } from "@/lib/site";
import {
  formatCompactNumber,
  formatPercentChange,
  formatUsdCompact,
} from "@/lib/format";
import PersonAvatar from "@/components/PersonAvatar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

type RouteParams = { ticker: string };

function normalizeTicker(raw: string): string {
  return decodeURIComponent(raw).toUpperCase();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { ticker: rawTicker } = await params;
  const ticker = normalizeTicker(rawTicker);
  const title = `Which Billionaires Own ${ticker}? — Real-Time Billionaires`;
  const description = `Tracked billionaires who hold ${ticker}, their estimated stakes, and the stock's live price and market value.`;
  return {
    title,
    description,
    keywords: [`who owns ${ticker}`, `${ticker} shareholders`, `${ticker} billionaire owners`, ticker],
    alternates: { canonical: `${siteUrl()}/stock/${ticker}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function StockPage({ params }: { params: Promise<RouteParams> }) {
  const { ticker: rawTicker } = await params;
  const ticker = normalizeTicker(rawTicker);

  const [leaderboard, summary] = await Promise.all([
    getLeaderboard(),
    getStockSummary(ticker),
  ]);

  const holders = getTickerHolders(leaderboard, ticker);

  if (holders.length === 0) {
    notFound();
  }

  const changePercent = summary?.changePercent ?? null;
  const changeColor =
    changePercent === null
      ? "text-neutral-400"
      : changePercent > 0
        ? "text-emerald-500"
        : changePercent < 0
          ? "text-rose-500"
          : "text-neutral-400";

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <nav className="text-sm text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &rsaquo; Stocks &rsaquo; {ticker}
        </nav>

        <header>
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
            Which Billionaires Own {ticker}?
          </h1>
          {summary?.name && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{summary.name}</p>
          )}
        </header>

        {summary && (summary.price !== null || summary.marketCap !== null) && (
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800 sm:grid-cols-3">
            {summary.price !== null && (
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Share Price
                </div>
                <div className="text-xl font-bold tabular-nums">
                  {summary.price.toFixed(2)} {summary.currency ?? ""}
                </div>
              </div>
            )}
            {changePercent !== null && (
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Today
                </div>
                <div className={`text-xl font-bold tabular-nums ${changeColor}`}>
                  {formatPercentChange(changePercent)}
                </div>
              </div>
            )}
            {summary.marketCap !== null && (
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Market Cap
                </div>
                <div className="text-xl font-bold tabular-nums">
                  {formatCompactNumber(summary.marketCap)} {summary.currency ?? ""}
                </div>
              </div>
            )}
          </div>
        )}

        <section aria-labelledby="holders-heading">
          <h2 id="holders-heading" className="mb-3 text-lg font-bold">
            Tracked Billionaire Holders
          </h2>
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {holders.map(({ person, valueUsd }) => (
              <li key={person.id} className="flex items-center justify-between gap-3 py-3">
                <Link href={`/billionaire/${person.id}`} className="flex items-center gap-3">
                  <PersonAvatar name={person.name} photoUrl={person.photoUrl} size={36} />
                  <span className="font-medium hover:underline">{person.name}</span>
                </Link>
                <span className="text-right text-sm tabular-nums">
                  {valueUsd !== null ? formatUsdCompact(valueUsd) : "—"}
                  <span className="block text-xs text-neutral-400">estimated stake</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-neutral-400">
          Share counts are manually curated estimates; stake values are those
          share counts multiplied by the live price. Directional estimates,
          not audited figures, and not affiliated with Forbes.
        </p>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
              { "@type": "ListItem", position: 2, name: `Who owns ${ticker}`, item: `${siteUrl()}/stock/${ticker}` },
            ],
          }),
        }}
      />
    </div>
  );
}
