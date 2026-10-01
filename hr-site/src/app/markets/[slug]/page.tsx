import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, PageHeader, Prose, Sidebar, WithSidebar } from "@/components/ui";
import { markets } from "@/lib/markets";

export function generateStaticParams() {
  return markets.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = markets.find((x) => x.slug === slug);
  return { title: m ? `Hiring in ${m.name}` : undefined, description: m?.summary };
}

export default async function MarketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = markets.find((x) => x.slug === slug);
  if (!m) notFound();

  return (
    <>
      <PageHeader crumbs={[{ label: "Markets", href: "/markets" }, { label: m.name }]} title={m.name} intro={m.summary} />
      <WithSidebar aside={<Sidebar title="Markets" current={`/markets/${m.slug}`} links={[...markets.map((x) => ({ href: `/markets/${x.slug}`, label: x.name })), { href: "/government", label: "Government & Public Sector" }]} />}>
        <Prose>
          <p className="text-xl leading-9 text-navy">{m.intro}</p>
          <div className="space-y-8 pt-4">
            {m.points.map((p) => (
              <div key={p.h} className="border-t border-rule pt-4">
                <h2 className="text-xl font-semibold text-navy">{p.h}</h2>
                <p className="mt-2">{p.p}</p>
              </div>
            ))}
          </div>
        </Prose>
      </WithSidebar>
      <CtaBand />
    </>
  );
}
