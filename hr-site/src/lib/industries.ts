export type Industry = {
  slug: string;
  name: string;
  summary: string;
  intro: string;
  roles: string[];
  look: string[];
};

export const industries: Industry[] = [
  {
    slug: "technology",
    name: "Information Technology & Services",
    summary: "Product companies, IT services, SaaS, GCCs and digital businesses.",
    intro: "Technology is the largest part of our work. We hire for product companies, services firms, SaaS businesses and global capability centres in India, as well as US and Canadian technology firms building teams here.",
    roles: ["CTO and VP Engineering", "Engineering and product heads", "Principal and enterprise architects", "Data, ML and AI leaders", "Cloud, security and infrastructure heads", "Delivery and account leaders in IT services"],
    look: ["Depth in the relevant technology stack and scale", "Experience of building and retaining teams", "Comfort working with global stakeholders", "A record of shipping, not only managing"],
  },
  {
    slug: "financial-services",
    name: "Banking, Financial Services & Insurance",
    summary: "Banks, NBFCs, insurers, asset managers and fintechs.",
    intro: "Financial services hiring is shaped by regulation and by the movement of senior people between institutions. We support banks, NBFCs, insurers, asset and wealth managers and fintech firms.",
    roles: ["Business heads and regional heads", "Risk, compliance and audit leaders", "CFO and finance leadership", "Product and digital banking heads", "Wealth and distribution leaders", "Technology and data leaders in BFSI"],
    look: ["Regulatory fluency", "A clean and verifiable professional record", "P&L ownership", "Experience across market cycles"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing & Industrial",
    summary: "Engineering, auto, capital goods, chemicals and process industries.",
    intro: "We help manufacturers hire plant, operations, supply chain and commercial leaders, as well as the technology and finance leaders who support them.",
    roles: ["Plant and operations heads", "Supply chain and procurement leaders", "Quality and manufacturing excellence heads", "Business unit and sales leaders", "CFO and controllership", "Digital and Industry 4.0 leaders"],
    look: ["Hands-on operational credibility", "Experience at comparable scale", "Safety and compliance discipline", "Ability to lead through change"],
  },
  {
    slug: "healthcare",
    name: "Healthcare & Life Sciences",
    summary: "Hospitals, pharma, medical devices, diagnostics and health-tech.",
    intro: "Healthcare organisations need leaders who can balance clinical, commercial and regulatory demands. We hire non-clinical leadership and specialist roles across the sector.",
    roles: ["Hospital and network operations heads", "Commercial and marketing leaders", "Regulatory and quality heads", "Business development and market access", "Health-tech product and engineering leaders", "Finance and strategy"],
    look: ["Understanding of regulatory environments", "Stakeholder management across clinicians and administrators", "Commercial discipline in a mission-led setting"],
  },
  {
    slug: "consumer-retail",
    name: "Consumer & Retail",
    summary: "FMCG, retail, e-commerce, consumer durables and direct-to-consumer brands.",
    intro: "From established FMCG companies to new direct-to-consumer brands, we hire marketing, sales, category and supply chain leaders who understand Indian and international consumers.",
    roles: ["CMO and brand leaders", "Category and merchandising heads", "Sales and distribution leaders", "E-commerce and growth heads", "Supply chain and logistics", "Consumer insights"],
    look: ["Brand-building track record", "Distribution and channel knowledge", "Data-led decision making", "Comfort with fast-moving categories"],
  },
  {
    slug: "infrastructure-energy",
    name: "Infrastructure & Energy",
    summary: "Power, renewables, construction, real estate, logistics and utilities.",
    intro: "Large projects need leaders who can manage capital, contractors, regulators and timelines. We hire project, commercial and corporate leaders for infrastructure and energy businesses.",
    roles: ["Project and programme directors", "Business development and tendering heads", "Commercial and contracts leaders", "CFO and treasury", "Operations and asset management", "Sustainability and ESG leaders"],
    look: ["Experience delivering large projects", "Familiarity with public-sector counterparties", "Financial and commercial rigour"],
  },
  {
    slug: "public-sector",
    name: "Education & Public Sector",
    summary: "Government bodies, PSUs, universities and public institutions.",
    intro: "We support public institutions that need experienced professionals through a transparent and documented process. See also our dedicated government page.",
    roles: ["Programme and project directors", "Technology and digital leaders", "Finance and administration heads", "Policy and research specialists", "Institution and campus leadership"],
    look: ["Familiarity with public-sector processes", "Integrity and transparency", "Ability to deliver within institutional constraints"],
  },
];
