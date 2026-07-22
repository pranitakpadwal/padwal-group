import { getLeaderboard } from "@/lib/net-worth";
import { getCompanyCaps, getRosterNetWorths, CALCULATOR_COMPANIES } from "@/lib/calculator-data";
import { getPersonHistory } from "@/lib/snapshots";
import { billionaires } from "@/data/billionaires";
import { personProfiles } from "@/data/profiles";
import { SPEND_ITEMS } from "@/data/spend-items";
import { RICHEST_BY_YEAR } from "@/data/richest-by-year";
import { CPI_BASE_YEAR, inflationMultiplier } from "@/data/cpi";
import { formatUsdCompact, formatCompactNumber } from "@/lib/format";
import { nameList, type Faq } from "@/lib/article-template";
import type { CoveragePerson } from "@/lib/related-coverage";

export interface CalculatorArticleSummary {
  slug: string;
  calculatorHref: string;
  calculatorLabel: string;
  title: string;
  blurb: string;
}

export interface CalculatorArticle extends CalculatorArticleSummary {
  description: string;
  eyebrow: string;
  stat: string;
  subtitle: string;
  narrative: string[];
  faqs: Faq[];
  relatedPeople: CoveragePerson[];
}

/**
 * Static index metadata — cheap to list without hitting live data. The
 * actual article body is only ever computed on demand, per slug, from real
 * live figures (never stored/fabricated). Add one entry here (and one
 * builder function below) each time we publish a new calculator article.
 */
export const CALCULATOR_ARTICLE_INDEX: CalculatorArticleSummary[] = [
  {
    slug: "what-the-worlds-richest-persons-fortune-could-buy-outright",
    calculatorHref: "/calculators/own-a-company",
    calculatorLabel: "Own a Piece of a Company",
    title: "What the World's Richest Person's Fortune Could Buy Outright",
    blurb: "We checked one fortune against 20 of the world's biggest public companies, share for share.",
  },
  {
    slug: "net-worth-it-takes-to-crack-the-top-10-billionaires",
    calculatorHref: "/calculators/net-worth-rank",
    calculatorLabel: "Net Worth Rank",
    title: "How Much Net Worth Does It Take to Crack the Top 10 Billionaires Right Now?",
    blurb: "The live cut-off for the top 10, top 25, top 50, and top 100 — recalculated from today's numbers.",
  },
  {
    slug: "how-far-the-richest-persons-fortune-goes-on-real-billionaire-purchases",
    calculatorHref: "/calculators/spend",
    calculatorLabel: "Spend a Billionaire's Fortune",
    title: "We Tried to Spend the World's Richest Fortune on Real Billionaire Purchases",
    blurb: "One of literally everything — a coffee, a jet, an NFL team, Twitter — and the fortune barely moved.",
  },
  {
    slug: "everyone-whos-been-the-worlds-richest-person-since-1987",
    calculatorHref: "/calculators/birthday",
    calculatorLabel: "Richest Person When You Were Born",
    title: "Everyone Who's Been the World's Richest Person Since Forbes Started Ranking",
    blurb: "Only a handful of people have ever held the crown since the first World's Billionaires list in 1987.",
  },
  {
    slug: "what-the-richest-people-had-done-by-age-30",
    calculatorHref: "/calculators/billionaire-by-age",
    calculatorLabel: "When They Were Your Age",
    title: "What the World's Richest People Had Actually Done by Age 30",
    blurb: "Real career-timeline milestones, sorted by the age they happened — not every founder was ahead of schedule.",
  },
  {
    slug: "what-old-billionaire-fortunes-are-worth-in-todays-dollars",
    calculatorHref: "/calculators/inflation",
    calculatorLabel: "Wealth Inflation Calculator",
    title: "What Rockefeller's First Billion Is Worth in Today's Dollars",
    blurb: "Official US CPI data applied to four famous historical fortunes, measured against today's richest person.",
  },
  {
    slug: "how-often-is-the-worlds-richest-person-actually-in-first",
    calculatorHref: "/calculators/wealth-race",
    calculatorLabel: "Wealth Race",
    title: "How Often Is the World's Richest Person Actually in First Place?",
    blurb: "Live day-by-day snapshot history between #1 and #2 — the lead changes more than the annual lists suggest.",
  },
];

function pct(value: number): string {
  return `${value.toFixed(value < 10 ? 1 : 0)}%`;
}

/** Lowercases only the first character, so a title can open a mid-sentence clause without mangling proper nouns ("Zip2", "Facebook") elsewhere in it. */
function lowerFirst(text: string): string {
  return text.length === 0 ? text : text[0].toLowerCase() + text.slice(1).replace(/\.$/, "");
}

async function buildOwnACompanyArticle(): Promise<CalculatorArticle> {
  const [leaderboard, companies] = await Promise.all([getLeaderboard(), getCompanyCaps()]);
  const top = leaderboard.people[0];
  const firstName = top.name.split(" ")[0];

  const ranked = companies
    .map((c) => ({ ...c, affordPercent: Math.min(100, (top.netWorthUsd / c.marketCapUsd) * 100) }))
    .sort((a, b) => b.affordPercent - a.affordPercent);
  const fullyBuyable = ranked.filter((c) => c.affordPercent >= 100);
  const partial = ranked.filter((c) => c.affordPercent < 100).slice(0, 4);

  const narrative: string[] = [
    `${top.name} is worth an estimated ${formatUsdCompact(top.netWorthUsd)} right now. We measured that fortune against the live market value of ${CALCULATOR_COMPANIES.length} of the world's biggest public companies — from Apple and Nvidia to Reliance Industries and Saudi Aramco — to see exactly how much of each ${firstName} could buy outright, today, with cash alone.`,
  ];

  if (fullyBuyable.length > 0) {
    narrative.push(
      `${firstName} could buy ${nameList(fullyBuyable)} outright — 100% of ${fullyBuyable.length === 1 ? "the company" : "each company"} — and still have money left over. ${fullyBuyable[0].name} alone is valued at ${formatUsdCompact(fullyBuyable[0].marketCapUsd)}.`,
    );
  } else if (companies.length > 0) {
    narrative.push(
      `Even the world's richest fortune doesn't stretch to buying any of these companies outright — every one of them is currently worth more than ${firstName}'s entire net worth.`,
    );
  }

  if (partial.length > 0) {
    const biggest = partial[0];
    const smallest = partial[partial.length - 1];
    narrative.push(
      `Among the rest, ${firstName}'s fortune would buy about ${pct(biggest.affordPercent)} of ${biggest.name} (market cap ${formatUsdCompact(biggest.marketCapUsd)})${
        partial.length > 1 ? `, tapering down to roughly ${pct(smallest.affordPercent)} of ${smallest.name}` : ""
      }. Market caps move every trading day, so these percentages shift right along with them.`,
    );
  } else if (companies.length === 0) {
    narrative.push(
      "Live market caps for this comparison didn't load this time — refresh the page in a moment to see the full breakdown.",
    );
  }

  const faqs: Faq[] = [
    {
      question: `Could ${top.name} really buy a company outright?`,
      answer: `Only in theory — this compares net worth (mostly stock in one company) to another company's total market value. Buying real shares at scale would move the price, and most of ${firstName}'s wealth is tied up in their own holdings, not free cash.`,
    },
    {
      question: "Which companies are included in this comparison?",
      answer: `${companies.length} major global companies across the US, India, Europe, the Middle East, and Asia — the same list used in our "Own a Piece of a Company" calculator.`,
    },
    {
      question: "How often does this update?",
      answer: "Every time the page loads — both the billionaire's net worth and every company's market cap are pulled live, so the percentages here are never more than a few minutes stale.",
    },
  ];

  return {
    ...CALCULATOR_ARTICLE_INDEX[0],
    description: narrative[0],
    eyebrow: "Own a Piece of a Company",
    stat: formatUsdCompact(top.netWorthUsd),
    subtitle: `${top.name}'s live net worth`,
    narrative,
    faqs,
    relatedPeople: [{ id: top.id, name: top.name }],
  };
}

async function buildNetWorthRankArticle(): Promise<CalculatorArticle> {
  const roster = await getRosterNetWorths();
  const total = roster.length;
  const tiers = [10, 25, 50, 100].filter((rank) => rank <= total);

  const narrative: string[] = [
    `We track ${total} billionaires in real time. Here's exactly how much net worth it takes right now to land at each major cut-off on that list.`,
  ];

  for (const rank of tiers) {
    const person = roster[rank - 1];
    narrative.push(
      `Top ${rank}: you need at least ${formatUsdCompact(person.netWorthUsd)} — that's where ${person.name} currently sits, at #${rank}.`,
    );
  }

  const last = roster[total - 1];
  narrative.push(
    `At the other end, ${last.name} holds down the final spot we track, at ${formatUsdCompact(last.netWorthUsd)} — still a fortune almost no one on Earth will ever see, and still the "floor" of this particular list.`,
  );

  const faqs: Faq[] = [
    {
      question: "How much net worth do you need to be in the top 10 billionaires?",
      answer: tiers.includes(10)
        ? `Right now, ${formatUsdCompact(roster[9].netWorthUsd)} — the net worth of ${roster[9].name}, who currently holds the #10 spot.`
        : `We're currently tracking fewer than 10 people on this particular list; check back as coverage grows.`,
    },
    {
      question: "Does this cut-off change often?",
      answer: "Yes — every ranked person's net worth is recalculated from live stock prices, so the exact figure needed to crack any tier moves throughout each trading day.",
    },
    {
      question: "Can I check where my own net worth would land?",
      answer: "Yes — use the Net Worth Rank calculator above to enter any amount, in any currency, and see your exact placement against the full list.",
    },
  ];

  return {
    ...CALCULATOR_ARTICLE_INDEX[1],
    description: narrative[0],
    eyebrow: "Net Worth Rank",
    stat: tiers.includes(10) ? formatUsdCompact(roster[9].netWorthUsd) : formatUsdCompact(roster[0].netWorthUsd),
    subtitle: "to crack the top 10, right now",
    narrative,
    faqs,
    relatedPeople: tiers.map((rank) => ({ id: roster[rank - 1].id, name: roster[rank - 1].name })),
  };
}

async function buildSpendArticle(): Promise<CalculatorArticle> {
  const leaderboard = await getLeaderboard();
  const top = leaderboard.people[0];
  const firstName = top.name.split(" ")[0];

  const totalOfOne = SPEND_ITEMS.reduce((sum, item) => sum + item.priceUsd, 0);
  const remaining = top.netWorthUsd - totalOfOne;
  const percentUsed = (totalOfOne / top.netWorthUsd) * 100;
  const repeats = remaining > 0 ? Math.floor(remaining / totalOfOne) : 0;

  const priciest = [...SPEND_ITEMS].sort((a, b) => b.priceUsd - a.priceUsd)[0];
  const priciestCount = Math.floor(top.netWorthUsd / priciest.priceUsd);
  const coffee = SPEND_ITEMS.find((item) => item.id === "coffee");
  const coffeeCount = coffee ? Math.floor(top.netWorthUsd / coffee.priceUsd) : null;

  const narrative: string[] = [
    `${top.name}'s live net worth is an estimated ${formatUsdCompact(top.netWorthUsd)}. We built a shopping list of ${SPEND_ITEMS.length} real, documented purchases — from a $6 coffee to Elon Musk's actual $44 billion Twitter deal — and added up what it would cost ${firstName} to buy one of literally everything on it.`,
  ];
  narrative.push(
    `The full list comes to ${formatUsdCompact(totalOfOne)} — just ${pct(percentUsed)} of ${firstName}'s fortune. That leaves ${formatUsdCompact(Math.max(remaining, 0))} over${
      repeats > 0 ? `, enough to buy the entire list again ${formatCompactNumber(repeats)} more times` : ""
    }.`,
  );
  narrative.push(
    `Even the priciest item — ${priciest.name} (${lowerFirst(priciest.note)}), at ${formatUsdCompact(priciest.priceUsd)} — barely dents it: ${firstName}'s fortune could buy about ${formatCompactNumber(priciestCount)} of them.${
      coffeeCount ? ` At the other extreme, that same fortune buys roughly ${formatCompactNumber(coffeeCount)} cups of coffee.` : ""
    }`,
  );

  const faqs: Faq[] = [
    {
      question: "Are the item prices on this list real?",
      answer: "Yes — each one is a rounded public figure or a documented deal price (Bezos's Washington Post purchase, Musk's Twitter deal, Ballmer's Clippers purchase, and so on), listed next to the item.",
    },
    {
      question: `How much of ${top.name}'s fortune would it take to buy one of everything?`,
      answer: `About ${pct(percentUsed)}, or ${formatUsdCompact(totalOfOne)} out of an estimated ${formatUsdCompact(top.netWorthUsd)}.`,
    },
    {
      question: "Can I try this with a different billionaire?",
      answer: "Yes — the Spend a Billionaire's Fortune calculator above lets you switch between the top 8 billionaires we track and build your own shopping list against their live net worth.",
    },
  ];

  return {
    ...CALCULATOR_ARTICLE_INDEX[2],
    description: narrative[0],
    eyebrow: "Spend a Billionaire's Fortune",
    stat: pct(percentUsed),
    subtitle: `of ${top.name}'s fortune, buying one of everything`,
    narrative,
    faqs,
    relatedPeople: [{ id: top.id, name: top.name }],
  };
}

interface Reign {
  name: string;
  personId?: string;
  startYear: number;
  endYear: number;
}

function buildReigns(): Reign[] {
  const reigns: Reign[] = [];
  for (const entry of RICHEST_BY_YEAR) {
    const last = reigns[reigns.length - 1];
    if (last && last.name === entry.name) {
      last.endYear = entry.year;
    } else {
      reigns.push({ name: entry.name, personId: entry.personId, startYear: entry.year, endYear: entry.year });
    }
  }
  return reigns;
}

async function buildBirthdayArticle(): Promise<CalculatorArticle> {
  const leaderboard = await getLeaderboard();
  const top = leaderboard.people[0];

  const reigns = buildReigns();
  const distinctPeople = Array.from(new Set(reigns.map((r) => r.name)));
  const longest = reigns.reduce((a, b) => (b.endYear - b.startYear > a.endYear - a.startYear ? b : a));
  const firstYear = RICHEST_BY_YEAR[0].year;
  const lastYear = RICHEST_BY_YEAR[RICHEST_BY_YEAR.length - 1].year;

  const narrative: string[] = [
    `Forbes has published its annual World's Billionaires list every year since ${firstYear}. In that time — ${lastYear - firstYear + 1} years — only ${distinctPeople.length} different people have ever held the #1 spot.`,
    `The reigns, in order: ${reigns.map((r) => (r.startYear === r.endYear ? `${r.name} (${r.startYear})` : `${r.name} (${r.startYear}–${r.endYear})`)).join("; ")}.`,
    `The longest unbroken run belongs to ${longest.name}, who topped the list every year from ${longest.startYear} to ${longest.endYear} — ${longest.endYear - longest.startYear + 1} consecutive years.`,
    `That annual snapshot only updates once a year, though. On a live, real-time basis, ${top.name} currently leads with an estimated ${formatUsdCompact(top.netWorthUsd)} — a number that can (and does) change every trading day, which is the whole premise of this site.`,
  ];

  const faqs: Faq[] = [
    {
      question: "How many people have been the world's richest person since Forbes started ranking?",
      answer: `${distinctPeople.length}: ${nameList(distinctPeople.map((name) => ({ name })))}.`,
    },
    {
      question: "Who has held the #1 spot the longest?",
      answer: `${longest.name}, for ${longest.endYear - longest.startYear + 1} consecutive years (${longest.startYear}–${longest.endYear}) on Forbes' annual list.`,
    },
    {
      question: "Who was the richest person the year I was born?",
      answer: "Use the Richest Person When You Were Born calculator above — enter your birth year to see the annual #1 then, when you turned 18 and 30, and who leads right now.",
    },
  ];

  return {
    ...CALCULATOR_ARTICLE_INDEX[3],
    description: narrative[0],
    eyebrow: "Richest Person When You Were Born",
    stat: `${distinctPeople.length}`,
    subtitle: `people have held #1 since ${firstYear}`,
    narrative,
    faqs,
    relatedPeople: [
      { id: top.id, name: top.name },
      ...reigns.filter((r) => r.personId).map((r) => ({ id: r.personId as string, name: r.name })),
    ],
  };
}

async function buildBillionaireByAgeArticle(): Promise<CalculatorArticle> {
  const leaderboard = await getLeaderboard();

  const candidates = billionaires
    .map((person) => {
      const timeline = personProfiles[person.id]?.careerTimeline;
      const ranked = leaderboard.people.find((p) => p.id === person.id);
      if (!timeline || timeline.length === 0 || !ranked) return null;
      const birthYear = Number(person.birthDate.slice(0, 4));
      const milestonesBy30 = timeline
        .map((event) => ({ ...event, atAge: Number(event.year) - birthYear }))
        .filter((event) => Number.isFinite(event.atAge) && event.atAge >= 0 && event.atAge <= 30)
        .sort((a, b) => a.atAge - b.atAge);
      if (milestonesBy30.length === 0) return null;
      return { person, ranked, earliest: milestonesBy30[0], count: milestonesBy30.length };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.ranked.netWorthUsd - a.ranked.netWorthUsd)
    .slice(0, 5);

  const narrative: string[] = [
    `We went through the documented career timelines of the world's richest people and pulled out everything that happened at or before age 30 — the age most people are still a few years into their first real job.`,
  ];

  for (const entry of candidates) {
    narrative.push(
      `${entry.person.name}, worth an estimated ${formatUsdCompact(entry.ranked.netWorthUsd)} today, had already ${lowerFirst(entry.earliest.title)} by age ${entry.earliest.atAge} (${entry.earliest.year})${
        entry.count > 1 ? `, the first of ${entry.count} documented milestones before turning 30` : ""
      }.`,
    );
  }

  if (candidates.length === 0) {
    narrative.push(
      "None of the career timelines we currently have documented include a milestone at or before age 30 — check back as we add more detailed timelines.",
    );
  }

  const faqs: Faq[] = [
    {
      question: "What had the world's richest people done by age 30?",
      answer:
        candidates.length > 0
          ? `${candidates[0].person.name} had already ${candidates[0].earliest.title.toLowerCase()} by ${candidates[0].earliest.atAge}. See the full comparison above.`
          : "We're still building out documented, age-tagged career timelines for this comparison.",
    },
    {
      question: "Is every billionaire's timeline included?",
      answer: `Only people with a documented career timeline on our site are included — ${candidates.length} currently have at least one milestone at or before age 30.`,
    },
    {
      question: "Can I compare a billionaire to my own age?",
      answer: "Yes — the When They Were Your Age calculator above lets you pick any billionaire with a documented timeline and slide to any age to see exactly what they'd done by then.",
    },
  ];

  return {
    ...CALCULATOR_ARTICLE_INDEX[4],
    description: narrative[0],
    eyebrow: "When They Were Your Age",
    stat: candidates.length > 0 ? `Age ${candidates[0].earliest.atAge}` : "—",
    subtitle: candidates.length > 0 ? `${candidates[0].person.name}'s first big milestone` : "Career timelines",
    narrative,
    faqs,
    relatedPeople: candidates.map((entry) => ({ id: entry.person.id, name: entry.person.name })),
  };
}

async function buildInflationArticle(): Promise<CalculatorArticle> {
  const leaderboard = await getLeaderboard();
  const top = leaderboard.people[0];

  const presets = [
    { label: "Rockefeller's first documented $1 billion", amount: 1_000_000_000, year: 1916 },
    { label: "$100 million in 1980", amount: 100_000_000, year: 1980 },
    { label: "Bill Gates' $12.9 billion Forbes valuation in 1995", amount: 12_900_000_000, year: 1995 },
    { label: "$1 million in 1950", amount: 1_000_000, year: 1950 },
  ]
    .map((preset) => {
      const multiplier = inflationMultiplier(preset.year);
      return multiplier ? { ...preset, converted: preset.amount * multiplier, multiplier } : null;
    })
    .filter((preset): preset is NonNullable<typeof preset> => preset !== null);

  const narrative: string[] = [
    `Old fortunes sound smaller than they were. Using official US Bureau of Labor Statistics CPI data, here's what four famous historical amounts are actually worth in ${CPI_BASE_YEAR} dollars.`,
  ];
  for (const preset of presets) {
    narrative.push(
      `${preset.label} had the buying power of about ${formatUsdCompact(preset.converted)} today — prices are roughly ${preset.multiplier.toFixed(1)}× higher now than in ${preset.year}.`,
    );
  }
  const biggest = presets[0];
  if (biggest) {
    narrative.push(
      `For scale: even converted to today's dollars, that puts ${lowerFirst(biggest.label)} at about ${pct((biggest.converted / top.netWorthUsd) * 100)} of ${top.name}'s current, live net worth of ${formatUsdCompact(top.netWorthUsd)} — a reminder of how much larger fortunes have grown, not just how much prices have.`,
    );
  }

  const faqs: Faq[] = [
    {
      question: "What is $100 million from 1980 worth today?",
      answer: presets.find((p) => p.year === 1980)
        ? `About ${formatUsdCompact(presets.find((p) => p.year === 1980)!.converted)} in ${CPI_BASE_YEAR} dollars, based on official CPI data.`
        : "See the calculator above for a live conversion.",
    },
    {
      question: "What CPI data does this use?",
      answer: `US CPI-U annual averages (all items) from the Bureau of Labor Statistics, covering 1913 through ${CPI_BASE_YEAR}.`,
    },
    {
      question: "Can I convert my own amount and year?",
      answer: "Yes — the Wealth Inflation Calculator above converts any amount and year from 1913 onward into today's dollars.",
    },
  ];

  return {
    ...CALCULATOR_ARTICLE_INDEX[5],
    description: narrative[0],
    eyebrow: "Wealth Inflation Calculator",
    stat: presets[presets.length - 1] ? formatUsdCompact(presets[presets.length - 1].converted) : "—",
    subtitle: presets[presets.length - 1]?.label ?? "Historical fortunes, converted",
    narrative,
    faqs,
    relatedPeople: [{ id: top.id, name: top.name }],
  };
}

async function buildWealthRaceArticle(): Promise<CalculatorArticle> {
  const leaderboard = await getLeaderboard();
  const first = leaderboard.people[0];
  const second = leaderboard.people[1];

  const firstHistory = getPersonHistory(first.id);
  const secondHistory = getPersonHistory(second.id);
  const secondByDate = new Map(secondHistory.map((point) => [point.date, point]));

  let firstLeadDays = 0;
  let secondLeadDays = 0;
  let biggestGap = 0;
  let biggestGapDate: string | null = null;

  for (const point of firstHistory) {
    const other = secondByDate.get(point.date);
    if (!other) continue;
    const gap = point.netWorthUsd - other.netWorthUsd;
    if (gap >= 0) firstLeadDays += 1;
    else secondLeadDays += 1;
    if (Math.abs(gap) > Math.abs(biggestGap)) {
      biggestGap = gap;
      biggestGapDate = point.date;
    }
  }

  const overlapDays = firstLeadDays + secondLeadDays;
  const currentGap = first.netWorthUsd - second.netWorthUsd;

  const narrative: string[] = [
    `Right now, ${first.name} leads ${second.name} by ${formatUsdCompact(Math.abs(currentGap))} — ${formatUsdCompact(first.netWorthUsd)} to ${formatUsdCompact(second.netWorthUsd)}.`,
  ];

  if (overlapDays >= 2) {
    narrative.push(
      `Across the ${overlapDays} days we've captured snapshots for both of them, ${first.name} has held the lead on ${firstLeadDays} of them and ${second.name} on ${secondLeadDays}${
        secondLeadDays > 0 ? " — this is closer than the current gap alone suggests" : ""
      }.`,
    );
    if (biggestGapDate) {
      narrative.push(
        `The widest the gap has been in that stretch was ${formatUsdCompact(Math.abs(biggestGap))}, on ${biggestGapDate}.`,
      );
    }
  } else {
    narrative.push(
      `We've only just started capturing daily snapshots for both of them, so there isn't enough history yet to show how often the lead has changed hands — that will fill in day by day.`,
    );
  }

  const faqs: Faq[] = [
    {
      question: `Who is currently richer, ${first.name} or ${second.name}?`,
      answer: `${first.name}, by an estimated ${formatUsdCompact(Math.abs(currentGap))}, as of the live figures on this page.`,
    },
    {
      question: "How is the lead history tracked?",
      answer: "From daily net-worth snapshots we capture automatically — once both people have snapshots on the same day, we can say who was ahead that day.",
    },
    {
      question: "Can I race any two billionaires, not just the top 2?",
      answer: "Yes — the Wealth Race calculator above lets you pick any two of the top 30 billionaires we track and compare their net worth over time.",
    },
  ];

  return {
    ...CALCULATOR_ARTICLE_INDEX[6],
    description: narrative[0],
    eyebrow: "Wealth Race",
    stat: formatUsdCompact(Math.abs(currentGap)),
    subtitle: `${first.name}'s current lead over ${second.name}`,
    narrative,
    faqs,
    relatedPeople: [
      { id: first.id, name: first.name },
      { id: second.id, name: second.name },
    ],
  };
}

const BUILDERS: Record<string, () => Promise<CalculatorArticle>> = {
  "what-the-worlds-richest-persons-fortune-could-buy-outright": buildOwnACompanyArticle,
  "net-worth-it-takes-to-crack-the-top-10-billionaires": buildNetWorthRankArticle,
  "how-far-the-richest-persons-fortune-goes-on-real-billionaire-purchases": buildSpendArticle,
  "everyone-whos-been-the-worlds-richest-person-since-1987": buildBirthdayArticle,
  "what-the-richest-people-had-done-by-age-30": buildBillionaireByAgeArticle,
  "what-old-billionaire-fortunes-are-worth-in-todays-dollars": buildInflationArticle,
  "how-often-is-the-worlds-richest-person-actually-in-first": buildWealthRaceArticle,
};

export async function getCalculatorArticle(slug: string): Promise<CalculatorArticle | null> {
  const builder = BUILDERS[slug];
  if (!builder) return null;
  return builder();
}
