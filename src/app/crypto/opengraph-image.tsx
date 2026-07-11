import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Crypto billionaires and live crypto prices";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return brandOgImage({
    eyebrow: "Crypto wealth, live",
    title: "The Crypto Billionaires",
    subtitle: "Live Bitcoin & Ethereum prices — and the fortunes riding on them",
  });
}
