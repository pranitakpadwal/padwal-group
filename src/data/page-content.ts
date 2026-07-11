import type { Category } from "@/lib/categories";
import type { Faq } from "@/lib/article-template";

/**
 * Keyword-aware page copy. The homepage deliberately leads with the exact
 * phrase "real-time billionaires" (the primary, winnable head term at
 * ~60k searches/month) and geo/segment variants on the other lists.
 */

export interface HeroContent {
  h1: string;
  lede: string;
}

export function getHero(category: Category): HeroContent {
  switch (category) {
    case "world":
      return {
        h1: "Real-Time Billionaires",
        lede: "The real-time billionaires list — a live index of the world's richest people, ranked by net worth. Every fortune updates continuously from public stock holdings, so the ranking moves as markets move.",
      };
    case "india":
      return {
        h1: "Real-Time Billionaires: India",
        lede: "India's richest people, ranked live by net worth — from Reliance and Adani to the country's biggest tech and industrial fortunes.",
      };
    case "women":
      return {
        h1: "The World's Richest Women, Live",
        lede: "A real-time ranking of the wealthiest women in the world, updated continuously from public stock holdings.",
      };
    case "young":
      return {
        h1: "The Youngest Billionaires, Live",
        lede: "A real-time ranking of self-made and heir billionaires under 45, updated continuously as markets move.",
      };
  }
}

export function getFaqs(category: Category, leaderName?: string): Faq[] {
  const leader = leaderName ?? "the current leader";

  const shared: Faq[] = [
    {
      question: "How is real-time net worth calculated?",
      answer:
        "For each person we multiply their estimated publicly-traded shareholdings by the live share price, convert to US dollars, and add a static estimate for private assets (private companies, cash, real estate, and so on). The public-equity portion moves continuously; the private-asset estimate is updated manually.",
    },
    {
      question: "How often does this list update?",
      answer:
        "The value of public holdings refreshes continuously while stock markets are open. Market prices are typically delayed by around 15 minutes. Fortunes tied mainly to private companies change far less often.",
    },
    {
      question: "Is this the Forbes real-time billionaires list?",
      answer:
        "No. This is an independent real-time billionaires tracker and is not affiliated with, endorsed by, or connected to Forbes or Bloomberg. Figures are directional estimates, not audited valuations.",
    },
  ];

  switch (category) {
    case "world":
      return [
        {
          question: "What is a real-time billionaires list?",
          answer:
            "A real-time billionaires list ranks the world's wealthiest people by net worth and updates continuously as the value of their holdings changes, rather than once a year. Because most of a typical billionaire's fortune sits in publicly-traded stock, their net worth rises and falls with the market throughout the day.",
        },
        {
          question: "Who is the richest person in the world right now?",
          answer: `As of the latest update, ${leader} tops our real-time world billionaires list. The ranking can change intraday as markets move.`,
        },
        ...shared,
      ];
    case "india":
      return [
        {
          question: "Who is the richest person in India right now?",
          answer: `As of the latest update, ${leader} is the richest person in India on our real-time list. Rankings can shift intraday with the market.`,
        },
        ...shared,
      ];
    case "women":
      return [
        {
          question: "Who is the richest woman in the world right now?",
          answer: `As of the latest update, ${leader} is the richest woman on our real-time list.`,
        },
        ...shared,
      ];
    case "young":
      return [
        {
          question: "Who is the richest billionaire under 45?",
          answer: `As of the latest update, ${leader} tops our real-time list of billionaires under 45.`,
        },
        ...shared,
      ];
  }
}
