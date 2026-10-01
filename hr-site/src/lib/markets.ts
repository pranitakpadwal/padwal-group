export type Market = {
  slug: string;
  name: string;
  summary: string;
  intro: string;
  points: { h: string; p: string }[];
};

export const markets: Market[] = [
  {
    slug: "india",
    name: "India",
    summary: "Domestic hiring across metros and emerging cities.",
    intro: "Our home market. We hire for Indian companies, for the Indian operations of global firms, and for global capability centres.",
    points: [
      { h: "Metros and emerging cities", p: "Search across the major metros as well as Tier 2 cities where talent availability and relocation expectations differ." },
      { h: "Notice periods and counter-offers", p: "Notice periods of sixty to ninety days are common at senior levels. We manage the period actively and prepare clients for counter-offers." },
      { h: "Global capability centres", p: "We support GCCs in building leadership teams in India that report into global headquarters." },
    ],
  },
  {
    slug: "usa",
    name: "United States",
    summary: "Support for US organisations building teams with India and cross-border talent.",
    intro: "We work with US organisations that are hiring in India, or that want access to experienced professionals willing to work across both markets.",
    points: [
      { h: "India operations for US firms", p: "Leadership and technology hiring for US companies establishing or scaling teams in India." },
      { h: "Cross-border talent", p: "Experienced professionals with US exposure, and returnees with international experience." },
      { h: "Time-zone aware process", p: "Interview scheduling and reporting designed around US working hours." },
    ],
  },
  {
    slug: "canada",
    name: "Canada",
    summary: "Hiring for Canadian clients, with access to talent in India and the diaspora.",
    intro: "We support Canadian organisations hiring technology, business and marketing professionals, including those looking to build or expand teams in India.",
    points: [
      { h: "Canada–India hiring", p: "Teams for Canadian companies with delivery or operations in India." },
      { h: "Skilled-professional pipelines", p: "Access to experienced professionals in India and in the Indian diaspora." },
      { h: "Process clarity", p: "Clear documentation and regular updates, so Canadian hiring managers can follow the search without chasing." },
    ],
  },
  {
    slug: "international",
    name: "International Clients",
    summary: "Indian companies expanding abroad, and international clients with India operations.",
    intro: "Beyond our three core markets, we take on mandates for international clients entering India and for Indian companies building leadership teams overseas.",
    points: [
      { h: "Market entry", p: "Country head and founding-team searches for companies establishing an Indian presence." },
      { h: "Indian companies going abroad", p: "Leaders with the international experience to run overseas subsidiaries." },
      { h: "Local partners", p: "Where a search needs on-the-ground support outside our own markets, we work with vetted local partners." },
    ],
  },
];
