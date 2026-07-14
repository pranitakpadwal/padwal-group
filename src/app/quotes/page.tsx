import type { Metadata } from "next";
import Link from "next/link";
import { listQuotePeopleIds, getPersonQuotes } from "@/data/quotes";
import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { ensureAndListQuoteOfDay } from "@/lib/quote-of-day";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import PersonAvatar from "@/components/PersonAvatar";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verified Billionaire Quotes — Real Words, Real Sources",
  description:
    "Quotes from the world's richest people that they actually said — every quote traced to a shareholder letter, filmed interview, or speech. No fakes, no misattributions.",
  keywords: [
    "warren buffett quotes",
    "elon musk quotes",
    "jeff bezos quotes",
    "billionaire quotes verified",
  ],
  alternates: { canonical: `${siteUrl()}/quotes` },
};

export default async function QuotesHub() {
  const [leaderboard, quoteOfDayHistory] = await Promise.all([
    getLeaderboard(),
    ensureAndListQuoteOfDay(1),
  ]);
  const today = quoteOfDayHistory[0];
  const people = listQuotePeopleIds()
    .map((id) => {
      const person = findBillionaireById(id);
      if (!person) return null;
      const ranked = leaderboard.people.find((p) => p.id === id);
      return {
        id,
        name: person.name,
        photoUrl: ranked?.photoUrl ?? null,
        netWorthUsd: ranked?.netWorthUsd ?? null,
        quoteCount: getPersonQuotes(id).length,
        sample: getPersonQuotes(id)[0]?.text ?? "",
      };
    })
    .filter((entry) => entry !== null)
    .sort((a, b) => (b.netWorthUsd ?? 0) - (a.netWorthUsd ?? 0));

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Quotes" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Billionaire Quotes, Verified
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            The internet is full of quotes billionaires never said. Every quote
            here is traced to a real source — a shareholder letter, a signed
            op-ed, a filmed interview, a commencement speech — and we show the
            source next to each one.
          </p>
        </header>

        {today && (
          <div className="flex flex-col gap-2 rounded-2xl border border-brand/40 bg-brand-soft/50 p-5">
            <Link href={`/quote-of-the-day/${today.slug}`} className="flex flex-col gap-2 hover:opacity-90">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
                Today&apos;s Quote of the Day &rarr;
              </span>
              <p className="italic text-foreground">
                &ldquo;{today.quoteText}&rdquo; — {today.personName}
              </p>
            </Link>
            <Link href="/quote-of-the-day" className="text-xs font-medium text-brand hover:underline">
              See past days &rarr;
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {people.map((entry) => (
            <Link
              key={entry.id}
              href={`/quotes/${entry.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
            >
              <div className="flex items-center gap-3">
                <PersonAvatar name={entry.name} photoUrl={entry.photoUrl} size={44} />
                <div>
                  <div className="font-display text-lg font-semibold text-foreground">
                    {entry.name}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {entry.quoteCount} verified quotes
                    {entry.netWorthUsd ? ` · ${formatUsdCompact(entry.netWorthUsd)}` : ""}
                  </div>
                </div>
              </div>
              <p className="text-sm italic text-foreground/70">&ldquo;{entry.sample}&rdquo;</p>
            </Link>
          ))}
        </div>

        <p className="text-xs text-neutral-400">
          A short page of real quotes beats a long page of fake ones. We add
          quotes only when we can name where they were said.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
