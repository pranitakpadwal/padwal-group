/**
 * Billionaires we haven't researched enough to track live (no verified
 * ticker + share count), but who genuinely belong on a "how does this
 * compare to Forbes' ~3,300" list. Deliberately a separate, lighter-weight
 * data model from billionaires.ts:
 *
 * - Net worth here is a STATIC, labeled ESTIMATE, cited to one named
 *   source (Forbes' or Bloomberg's own published profile), not derived
 *   from a live share price the way the tracked core is. Same rule as
 *   celebrities.ts: don't blur this with the live engine — every entry
 *   says plainly that it isn't a live figure.
 * - Same sourcing bar as everything else on the site: a named source and
 *   an as-of date, or the entry doesn't go in.
 * - The intent is to promote people out of this file and into
 *   billionaires.ts once their public holdings are actually verified —
 *   this file is the wide, shallow tier; billionaires.ts is the narrow,
 *   deep, live one.
 */

export interface EstimatedBillionaire {
  id: string;
  name: string;
  country: string;
  industry: string;
  primarySource: string;
  gender: "male" | "female";
  bio: string;
  wikipediaTitle: string;
  netWorthUsd: number;
  netWorthSourceName: string;
  netWorthSourceUrl: string;
  /** The period the estimate reflects — these go stale, unlike a live quote. */
  netWorthAsOf: string;
}

export const estimatedBillionaires: Record<string, EstimatedBillionaire> = {
  "bill-gates": {
    id: "bill-gates",
    name: "Bill Gates",
    country: "United States",
    industry: "Technology",
    primarySource: "Microsoft",
    gender: "male",
    bio: "Co-founded Microsoft in 1975 and led it through the personal-computing boom. Now devotes most of his time to the Bill & Melinda Gates Foundation; his Microsoft stake has fallen below 1% after years of large charitable share transfers.",
    wikipediaTitle: "Bill_Gates",
    netWorthUsd: 107_700_000_000,
    netWorthSourceName: "Forbes",
    netWorthSourceUrl: "https://www.forbes.com/profile/bill-gates/",
    netWorthAsOf: "February 2026",
  },
  "amancio-ortega": {
    id: "amancio-ortega",
    name: "Amancio Ortega",
    country: "Spain",
    industry: "Retail",
    primarySource: "Inditex (Zara)",
    gender: "male",
    bio: "Co-founded Inditex, the fast-fashion group behind Zara, in 1975. Owns roughly 60% of the Madrid-listed company and has separately built a large European and North American real-estate portfolio.",
    wikipediaTitle: "Amancio_Ortega",
    netWorthUsd: 147_000_000_000,
    netWorthSourceName: "Forbes",
    netWorthSourceUrl: "https://www.forbes.com/profile/amancio-ortega/",
    netWorthAsOf: "2026",
  },
  "zhang-yiming": {
    id: "zhang-yiming",
    name: "Zhang Yiming",
    country: "China",
    industry: "Technology",
    primarySource: "ByteDance (TikTok)",
    gender: "male",
    bio: "Founded ByteDance in a four-bedroom Beijing apartment in 2012; the company went on to build TikTok into one of the world's most-used apps. Stepped down as chairman and CEO in 2021 but remains a major shareholder.",
    wikipediaTitle: "Zhang_Yiming",
    netWorthUsd: 92_800_000_000,
    netWorthSourceName: "Bloomberg Billionaires Index",
    netWorthSourceUrl: "https://www.bloomberg.com/billionaires/profiles/yiming-zhang/",
    netWorthAsOf: "June 2026",
  },
  "rupert-murdoch": {
    id: "rupert-murdoch",
    name: "Rupert Murdoch",
    country: "United States",
    industry: "Media",
    primarySource: "News Corp / Fox Corporation",
    gender: "male",
    bio: "Built a global media empire spanning Fox News, The Wall Street Journal, The Times of London, and the New York Post. Stepped down as chairman of Fox and News Corp in September 2023; son Lachlan now runs Fox.",
    wikipediaTitle: "Rupert_Murdoch",
    netWorthUsd: 23_000_000_000,
    netWorthSourceName: "Forbes",
    netWorthSourceUrl: "https://www.forbes.com/profile/rupert-murdoch/",
    netWorthAsOf: "2026",
  },
  "charles-koch": {
    id: "charles-koch",
    name: "Charles Koch",
    country: "United States",
    industry: "Industrial Conglomerates",
    primarySource: "Koch Industries",
    gender: "male",
    bio: "Chairman and CEO of Koch Industries since 1967, having grown the company from his father Fred Koch's business into one of America's largest private conglomerates, spanning pipelines, chemicals, and manufacturing.",
    wikipediaTitle: "Charles_Koch",
    netWorthUsd: 71_400_000_000,
    netWorthSourceName: "Bloomberg Billionaires Index",
    netWorthSourceUrl: "https://www.bloomberg.com/billionaires/profiles/charles-d-koch/",
    netWorthAsOf: "May 2025",
  },
  "colin-huang": {
    id: "colin-huang",
    name: "Colin Huang",
    country: "China",
    industry: "E-commerce",
    primarySource: "PDD Holdings (Pinduoduo / Temu)",
    gender: "male",
    bio: "Founded budget e-commerce platform Pinduoduo in 2015 after earlier stints at Microsoft and Google; the company (renamed PDD Holdings in 2023) also owns the discount marketplace Temu. Stepped down as chairman in 2021 but remains a major shareholder.",
    wikipediaTitle: "Colin_Huang",
    netWorthUsd: 42_400_000_000,
    netWorthSourceName: "Forbes",
    netWorthSourceUrl: "https://www.forbes.com/profile/colin-huang/",
    netWorthAsOf: "2026",
  },
  "ray-dalio": {
    id: "ray-dalio",
    name: "Ray Dalio",
    country: "United States",
    industry: "Hedge Funds",
    primarySource: "Bridgewater Associates",
    gender: "male",
    bio: "Founded Bridgewater Associates, the world's largest hedge fund by assets, out of his New York apartment in 1975. Stepped down as CEO in 2017 and retired as co-CIO in 2022, selling off his remaining stake by 2025.",
    wikipediaTitle: "Ray_Dalio",
    netWorthUsd: 21_500_000_000,
    netWorthSourceName: "Bloomberg Billionaires Index",
    netWorthSourceUrl: "https://www.bloomberg.com/billionaires/profiles/raymond-t-dalio/",
    netWorthAsOf: "June 2026",
  },
  "ken-griffin": {
    id: "ken-griffin",
    name: "Ken Griffin",
    country: "United States",
    industry: "Hedge Funds",
    primarySource: "Citadel",
    gender: "male",
    bio: "Founded the hedge fund Citadel in 1990 from his Harvard dorm room; also founded and owns roughly 80% of Citadel Securities, one of the largest market makers in the US.",
    wikipediaTitle: "Kenneth_C._Griffin",
    netWorthUsd: 51_200_000_000,
    netWorthSourceName: "Bloomberg Billionaires Index",
    netWorthSourceUrl: "https://www.bloomberg.com/billionaires/profiles/kenneth-c-griffin/",
    netWorthAsOf: "January 2026",
  },
  "stephen-schwarzman": {
    id: "stephen-schwarzman",
    name: "Stephen Schwarzman",
    country: "United States",
    industry: "Private Equity",
    primarySource: "Blackstone",
    gender: "male",
    bio: "Co-founded the private equity firm Blackstone in 1985 with Peter G. Peterson. Still chairman and CEO, owning roughly 19% of the now publicly traded company, which manages over a trillion dollars in assets.",
    wikipediaTitle: "Stephen_A._Schwarzman",
    netWorthUsd: 47_800_000_000,
    netWorthSourceName: "Bloomberg Billionaires Index",
    netWorthSourceUrl: "https://www.bloomberg.com/billionaires/profiles/stephen-a-schwarzman/",
    netWorthAsOf: "2026",
  },
  "william-ding": {
    id: "william-ding",
    name: "William Ding",
    country: "China",
    industry: "Technology",
    primarySource: "NetEase",
    gender: "male",
    bio: "Founded NetEase in 1997 with about $60,000, starting with China's first free email service before building it into one of the country's largest online gaming companies. Still holds roughly 46% of the publicly traded company.",
    wikipediaTitle: "Ding_Lei",
    netWorthUsd: 31_000_000_000,
    netWorthSourceName: "Forbes",
    netWorthSourceUrl: "https://www.forbes.com/profile/william-ding/",
    netWorthAsOf: "2026",
  },
  "klaus-michael-kuehne": {
    id: "klaus-michael-kuehne",
    name: "Klaus-Michael Kühne",
    country: "Germany",
    industry: "Logistics",
    primarySource: "Kuehne + Nagel",
    gender: "male",
    bio: "Joined Kuehne + Nagel, the logistics firm his grandfather co-founded, in 1958 and became CEO in 1966. Now honorary chairman, holding roughly 55% of the company along with large stakes in Hapag-Lloyd, Lufthansa, and Brenntag.",
    wikipediaTitle: "Klaus-Michael_K%C3%BChne",
    netWorthUsd: 40_370_000_000,
    netWorthSourceName: "Forbes",
    netWorthSourceUrl: "https://www.forbes.com/profile/klaus-michael-kuehne/",
    netWorthAsOf: "2026",
  },
  "charles-schwab": {
    id: "charles-schwab",
    name: "Charles Schwab",
    country: "United States",
    industry: "Financial Services",
    primarySource: "The Charles Schwab Corporation",
    gender: "male",
    bio: "Founded his eponymous brokerage in 1971 with $100,000 borrowed from his uncle, pioneering discount trading after 1975 deregulation. Was CEO until 2008 and still co-chairman, owning more than 5% of the firm.",
    wikipediaTitle: "Charles_R._Schwab",
    netWorthUsd: 13_500_000_000,
    netWorthSourceName: "Forbes",
    netWorthSourceUrl: "https://www.forbes.com/profile/charles-schwab/",
    netWorthAsOf: "January 2026",
  },
  "robin-zeng": {
    id: "robin-zeng",
    name: "Robin Zeng",
    country: "China",
    industry: "Batteries & Energy Storage",
    primarySource: "CATL",
    gender: "male",
    bio: "Founded Contemporary Amperex Technology (CATL) in 2011; it has since become the world's dominant EV battery maker, supplying automakers including Tesla, BMW, and Geely with more than 40% of the global market.",
    wikipediaTitle: "Robin_Zeng",
    netWorthUsd: 63_000_000_000,
    netWorthSourceName: "Forbes",
    netWorthSourceUrl: "https://www.forbes.com/profile/robin-zeng/",
    netWorthAsOf: "2026",
  },
};

export function getEstimatedBillionaire(id: string): EstimatedBillionaire | undefined {
  return estimatedBillionaires[id];
}

export function listEstimatedBillionaires(): EstimatedBillionaire[] {
  return Object.values(estimatedBillionaires);
}
