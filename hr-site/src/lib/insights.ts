export type Article = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: { h?: string; p: string }[];
};

// Draft articles. Edit freely, add your own byline, and publish real dates once ready.
export const articles: Article[] = [
  {
    slug: "how-to-run-a-cxo-search",
    title: "How to run a CXO search without losing six months",
    category: "For clients",
    summary: "The four decisions that most often decide whether a senior search finishes on time.",
    body: [
      { p: "Senior searches rarely fail because of a shortage of candidates. They fail because the organisation was not aligned on what it was hiring for. These are the four decisions that matter most." },
      { h: "1. Agree who decides", p: "Name the decision-maker and the small group that must be comfortable. Searches stall when a late-stage interviewer, often a promoter or investor, introduces a new view on the profile." },
      { h: "2. Write the real brief", p: "A job description lists responsibilities. A brief says what has to be true in twelve months. Be specific about the problem the new leader is being hired to solve, and what is not their job." },
      { h: "3. Be honest about compensation early", p: "Candidates at this level compare the whole package, including variable pay, long-term incentives and the cost of leaving unvested benefits. A range that is clearly below market will not be fixed by a good pitch." },
      { h: "4. Plan for the notice period", p: "Ninety days of notice is common. A search that closes in ten weeks still means a leader who starts in six months. Plan the interim arrangements accordingly." },
    ],
  },
  {
    slug: "hiring-across-india-usa-canada",
    title: "Hiring across India, the USA and Canada: what changes",
    category: "Global hiring",
    summary: "Notice periods, compensation structure and process expectations differ more than most teams expect.",
    body: [
      { p: "Organisations hiring in more than one country often apply a single playbook. In practice, three things change materially between markets." },
      { h: "Notice periods", p: "Notice periods in India are typically much longer than those in North America, especially at senior levels. This affects both timelines and the risk of counter-offers." },
      { h: "Compensation structure", p: "The mix of fixed pay, variable pay and equity differs by market and by company type. Comparing headline numbers alone often misleads." },
      { h: "Process and communication", p: "Candidates in each market have different expectations about speed, feedback and the number of interview rounds. A slow process loses candidates everywhere, but the tolerance threshold varies." },
    ],
  },
  {
    slug: "briefing-a-search-partner",
    title: "What to put in a brief for a search partner",
    category: "For clients",
    summary: "A checklist for the first conversation with an executive search firm.",
    body: [
      { p: "A good first briefing saves weeks later. Before you speak to a search firm, have a view on the following." },
      { h: "The business context", p: "Where the business is, where it is going, and why this role exists now." },
      { h: "The profile", p: "Must-have and nice-to-have experience, the sectors you would hire from, and whether you will consider candidates from outside your industry." },
      { h: "The package", p: "A realistic range for fixed pay, variable pay and any long-term incentive, and how much flexibility you have." },
      { h: "The process", p: "Who will interview, in what order, how fast you can move, and any internal candidates who should be considered." },
    ],
  },
  {
    slug: "moving-to-a-senior-role",
    title: "For candidates: moving into your first senior role",
    category: "For candidates",
    summary: "How to think about a move from manager to director or head of function.",
    body: [
      { p: "The step from senior manager to director or head of function changes what you are assessed on. Technical excellence stays necessary but no longer decides the outcome." },
      { h: "Show scope, not just delivery", p: "Describe the size of the team, budget and business outcome you were responsible for, and what changed because of your decisions." },
      { h: "Be ready to talk about people", p: "Expect questions on how you hired, developed and, where needed, exited people." },
      { h: "Understand the whole package", p: "Look beyond fixed pay. Ask about variable pay, equity, reporting line and the mandate you are being given." },
    ],
  },
];
