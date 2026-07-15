import type { NotableAsset } from "@/data/profiles";

/**
 * Notable people who AREN'T billionaires — actors, athletes, musicians.
 * Deliberately a separate, smaller data model from billionaires.ts:
 *
 * - Net worth here is a STATIC, labeled ESTIMATE from public reporting
 *   (usually Celebrity Net Worth or similar), never a live figure — most
 *   of this wealth is career earnings, endorsements, and real estate,
 *   not public stock we can price minute-to-minute. Don't blur this
 *   with the live billionaire engine; the whole site's credibility rests
 *   on being honest about what's actually live vs. estimated.
 * - Same sourcing bar as everything else: a named source or it doesn't
 *   go in. Celebrity net worth figures online are notoriously copied
 *   from site to site — we cite one source and say so plainly.
 */

export interface Celebrity {
  id: string;
  name: string;
  profession: string;
  bio: string;
  netWorthUsd: number;
  netWorthSourceName: string;
  netWorthSourceUrl: string;
  /** The year/period the estimate reflects — these go stale fast. */
  netWorthAsOf: string;
  wikipediaTitle: string;
  notableAssets?: NotableAsset[];
}

export const celebrities: Record<string, Celebrity> = {
  "leonardo-dicaprio": {
    id: "leonardo-dicaprio",
    name: "Leonardo DiCaprio",
    profession: "Actor",
    bio: "Academy Award-winning actor known for Titanic, The Revenant, and The Wolf of Wall Street. A prominent environmental advocate, his car collection leans toward electric and hybrid vehicles rather than typical Hollywood supercars.",
    netWorthUsd: 300_000_000,
    netWorthSourceName: "Celebrity Net Worth",
    netWorthSourceUrl: "https://www.celebritynetworth.com/richest-celebrities/actors/leonardo-dicaprio-net-worth/",
    netWorthAsOf: "2026",
    wikipediaTitle: "Leonardo_DiCaprio",
    notableAssets: [
      {
        category: "vehicle",
        name: "Fisker Karma",
        description: "Reported to be the first customer to take delivery of the all-electric Fisker Karma; later became a paid brand ambassador for Fisker.",
        sourceName: "The Cheat Sheet",
        sourceUrl: "https://www.cheatsheet.com/news/leonardo-dicaprio-has-a-simple-but-eco-friendly-car-collection.html/",
      },
      {
        category: "vehicle",
        name: "Range Rover SV Autobiography",
        description: "Reportedly the most expensive vehicle in his collection, at around $215,000 — notably less flashy than the supercars typical of his A-list peers.",
        sourceName: "The Richest",
        sourceUrl: "https://www.therichest.com/luxury/a-peek-inside-hollywood-superstar-leonardo-dicaprios-1-million-car-collection/",
      },
    ],
  },
};

export function getCelebrity(id: string): Celebrity | undefined {
  return celebrities[id];
}

export function listCelebrities(): Celebrity[] {
  return Object.values(celebrities);
}
