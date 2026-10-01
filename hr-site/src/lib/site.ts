// ─────────────────────────────────────────────────────────────
// Everything you'll want to edit lives here.
// Items with `placeholder: true` show a small "Placeholder" tag on the page.
// Replace them with real facts, then delete the flag.
// ─────────────────────────────────────────────────────────────

export const firm = {
  name: "Padwal Group",
  descriptor: "Executive Search & Talent Advisory",
  tagline: "Senior hiring for technology, business and marketing leaders.",
  email: "contact@padwalgroup.example", // placeholder
  phone: "+91 00000 00000", // placeholder
  address: "City, India", // placeholder
  contactPlaceholder: true,
};

// Set to false to hide client logos, the Clients page and its nav link
// until you have real clients you can name publicly.
export const showClients = true;

const allNav = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries & Roles" },
  { href: "/government", label: "Government" },
  { href: "/global", label: "Global" },
  { href: "/clients", label: "Clients" },
  { href: "/about", label: "About" },
];

export const nav = allNav.filter((n) => showClients || n.href !== "/clients");

// Proof figures. Replace with real numbers only.
export const stats = [
  { value: "₹10L – ₹5Cr", label: "Compensation range we search across", placeholder: false },
  { value: "00+", label: "Mandates completed", placeholder: true },
  { value: "00+", label: "Client organisations", placeholder: true },
  { value: "3+", label: "Countries served: India, USA, Canada", placeholder: true },
];

export const services = [
  {
    title: "Executive Search",
    body: "Confidential, retained searches for CXO, VP and Director roles. We map the market, approach candidates directly and present a short, well-vetted shortlist.",
    band: "₹1Cr – ₹5Cr+",
  },
  {
    title: "Senior & Mid-Senior Hiring",
    body: "Contingent and retained hiring for experienced managers, architects and functional heads, with a defined timeline and a clear fee structure.",
    band: "₹10L – ₹1Cr",
  },
  {
    title: "Leadership & Board Advisory",
    body: "Support on leadership assessment, succession planning and building senior teams for growing and restructuring organisations.",
    band: "Retained",
  },
  {
    title: "Recruitment Process Outsourcing",
    body: "A dedicated recruitment team embedded with your organisation for sustained, high-volume or multi-location hiring programmes.",
    band: "Project-based",
  },
];

export const process = [
  { n: "01", title: "Briefing", body: "We take a detailed brief: the role, the business context, the team, and what success looks like in the first year." },
  { n: "02", title: "Market mapping", body: "We identify target companies and candidates, including those who are not actively looking." },
  { n: "03", title: "Approach & assessment", body: "Direct outreach, structured interviews and reference checks before any profile reaches you." },
  { n: "04", title: "Shortlist & interviews", body: "A concise shortlist with our assessment notes, and coordination of your interview process." },
  { n: "05", title: "Offer & onboarding", body: "Offer negotiation, notice-period management and post-joining follow-up." },
];

export const functions = [
  {
    name: "Technology",
    roles: ["CTO / VP Engineering", "Engineering & Product Heads", "Architects", "Data, AI & Analytics Leaders", "Cybersecurity & Infrastructure", "Engineering Managers"],
  },
  {
    name: "Business",
    roles: ["CEO / MD / GM", "CFO & Finance Leaders", "Operations & Supply Chain", "Strategy & Business Development", "Sales & Revenue Leaders", "HR & People Leaders"],
  },
  {
    name: "Marketing",
    roles: ["CMO / VP Marketing", "Brand & Communications", "Growth & Performance Marketing", "Product Marketing", "Digital & Content Leaders", "Market Research & Insights"],
  },
];

export const sectors = [
  "Information Technology & Services",
  "Banking, Financial Services & Insurance",
  "Manufacturing & Industrial",
  "Healthcare & Life Sciences",
  "Consumer & Retail",
  "Infrastructure & Energy",
  "Education & Public Sector",
];

export const regions = [
  { name: "India", body: "Domestic hiring across metros and emerging cities for Indian companies and the Indian arms of global firms." },
  { name: "United States", body: "Support for US organisations building leadership and technology teams, including India-based and cross-border talent." },
  { name: "Canada", body: "Hiring for Canadian clients, with access to candidates in India and the wider diaspora." },
  { name: "Other markets", body: "Mandates for international clients with India operations, and for Indian companies expanding abroad." },
];

// HOLD LIST: dummy names. Replace each with a real client (and later a logo)
// only when you have written permission to display them.
export const clients = [
  { name: "Client One", sector: "Technology", region: "India" },
  { name: "Client Two", sector: "Financial Services", region: "USA" },
  { name: "Client Three", sector: "Manufacturing", region: "India" },
  { name: "Client Four", sector: "Healthcare", region: "Canada" },
  { name: "Client Five", sector: "Consumer", region: "India" },
  { name: "Client Six", sector: "Public Sector", region: "India" },
  { name: "Client Seven", sector: "Technology", region: "USA" },
  { name: "Client Eight", sector: "Energy", region: "India" },
];
