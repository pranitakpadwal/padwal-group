export type RoleFamily = {
  slug: string;
  name: string;
  summary: string;
  intro: string;
  levels: { level: string; titles: string[]; band: string }[];
  skills: string[];
};

// Salary bands are indicative and should be reviewed against your real search data.
export const roles: RoleFamily[] = [
  {
    slug: "technology",
    name: "Technology",
    summary: "Engineering, product, data, security and infrastructure leadership.",
    intro: "Technology roles are the core of our practice. We cover the full ladder from senior engineers to Chief Technology Officers, in product companies, services firms and capability centres.",
    levels: [
      { level: "Senior specialist / Manager", titles: ["Senior Software Engineer", "Engineering Manager", "Data Scientist", "Product Manager", "DevOps Lead"], band: "₹10L – ₹30L" },
      { level: "Director / Senior Manager", titles: ["Director of Engineering", "Principal Architect", "Head of Data", "Senior Product Manager", "Security Manager"], band: "₹30L – ₹70L" },
      { level: "VP / Head of function", titles: ["VP Engineering", "Head of Product", "Head of AI/ML", "CISO", "Head of Infrastructure"], band: "₹70L – ₹1.5Cr" },
      { level: "CXO", titles: ["Chief Technology Officer", "Chief Product Officer", "Chief Data Officer", "Chief Information Officer"], band: "₹1.5Cr – ₹5Cr+" },
    ],
    skills: ["Architecture and scale", "Team building", "Delivery discipline", "Stakeholder and board communication"],
  },
  {
    slug: "business",
    name: "Business & General Management",
    summary: "General management, finance, operations, sales and people leadership.",
    intro: "We hire the people who run the business: general managers, finance and operations leaders, sales heads and HR leaders.",
    levels: [
      { level: "Senior specialist / Manager", titles: ["Finance Manager", "Operations Manager", "Business Development Manager", "HR Business Partner", "Strategy Manager"], band: "₹10L – ₹30L" },
      { level: "Director / Senior Manager", titles: ["Director, Finance", "Director, Operations", "Regional Sales Head", "Head of Strategy", "Head of HR"], band: "₹30L – ₹70L" },
      { level: "VP / Head of function", titles: ["VP Sales", "VP Operations", "Business Unit Head", "VP Finance", "VP HR"], band: "₹70L – ₹1.5Cr" },
      { level: "CXO", titles: ["Chief Executive Officer", "Managing Director", "Chief Financial Officer", "Chief Operating Officer", "Chief People Officer"], band: "₹1.5Cr – ₹5Cr+" },
    ],
    skills: ["P&L ownership", "Commercial judgement", "People leadership", "Governance"],
  },
  {
    slug: "marketing",
    name: "Marketing & Growth",
    summary: "Brand, performance, product marketing, communications and insights.",
    intro: "Marketing hiring ranges from specialist digital roles to Chief Marketing Officers. We pay close attention to whether the candidate's strength is brand, performance or a blend.",
    levels: [
      { level: "Senior specialist / Manager", titles: ["Performance Marketing Manager", "Brand Manager", "Content Lead", "Product Marketing Manager", "CRM Manager"], band: "₹10L – ₹25L" },
      { level: "Director / Senior Manager", titles: ["Director, Marketing", "Head of Growth", "Head of Brand", "Head of Communications", "Head of Insights"], band: "₹25L – ₹60L" },
      { level: "VP / Head of function", titles: ["VP Marketing", "VP Growth", "Head of Digital", "Head of Corporate Communications"], band: "₹60L – ₹1.2Cr" },
      { level: "CXO", titles: ["Chief Marketing Officer", "Chief Growth Officer", "Chief Brand Officer"], band: "₹1.2Cr – ₹3Cr+" },
    ],
    skills: ["Brand and category understanding", "Data-led growth", "Agency and budget management", "Cross-functional influence"],
  },
];
