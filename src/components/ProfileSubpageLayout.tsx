import Link from "next/link";
import { getPersonProfile } from "@/data/profiles";
import { getPersonQuotes } from "@/data/quotes";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

/**
 * Shared frame for /billionaire/[id]/{journey,ventures,lifestyle,family}.
 * Renders the brand header, a breadcrumb trail, and a sub-nav across the
 * person's sections so the sub-pages feel like one profile, not orphans.
 */
export default function ProfileSubpageLayout({
  personName,
  personId,
  sectionLabel,
  children,
}: {
  personName: string;
  personId: string;
  sectionLabel: string;
  children: React.ReactNode;
}) {
  const profile = getPersonProfile(personId);

  const sections = [
    { label: "Overview", href: `/billionaire/${personId}` },
    profile?.careerTimeline && profile.careerTimeline.length > 0
      ? { label: "Journey", href: `/billionaire/${personId}/journey` }
      : null,
    profile?.ventures && profile.ventures.length > 0
      ? { label: "Ventures", href: `/billionaire/${personId}/ventures` }
      : null,
    profile?.notableAssets && profile.notableAssets.length > 0
      ? { label: "Lifestyle & Assets", href: `/billionaire/${personId}/lifestyle` }
      : null,
    profile?.family ? { label: "Family", href: `/billionaire/${personId}/family` } : null,
    profile?.careerTimeline && profile.careerTimeline.length > 0
      ? { label: "Story", href: `/story/${personId}` }
      : null,
    getPersonQuotes(personId).length > 0
      ? { label: "Quotes", href: `/quotes/${personId}` }
      : null,
  ].filter((section) => section !== null);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs
          crumbs={[
            { label: personName, href: `/billionaire/${personId}` },
            { label: sectionLabel },
          ]}
        />

        <nav
          className="-mb-1 flex gap-1 overflow-x-auto border-b border-line"
          aria-label={`${personName} profile sections`}
        >
          {sections.map((section) => {
            const isActive =
              section.label === sectionLabel ||
              (section.label === "Lifestyle & Assets" && sectionLabel.startsWith("Lifestyle"));
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-brand text-brand"
                    : "border-transparent text-foreground/60 hover:text-brand"
                }`}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
