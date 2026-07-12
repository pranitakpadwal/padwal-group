/**
 * Real, sourced quotes only. The bar: a primary source we can name —
 * a shareholder letter, a signed op-ed, a filmed interview or speech.
 * Nothing from quote-aggregator sites, nothing "attributed" without a
 * traceable origin. When in doubt, leave it out; a short page of real
 * quotes beats a long page of fake ones.
 */

export interface PersonQuote {
  text: string;
  /** Where it was said/written — shown on the page next to the quote. */
  source: string;
  year?: number;
}

export const personQuotes: Record<string, PersonQuote[]> = {
  "warren-buffett": [
    {
      text: "Be fearful when others are greedy, and be greedy when others are fearful.",
      source: "“Buy American. I'm Buying.” — his op-ed in The New York Times",
      year: 2008,
    },
    {
      text: "Price is what you pay; value is what you get.",
      source: "Berkshire Hathaway shareholder letter (crediting his teacher Ben Graham)",
      year: 2008,
    },
    {
      text: "Our favorite holding period is forever.",
      source: "Berkshire Hathaway shareholder letter",
      year: 1988,
    },
    {
      text: "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price.",
      source: "Berkshire Hathaway shareholder letter",
      year: 1989,
    },
    {
      text: "You only find out who is swimming naked when the tide goes out.",
      source: "Berkshire Hathaway shareholder letter",
      year: 2001,
    },
  ],

  "elon-musk": [
    {
      text: "When something is important enough, you do it even if the odds are not in your favor.",
      source: "CBS 60 Minutes interview, on SpaceX",
      year: 2012,
    },
    {
      text: "I would like to die on Mars. Just not on impact.",
      source: "On stage at SXSW, Austin",
      year: 2013,
    },
    {
      text: "Failure is an option here. If things are not failing, you are not innovating enough.",
      source: "Interview during SpaceX's early years (Fast Company)",
      year: 2005,
    },
  ],

  "jeff-bezos": [
    {
      text: "Day 2 is stasis. Followed by irrelevance. Followed by excruciating, painful decline. Followed by death. And that is why it is always Day 1.",
      source: "Amazon shareholder letter",
      year: 2016,
    },
    {
      text: "In the end, we are our choices. Build yourself a great story.",
      source: "Princeton University commencement address",
      year: 2010,
    },
    {
      text: "We will continue to make investment decisions in light of long-term market leadership considerations rather than short-term profitability considerations.",
      source: "Amazon's first shareholder letter",
      year: 1997,
    },
  ],

  "jensen-huang": [
    {
      text: "Run, don't walk. Either you're running for food, or you are running from becoming food.",
      source: "National Taiwan University commencement address",
      year: 2023,
    },
    {
      text: "I wish upon you ample doses of pain and suffering.",
      source: "Talk at Stanford Graduate School of Business, on what builds greatness",
      year: 2024,
    },
  ],
};

export function getPersonQuotes(id: string): PersonQuote[] {
  return personQuotes[id] ?? [];
}

export function listQuotePeopleIds(): string[] {
  return Object.keys(personQuotes);
}
