import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCalculatorArticle } from "@/lib/calculator-articles";
import { getRelatedCoverage } from "@/lib/related-coverage";
import { siteUrl, NOINDEX } from "@/lib/site";
import { publisherJsonLd, SITE_NAME } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareBar from "@/components/ShareBar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FaqBlock from "@/components/FaqBlock";
import RelatedCoverage from "@/components/RelatedCoverage";

export const dynamic = "force-dynamic";

type RouteParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getCalculatorArticle(slug);
  if (!article) {
    return { title: "Article not found" };
  }
  const url = `${siteUrl()}/calculators/articles/${slug}`;
  return {
    title: article.title,
    description: article.description,
    keywords: [article.eyebrow.toLowerCase(), "billionaire calculator", "wealth calculator article"],
    alternates: { canonical: url },
    robots: NOINDEX,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url,
      siteName: SITE_NAME,
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description },
  };
}

export default async function CalculatorArticlePage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const article = await getCalculatorArticle(slug);

  if (!article) {
    notFound();
  }

  const url = `${siteUrl()}/calculators/articles/${slug}`;
  const imagePath = `/calculators/articles/${slug}/opengraph-image`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [`${url}/opengraph-image`],
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl() },
    publisher: publisherJsonLd(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: "Calculators",
    inLanguage: "en",
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      { "@type": "ListItem", position: 2, name: "Calculators", item: `${siteUrl()}/calculators` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs
          crumbs={[
            { label: "Calculators", href: "/calculators" },
            { label: "Articles", href: "/calculators/articles" },
            { label: article.eyebrow },
          ]}
        />

        <header>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">{article.eyebrow}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {article.title}
          </h1>
        </header>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagePath}
          alt={article.title}
          width={1200}
          height={630}
          className="w-full rounded-2xl border border-line"
        />

        <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-foreground/85">
          {article.narrative.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <FaqBlock faqs={article.faqs} />

        {article.relatedPeople.length > 0 && (
          <RelatedCoverage links={getRelatedCoverage(article.relatedPeople)} />
        )}

        <section className="rounded-2xl border border-line bg-brand-soft/40 p-5 text-sm">
          <span className="text-foreground/70">Keep going: </span>
          <Link href={article.calculatorHref} className="font-medium text-brand hover:underline">
            Try the {article.calculatorLabel} calculator
          </Link>
          <span className="text-foreground/70"> · </span>
          <Link href="/calculators/articles" className="font-medium text-brand hover:underline">
            More calculator articles
          </Link>
          <span className="text-foreground/70"> · </span>
          <Link href="/" className="font-medium text-brand hover:underline">
            the live leaderboard
          </Link>
        </section>

        <ShareBar text={`${article.title}:`} />

        <p className="text-xs text-neutral-400">
          Figures are directional estimates from live public market data, not audited valuations, and this site is not affiliated with Forbes.
        </p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </div>
  );
}
