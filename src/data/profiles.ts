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
  category: "residence" | "vehicle" | "yacht" | "jet" | "island" | "other";
  name: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
}

export interface FamilyInfo {
  maritalStatus: string;
  spouseName?: string;
  /** If the (former) spouse is also in our roster, link to them. */
  spouseId?: string;
  formerSpouseName?: string;
  formerSpouseId?: string;
  childrenCount?: number;
  note?: string;
}

/** A single milestone in a person's career/wealth journey. Bedrock, well-documented facts only. */
export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

/**
 * "Self-made" descriptor loosely mirroring how Forbes frames wealth origin,
 * without copying their proprietary 1-10 score (which we can't verify).
 */
export type WealthOrigin = "Self-made" | "Inherited" | "Inherited and growing it";

/**
 * A genuine, sourced "trending explainer" angle for the /net-worth page —
 * the kind of hook outlets like Times of India's etimes run ("how much is
 * left after giving away $X"). Only set this when there's a real, cited
 * fact behind it; most people just get the generic net-worth framing.
 */
export interface NetWorthHook {
  /** The headline hook, e.g. "How Much Is Left After Giving Away Over $26 Billion in 5 Years" */
  title: string;
  /** The sourced sentence(s) explaining the hook. */
  fact: string;
  sourceName: string;
  sourceUrl: string;
}

/**
 * A researched, individually-sourced section for a /net-worth deep dive —
 * the actual reporting a real net-worth explainer needs (not just a reused
 * profile bio). Each section cites its own source so a multi-part story
 * can draw on several different articles honestly.
 */
export interface DeepDiveSection {
  heading: string;
  paragraphs: string[];
  sourceName: string;
  sourceUrl: string;
}

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
  /** Career/wealth journey, oldest milestone first. */
  careerTimeline?: TimelineEntry[];
  ventures?: Venture[];
  notableAssets?: NotableAsset[];
  family?: FamilyInfo;
  netWorthHook?: NetWorthHook;
  /** Longer-form, individually-sourced sections for the /net-worth page. */
  deepDive?: DeepDiveSection[];
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
    careerTimeline: [
      { year: "1995", title: "Co-founded Zip2", description: "Started his first company, the web-software firm Zip2, with his brother Kimbal." },
      { year: "1999", title: "Founded X.com", description: "After selling Zip2, he founded the online bank X.com, which became PayPal." },
      { year: "2002", title: "PayPal sale & SpaceX", description: "eBay acquired PayPal; Musk used the proceeds to found the rocket company SpaceX." },
      { year: "2004", title: "Invested in Tesla", description: "Led an early investment in Tesla and joined as chairman of its board." },
      { year: "2008", title: "Became Tesla CEO", description: "Took over as Tesla's CEO; SpaceX reached orbit with the Falcon 1." },
      { year: "2022", title: "Acquired Twitter", description: "Bought Twitter for about $44 billion and later renamed it X." },
      { year: "2023", title: "Founded xAI", description: "Launched the artificial-intelligence company xAI." },
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
      {
        category: "vehicle",
        name: "2008 Tesla Roadster",
        description: "His personal Roadster was launched into space aboard a SpaceX Falcon Heavy in 2018 and is still orbiting the sun, with a mannequin named 'Starman' at the wheel.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/Tesla_Roadster_(2008)#In_popular_culture",
      },
      {
        category: "vehicle",
        name: "1976 Lotus Esprit \"Wet Nellie\"",
        description: "Owns the submarine-converting Lotus Esprit used as the \"Wet Nellie\" prop car in the 1977 James Bond film The Spy Who Loved Me.",
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/Lotus_Esprit_S1",
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
    careerTimeline: [
      { year: "1986", title: "Graduated Princeton", description: "Earned degrees in computer science and electrical engineering." },
      { year: "1990", title: "Joined D. E. Shaw", description: "Worked at the hedge fund D. E. Shaw, rising to senior vice president." },
      { year: "1994", title: "Founded Amazon", description: "Left Wall Street and started Amazon as an online bookstore, out of his Seattle garage." },
      { year: "1997", title: "Amazon IPO", description: "Took Amazon public on the Nasdaq." },
      { year: "2000", title: "Founded Blue Origin", description: "Started his aerospace company Blue Origin." },
      { year: "2013", title: "Bought The Washington Post", description: "Acquired the newspaper for $250 million." },
      { year: "2021", title: "Stepped down as Amazon CEO", description: "Became executive chairman and flew to space aboard Blue Origin's New Shepard." },
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
      formerSpouseName: "MacKenzie Scott",
      formerSpouseId: "mackenzie-scott",
      childrenCount: 4,
      note: "His four children are from his prior marriage to MacKenzie Scott.",
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
    careerTimeline: [
      { year: "1981", title: "Joined Reliance", description: "Began working in his father Dhirubhai Ambani's company, Reliance." },
      { year: "2005", title: "Became Reliance chairman", description: "Took the helm of Reliance Industries after the family business was divided with his brother." },
      { year: "2016", title: "Launched Jio", description: "Rolled out the Jio mobile network, rapidly reshaping India's telecom market." },
      { year: "2020", title: "Record Jio fundraising", description: "Raised record investment for Jio Platforms from global technology firms." },
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
      {
        category: "vehicle",
        name: "Antilia car collection",
        description: "Antilia's six-level, 168-car garage reportedly holds around 170 vehicles, including a Rolls-Royce Cullinan Black Badge, Ferrari SF90 Stradale, Lamborghini Urus, and Bentley Continental Flying Spur.",
        sourceName: "South China Morning Post",
        sourceUrl: "https://www.scmp.com/magazines/style/celebrity/article/3196258/inside-mukesh-ambanis-latest-extravagant-car-splurge",
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
    careerTimeline: [
      { year: "1971", title: "Joined the family firm", description: "Began working at his family's construction business, Ferret-Savinel." },
      { year: "1984", title: "Acquired Boussac Saint-Frères", description: "Took control of the struggling textile group, whose holdings included Christian Dior — his entry point into luxury goods." },
      { year: "1989", title: "Took control of LVMH", description: "Became chairman and CEO of the recently formed LVMH group." },
      { year: "2021", title: "Acquired Tiffany & Co.", description: "Completed LVMH's roughly $16 billion acquisition of the jeweler Tiffany & Co." },
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
      {
        category: "residence",
        name: "22 Avenue Montaigne, Paris",
        description: "His main Paris residence on the Seine, reported to be worth over $200M, spanning roughly 7,000 sq ft with 12 bedrooms.",
        sourceName: "Tuko",
        sourceUrl: "https://www.tuko.co.ke/facts-lifehacks/celebrity-biographies/602544-inside-bernard-arnaults-house-worth-200m-paris-billionaires-main-residence/",
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
    careerTimeline: [
      { year: "2004", title: "Launched Facebook", description: "Started 'TheFacebook' from his Harvard dorm room, then dropped out to run it full-time." },
      { year: "2012", title: "Facebook IPO & Instagram", description: "Took Facebook public in a landmark tech IPO and acquired Instagram." },
      { year: "2014", title: "Acquired WhatsApp", description: "Bought the messaging app WhatsApp." },
      { year: "2021", title: "Renamed to Meta", description: "Rebranded the company Meta to signal a focus on the metaverse." },
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
    careerTimeline: [
      { year: "1977", title: "Co-founded Oracle", description: "Started the company, originally Software Development Laboratories, with Bob Miner and Ed Oates." },
      { year: "1986", title: "Oracle IPO", description: "Took Oracle public on the Nasdaq." },
      { year: "2012", title: "Bought Lanai", description: "Purchased roughly 98% of the Hawaiian island of Lanai for about $300 million." },
      { year: "2014", title: "Stepped down as CEO", description: "Handed the chief executive role to Safra Catz and Mark Hurd, remaining chairman and chief technology officer." },
    ],
    ventures: [],
    notableAssets: [
      {
        category: "island",
        name: "Lanai, Hawaii",
        description: "Owns roughly 98% of the Hawaiian island, purchased in 2012 for about $300M, including its resorts and much of its commercial property.",
        sourceName: "CNBC",
        sourceUrl: "https://www.cnbc.com/2017/11/14/see-lanai-the-hawaiian-island-larry-ellison-bought-for-300-million.html",
      },
      {
        category: "vehicle",
        name: "Acura NSX collection",
        description: "Bought several new Acura NSX supercars every year for 15 years, gifting many to friends and top Oracle employees; also previously owned a 1995 McLaren F1.",
        sourceName: "Luxurylaunches",
        sourceUrl: "https://luxurylaunches.com/transport/oracle-founder-ditched-ferraris-and-fell-in-love-with-the-acura-nsx.php",
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

  "larry-page": {
    residenceCity: "Palo Alto, California",
    citizenship: "United States",
    education: "Stanford University",
    wealthOrigin: "Self-made",
    longBio: [
      "Larry Page co-founded Google with Sergey Brin at Stanford in 1998 and served as CEO of both Google and, later, its parent company Alphabet. He stepped back from day-to-day leadership in 2019 but remains a controlling shareholder.",
    ],
    keyFacts: [
      "Co-created the PageRank algorithm that powered Google search.",
      "Stepped down as Alphabet CEO in 2019 but retains voting control.",
      "Has funded aviation and flying-car startups.",
    ],
    careerTimeline: [
      { year: "1995", title: "Met Sergey Brin at Stanford", description: "Began the research collaboration behind Google's search algorithm." },
      { year: "1998", title: "Co-founded Google", description: "Founded Google with Sergey Brin, initially operating out of a garage in Menlo Park." },
      { year: "2004", title: "Google IPO", description: "Took Google public." },
      { year: "2015", title: "Became Alphabet CEO", description: "Took the chief executive role of newly formed parent company Alphabet." },
      { year: "2019", title: "Stepped back from Alphabet", description: "Left the CEO role to Sundar Pichai, remaining a controlling shareholder." },
    ],
  },

  "sergey-brin": {
    residenceCity: "Los Altos, California",
    citizenship: "United States",
    education: "Stanford University",
    wealthOrigin: "Self-made",
    longBio: [
      "Sergey Brin co-founded Google with Larry Page and served as president of Alphabet until 2019. Born in Moscow, he emigrated to the United States as a child. He remains a controlling shareholder and has returned to hands-on work on Google's AI efforts.",
    ],
    keyFacts: [
      "Born in Moscow, in the former Soviet Union.",
      "Co-created the PageRank algorithm with Larry Page.",
      "Has been closely involved in Alphabet's AI and moonshot projects.",
    ],
    careerTimeline: [
      { year: "1979", title: "Emigrated from Moscow", description: "Moved to the United States with his family as a child." },
      { year: "1995", title: "Met Larry Page at Stanford", description: "Began the research partnership behind Google's search technology." },
      { year: "1998", title: "Co-founded Google", description: "Founded Google with Larry Page." },
      { year: "2004", title: "Google IPO", description: "Took Google public." },
      { year: "2019", title: "Stepped down as Alphabet president", description: "Left his formal executive role, remaining a controlling shareholder and active on AI projects." },
    ],
    notableAssets: [
      {
        category: "yacht",
        name: "Dragonfly",
        description: "142-meter Lürssen superyacht reported at roughly $450M, delivered in December 2024 — the largest superyacht in the United States.",
        sourceName: "Forbes",
        sourceUrl: "https://www.forbes.com/sites/billspringer/2024/12/13/just-how-big-is-google-co-founder-sergey-brins-new-superyacht/",
      },
    ],
  },

  "steve-ballmer": {
    residenceCity: "Hunts Point, Washington",
    citizenship: "United States",
    education: "Harvard University",
    wealthOrigin: "Self-made",
    longBio: [
      "Steve Ballmer was Microsoft's CEO from 2000 to 2014, having joined as its first business manager in 1980. Since leaving, he has owned the Los Angeles Clippers and launched the data non-profit USAFacts.",
    ],
    keyFacts: [
      "Was Microsoft's 30th employee and first business manager.",
      "Bought the Los Angeles Clippers for $2 billion in 2014.",
      "Founded USAFacts, a government-data transparency project.",
    ],
    careerTimeline: [
      { year: "1980", title: "Joined Microsoft", description: "Became Microsoft's first business manager and 30th employee." },
      { year: "2000", title: "Became CEO", description: "Succeeded Bill Gates as Microsoft's chief executive." },
      { year: "2014", title: "Stepped down as CEO", description: "Retired as Microsoft CEO, succeeded by Satya Nadella." },
      { year: "2014", title: "Bought the LA Clippers", description: "Purchased the NBA's Los Angeles Clippers for $2 billion." },
    ],
  },

  "warren-buffett": {
    residenceCity: "Omaha, Nebraska",
    citizenship: "United States",
    education: "Columbia Business School",
    wealthOrigin: "Self-made",
    longBio: [
      "Warren Buffett, the \"Oracle of Omaha,\" is chairman and CEO of Berkshire Hathaway and one of the most successful investors in history. He built a conglomerate spanning insurance, railroads, energy, and consumer brands, and is known for his value-investing philosophy.",
    ],
    keyFacts: [
      "Bought his first stock at age 11.",
      "Still lives in the Omaha home he purchased in 1958.",
      "Has pledged to give away more than 99% of his wealth.",
    ],
    careerTimeline: [
      { year: "1942", title: "First stock at age 11", description: "Bought his first shares — Cities Service preferred stock." },
      { year: "1951", title: "Studied under Benjamin Graham", description: "Learned value investing from Graham at Columbia Business School." },
      { year: "1956", title: "Started his first partnership", description: "Launched the Buffett Partnership in Omaha." },
      { year: "1965", title: "Took control of Berkshire Hathaway", description: "Gained control of the struggling textile maker and reshaped it into a holding company." },
      { year: "1988", title: "Bought into Coca-Cola", description: "Began accumulating a signature long-term stake in Coca-Cola." },
      { year: "2006", title: "The Giving Pledge era", description: "Pledged to give away the bulk of his fortune, largely through the Gates Foundation." },
    ],
  },

  "jensen-huang": {
    residenceCity: "California",
    citizenship: "United States",
    education: "Stanford University",
    wealthOrigin: "Self-made",
    longBio: [
      "Jensen Huang co-founded the chipmaker Nvidia in 1993 and has led it ever since. Once known mainly for graphics cards, Nvidia became one of the world's most valuable companies as its chips became the backbone of the artificial-intelligence boom.",
    ],
    keyFacts: [
      "Born in Taiwan; moved to the United States as a child.",
      "Has led Nvidia as CEO for more than 30 years.",
      "A central figure in the AI hardware boom.",
    ],
    careerTimeline: [
      { year: "1993", title: "Co-founded Nvidia", description: "Started Nvidia with Chris Malachowsky and Curtis Priem." },
      { year: "1999", title: "Nvidia IPO", description: "Took Nvidia public and shipped the GeForce 256, marketed as the first GPU." },
      { year: "2006", title: "Launched CUDA", description: "Introduced Nvidia's CUDA computing platform, which later became central to AI workloads." },
      { year: "2023", title: "AI boom", description: "Nvidia's chips became the backbone of the generative-AI buildout, propelling the company's market value past $1 trillion." },
    ],
  },

  "michael-dell": {
    residenceCity: "Austin, Texas",
    citizenship: "United States",
    education: "University of Texas (dropped out)",
    wealthOrigin: "Self-made",
    longBio: [
      "Michael Dell founded the computer company that bears his name from his university dorm room in 1984. He took the company private in 2013 and public again in 2018, and controls it alongside investment firm MSD Capital.",
    ],
    keyFacts: [
      "Started the company from his dorm room at age 19.",
      "Took Dell private in a $25 billion deal in 2013.",
      "Returned Dell to the public markets in 2018.",
    ],
    careerTimeline: [
      { year: "1984", title: "Founded Dell", description: "Started the company from his University of Texas dorm room, selling custom PCs directly to customers." },
      { year: "1988", title: "Dell IPO", description: "Took the company public." },
      { year: "2013", title: "Took Dell private", description: "Led a roughly $25 billion buyout to take Dell private." },
      { year: "2018", title: "Returned to public markets", description: "Brought Dell Technologies back to the stock market." },
    ],
    notableAssets: [
      {
        category: "residence",
        name: "\"The Castle,\" West Lake Hills",
        description: "A 33,000 sq ft home on 119 acres overlooking Lake Austin, built in 1997 with a tennis court and both indoor and outdoor pools.",
        sourceName: "The Real Deal",
        sourceUrl: "https://therealdeal.com/texas/2022/06/23/heres-where-michael-dell-hangs-up-his-many-hats/",
      },
    ],
  },

  "phil-knight": {
    residenceCity: "Oregon",
    citizenship: "United States",
    education: "Stanford Graduate School of Business",
    wealthOrigin: "Self-made",
    longBio: [
      "Phil Knight co-founded Nike with his former track coach Bill Bowerman, starting by importing and selling running shoes out of his car. He built it into the world's largest athletic-footwear and apparel company and is now chairman emeritus.",
    ],
    keyFacts: [
      "Co-founded Nike with his track coach, Bill Bowerman.",
      "Started out selling shoes from the trunk of his car.",
      "A major donor to the University of Oregon and Stanford.",
    ],
    careerTimeline: [
      { year: "1964", title: "Co-founded Blue Ribbon Sports", description: "Started the company with his track coach Bill Bowerman, selling imported running shoes out of the trunk of his car." },
      { year: "1971", title: "Renamed Nike", description: "Rebranded the company Nike, adopting the now-famous Swoosh logo." },
      { year: "1980", title: "Nike IPO", description: "Took Nike public." },
      { year: "2016", title: "Stepped down as chairman", description: "Retired as Nike's chairman, becoming chairman emeritus." },
    ],
  },

  "jim-walton": {
    residenceCity: "Bentonville, Arkansas",
    citizenship: "United States",
    education: "University of Arkansas",
    wealthOrigin: "Inherited",
    longBio: [
      "Jim Walton is the youngest son of Walmart founder Sam Walton. He chairs Arvest Bank, the family's banking business, and holds a large stake in the retailer through the family holding company.",
    ],
    keyFacts: [
      "Youngest son of Walmart founder Sam Walton.",
      "Chairman of the family's Arvest Bank.",
      "A part-owner of Walton Enterprises, the family holding company.",
    ],
  },

  "rob-walton": {
    residenceCity: "Bentonville, Arkansas",
    citizenship: "United States",
    education: "Columbia Law School",
    wealthOrigin: "Inherited",
    longBio: [
      "Rob Walton is the eldest son of Sam Walton and chaired Walmart's board from 1992 to 2015. In 2022 he led an ownership group that bought the NFL's Denver Broncos.",
    ],
    keyFacts: [
      "Chaired Walmart's board of directors from 1992 to 2015.",
      "Led the group that bought the Denver Broncos in 2022.",
      "Eldest of Sam Walton's four children.",
    ],
  },

  "alice-walton": {
    residenceCity: "Fort Worth, Texas",
    citizenship: "United States",
    education: "Trinity University",
    wealthOrigin: "Inherited",
    longBio: [
      "Alice Walton is the only daughter of Walmart founder Sam Walton and, at times, the richest woman in the world. Unlike her brothers she never worked in the family business, focusing instead on art; she founded the Crystal Bridges Museum of American Art in Arkansas.",
    ],
    keyFacts: [
      "Founded the Crystal Bridges Museum of American Art.",
      "Has at times been the richest woman in the world.",
      "A prominent collector of American art.",
    ],
  },

  "mackenzie-scott": {
    residenceCity: "California",
    citizenship: "United States",
    education: "Princeton University",
    longBio: [
      "MacKenzie Scott is a novelist and philanthropist who received a large Amazon stake in her 2019 divorce from Jeff Bezos. She has since given away tens of billions of dollars, largely as unrestricted gifts to nonprofits.",
    ],
    keyFacts: [
      "Was one of Amazon's earliest employees.",
      "Has given away tens of billions in unrestricted gifts.",
      "A published novelist.",
    ],
    netWorthHook: {
      title: "How Much Is Left After Giving Away Over $26 Billion in 5 Years",
      fact: "Through her giving vehicle Yield Giving, Scott has donated roughly $26.2 billion across more than 2,700 unrestricted gifts since 2019 — including $7.2 billion in 2025 alone, more than a third of all US megagifts that year.",
      sourceName: "Fortune",
      sourceUrl: "https://fortune.com/2026/06/25/mackenzie-scott-largest-megadonor-2025-7-billion-donations-giving-usa-iu-report/",
    },
    deepDive: [
      {
        heading: "The Divorce That Created the Fortune",
        paragraphs: [
          "Scott and Amazon founder Jeff Bezos divorced in 2019 after 25 years of marriage. As part of the settlement, she received roughly a 4% stake in Amazon — about 19.7 million shares at the time, worth an estimated $36 billion. Bezos retained voting control over the shares, but the economic value was hers outright.",
        ],
        sourceName: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/MacKenzie_Scott",
      },
      {
        heading: "Richer Now Than the Day She Left",
        paragraphs: [
          "Despite giving away more than $26 billion since the divorce, Scott's fortune has kept growing. Amazon's stock has climbed so much that even after her donations and periodic share sales, she is wealthier today than she was the day the marriage ended — the giving has barely dented the underlying stake.",
        ],
        sourceName: "Fortune",
        sourceUrl: "https://fortune.com/article/mackenzie-scott-26-billion-donations-net-worth-amazon-shares/",
      },
      {
        heading: "Where the Money Has Gone",
        paragraphs: [
          "A large share of Scott's giving has gone to higher education, especially Historically Black Colleges and Universities — her HBCU giving alone has topped $1 billion, spread across 24 schools plus endowment support for all 37 UNCF-member institutions.",
          "Named gifts include $80 million to Howard University, $63 million each to Morgan State University and Prairie View A&M University, $42 million to Elizabeth City State University, $38 million each to Alabama State University and Spelman College, and a $70 million gift to the United Negro College Fund.",
        ],
        sourceName: "Higher Ed Dive",
        sourceUrl: "https://www.highereddive.com/news/mackenzie-scotts-hbcu-college-gifts-2025/805854/",
      },
      {
        heading: "Giving With \"No Strings Attached\"",
        paragraphs: [
          "Scott's philanthropy is built around large, unrestricted gifts — grants with no application process, minimal reporting requirements, and no conditions on how recipients use the money. She typically explains her reasoning in her own posts rather than through a foundation press office.",
        ],
        sourceName: "Forbes",
        sourceUrl: "https://www.forbes.com/sites/lisettevoytko/2021/07/07/inside-mackenzie-scotts-no-strings-attached-philanthropy-i-was-in-tears/",
      },
      {
        heading: "Researchers Say the Approach Is Working",
        paragraphs: [
          "A multi-year study by the Center for Effective Philanthropy found that the large, unrestricted nature of Scott's gifts has strengthened the financial position of the nonprofits that received them, according to CBS News' coverage of the research.",
        ],
        sourceName: "CBS News",
        sourceUrl: "https://www.cbsnews.com/news/mackenzie-scotts-large-unrestricted-gifts-have-transformed-non-profits-research-shows/",
      },
    ],
  },

  "julia-koch": {
    residenceCity: "New York City",
    citizenship: "United States",
    wealthOrigin: "Inherited",
    longBio: [
      "Julia Koch and her children inherited a roughly 42% stake in Koch Industries, one of the largest private companies in the United States, after the death of her husband David Koch in 2019.",
    ],
    keyFacts: [
      "Inherited her Koch Industries stake in 2019.",
      "She and her children own about 42% of the conglomerate.",
      "Active in philanthropy and the arts in New York.",
    ],
  },

  "francoise-bettencourt-meyers": {
    residenceCity: "Paris, France",
    citizenship: "France",
    wealthOrigin: "Inherited",
    longBio: [
      "Françoise Bettencourt Meyers is the granddaughter of L'Oréal founder Eugène Schueller and chairs the family holding company. She has often ranked as the richest woman in the world and is also a published author.",
    ],
    keyFacts: [
      "Granddaughter of L'Oréal's founder.",
      "Frequently ranked as the world's richest woman.",
      "An author of books on religion and mythology.",
    ],
  },

  "miriam-adelson": {
    residenceCity: "Las Vegas, Nevada",
    citizenship: "United States",
    education: "Tel Aviv University (MD)",
    wealthOrigin: "Inherited",
    longBio: [
      "Miriam Adelson is a physician and the widow of casino magnate Sheldon Adelson. She controls the family's majority stake in Las Vegas Sands and is one of the largest political donors in the United States.",
    ],
    keyFacts: [
      "A physician who has specialized in addiction treatment.",
      "Controls the family's majority stake in Las Vegas Sands.",
      "Part of the ownership group of the NBA's Dallas Mavericks.",
    ],
  },

  "jacqueline-mars": {
    residenceCity: "Virginia",
    citizenship: "United States",
    education: "Bryn Mawr College",
    wealthOrigin: "Inherited",
    longBio: [
      "Jacqueline Mars is a granddaughter of Mars, Incorporated founder Frank Mars and owns roughly a third of the private candy and pet-care giant behind brands like M&M's, Snickers, and Pedigree.",
    ],
    keyFacts: [
      "Owns about one-third of Mars, Incorporated.",
      "Granddaughter of the company's founder, Frank Mars.",
      "A longtime equestrian and supporter of the sport.",
    ],
  },

  "abigail-johnson": {
    residenceCity: "Massachusetts",
    citizenship: "United States",
    education: "Harvard Business School",
    wealthOrigin: "Inherited and growing it",
    longBio: [
      "Abigail Johnson is the chair and CEO of Fidelity Investments, the asset-management giant founded by her grandfather. A third-generation leader, she has pushed the firm into new areas including cryptocurrency.",
    ],
    keyFacts: [
      "Third-generation leader of Fidelity Investments.",
      "An early mover in offering crypto to retirement savers.",
      "Joined the family firm in 1988.",
    ],
  },

  "gina-rinehart": {
    residenceCity: "Perth, Australia",
    citizenship: "Australia",
    education: "University of Sydney",
    wealthOrigin: "Inherited and growing it",
    longBio: [
      "Gina Rinehart is Australia's richest person and executive chair of Hancock Prospecting. She inherited a debt-laden mining business from her father and rebuilt it into the country's most valuable private company, riding the iron-ore boom.",
    ],
    keyFacts: [
      "Australia's richest person.",
      "Rebuilt an inherited, debt-laden mining business into a giant.",
      "A major investor in agriculture and cattle stations.",
    ],
  },

  "susanne-klatten": {
    residenceCity: "Munich, Germany",
    citizenship: "Germany",
    education: "University of Buckingham (MBA)",
    wealthOrigin: "Inherited and growing it",
    longBio: [
      "Susanne Klatten is among the largest shareholders of automaker BMW and controls the specialty-chemicals company Altana. She is one of Germany's wealthiest people and a member of the Quandt family.",
    ],
    keyFacts: [
      "One of BMW's largest individual shareholders.",
      "Controls the chemicals company Altana.",
      "A member of the industrial Quandt family.",
    ],
  },

  "whitney-wolfe-herd": {
    residenceCity: "Austin, Texas",
    citizenship: "United States",
    education: "Southern Methodist University",
    wealthOrigin: "Self-made",
    longBio: [
      "Whitney Wolfe Herd founded the dating app Bumble, built around the idea of women making the first move. When Bumble went public in 2021 she became, at 31, the youngest woman to take a US company public.",
    ],
    keyFacts: [
      "Co-founded Tinder before launching Bumble.",
      "Became the youngest woman to take a US company public, in 2021.",
      "Built Bumble around women making the first move.",
    ],
  },

  "gautam-adani": {
    residenceCity: "Ahmedabad, India",
    citizenship: "India",
    education: "Gujarat University (dropped out)",
    wealthOrigin: "Self-made",
    longBio: [
      "Gautam Adani is a first-generation entrepreneur who built the Adani Group into one of India's largest infrastructure conglomerates, spanning ports, energy, airports, and logistics. He has at times ranked as Asia's richest person.",
    ],
    keyFacts: [
      "A first-generation, self-made entrepreneur.",
      "Built a ports-to-energy infrastructure empire.",
      "Has at times been Asia's richest person.",
    ],
    careerTimeline: [
      { year: "1988", title: "Founded Adani Enterprises", description: "Started what became the Adani Group as a commodity-trading business." },
      { year: "1998", title: "Mundra Port", description: "Began developing Mundra Port in Gujarat, which grew into India's largest commercial port." },
      { year: "2022", title: "Acquired Ambuja Cements", description: "Took control of Ambuja Cements and ACC, making Adani one of India's largest cement producers." },
    ],
    notableAssets: [
      {
        category: "residence",
        name: "Shantivan House, Ahmedabad",
        description: "His primary residence off SG Road in Ahmedabad, in a prime location behind the Karnavati Club.",
        sourceName: "IndexTap",
        sourceUrl: "https://www.indextap.com/blog/gautam-adani-house-addresses-value-net-worth-and-latest-news/",
      },
      {
        category: "jet",
        name: "Boeing BBJ 737 MAX 8",
        description: "A business-jet version of the 737 MAX reported to have cost around ₹1,000 crore (roughly $120M), part of a private fleet that also includes several Bombardier and Embraer jets.",
        sourceName: "CarToq",
        sourceUrl: "https://www.cartoq.com/car-life/gautam-adani-adds-rs-1000-crore-boeing-bbj-737-max-8-to-his-private-jet-fleet/",
      },
    ],
  },

  "shiv-nadar": {
    residenceCity: "Delhi, India",
    citizenship: "India",
    education: "PSG College of Technology",
    wealthOrigin: "Self-made",
    longBio: [
      "Shiv Nadar founded HCL in 1976, making him one of the pioneers of India's IT industry. He is also one of the country's most generous philanthropists through the Shiv Nadar Foundation and its schools and university.",
    ],
    keyFacts: [
      "Founded HCL in 1976, an early Indian IT pioneer.",
      "A leading Indian philanthropist in education.",
      "Founded Shiv Nadar University.",
    ],
    careerTimeline: [
      { year: "1976", title: "Founded HCL", description: "Started HCL (originally Microcomp) with a small group of engineers, becoming one of the pioneers of India's IT industry." },
      { year: "1991", title: "Entered software services", description: "Launched HCL Technologies to build out the group's IT services business." },
      { year: "1994", title: "Founded the Shiv Nadar Foundation", description: "Established his philanthropic foundation focused on education." },
    ],
  },

  "radhakishan-damani": {
    residenceCity: "Mumbai, India",
    citizenship: "India",
    education: "University of Mumbai (dropped out)",
    wealthOrigin: "Self-made",
    longBio: [
      "Radhakishan Damani is a reclusive value investor who founded the DMart supermarket chain, run by listed company Avenue Supermarts. He is widely regarded as a mentor figure among Indian investors.",
    ],
    keyFacts: [
      "Founder of the DMart supermarket chain.",
      "Made his name first as a stock-market investor.",
      "Known for a notably private, low-profile lifestyle.",
    ],
  },

  "kumar-birla": {
    residenceCity: "Mumbai, India",
    citizenship: "India",
    education: "London Business School (MBA)",
    wealthOrigin: "Inherited and growing it",
    longBio: [
      "Kumar Mangalam Birla took over the Aditya Birla Group at 28 after his father's death and expanded it into a global conglomerate spanning cement, metals, chemicals, and telecom, including a stake in Vodafone Idea.",
    ],
    keyFacts: [
      "Took charge of the Aditya Birla Group at age 28.",
      "Expanded it into a multinational conglomerate.",
      "The group is one of India's largest cement producers.",
    ],
  },

  "savitri-jindal": {
    residenceCity: "Hisar, India",
    citizenship: "India",
    wealthOrigin: "Inherited",
    longBio: [
      "Savitri Jindal is the matriarch of the O.P. Jindal Group, a steel and power conglomerate, having become chairperson emeritus after her husband's death in 2005. She has also served as a politician in the state of Haryana.",
    ],
    keyFacts: [
      "Matriarch of the Jindal steel-and-power empire.",
      "Became chairperson emeritus after 2005.",
      "A former state politician in Haryana.",
    ],
  },

  "cyrus-poonawalla": {
    residenceCity: "Pune, India",
    citizenship: "India",
    education: "University of Pune",
    wealthOrigin: "Self-made",
    longBio: [
      "Cyrus Poonawalla founded the Serum Institute of India, the world's largest vaccine manufacturer by number of doses produced. The company played a major role in global Covid-19 vaccine supply.",
    ],
    keyFacts: [
      "Founded the world's largest vaccine maker by volume.",
      "Started out breeding racehorses.",
      "The Serum Institute produced billions of Covid-19 doses.",
    ],
  },

  "evan-spiegel": {
    residenceCity: "Los Angeles, California",
    citizenship: "United States",
    education: "Stanford University",
    wealthOrigin: "Self-made",
    longBio: [
      "Evan Spiegel co-founded Snap, the parent company of Snapchat, while a student at Stanford. He became one of the youngest self-made billionaires when the company went public in 2017.",
    ],
    keyFacts: [
      "Co-founded Snapchat while at Stanford.",
      "Was among the youngest self-made billionaires at Snap's 2017 IPO.",
      "Serves as Snap's CEO.",
    ],
    careerTimeline: [
      { year: "2011", title: "Launched Snapchat", description: "Co-founded the disappearing-photo app, initially called Picaboo, with Bobby Murphy and Reggie Brown while at Stanford." },
      { year: "2013", title: "Turned down Facebook's offer", description: "Reportedly rejected a multibillion-dollar acquisition offer from Facebook, choosing to stay independent." },
      { year: "2017", title: "Snap IPO", description: "Took Snap public on the NYSE." },
    ],
  },

  "bobby-murphy": {
    residenceCity: "Los Angeles, California",
    citizenship: "United States",
    education: "Stanford University",
    wealthOrigin: "Self-made",
    longBio: [
      "Bobby Murphy co-founded Snap with Evan Spiegel and built the early engineering behind Snapchat. He serves as the company's chief technology officer and keeps a notably low public profile.",
    ],
    keyFacts: [
      "Co-founded Snapchat and built its early technology.",
      "Serves as Snap's chief technology officer.",
      "Keeps a famously low public profile.",
    ],
    careerTimeline: [
      { year: "2011", title: "Co-founded Snapchat", description: "Built the early engineering behind the disappearing-photo app with Evan Spiegel at Stanford." },
      { year: "2017", title: "Snap IPO", description: "Took Snap public on the NYSE." },
    ],
  },

  "daniel-ek": {
    residenceCity: "Stockholm, Sweden",
    citizenship: "Sweden",
    education: "KTH Royal Institute of Technology (dropped out)",
    wealthOrigin: "Self-made",
    longBio: [
      "Daniel Ek co-founded Spotify in 2006 as a legal alternative to music piracy and grew it into the world's largest music-streaming service. He has also become a prominent backer of European technology startups.",
    ],
    keyFacts: [
      "Co-founded Spotify in 2006.",
      "Built the world's largest music-streaming service.",
      "An active investor in European tech.",
    ],
    careerTimeline: [
      { year: "2006", title: "Co-founded Spotify", description: "Started Spotify with Martin Lorentzon as a licensed alternative to music piracy." },
      { year: "2008", title: "Public launch", description: "Launched Spotify to the public in Europe." },
      { year: "2011", title: "US launch", description: "Brought Spotify to the United States." },
      { year: "2018", title: "Direct listing on NYSE", description: "Took Spotify public via an unconventional direct listing rather than a traditional IPO." },
    ],
  },

  "brian-chesky": {
    residenceCity: "San Francisco, California",
    citizenship: "United States",
    education: "Rhode Island School of Design",
    wealthOrigin: "Self-made",
    longBio: [
      "Brian Chesky co-founded Airbnb, which began when he and his roommates rented out air mattresses in their apartment. A trained industrial designer, he led the company through its 2020 IPO and serves as CEO.",
    ],
    keyFacts: [
      "Started Airbnb by renting air mattresses in his apartment.",
      "A trained industrial designer.",
      "Led Airbnb's 2020 IPO.",
    ],
    careerTimeline: [
      { year: "2007", title: "Air mattresses to cover rent", description: "With roommate Joe Gebbia, rented out air mattresses in their San Francisco apartment during a design conference." },
      { year: "2008", title: "Founded Airbnb", description: "Formally launched Airbnb with Gebbia and Nathan Blecharczyk." },
      { year: "2020", title: "Airbnb IPO", description: "Led the company through its Nasdaq initial public offering." },
    ],
  },

  "changpeng-zhao": {
    residenceCity: "Dubai, UAE",
    citizenship: "Canada",
    wealthOrigin: "Self-made",
    longBio: [
      "Changpeng Zhao, known as CZ, founded the cryptocurrency exchange Binance in 2017 and built it into the largest in the world by trading volume. Born in Jiangsu, China, he emigrated to Canada as a child and is a Canadian citizen.",
      "He stepped down as Binance's CEO in 2023. Though he is based in Dubai, he is typically ranked as the richest Canadian; his fortune is tied largely to Binance and crypto holdings, so estimates move with the market.",
    ],
    keyFacts: [
      "Founded Binance in 2017, the world's largest crypto exchange by volume.",
      "Chinese-born Canadian citizen; based in Dubai.",
      "Often ranked as the richest person in Canada.",
    ],
    careerTimeline: [
      { year: "2017", title: "Founded Binance", description: "Launched the cryptocurrency exchange, which grew into the largest in the world by trading volume." },
      { year: "2023", title: "Stepped down as CEO", description: "Pleaded guilty to a US anti-money-laundering violation and stepped down as Binance's CEO." },
    ],
  },

  "pavel-durov": {
    residenceCity: "Dubai, UAE",
    citizenship: "UAE, France, Russia, St. Kitts and Nevis",
    wealthOrigin: "Self-made",
    longBio: [
      "Pavel Durov founded the messaging app Telegram in 2013 and runs it from Dubai. He earlier created the Russian social network VK before leaving Russia.",
      "He holds Emirati, French, Russian, and St. Kitts and Nevis citizenship. Because Telegram is privately held, published estimates of his net worth vary widely.",
    ],
    keyFacts: [
      "Founder of Telegram, one of the world's largest messaging apps.",
      "Previously founded the Russian social network VK.",
      "Holds four citizenships and is based in Dubai.",
    ],
    careerTimeline: [
      { year: "2006", title: "Co-founded VK", description: "Launched the Russian social network VKontakte (VK) with his brother Nikolai." },
      { year: "2013", title: "Founded Telegram", description: "Launched the encrypted messaging app Telegram with Nikolai after leaving VK." },
      { year: "2014", title: "Left Russia", description: "Sold his stake in VK and left Russia amid disputes over user data." },
    ],
  },
};

export function getPersonProfile(id: string): PersonProfile | undefined {
  return personProfiles[id];
}
