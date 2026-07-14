import type { Metadata } from "next";
import Link from "next/link";
import { listUniversities } from "@/lib/universities";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billionaires by University — Harvard, Stanford & More",
  description:
    "Which universities produced the most billionaires we track? Browse alumni-founded fortunes by school, ranked live by net worth.",
  keywords: [
    "billionaires by university",
    "Harvard billionaires",
    "Stanford billionaires",
    "richest college dropouts",
  ],
  alternates: { canonical: `${siteUrl()}/universities` },
};

export default function UniversitiesIndex() {
  const universities = listUniversities();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Billionaires by University
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Where the world&apos;s richest people studied — or dropped out of —
            before building their fortunes.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {universities.map((u) => (
            <Link
              key={u.slug}
              href={`/university/${u.slug}`}
              className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-brand"
            >
              <span className="font-medium text-foreground">{u.university}</span>
              <span className="text-sm text-[--muted]">
                {u.personIds.length} {u.personIds.length === 1 ? "billionaire" : "billionaires"}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
