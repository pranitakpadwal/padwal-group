import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/**
 * Raster wordmark at /logo.png (600x60), referenced as the publisher
 * logo in article structured data — Google doesn't accept SVG there.
 */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 16px",
          background: "#0b3d2e",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 26,
            height: 26,
            borderRadius: 9999,
            background: "#7ee2c0",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 0.5,
          }}
        >
          RealTime<span style={{ color: "#7ee2c0" }}>Billionaire</span>
        </div>
      </div>
    ),
    { width: 600, height: 60 },
  );
}
