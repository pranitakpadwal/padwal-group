import { billionaires } from "@/data/billionaires";
import type { Leaderboard, RankedBillionaire } from "@/lib/net-worth";
import { selectMovers } from "@/lib/net-worth";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Display name for each tracked ticker — the actual listed company, not the person's whole empire. */
const COMPANY_NAMES: Record<string, string> = {
  TSLA: "Tesla",
  AMZN: "Amazon",
  META: "Meta Platforms",
  ORCL: "Oracle",
  GOOGL: "Alphabet (Google)",
  MSFT: "Microsoft",
  "BRK-B": "Berkshire Hathaway",
  "MC.PA": "LVMH",
  NVDA: "Nvidia",
  DELL: "Dell Technologies",
  NKE: "Nike",
  WMT: "Walmart",
  "OR.PA": "L'Oréal",
  LVS: "Las Vegas Sands",
  "BMW.DE": "BMW",
  BMBL: "Bumble",
  "RELIANCE.NS": "Reliance Industries",
  "ADANIENT.NS": "Adani Enterprises",
  "HCLTECH.NS": "HCL Technologies",
  "DMART.NS": "Avenue Supermarts (DMart)",
  "GRASIM.NS": "Grasim Industries",
  "JINDALSTEL.NS": "Jindal Steel & Power",
  SNAP: "Snap Inc.",
  SPOT: "Spotify",
  ABNB: "Airbnb",
  "GMEXICOB.MX": "Grupo México",
  "4280.SR": "Kingdom Holding",
  "ADS.DE": "Adidas",
  "9633.HK": "Nongfu Spring",
  BABA: "Alibaba",
  "0700.HK": "Tencent",
  "9983.T": "Fast Retailing (Uniqlo)",
  "9984.T": "SoftBank Group",
  COIN: "Coinbase",
  MSTR: "Strategy (MicroStrategy)",
};

export function companyName(ticker: string): string {
  return COMPANY_NAMES[ticker] ?? ticker;
}

export interface CompanyInfo {
  ticker: string;
  name: string;
  slug: string;
  personIds: string[];
}

/** Every tracked ticker with its owners, most owners first. */
export function listCompanies(): CompanyInfo[] {
  const byTicker = new Map<string, string[]>();
  for (const person of billionaires) {
    if (!person.ticker) continue;
    const ids = byTicker.get(person.ticker) ?? [];
    ids.push(person.id);
    byTicker.set(person.ticker, ids);
  }
  return Array.from(byTicker.entries())
    .map(([ticker, personIds]) => ({
      ticker,
      name: companyName(ticker),
      slug: slugify(companyName(ticker)),
      personIds,
    }))
    .sort((a, b) => b.personIds.length - a.personIds.length || a.name.localeCompare(b.name));
}

export function companyFromSlug(slug: string): CompanyInfo | null {
  return listCompanies().find((c) => c.slug === slug) ?? null;
}

export interface CompanyView {
  ticker: string;
  name: string;
  people: RankedBillionaire[];
  topGainers: RankedBillionaire[];
  topLosers: RankedBillionaire[];
}

export function getCompanyView(leaderboard: Leaderboard, info: CompanyInfo): CompanyView {
  const idSet = new Set(info.personIds);
  const ranked = leaderboard.people
    .filter((p) => idSet.has(p.id))
    .slice()
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .map((person, index) => ({ ...person, rank: index + 1 }));
  const { topGainers, topLosers } = selectMovers(ranked);
  return { ticker: info.ticker, name: info.name, people: ranked, topGainers, topLosers };
}
