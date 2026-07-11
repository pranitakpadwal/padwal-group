/**
 * Price tags for the "Spend a Billionaire's Fortune" game. Where an item is
 * a real, documented transaction the note says who paid it; everything else
 * is a rounded public estimate. All figures are for fun, not quotes.
 */

export interface SpendItem {
  id: string;
  name: string;
  priceUsd: number;
  note: string;
  emoji: string;
}

export const SPEND_ITEMS: SpendItem[] = [
  { id: "coffee", name: "Cup of coffee", priceUsd: 6, note: "Start small.", emoji: "☕" },
  { id: "iphone", name: "iPhone Pro", priceUsd: 1_200, note: "Top-spec, no contract.", emoji: "📱" },
  { id: "tesla", name: "Tesla Model S", priceUsd: 100_000, note: "The founder-approved daily driver.", emoji: "🚗" },
  { id: "degree", name: "4 years at Harvard", priceUsd: 320_000, note: "Estimated all-in cost of attendance.", emoji: "🎓" },
  { id: "home", name: "Median US home", priceUsd: 420_000, note: "Roughly the national median sale price.", emoji: "🏠" },
  { id: "superbowl-ad", name: "Super Bowl ad (30s)", priceUsd: 8_000_000, note: "Reported going rate for 30 seconds.", emoji: "📺" },
  { id: "jet", name: "Gulfstream G650ER", priceUsd: 75_000_000, note: "Long-range private jet, list price estimate.", emoji: "✈️" },
  { id: "wapo", name: "The Washington Post", priceUsd: 250_000_000, note: "What Jeff Bezos paid in 2013.", emoji: "📰" },
  { id: "island", name: "98% of a Hawaiian island", priceUsd: 300_000_000, note: "What Larry Ellison reportedly paid for Lanai in 2012.", emoji: "🏝️" },
  { id: "painting", name: "Salvator Mundi", priceUsd: 450_000_000, note: "The most expensive painting ever auctioned (2017).", emoji: "🖼️" },
  { id: "yacht", name: "Flagship superyacht", priceUsd: 500_000_000, note: "Reported cost of Jeff Bezos's sailing yacht Koru.", emoji: "🛥️" },
  { id: "skyscraper-home", name: "27-story private residence", priceUsd: 2_000_000_000, note: "Reported build cost of Mukesh Ambani's Antilia.", emoji: "🏙️" },
  { id: "nba", name: "An NBA team", priceUsd: 2_000_000_000, note: "What Steve Ballmer paid for the Clippers in 2014.", emoji: "🏀" },
  { id: "nfl", name: "An NFL team", priceUsd: 4_650_000_000, note: "What the Walton-Penner group paid for the Broncos in 2022.", emoji: "🏈" },
  { id: "twitter", name: "Twitter (now X)", priceUsd: 44_000_000_000, note: "What Elon Musk paid in 2022.", emoji: "🐦" },
];
