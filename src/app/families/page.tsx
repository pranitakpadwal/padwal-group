import type { Metadata } from "next";
import Link from "next/link";
import { listFamilies } from "@/lib/families";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billionaire Families — Combined Family Fortunes",
  description:
    "Family fortunes where we track multiple members — the Waltons, the Sawiris brothers, and more — with combined net worth, ranked live.",
  keywords: [
    "billionaire families",
    "Walton family net worth",
    "richest families in the world",
  ],
  alternates: { canonical: `${siteUrl()}/families` },
};

export default function FamiliesIndex() {
  const families = listFamilies();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Billionaire Families
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Families where we track two or more members. This list is short
            on purpose — we only group people who are genuinely related and
            genuinely in our roster, so it grows as we add more family
            members.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {families.map((f) => (
            <Link
              key={f.slug}
              href={`/family/${f.slug}`}
              className="flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
            >
              <span className="font-display text-lg font-semibold text-foreground">{f.name}</span>
              <span className="text-sm text-foreground/70">{f.description}</span>
              <span className="mt-1 text-xs text-[--muted]">
                {f.personIds.length} tracked members
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
