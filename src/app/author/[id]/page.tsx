import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthor } from "@/data/authors";
import { billionaires } from "@/data/billionaires";
import { personProfiles } from "@/data/profiles";
import { getLeaderboard } from "@/lib/net-worth";
import { netWorthUrl } from "@/lib/net-worth-explainer";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import { publisherJsonLd, SITE_NAME } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

type RouteParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const author = getAuthor(id);
  if (!author) {
    return { title: "Not found" };
  }
  return {
    title: `${author.name} — ${author.title} | ${SITE_NAME}`,
    description: author.bio,
    alternates: { canonical: `${siteUrl()}/author/${author.id}` },
  };
}

export default async function AuthorPage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const author = getAuthor(id);

  if (!author) {
    notFound();
  }

  const year = new Date().getFullYear();
  const leaderboard = await getLeaderboard();

  const bylined = billionaires
    .filter((person) => personProfiles[person.id]?.deepDiveAuthor === author.id)
    .map((person) => {
      const ranked = leaderboard.people.find((p) => p.id === person.id);
      return { person, ranked };
    })
    .sort((a, b) => (b.ranked?.netWorthUsd ?? 0) - (a.ranked?.netWorthUsd ?? 0));

  const url = `${siteUrl()}/author/${author.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.title,
      description: author.bio,
      url,
      worksFor: publisherJsonLd(),
    },
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Authors", href: "/author" }, { label: author.name }]} />

        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {author.name}
          </h1>
          <p className="mt-1 text-sm font-medium text-brand-dark">{author.title}</p>
          <p className="mt-3 max-w-2xl text-foreground/70">{author.bio}</p>
        </header>

        <section aria-labelledby="bylines-heading" className="flex flex-col gap-3">
          <h2 id="bylines-heading" className="text-lg font-bold text-foreground">
            {bylined.length > 0 ? `Net-Worth Deep Dives by ${author.name}` : "No bylined pieces yet"}
          </h2>
          {bylined.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {bylined.map(({ person, ranked }) => (
                <Link
                  key={person.id}
                  href={netWorthUrl(person.id, person.name, year)}
                  className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand"
                >
                  <span className="font-medium text-foreground">{person.name}&apos;s Net Worth Explained</span>
                  {ranked && (
                    <span className="text-xs text-[--muted]">
                      {formatUsdCompact(ranked.netWorthUsd)} &middot; #{ranked.rank} in the world
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/70">Check back soon.</p>
          )}
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
