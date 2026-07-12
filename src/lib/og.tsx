import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Shared brand template for social share cards (Open Graph images).
 * Emerald & Ink: deep green gradient, crown mark, big serif-feel headline.
 */
export function brandOgImage({
  eyebrow,
  title,
  stat,
  subtitle,
  statColor = "#7ee2c0",
}: {
  eyebrow: string;
  title: string;
  stat?: string;
  subtitle?: string;
  statColor?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #0b3d2e 0%, #0b6b4f 100%)",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 22,
              height: 22,
              borderRadius: 9999,
              background: "#7ee2c0",
            }}
          />
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: 1 }}>
            RealTime<span style={{ color: "#7ee2c0" }}>Billionaire</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              textTransform: "uppercase",
              letterSpacing: 4,
              color: "#9fd9c3",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 26 ? 64 : 84,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          {stat && (
            <div style={{ display: "flex", fontSize: 58, fontWeight: 700, color: statColor }}>
              {stat}
            </div>
          )}
          {subtitle && (
            <div style={{ display: "flex", fontSize: 28, color: "#d9efe6" }}>{subtitle}</div>
          )}
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#9fd9c3" }}>
          The live database of global wealth · realtimebillionaire.com
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
