/**
 * Deeper, curated profile content: business ventures beyond the primary
 * ticker, well-documented notable assets, and minimal family facts.
 *
 * Deliberate boundaries, on purpose:
 * - Every fact here should be widely and credibly reported (major outlets,
 *   Wikipedia), not a single tabloid rumor. Each entry carries a source.
 * - Family info is capped at marital status + number of children. No
 *   children's names, ages, or schools, ever — these are some of the
 *   most targetable people alive, and that's a real safety line, not
 *   just a style choice.
 * - Home locations are kept at city/region level, not street addresses,
 *   even where more specific info is publicly reported elsewhere.
 * - This is a point-in-time snapshot, manually curated — not a live feed.
 *   Expect it to go stale; recheck sources periodically.
 *
 * Only people with genuinely well-documented public lives are listed
 * here — most of the roster in billionaires.ts intentionally has no
 * entry, and their profile pages simply won't show these sections.
 */

export interface Venture {
  name: string;
  role: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
}

export interface NotableAsset {
  category: "residence" | "vehicle" | "yacht" | "jet" | "other";
  name: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
}

export interface FamilyInfo {
  maritalStatus: string;
  spouseName?: string;
  childrenCount?: number;
  note?: string;
}

export interface PersonProfile {
  ventures?: Venture[];
  notableAssets?: NotableAsset[];
  family?: FamilyInfo;
}

export const personProfiles: Record<string, PersonProfile> = {
  "elon-musk": {
    ventures: [
      {
        name: "SpaceX",
        role: "Founder & CEO",
        description: "Rocket and satellite company; also operates the Starlink satellite internet network.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/SpaceX",
      },
      {
        name: "The Boring Company",
        role: "Founder",
        description: "Tunnel construction and infrastructure company.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/The_Boring_Company",
      },
      {
        name: "Neuralink",
        role: "Founder",
        description: "Brain-computer interface company.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/Neuralink",
      },
      {
        name: "xAI",
        role: "Founder",
        description: "AI company behind the Grok chatbot.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/XAI_(company)",
      },
      {
        name: "X (formerly Twitter)",
        role: "Owner",
        description: "Social media platform, acquired in 2022.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/Acquisition_of_Twitter_by_Elon_Musk",
      },
    ],
    notableAssets: [
      {
        category: "jet",
        name: "Gulfstream G650ER",
        description: "Long-range private jet, one of several aircraft he's reported to use.",
        sourceName: "SuperYacht Fan",
        sourceUrl: "https://www.superyachtfan.com/private-jet/owner/elon-musk/",
      },
      {
        category: "residence",
        name: "Bel Air, California home",
        description: "Purchased in 2013; notable partly because Musk has otherwise sold off most of his real estate and says he doesn't own a yacht.",
        sourceName: "SuperYacht Fan",
        sourceUrl: "https://www.superyachtfan.com/private-jet/owner/elon-musk/",
      },
    ],
    family: {
      maritalStatus: "Not currently married",
      note: "Has multiple children with more than one partner; the exact count is widely reported but continues to evolve, including active paternity proceedings — we don't try to pin an exact number.",
    },
  },

  "jeff-bezos": {
    ventures: [
      {
        name: "Blue Origin",
        role: "Founder",
        description: "Aerospace and spaceflight company.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/Blue_Origin",
      },
      {
        name: "The Washington Post",
        role: "Owner",
        description: "Acquired the newspaper in 2013.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/The_Washington_Post",
      },
    ],
    notableAssets: [
      {
        category: "yacht",
        name: "Koru",
        description: "417-foot sailing yacht, reportedly the world's tallest; built 2021 and reported to be for sale as of 2026.",
        sourceName: "Luxurylaunches",
        sourceUrl: "https://luxurylaunches.com/transport/jeff-bezos-selling-koru-05052026.php",
      },
      {
        category: "residence",
        name: "Miami, Florida properties",
        description: "Several properties on Miami's Indian Creek Island, reported at roughly $234M combined; relocated his primary residence there from Washington, D.C.",
        sourceName: "Hello! Magazine",
        sourceUrl: "https://www.hellomagazine.com/homes/502898/jeff-bezos-superyacht-koru-photos/",
      },
    ],
    family: {
      maritalStatus: "Married",
      spouseName: "Lauren Sánchez",
      childrenCount: 4,
      note: "The 4 children are from his prior marriage to MacKenzie Scott.",
    },
  },

  "mukesh-ambani": {
    ventures: [
      {
        name: "Jio",
        role: "Founder (via Reliance)",
        description: "Telecom network that reshaped India's mobile internet market.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/Jio",
      },
      {
        name: "Reliance Retail",
        role: "Chairman (via Reliance)",
        description: "India's largest retailer by revenue.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/Reliance_Retail",
      },
    ],
    notableAssets: [
      {
        category: "residence",
        name: "Antilia",
        description: "27-story family residence in Mumbai, reported to have cost roughly $2B to build and valued near $4.6B; includes a reported 168-car garage.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/Antilia_(building)",
      },
      {
        category: "other",
        name: "Mandarin Oriental, New York (stake)",
        description: "Acquired a majority stake in the hotel, reported at roughly $98M.",
        sourceName: "Luxurylaunches",
        sourceUrl: "https://luxurylaunches.com/real_estate/mukesh-ambani-properties-11232024.php",
      },
    ],
    family: {
      maritalStatus: "Married",
      spouseName: "Nita Ambani",
      childrenCount: 3,
    },
  },

  "bernard-arnault": {
    ventures: [
      {
        name: "Fondation Louis Vuitton",
        role: "Founder",
        description: "Art museum and foundation in Paris housing his largely-undisclosed art collection, designed by Frank Gehry.",
        sourceName: "Fondation Louis Vuitton",
        sourceUrl: "https://www.fondationlouisvuitton.fr/en/fondation",
      },
    ],
    notableAssets: [
      {
        category: "other",
        name: "Contemporary art collection",
        description: "A large, largely private collection displayed in part at the Fondation Louis Vuitton since 2014.",
        sourceName: "The Art Newspaper",
        sourceUrl: "https://www.theartnewspaper.com/2006/11/01/bernard-arnault-luxury-goods-billionaire-to-show-his-art-in-new-private-foundation-in-paris",
      },
    ],
    family: {
      maritalStatus: "Married",
      childrenCount: 5,
      note: "Several of his children hold senior executive roles within LVMH's portfolio of brands.",
    },
  },

  "mark-zuckerberg": {
    ventures: [
      {
        name: "Chan Zuckerberg Initiative",
        role: "Co-founder (with Priscilla Chan)",
        description: "Philanthropic organization focused on science, education, and justice; the couple has pledged to give away 99% of their Meta shares over time.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/Chan_Zuckerberg_Initiative",
      },
    ],
    notableAssets: [
      {
        category: "residence",
        name: "Real estate portfolio",
        description: "Roughly a dozen properties reported across Palo Alto, San Francisco, Lake Tahoe, and Hawaii, with a combined reported value in the hundreds of millions.",
        sourceName: "Hello! Magazine",
        sourceUrl: "https://www.hellomagazine.com/celebrities/509720/mark-zuckerberg-personal-life-million-dollar-property-portfolio-wife-priscilla-net-worth/",
      },
    ],
    family: {
      maritalStatus: "Married",
      spouseName: "Priscilla Chan",
      childrenCount: 3,
    },
  },

  "larry-ellison": {
    ventures: [],
    notableAssets: [
      {
        category: "other",
        name: "Lanai, Hawaii",
        description: "Owns roughly 98% of the Hawaiian island, purchased in 2012 for about $300M, including its resorts and much of its commercial property.",
        sourceName: "CNBC",
        sourceUrl: "https://www.cnbc.com/2017/11/14/see-lanai-the-hawaiian-island-larry-ellison-bought-for-300-million.html",
      },
      {
        category: "yacht",
        name: "Musashi",
        description: "288-foot yacht, built in a minimalist style at a reported cost of around $160M.",
        sourceName: "VnExpress",
        sourceUrl: "https://e.vnexpress.net/news/tech/personalities/hawaii-island-superyachts-and-fighter-jets-lavish-retreats-of-larry-ellison-briefly-the-world-s-richest-man-ahead-of-elon-musk-4942215.html",
      },
      {
        category: "yacht",
        name: "Katana",
        description: "244-foot yacht built by Blohm+Voss, reported to include a private cinema and gym.",
        sourceName: "VnExpress",
        sourceUrl: "https://e.vnexpress.net/news/tech/personalities/hawaii-island-superyachts-and-fighter-jets-lavish-retreats-of-larry-ellison-briefly-the-world-s-richest-man-ahead-of-elon-musk-4942215.html",
      },
    ],
    family: {
      maritalStatus: "Married",
      spouseName: "Jolin Zhu",
      note: "Reported to be his sixth marriage, following five divorces.",
    },
  },
};

export function getPersonProfile(id: string): PersonProfile | undefined {
  return personProfiles[id];
}
