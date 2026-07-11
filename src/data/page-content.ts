import type { Category } from "@/lib/categories";
import type { Faq } from "@/lib/article-template";

/**
 * Keyword-aware, UNIQUE page copy. Every category gets its own hero,
 * methodology section, and FAQ set — no shared boilerplate — so each page
 * has original content that can rank on its own terms.
 */

export interface HeroContent {
  h1: string;
  lede: string;
}

export interface MethodologyContent {
  heading: string;
  paragraphs: string[];
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

export function getMethodology(category: Category): MethodologyContent {
  switch (category) {
    case "world":
      return {
        heading: "How we calculate real-time net worth",
        paragraphs: [
          "Most of a typical billionaire's fortune sits in publicly-traded company stock. We estimate each person's shareholdings from public filings and reporting, multiply those shares by the live market price, and convert everything to US dollars. That public-equity figure updates continuously while markets are open — which is what makes this a real-time billionaires list rather than a once-a-year snapshot.",
          "On top of that, we add a static estimate for wealth that isn't publicly traded — private companies, cash, real estate, and similar. Those figures don't tick minute-to-minute and are updated manually. Everything here is a directional estimate for informational purposes, not an audited valuation, and this site is independent and not affiliated with Forbes or Bloomberg.",
        ],
      };
    case "india":
      return {
        heading: "How we track India's richest in real time",
        paragraphs: [
          "For Indian billionaires, most wealth is tied to companies listed on the NSE and BSE — like Reliance Industries, the Adani group, and the big IT and cement houses. We take each person's estimated stake, multiply it by the live share price in rupees, and convert to US dollars using the current exchange rate, so an INR move on Dalal Street flows straight through to the ranking.",
          "Fortunes rooted in privately-held businesses (family conglomerates, unlisted arms) are added as a static estimate that we update by hand. Figures are independent, directional estimates for information only — not audited valuations, and not affiliated with Forbes India or any official rich list.",
        ],
      };
    case "women":
      return {
        heading: "How the richest women are ranked",
        paragraphs: [
          "The women on this list span self-made founders and heirs to some of the world's largest fortunes. Where their wealth sits in publicly-traded stock — Walmart, L'Oréal, BMW, and others — we value it live from the current share price. Where it sits in private holdings, we use a manually-updated estimate.",
          "The ranking re-sorts continuously as markets move, so a woman whose fortune is tied to a fast-moving stock can climb or slip within the day. All numbers are independent, directional estimates, not audited valuations.",
        ],
      };
    case "young":
      return {
        heading: "How young billionaires' wealth is measured",
        paragraphs: [
          "Younger billionaires are overwhelmingly tech founders whose wealth is concentrated in a single company they started — often taken public in a recent IPO. That makes their net worth especially volatile: a big daily move in one stock can swing their fortune by billions, which is exactly what a real-time list captures.",
          "We value each stake from the live share price and add a static estimate for anything private. These are independent, directional estimates for information only, updated continuously while markets trade.",
        ],
      };
  }
}

export function getFaqs(category: Category, leaderName?: string): Faq[] {
  const leader = leaderName ?? "the current leader";

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
        {
          question: "How often does this billionaires list update?",
          answer:
            "The value of public holdings refreshes continuously while stock markets are open; market prices are typically delayed by around 15 minutes. Fortunes tied mainly to private companies change far less often.",
        },
        {
          question: "Is this the Forbes real-time billionaires list?",
          answer:
            "No. This is an independent real-time billionaires tracker and is not affiliated with, endorsed by, or connected to Forbes or Bloomberg. Figures are directional estimates, not audited valuations.",
        },
      ];
    case "india":
      return [
        {
          question: "Who is the richest person in India right now?",
          answer: `As of the latest update, ${leader} is the richest person in India on our real-time list. Rankings can shift intraday with the NSE and BSE.`,
        },
        {
          question: "Are these Indian net worths shown in rupees or dollars?",
          answer:
            "Net worth is shown in US dollars for comparison with the global list, but it's calculated from live rupee share prices on Indian exchanges and converted using the current USD–INR exchange rate.",
        },
        {
          question: "How many Indian billionaires are there?",
          answer:
            "India has one of the fastest-growing billionaire populations in the world. This page tracks a curated set of the most prominent Indian fortunes and grows over time; the ranking updates live as markets move.",
        },
        {
          question: "Is this the Forbes India rich list?",
          answer:
            "No — this is an independent tracker, not affiliated with Forbes India or any official rich list. All figures are directional estimates.",
        },
      ];
    case "women":
      return [
        {
          question: "Who is the richest woman in the world right now?",
          answer: `As of the latest update, ${leader} is the richest woman on our real-time list.`,
        },
        {
          question: "Are most of the richest women self-made or heirs?",
          answer:
            "Both. The list mixes self-made founders with heirs to major family fortunes. Each profile notes whether the wealth is self-made or inherited.",
        },
        {
          question: "How is each woman's net worth calculated?",
          answer:
            "We value their public shareholdings live from the current share price and add a static estimate for private assets, then rank everyone by the total in US dollars.",
        },
      ];
    case "young":
      return [
        {
          question: "Who is the richest billionaire under 45?",
          answer: `As of the latest update, ${leader} tops our real-time list of billionaires under 45.`,
        },
        {
          question: "How do people become billionaires so young?",
          answer:
            "Almost all young billionaires are founders whose companies grew quickly and went public, turning a large founder's stake into a fortune. Because that wealth is concentrated in one stock, it moves a lot day to day.",
        },
        {
          question: "How is a young billionaire's net worth calculated?",
          answer:
            "We multiply their estimated founder's stake by the live share price and add any private holdings as a static estimate. It updates continuously while markets are open.",
        },
      ];
  }
}
