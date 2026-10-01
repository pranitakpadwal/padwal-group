// ─────────────────────────────────────────────────────────────
// Core facts about the firm. Items flagged `placeholder` show a small
// "Placeholder" tag on the page. Replace with real facts, then delete the flag.
// ─────────────────────────────────────────────────────────────

export const firm = {
  name: "Padwal Group",
  descriptor: "Executive Search & Talent Advisory",
  tagline: "Senior hiring for technology, business and marketing leaders.",
  email: "contact@padwalgroup.example",
  phone: "+91 00000 00000",
  address: "Registered office address, City, State, India",
  hours: "Monday to Friday, 9:30 am to 6:30 pm IST",
  contactPlaceholder: true,
};

// Hide sections you cannot yet back up with real facts.
export const showClients = true; // logo strip + /clients page
export const showJobs = true; // /jobs sample listings

export const stats = [
  { value: "₹10L – ₹5Cr", label: "Compensation range we search across", placeholder: false },
  { value: "00+", label: "Mandates completed", placeholder: true },
  { value: "00+", label: "Client organisations", placeholder: true },
  { value: "3", label: "Core markets: India, USA, Canada", placeholder: false },
];

// HOLD LIST: dummy names. Replace each with a real client only when you have
// written permission to display them.
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

export const process = [
  { n: "01", title: "Briefing", body: "We take a detailed brief covering the role, the business context, the reporting line and what success looks like in the first twelve months. We agree the profile, the compensation range and the timeline in writing." },
  { n: "02", title: "Market mapping", body: "We identify target companies and the individuals within them, including people who are not looking. You see the map before we approach anyone." },
  { n: "03", title: "Approach and assessment", body: "Direct, confidential outreach, followed by structured interviews, competency assessment and reference checks. Nothing reaches you unvetted." },
  { n: "04", title: "Shortlist and interviews", body: "A concise shortlist with our written assessment of each candidate, and coordination of your interview rounds." },
  { n: "05", title: "Offer and onboarding", body: "Offer structuring, negotiation, notice-period management and follow-up after joining." },
];
