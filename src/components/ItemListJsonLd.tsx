import type { RankedBillionaire } from "@/lib/net-worth";
import { categoryLabel, type Category } from "@/lib/categories";
import { siteUrl } from "@/lib/site";

export default function ItemListJsonLd({
  category,
  people,
}: {
  category: Category;
  people: RankedBillionaire[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryLabel(category)}'s Billionaires — Real-Time Billionaires`,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: people.length,
    itemListElement: people.slice(0, 50).map((person) => ({
      "@type": "ListItem",
      position: person.rank,
      url: `${siteUrl()}/billionaire/${person.id}`,
      name: person.name,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
