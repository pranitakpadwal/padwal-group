import type { Metadata } from "next";
import { BulletList, CtaBand, PageHeader, Prose, Sidebar, WithSidebar } from "@/components/ui";
import { markets } from "@/lib/markets";

export const metadata: Metadata = { title: "Government & Public Sector" };

export default function Government() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Markets", href: "/markets" }, { label: "Government & Public Sector" }]} title="Government and public sector" intro="Hiring support for departments, public sector undertakings and institutions that need experienced professionals through a transparent, well-documented process." />
      <WithSidebar aside={<Sidebar title="Markets" current="/government" links={[...markets.map((x) => ({ href: `/markets/${x.slug}`, label: x.name })), { href: "/government", label: "Government & Public Sector" }]} />}>
        <Prose>
          <p className="text-xl leading-9 text-navy">Public bodies hire differently from private companies. Selection must be demonstrably fair, records must stand up to audit, and the work often runs through formal procurement. We design our engagements around those requirements.</p>
          <h2 className="mt-8 border-t-2 border-navy pt-3 text-2xl font-semibold text-navy">How we work with public bodies</h2>
          <BulletList items={[
            "Participation in tenders, empanelment and rate-contract processes",
            "Written selection criteria agreed before sourcing begins",
            "Documented assessment of every shortlisted candidate",
            "Audit-ready records of the entire process",
            "Strict confidentiality of candidate and departmental information",
          ]} />
          <h2 className="mt-8 border-t-2 border-navy pt-3 text-2xl font-semibold text-navy">Typical requirements</h2>
          <BulletList items={[
            "Technology and digital transformation leaders",
            "Programme and project directors for large initiatives",
            "Finance, audit and administration heads",
            "Policy, research and domain specialists",
            "Institutional leadership for universities and public bodies",
          ]} />
          <h2 className="mt-8 border-t-2 border-navy pt-3 text-2xl font-semibold text-navy">Documentation</h2>
          <p>We can provide company registration, tax and compliance documents, and an organisational profile on request as part of a tender or empanelment application.</p>
        </Prose>
      </WithSidebar>
      <CtaBand title="Planning a public-sector engagement?" text="Send us the tender reference or requirement and we will respond with our proposed approach." />
    </>
  );
}
