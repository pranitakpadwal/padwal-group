import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import Script from "next/script";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-2K1F0PWXWN";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const title = "RealTimeBillionaire — The Live Database of Global Wealth";
const description =
  "A structured, real-time database of global wealth: live billionaire rankings, the stocks, crypto, and energy markets behind the fortunes, plus interactive wealth tools.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: title,
    template: "%s",
  },
  description,
  // Google Search Console site verification.
  verification: {
    google: "rSDbPuMzdQLLLF9pFCko69X3zHalnLRHqY4Xl2Bq_8E",
  },
  // Google AdSense account association meta tag.
  other: {
    "google-adsense-account": "ca-pub-2121262893172079",
  },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "RealTimeBillionaire",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        {/* Google Analytics (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
