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

/**
 * "Self-made" descriptor loosely mirroring how Forbes frames wealth origin,
 * without copying their proprietary 1-10 score (which we can't verify).
 */
export type WealthOrigin = "Self-made" | "Inherited" | "Inherited and growing it";

export interface PersonProfile {
  /** City/region only, never a street address. */
  residenceCity?: string;
  citizenship?: string;
  education?: string;
  wealthOrigin?: WealthOrigin;
  /** Short editorial bio, one string per paragraph. Written from public facts. */
  longBio?: string[];
  /** Punchy, widely-reported facts. */
  keyFacts?: string[];
  ventures?: Venture[];
  notableAssets?: NotableAsset[];
  family?: FamilyInfo;
}

export const personProfiles: Record<string, PersonProfile> = {
  "elon-musk": {
    residenceCity: "Austin, Texas",
    citizenship: "United States",
    education: "University of Pennsylvania",
    wealthOrigin: "Self-made",
    longBio: [
      "Elon Musk is the CEO of Tesla and SpaceX and one of the most closely watched entrepreneurs in the world. Born in Pretoria, South Africa, he moved to Canada and then the United States, where he co-founded the online payments company that became PayPal.",
      "He has since built a sprawling portfolio of companies spanning electric vehicles, spaceflight, satellite internet, tunnelling, brain-computer interfaces, and artificial intelligence, and acquired the social platform now known as X.",
    ],
    keyFacts: [
      "Taught himself to code as a child and sold his first game, Blastar, for around $500.",
      "Co-founder of multiple companies including Tesla, SpaceX, Neuralink, and xAI.",
      "Acquired Twitter (now X) in 2022 for roughly $44 billion.",
    ],
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
    residenceCity: "Miami, Florida",
    citizenship: "United States",
    education: "Princeton University",
    wealthOrigin: "Self-made",
    longBio: [
      "Jeff Bezos founded Amazon in 1994, initially as an online bookseller run out of his garage, and built it into one of the world's largest companies spanning e-commerce, cloud computing, and devices.",
      "He stepped down as Amazon CEO in 2021 to focus on other ventures, including his aerospace company Blue Origin. Most of his fortune remains tied to his Amazon stake.",
    ],
    keyFacts: [
      "Founded Amazon in 1994 out of his garage, initially selling books online.",
      "Founded aerospace company Blue Origin in 2000.",
      "Bought The Washington Post for $250 million in 2013.",
    ],
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
    residenceCity: "Mumbai, India",
    citizenship: "India",
    education: "Institute of Chemical Technology, Mumbai",
    wealthOrigin: "Inherited and growing it",
    longBio: [
      "Mukesh Ambani is the chairman and managing director of Reliance Industries, India's most valuable company, which spans energy, petrochemicals, retail, and telecom.",
      "He inherited the business his father Dhirubhai Ambani founded and has substantially expanded it, most notably by launching the telecom operator Jio, which rapidly became one of India's largest mobile networks.",
    ],
    keyFacts: [
      "Chairs Reliance Industries, India's most valuable company.",
      "Launched telecom operator Jio in 2016, rapidly gaining hundreds of millions of subscribers.",
      "Lives in Antilia, a 27-story private residence in Mumbai.",
    ],
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
    residenceCity: "Paris, France",
    citizenship: "France",
    education: "École Polytechnique",
    wealthOrigin: "Inherited and growing it",
    longBio: [
      "Bernard Arnault is the chairman and CEO of LVMH, the world's largest luxury goods company, which controls around 75 brands including Louis Vuitton, Dior, and Tiffany & Co.",
      "He began by taking over his family's construction business and used the proceeds to build a luxury empire through a series of acquisitions over several decades. Several of his five children hold senior roles across LVMH's brands.",
    ],
    keyFacts: [
      "Transformed a family construction business into luxury conglomerate LVMH.",
      "LVMH controls around 75 brands including Louis Vuitton, Dior, and Tiffany & Co.",
      "A prominent contemporary art collector via the Fondation Louis Vuitton.",
    ],
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
    residenceCity: "Palo Alto, California",
    citizenship: "United States",
    education: "Harvard University (dropped out)",
    wealthOrigin: "Self-made",
    longBio: [
      "Mark Zuckerberg is the co-founder, chairman, and CEO of Meta Platforms, which owns Facebook, Instagram, and WhatsApp. He launched Facebook from his Harvard dorm room in 2004 and dropped out to build the company full-time.",
      "He controls the company through a dual-class share structure and, with his wife Priscilla Chan, has pledged to give away the vast majority of his wealth through the Chan Zuckerberg Initiative.",
    ],
    keyFacts: [
      "Launched Facebook from his Harvard dorm room in 2004.",
      "Dropped out of Harvard to build the company full-time.",
      "Owns roughly 13% of Meta Platforms.",
    ],
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
    residenceCity: "Lanai, Hawaii",
    citizenship: "United States",
    education: "University of Illinois (dropped out)",
    wealthOrigin: "Self-made",
    longBio: [
      "Larry Ellison co-founded the software company Oracle in 1977 and led it as CEO for decades, building it into one of the world's largest database and enterprise software firms. He remains its chairman and chief technology officer.",
      "Raised in modest circumstances in Chicago, he is known for an extravagant personal life, including ownership of most of the Hawaiian island of Lanai and a fleet of large yachts.",
    ],
    keyFacts: [
      "Co-founded Oracle in 1977 and led it as CEO for decades.",
      "Owns about 98% of the Hawaiian island of Lanai.",
      "Known as one of the largest individual yacht owners in the world.",
    ],
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
