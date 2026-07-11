import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "RealTimeBillionaire — The Live Database of Global Wealth";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return brandOgImage({
    eyebrow: "Live wealth rankings",
    title: "The World's Richest, In Real Time",
    subtitle: "Billionaires · Stocks · Crypto · Energy · Wealth tools",
  });
}
