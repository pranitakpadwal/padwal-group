import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { familyFromSlug, getFamilyView } from "@/lib/families";
import { getRelatedCoverage } from "@/lib/related-coverage";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeaderboardTable from "@/components/LeaderboardTable";
import FaqBlock from "@/components/FaqBlock";
import RelatedCoverage from "@/components/RelatedCoverage";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LiveWebPageJsonLd from "@/components/LiveWebPageJsonLd";

export const dynamic = "force-dynamic";

type RouteParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const family = familyFromSlug(slug);
  if (!family) {
    return { title: "Not found" };
  }
  const title = `${family.name} Net Worth — Combined Family Fortune, Live`;
  const description = `The combined real-time net worth of the ${family.name}: ${family.description}`;
  return {
    title,
    description,
    keywords: [`${family.name} net worth`, `${family.name} fortune`, `${family.name} billionaires`],
    alternates: { canonical: `${siteUrl()}/family/${family.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function FamilyPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const family = familyFromSlug(slug);
  if (!family) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const view = getFamilyView(leaderboard, family);
  if (view.people.length === 0) {
    notFound();
  }

  const total = view.people.reduce((sum, p) => sum + p.netWorthUsd, 0);
  const leader = view.people[0];

  const faqs = [
    {
      question: `What is the ${family.name}'s combined net worth?`,
      answer: `We track ${view.people.length} members of the ${family.name} with a combined estimated net worth of ${formatUsdCompact(total)}. This adds each tracked member's individual estimate — it isn't a single figure the family itself reports.`,
    },
    {
      question: `Who is the richest member of the ${family.name}?`,
      answer: `${leader.name} is the richest tracked member of the ${family.name}, with an estimated net worth of ${formatUsdCompact(leader.netWorthUsd)}.`,
    },
    {
      question: `Where does the ${family.name}'s fortune come from?`,
      answer: family.description,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${family.name} Net Worth`,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: view.people.length,
    itemListElement: view.people.map((p) => ({
      "@type": "ListItem",
      position: p.rank,
      url: `${siteUrl()}/billionaire/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Families", href: "/families" }, { label: family.name }]} />

        <div className="rounded-2xl border border-line bg-gradient-to-br from-brand-soft to-surface p-6 sm:p-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {family.name}
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">{family.description}</p>
          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-[--muted]">Combined Net Worth</div>
              <div className="font-display text-2xl font-semibold tabular-nums text-brand-dark">
                {formatUsdCompact(total)}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-[--muted]">Tracked Members</div>
              <div className="font-display text-2xl font-semibold tabular-nums text-foreground">
                {view.people.length}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-[--muted]">Richest Member</div>
              <div className="font-display text-2xl font-semibold text-foreground">{leader.name}</div>
            </div>
          </div>
        </div>

        <LeaderboardTable people={view.people} />

        <section className="rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed text-foreground/70 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            The tracked {family.name}
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {view.people.map((person) => (
              <li key={person.id} className="flex flex-wrap items-baseline justify-between gap-x-3 border-t border-line pt-2 first:border-t-0 first:pt-0">
                <Link href={`/billionaire/${person.id}`} className="font-medium text-foreground hover:text-brand hover:underline">
                  {person.name}
                </Link>
                <span className="text-xs text-[--muted]">
                  {formatUsdCompact(person.netWorthUsd)} &middot; {person.primarySource}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <FaqBlock faqs={faqs} />

        <RelatedCoverage links={getRelatedCoverage(view.people)} />

        <p className="text-xs text-[--muted]">
          Combined net worth simply adds each tracked member&apos;s
          individual estimate — it isn&apos;t a single shared figure the
          family reports. Figures are independent, directional estimates,
          not audited valuations.{" "}
          <Link href="/families" className="text-brand hover:underline">
            Browse billionaire families &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/family/${family.slug}`}
        name={family.name}
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
