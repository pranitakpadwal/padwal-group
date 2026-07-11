import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Interactive billionaire wealth calculators";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return brandOgImage({
    eyebrow: "Interactive wealth tools",
    title: "Could You Spend a Billionaire's Fortune?",
    subtitle: "Spend the money · Richest on your birthday · When they were your age",
  });
}
