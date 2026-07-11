import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Live oil, gas and fuel prices and the energy billionaires";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return brandOgImage({
    eyebrow: "Energy markets, live",
    title: "Oil, Gas & The Billionaires Behind Them",
    subtitle: "Crude · Natural gas · Petrol · Diesel — updated in real time",
  });
}
