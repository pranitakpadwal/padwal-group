import type { Faq } from "@/lib/article-template";
import { categoryArticleTitle, categoryLabel, type Category } from "@/lib/categories";
import { siteUrl } from "@/lib/site";
import { publisherJsonLd, SITE_NAME } from "@/lib/schema";

export default function ArticleJsonLd({
  date,
  category,
  title,
  summary,
  faqs,
  generatedAt,
}: {
  date: string;
  category: Category;
  title: string;
  summary: string;
  faqs: Faq[];
  generatedAt?: string;
}) {
  const url = `${siteUrl()}/articles/${date}/${category}`;
  const publishedAt = generatedAt ?? `${date}T23:59:00Z`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: summary,
    image: [`${siteUrl()}/opengraph-image`],
    datePublished: publishedAt,
    dateModified: publishedAt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl() },
    publisher: publisherJsonLd(),
    articleSection: "Daily Recaps",
    inLanguage: "en",
    isAccessibleForFree: true,
    keywords: `billionaires today, ${categoryArticleTitle(category)}, net worth ranking, ${date}`,
    about: categoryArticleTitle(category),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl(),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      { "@type": "ListItem", position: 2, name: "Daily Recaps", item: `${siteUrl()}/articles` },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryLabel(category),
        item: `${siteUrl()}/articles?category=${category}`,
      },
      { "@type": "ListItem", position: 4, name: title, item: url },
    ],
  };

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
    </>
  );
}
