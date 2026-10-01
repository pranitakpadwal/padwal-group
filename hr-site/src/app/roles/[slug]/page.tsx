import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BulletList, CtaBand, PageHeader, Prose, Sidebar, WithSidebar } from "@/components/ui";
import { roles } from "@/lib/roles";

export function generateStaticParams() {
  return roles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = roles.find((x) => x.slug === slug);
  return { title: r ? `${r.name} Roles` : undefined, description: r?.summary };
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = roles.find((x) => x.slug === slug);
  if (!r) notFound();

  return (
    <>
      <PageHeader crumbs={[{ label: "Roles", href: "/roles" }, { label: r.name }]} title={`${r.name} roles`} intro={r.summary} />
      <WithSidebar aside={<Sidebar title="Role families" current={`/roles/${r.slug}`} links={roles.map((x) => ({ href: `/roles/${x.slug}`, label: x.name }))} />}>
        <Prose>
          <p className="text-xl leading-9 text-navy">{r.intro}</p>
          <h2 className="mt-8 border-t-2 border-navy pt-3 text-2xl font-semibold text-navy">Levels and indicative compensation</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-base">
              <thead><tr className="border-b border-navy text-xs uppercase tracking-wider text-muted"><th className="py-2 pr-4 font-semibold">Level</th><th className="py-2 pr-4 font-semibold">Typical titles</th><th className="py-2 font-semibold">Annual pay</th></tr></thead>
              <tbody className="divide-y divide-rule align-top">
                {r.levels.map((l) => (
                  <tr key={l.level}><td className="py-4 pr-4 font-medium text-navy">{l.level}</td><td className="py-4 pr-4 text-muted">{l.titles.join(", ")}</td><td className="py-4 font-medium whitespace-nowrap">{l.band}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted">Figures are indicative total annual compensation and should be treated as a starting point for a conversation, not a quotation.</p>
          <h2 className="mt-8 border-t-2 border-navy pt-3 text-2xl font-semibold text-navy">What we assess</h2>
          <BulletList items={r.skills} />
        </Prose>
      </WithSidebar>
      <CtaBand />
    </>
  );
}
