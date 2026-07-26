import type { Metadata } from "next";
import Link from "next/link";
import { listAuthors } from "@/data/authors";
import { siteUrl } from "@/lib/site";
import { SITE_NAME } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: `Our Writers — ${SITE_NAME}`,
  description: `The people behind ${SITE_NAME}'s net-worth deep dives, and how automated coverage is labeled.`,
  alternates: { canonical: `${siteUrl()}/author` },
};

export default function AuthorIndex() {
  const authors = listAuthors();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Authors" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Our Writers
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Individually researched net-worth deep dives are bylined to the
            person who wrote them. Daily, data-driven recaps are labeled
            &quot;News Desk&quot; instead — compiled automatically from live
            market data, not written by a person, and we&apos;d rather say so
            than fake a byline.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/author/${author.id}`}
              className="flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
            >
              <span className="font-display text-lg font-semibold text-foreground">{author.name}</span>
              <span className="text-xs font-medium text-brand-dark">{author.title}</span>
              <span className="mt-1 text-sm text-foreground/70">{author.bio}</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
