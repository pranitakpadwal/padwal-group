import { getPersonProfile } from "@/data/profiles";
import { getPersonQuotes } from "@/data/quotes";
import { listNews } from "@/lib/news";
import { netWorthUrl } from "@/lib/net-worth-explainer";

export interface CoverageLink {
  href: string;
  label: string;
}

/** Minimal shape needed to build coverage links — accepts a full RankedBillionaire or just {id, name}. */
export interface CoveragePerson {
  id: string;
  name: string;
}

/**
 * Real, working links into a person's other content on the site — their
 * net-worth explainer, career story, verified quotes, and any news
 * articles about them. Used to give grouping pages (city/university/
 * industry/family/country/region) and daily recap articles genuine
 * substance beyond a leaderboard table or data widget.
 */
export function getRelatedCoverage(people: CoveragePerson[], limitPerPerson = 3): CoverageLink[] {
  const year = new Date().getFullYear();
  const links: CoverageLink[] = [];

  for (const person of people) {
    const profile = getPersonProfile(person.id);
    const perPerson: CoverageLink[] = [
      { href: netWorthUrl(person.id, person.name, year), label: `${person.name}'s net worth explained` },
    ];

    if (profile?.careerTimeline && profile.careerTimeline.length > 0) {
      perPerson.push({ href: `/story/${person.id}`, label: `How ${person.name} built the fortune` });
    }
    if (getPersonQuotes(person.id).length > 0) {
      perPerson.push({ href: `/quotes/${person.id}`, label: `${person.name}'s verified quotes` });
    }
    for (const article of listNews({ personId: person.id, limit: 2 })) {
      perPerson.push({ href: `/news/${article.slug}`, label: article.title });
    }

    links.push(...perPerson.slice(0, limitPerPerson));
  }

  return links;
}
