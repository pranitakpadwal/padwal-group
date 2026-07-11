import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FaqBlock from "@/components/FaqBlock";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Methodology & Data Sources — How We Estimate Billionaire Net Worth",
  description:
    "How RealTimeBillionaire estimates net worth in real time: our data sources, how live and private wealth are valued, update frequency, accuracy limits, and how we differ from Forbes and Bloomberg.",
  keywords: [
    "how is billionaire net worth calculated",
    "real time billionaires methodology",
    "billionaire net worth data sources",
    "how accurate are billionaire net worth estimates",
  ],
  alternates: { canonical: `${siteUrl()}/about` },
};

const FAQS = [
  {
    question: "How accurate are these net worth figures?",
    answer:
      "They are directional estimates, not audited figures. The live, publicly-traded portion is quite precise minute-to-minute, but our estimate of how many shares a person holds, and our valuation of their private assets, are approximations. Expect our numbers to differ from Forbes or Bloomberg — sometimes by billions — because everyone uses different share-count and private-asset assumptions.",
  },
  {
    question: "Why is your number different from Forbes or Bloomberg?",
    answer:
      "Three reasons: (1) we estimate share counts independently from public reporting, and ours may differ; (2) private assets (companies, cash, real estate) have no market price, so every source values them differently; and (3) timing — we update continuously, so we may be capturing a different moment in the market than a once-a-day index.",
  },
  {
    question: "Are you affiliated with Forbes or Bloomberg?",
    answer:
      "No. RealTimeBillionaire is an independent project and is not affiliated with, endorsed by, or connected to Forbes, Bloomberg, or any official rich list.",
  },
  {
    question: "How often do the numbers update?",
    answer:
      "The publicly-traded portion refreshes continuously while the relevant stock markets are open (prices are typically delayed about 15 minutes). Private-asset estimates and share counts are reviewed and updated manually on a periodic basis.",
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/75">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Methodology &amp; Data Sources
          </h1>
          <p className="mt-2 text-foreground/70">
            How we estimate net worth in real time, where the data comes from,
            and — just as importantly — what these numbers are not.
          </p>
        </header>

        <Section title="How we calculate net worth">
          <p>
            For each person, we split their wealth into two parts. The first is
            their stake in <strong>publicly-traded companies</strong>. We
            estimate how many shares they hold from public filings and
            reporting, multiply by the live market price, and convert to US
            dollars using current exchange rates. This part updates
            continuously while markets are open — it is what makes the list
            &ldquo;real-time.&rdquo;
          </p>
          <p>
            The second part is <strong>everything else</strong>: private
            companies, cash, real estate, art, and other holdings that have no
            live market price. For these we use a single static estimate that we
            update manually. It does not move minute-to-minute.
          </p>
          <p>
            A person&apos;s total is simply the sum of the two. Where someone&apos;s
            fortune is almost entirely private, the whole figure is a static
            estimate and won&apos;t tick during the day.
          </p>
        </Section>

        <Section title="Where the data comes from">
          <ul className="ml-4 flex list-disc flex-col gap-2">
            <li>
              <strong>Live share prices &amp; exchange rates:</strong> Yahoo
              Finance, refreshed continuously (typically ~15-minute delayed).
            </li>
            <li>
              <strong>Share counts &amp; company links:</strong> curated by hand
              from public sources such as SEC filings, exchange disclosures, and
              major news reporting.
            </li>
            <li>
              <strong>Biographies &amp; photos:</strong> Wikipedia and its public
              API, where available.
            </li>
            <li>
              <strong>Private-asset estimates:</strong> our own manual estimates,
              informed by public reporting.
            </li>
          </ul>
        </Section>

        <Section title="What these numbers are not">
          <p>
            These are <strong>directional estimates for information only</strong>
            , not audited valuations or investment advice. We will frequently
            differ from Forbes and Bloomberg because share-count and
            private-asset assumptions vary between every source. The live-equity
            portion is precise; the estimated-holdings and private-asset portions
            are approximations and can be off.
          </p>
          <p>
            We review the roster and its figures on an ongoing basis and correct
            errors as we find them. If a number looks wrong, it may simply be due
            for a review — the underlying share counts and private-asset
            estimates are the parts most likely to drift over time.
          </p>
        </Section>

        <FaqBlock faqs={FAQS} />

        <p className="text-sm text-[--muted]">
          Back to the{" "}
          <Link href="/" className="text-brand hover:underline">
            real-time billionaires list
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
