import { siteUrl } from "@/lib/site";

export default function ProfileBreadcrumbJsonLd({
  personName,
  personId,
  sectionLabel,
  sectionSlug,
}: {
  personName: string;
  personId: string;
  sectionLabel: string;
  sectionSlug: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      {
        "@type": "ListItem",
        position: 2,
        name: personName,
        item: `${siteUrl()}/billionaire/${personId}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: sectionLabel,
        item: `${siteUrl()}/billionaire/${personId}/${sectionSlug}`,
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
