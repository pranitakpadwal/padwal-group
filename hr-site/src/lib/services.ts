export type Service = {
  slug: string;
  title: string;
  band: string;
  summary: string;
  intro: string;
  sections: { h: string; p: string[] }[];
  deliverables: string[];
  suited: string[];
  timeline: string;
};

export const services: Service[] = [
  {
    slug: "executive-search",
    title: "Executive Search",
    band: "₹1Cr – ₹5Cr+",
    summary: "Confidential, retained searches for CXO, business head and board-adjacent roles.",
    intro: "Our retained executive search practice handles appointments where the choice of leader shapes the next several years of the business. Searches are run confidentially, with a dedicated partner and a small team.",
    sections: [
      { h: "How we run a search", p: [
        "Every search starts with a long conversation about the business, not just the job description. We want to understand where the organisation is going, what the outgoing or previous incumbent did well, and what has to change.",
        "We then map the relevant market, approach people directly and assess them in depth. Many of the strongest candidates at this level are not looking, so direct approach is the core of the work, not an afterthought.",
      ] },
      { h: "Confidentiality", p: [
        "Where the search is sensitive, such as a replacement of a sitting leader or a new business line, we can run it without naming the client until a candidate has shown serious interest and signed appropriate undertakings.",
      ] },
    ],
    deliverables: ["Written search brief and candidate profile", "Target company and talent map", "Structured interviews and competency assessment", "Referencing and background verification", "Shortlist report with our recommendation", "Offer negotiation and joining support"],
    suited: ["CEO, MD and country head appointments", "CTO, CFO, CMO, CHRO and other CXO roles", "Business unit and P&L leaders", "Roles being created for the first time"],
    timeline: "Indicatively eight to fourteen weeks from brief to offer, depending on seniority and notice periods.",
  },
  {
    slug: "senior-hiring",
    title: "Senior & Mid-Senior Hiring",
    band: "₹10L – ₹1Cr",
    summary: "Dedicated hiring for experienced managers, specialists and functional heads.",
    intro: "For roles below the leadership team, where the need is for a strong, experienced individual contributor or manager, we offer a faster, more structured model with a clear timeline and fee basis.",
    sections: [
      { h: "A faster route for experienced hires", p: [
        "Roles such as engineering managers, principal architects, product leaders, regional sales heads and senior marketers are hired often and need to be filled quickly. We keep an active network in these functions and can usually present first profiles within two weeks.",
        "We still assess every candidate ourselves. A profile that has not been interviewed by one of our consultants does not go to you.",
      ] },
      { h: "Engagement options", p: [
        "Depending on the role and urgency, we work on a contingent basis, a retained basis, or a hybrid. We will recommend the model that suits the role rather than the one that suits us.",
      ] },
    ],
    deliverables: ["Role scoping and compensation guidance", "Active search and direct approach", "Interview and technical or functional assessment", "Regular written progress updates", "Offer and notice-period management"],
    suited: ["Engineering, data and product managers", "Functional heads and senior managers", "Regional sales and marketing leaders", "Specialist roles that are hard to find"],
    timeline: "Indicatively four to eight weeks from brief to offer.",
  },
  {
    slug: "leadership-advisory",
    title: "Leadership Assessment & Advisory",
    band: "Retained",
    summary: "Assessment of internal and external leaders, succession planning and senior team design.",
    intro: "Not every leadership question is a hiring question. We advise on whether the right people are in the right seats, who is ready to step up, and what the senior team needs to look like for the next stage of growth.",
    sections: [
      { h: "What we assess", p: [
        "We use structured interviews, case-based exercises and reference conversations to assess leadership capability against the role being filled or the stage the business is entering. Assessments are written up in plain language, with clear recommendations.",
      ] },
      { h: "Succession and team design", p: [
        "For founder-led and family-owned businesses in particular, we help define the senior roles needed, the sequence in which to fill them, and the internal candidates worth developing.",
      ] },
    ],
    deliverables: ["Leadership competency framework", "Individual assessment reports", "Succession and bench-strength review", "Senior organisation design recommendations"],
    suited: ["Promoter-led and family businesses", "Companies preparing for investment or listing", "Organisations restructuring their senior team", "Boards seeking an independent view"],
    timeline: "Scoped per engagement. Most assessments complete within four to six weeks.",
  },
  {
    slug: "rpo",
    title: "Recruitment Process Outsourcing",
    band: "Project-based",
    summary: "An embedded recruitment team for sustained or multi-location hiring programmes.",
    intro: "For organisations hiring across many roles or locations over a sustained period, we provide a dedicated recruitment team that works as an extension of your talent acquisition function.",
    sections: [
      { h: "How it works", p: [
        "We agree a hiring plan, service levels and reporting. A small team then runs sourcing, screening and coordination, with your hiring managers making the decisions. You get weekly reporting on pipeline, time-to-fill and offer acceptance.",
      ] },
      { h: "Where it fits", p: [
        "RPO works best when the volume is predictable and the roles are repeatable. For one-off senior appointments, search is usually the better route and we will say so.",
      ] },
    ],
    deliverables: ["Hiring plan and service-level agreement", "Dedicated recruitment team", "Sourcing, screening and scheduling", "Weekly pipeline and metrics reporting", "Employer-brand and candidate-experience input"],
    suited: ["New offices and capability centres", "Expansion into new cities or countries", "Peak hiring cycles", "Companies without an in-house recruiting team"],
    timeline: "Typically a six to twelve month engagement, reviewed quarterly.",
  },
  {
    slug: "talent-mapping",
    title: "Talent Mapping & Market Intelligence",
    band: "Project-based",
    summary: "A clear view of who is where in your market, before you commit to a hire.",
    intro: "Before opening a role, or when entering a new market, it helps to know who the relevant people are, where they work and what they earn. We produce confidential talent maps and market reports for exactly this purpose.",
    sections: [
      { h: "What a talent map contains", p: [
        "A talent map lists target organisations, the leaders and specialists within them, their approximate tenure and background, and our view on who is realistically approachable. It is built from direct conversations, not scraped lists.",
      ] },
    ],
    deliverables: ["Target organisation list", "Individual-level map for key roles", "Availability and approachability notes", "Summary report with recommendations"],
    suited: ["Market entry and new business lines", "Build-versus-buy decisions on talent", "Pre-search scoping", "Investor and board discussions"],
    timeline: "Indicatively three to five weeks.",
  },
  {
    slug: "compensation-benchmarking",
    title: "Compensation Benchmarking",
    band: "Project-based",
    summary: "Role-level compensation guidance drawn from live search conversations.",
    intro: "Compensation data from surveys is often a year old by the time it is published. Because we speak to senior candidates every week, we can give you a current view of what specific roles pay and what it takes to move a candidate.",
    sections: [
      { h: "What you receive", p: [
        "A benchmarking note for the roles you specify, covering fixed pay, variable pay, long-term incentives, notice periods and typical counter-offer behaviour in the relevant segment.",
      ] },
    ],
    deliverables: ["Role-by-role compensation ranges", "Fixed versus variable pay structure", "Notice-period and counter-offer commentary", "Recommendations for your offer structure"],
    suited: ["Before launching a senior search", "Annual compensation reviews", "Offers being benchmarked against the market", "Cross-border roles (India, USA, Canada)"],
    timeline: "Indicatively one to two weeks.",
  },
];
