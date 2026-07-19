import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy — RealTimeBillionaire",
  description:
    "How RealTimeBillionaire handles data: what we collect, how Google Analytics and Google AdSense use cookies, and how to contact us or opt out.",
  alternates: { canonical: `${siteUrl()}/privacy` },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "July 2026";
const CONTACT_EMAIL = "realtimebillionairies@gmail.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/75">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-foreground/70">Last updated: {LAST_UPDATED}</p>
        </header>

        <Section title="Who we are">
          <p>
            RealTimeBillionaire (realtimebillionaire.com) is an independent,
            informational website that tracks estimated billionaire net
            worth. We are not affiliated with Forbes, Bloomberg, or any of
            the individuals featured on the site. This policy explains what
            data is collected when you visit, and how it&apos;s used.
          </p>
        </Section>

        <Section title="Information we collect">
          <p>
            We don&apos;t require an account, login, or any personal
            information to use this site. We don&apos;t knowingly collect
            names, addresses, or payment information from visitors.
          </p>
          <p>
            Like most websites, our hosting provider and the third-party
            services below automatically collect standard technical data —
            things like your IP address, browser type, device type, pages
            visited, and timestamps — through server logs and cookies.
          </p>
        </Section>

        <Section title="Google Analytics">
          <p>
            We use Google Analytics to understand how visitors use the site
            (which pages are popular, how people navigate, aggregate traffic
            volume). Google Analytics uses cookies to collect this
            information anonymously and in aggregate; we don&apos;t use it to
            identify individual visitors.
          </p>
        </Section>

        <Section title="Google AdSense &amp; advertising cookies">
          <p>
            This site shows ads served by Google AdSense. Google and its
            advertising partners use cookies (including the DoubleClick
            cookie) to serve ads based on a visitor&apos;s prior visits to
            this site and other sites on the internet. Google&apos;s use of
            advertising cookies enables it and its partners to serve ads
            based on your visits to this site and/or other sites.
          </p>
          <p>
            You can opt out of personalized advertising by visiting{" "}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Google&apos;s Ads Settings
            </a>
            . You can also opt out of some third-party vendors&apos; use of
            cookies for personalized advertising by visiting{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              www.aboutads.info
            </a>
            . For more detail on how Google uses data when you use our site,
            see{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              How Google uses information from sites that use our services
            </a>
            .
          </p>
        </Section>

        <Section title="Third-party market data">
          <p>
            Live share prices and market quotes shown on this site are
            sourced from Yahoo Finance. We don&apos;t control, and aren&apos;t
            responsible for, the data practices of Yahoo Finance or any
            other third-party site we link to (including source citations on
            individual profiles).
          </p>
        </Section>

        <Section title="Cookies, generally">
          <p>
            Cookies are small text files stored on your device. Beyond the
            Analytics and AdSense cookies described above, we don&apos;t set
            our own tracking cookies. You can disable cookies in your browser
            settings at any time; doing so may affect how ads are targeted
            but won&apos;t prevent you from reading the site.
          </p>
        </Section>

        <Section title="Children's privacy">
          <p>
            This site is not directed at children under 13, and we don&apos;t
            knowingly collect personal information from children.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy as the site changes. Material changes
            will be reflected by updating the &ldquo;Last updated&rdquo; date
            above.
          </p>
        </Section>

        <Section title="Contact us">
          <p>
            Questions about this policy or how your data is handled? Email us
            at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <p className="text-sm text-[--muted]">
          Back to the{" "}
          <Link href="/" className="text-brand hover:underline">
            real-time billionaires list
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
