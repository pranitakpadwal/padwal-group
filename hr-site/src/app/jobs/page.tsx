import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, CtaBand, PageHeader, Placeholder } from "@/components/ui";
import { firm, showJobs } from "@/lib/site";
import { jobs } from "@/lib/jobs";

export const metadata: Metadata = { title: "Open Mandates" };

export default function Jobs() {
  if (!showJobs) notFound();
  return (
    <>
      <PageHeader crumbs={[{ label: "Candidates", href: "/candidates" }, { label: "Open mandates" }]} title="Open mandates" intro="A selection of the senior roles we are currently working on. Many mandates are confidential and not listed here." />
      <Container className="py-12 sm:py-16">
        <p className="mb-6 text-sm text-muted">Sample listings to be replaced with real mandates.<Placeholder /></p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead><tr className="border-b-2 border-navy text-xs uppercase tracking-wider text-muted"><th className="py-3 pr-4 font-semibold">Role</th><th className="py-3 pr-4 font-semibold">Function</th><th className="py-3 pr-4 font-semibold">Level</th><th className="py-3 pr-4 font-semibold">Location</th><th className="py-3 font-semibold">Indicative pay</th></tr></thead>
            <tbody className="divide-y divide-rule">
              {jobs.map((j) => (
                <tr key={j.title}>
                  <td className="py-4 pr-4 font-semibold text-navy">
                    <a href={`mailto:${firm.email}?subject=${encodeURIComponent("Application: " + j.title)}`} className="hover:text-brass">{j.title}</a>
                  </td>
                  <td className="py-4 pr-4 text-muted">{j.function}</td>
                  <td className="py-4 pr-4 text-muted">{j.level}</td>
                  <td className="py-4 pr-4 text-muted">{j.location}</td>
                  <td className="py-4 whitespace-nowrap">{j.band}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
      <CtaBand title="Do not see the right role?" text="Send us your CV. We often hear of senior roles before they are listed." />
    </>
  );
}
