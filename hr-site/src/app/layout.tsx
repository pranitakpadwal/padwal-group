import type { Metadata } from "next";
import { Mukta } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { firm } from "@/lib/site";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

const body = Mukta({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: `${firm.name} | ${firm.descriptor}`, template: `%s | ${firm.name}` },
  description: `${firm.name} partners with organisations in India, the USA and Canada to hire senior technology, business and marketing leaders.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={body.variable}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppButton />
      </body>
    </html>
  );
}
