import type { Metadata } from "next";
import Link from "next/link";
import { ensureAndListQuoteOfDay } from "@/lib/quote-of-day";
import { formatDateLong } from "@/lib/dates";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Motivational Quote of the Day — From the World's Richest People",
  description:
    "A fresh, verified quote every day from a billionaire — each traced to its real source, with a new one posted daily.",
  keywords: [
    "quote of the day",
    "motivational quote of the day",
    "billionaire quote of the day",
    "inspirational quote today",
  ],
  alternates: { canonical: `${siteUrl()}/quote-of-the-day` },
};

export default async function QuoteOfDayIndex() {
  const history = await ensureAndListQuoteOfDay(30);
  const today = history[0];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Quote of the Day" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Motivational Quote of the Day
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            A new quote every day, from a billionaire, always with the real
            source named. Fresh daily — check back tomorrow for the next one.
          </p>
        </header>

        {today && (
          <Link
            href={`/quote-of-the-day/${today.slug}`}
            className="flex flex-col gap-3 rounded-2xl border border-brand/40 bg-brand-soft/50 p-6 transition-colors hover:border-brand"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
              Today &middot; {formatDateLong(today.date)}
            </span>
            <blockquote className="font-display text-xl leading-snug text-foreground">
              &ldquo;{today.quoteText}&rdquo;
            </blockquote>
            <span className="text-sm text-foreground/70">
              — {today.personName}, {today.quoteSource}
            </span>
          </Link>
        )}

        {history.length > 1 && (
          <section aria-labelledby="past-quotes" className="flex flex-col gap-3">
            <h2 id="past-quotes" className="text-lg font-bold">
              Past Days
            </h2>
            <ul className="flex flex-col gap-3">
              {history.slice(1).map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/quote-of-the-day/${item.slug}`}
                    className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand"
                  >
                    <span className="text-xs text-[--muted]">{formatDateLong(item.date)}</span>
                    <span className="text-sm italic text-foreground/80">
                      &ldquo;{item.quoteText}&rdquo; — {item.personName}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-xs text-neutral-400">
          Every quote is traced to a real, named source — shareholder
          letters, signed op-eds, filmed interviews, speeches. See the{" "}
          <Link href="/quotes" className="text-brand hover:underline">
            full verified quotes hub
          </Link>{" "}
          for more from each person.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
