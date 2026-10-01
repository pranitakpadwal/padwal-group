import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BulletList, CtaBand, PageHeader, Prose, Sidebar, WithSidebar } from "@/components/ui";
import { services } from "@/lib/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return { title: s?.title, description: s?.summary };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();

  return (
    <>
      <PageHeader crumbs={[{ label: "Services", href: "/services" }, { label: s.title }]} title={s.title} intro={s.summary} />
      <WithSidebar aside={<Sidebar title="Services" current={`/services/${s.slug}`} links={services.map((x) => ({ href: `/services/${x.slug}`, label: x.title }))} />}>
        <Prose>
          <p className="text-xl leading-9 text-navy">{s.intro}</p>
          {s.sections.map((sec) => (
            <div key={sec.h}>
              <h2 className="mb-3 mt-8 text-2xl font-semibold text-navy">{sec.h}</h2>
              <div className="space-y-4">{sec.p.map((p) => (<p key={p}>{p}</p>))}</div>
            </div>
          ))}
          <div className="grid gap-10 pt-6 md:grid-cols-2">
            <div><h2 className="mb-4 border-t-2 border-navy pt-3 text-xl font-semibold text-navy">What is included</h2><BulletList items={s.deliverables} /></div>
            <div><h2 className="mb-4 border-t-2 border-navy pt-3 text-xl font-semibold text-navy">Best suited for</h2><BulletList items={s.suited} /></div>
          </div>
          <dl className="mt-8 grid gap-6 border-y border-rule py-6 sm:grid-cols-2">
            <div><dt className="text-xs font-semibold uppercase tracking-widest text-brass">Typical compensation level</dt><dd className="mt-1">{s.band}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-widest text-brass">Typical timeline</dt><dd className="mt-1">{s.timeline}</dd></div>
          </dl>
        </Prose>
      </WithSidebar>
      <CtaBand />
    </>
  );
}
