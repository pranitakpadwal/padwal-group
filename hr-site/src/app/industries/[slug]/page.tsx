import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BulletList, CtaBand, PageHeader, Prose, Sidebar, WithSidebar } from "@/components/ui";
import { industries } from "@/lib/industries";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = industries.find((x) => x.slug === slug);
  return { title: i?.name, description: i?.summary };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = industries.find((x) => x.slug === slug);
  if (!i) notFound();

  return (
    <>
      <PageHeader crumbs={[{ label: "Industries", href: "/industries" }, { label: i.name }]} title={i.name} intro={i.summary} />
      <WithSidebar aside={<Sidebar title="Industries" current={`/industries/${i.slug}`} links={industries.map((x) => ({ href: `/industries/${x.slug}`, label: x.name }))} />}>
        <Prose>
          <p className="text-xl leading-9 text-navy">{i.intro}</p>
          <div className="grid gap-10 pt-4 md:grid-cols-2">
            <div><h2 className="mb-4 border-t-2 border-navy pt-3 text-xl font-semibold text-navy">Roles we hire</h2><BulletList items={i.roles} /></div>
            <div><h2 className="mb-4 border-t-2 border-navy pt-3 text-xl font-semibold text-navy">What clients look for</h2><BulletList items={i.look} /></div>
          </div>
        </Prose>
      </WithSidebar>
      <CtaBand />
    </>
  );
}
