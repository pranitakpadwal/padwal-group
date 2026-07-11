/**
 * Symbol catalogs for the live market pages (crypto + energy).
 * All symbols are Yahoo Finance tickers: spot crypto pairs quote in USD;
 * energy contracts are the front-month NYMEX/ICE futures.
 */

export interface MarketSymbol {
  symbol: string;
  name: string;
  /** What one unit of the quote means, e.g. "per barrel". */
  unit: string;
  description: string;
}

export const CRYPTO_ASSETS: MarketSymbol[] = [
  { symbol: "BTC-USD", name: "Bitcoin", unit: "per coin", description: "The original and largest cryptocurrency by market value." },
  { symbol: "ETH-USD", name: "Ethereum", unit: "per coin", description: "The leading smart-contract platform, powering most of decentralized finance." },
  { symbol: "BNB-USD", name: "BNB", unit: "per coin", description: "The exchange token of Binance, the world's largest crypto exchange." },
  { symbol: "SOL-USD", name: "Solana", unit: "per coin", description: "A high-throughput blockchain popular for trading and consumer apps." },
  { symbol: "XRP-USD", name: "XRP", unit: "per coin", description: "The token of the Ripple payments network." },
  { symbol: "DOGE-USD", name: "Dogecoin", unit: "per coin", description: "The meme coin that became a top-ten cryptocurrency." },
];

export const ENERGY_CONTRACTS: MarketSymbol[] = [
  { symbol: "CL=F", name: "Crude Oil (WTI)", unit: "per barrel", description: "West Texas Intermediate — the US crude oil benchmark." },
  { symbol: "BZ=F", name: "Crude Oil (Brent)", unit: "per barrel", description: "Brent — the international crude oil benchmark most of the world prices against." },
  { symbol: "NG=F", name: "Natural Gas", unit: "per MMBtu", description: "US natural gas futures (Henry Hub)." },
  { symbol: "RB=F", name: "Gasoline (Petrol)", unit: "per gallon", description: "RBOB gasoline futures — the wholesale price behind what you pay at the pump." },
  { symbol: "HO=F", name: "Diesel / Heating Oil", unit: "per gallon", description: "Ultra-low-sulfur diesel futures, the benchmark for diesel and heating oil." },
];

/**
 * Roster members whose fortunes are tied to energy, with the specific,
 * well-documented connection. Curated by hand — same sourcing bar as
 * profiles.ts (widely reported, no single-source claims).
 */
export const ENERGY_BILLIONAIRES: { id: string; energyNote: string }[] = [
  { id: "mukesh-ambani", energyNote: "Reliance Industries operates the world's largest single-site oil refining complex at Jamnagar, India." },
  { id: "gautam-adani", energyNote: "The Adani Group spans coal trading and mining, thermal power generation, and one of the world's largest green-energy buildouts." },
  { id: "aliko-dangote", energyNote: "Built the Dangote Refinery outside Lagos — Africa's largest oil refinery, designed to process 650,000 barrels per day." },
  { id: "mike-adenuga", energyNote: "Owns Conoil, one of Nigeria's largest indigenous oil exploration and fuel-marketing companies." },
  { id: "julia-koch", energyNote: "Koch Industries' Flint Hills Resources refines and markets fuels across the United States." },
  { id: "gina-rinehart", energyNote: "Hancock Prospecting's iron-ore fortune extends into energy, including the takeover of gas producer Senex Energy with POSCO." },
  { id: "alwaleed-bin-talal", energyNote: "Kingdom Holding's fortune is rooted in Saudi Arabia's oil-driven economy and includes stakes across global markets." },
];

/** Roster members whose fortunes come primarily from crypto. */
export const CRYPTO_BILLIONAIRE_IDS = ["changpeng-zhao", "brian-armstrong", "michael-saylor"];
