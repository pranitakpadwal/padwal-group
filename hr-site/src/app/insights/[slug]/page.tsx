import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, CtaBand, PageHeader, Prose } from "@/components/ui";
import { articles } from "@/lib/insights";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return { title: a?.title, description: a?.summary };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const others = articles.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <PageHeader crumbs={[{ label: "Insights", href: "/insights" }, { label: a.title }]} title={a.title} intro={a.summary} />
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_300px]">
        <article>
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-brass">{a.category}</p>
          <Prose>
            {a.body.map((b, i) => (
              <div key={i}>
                {b.h && <h2 className="mb-2 mt-4 text-2xl font-semibold text-navy">{b.h}</h2>}
                <p>{b.p}</p>
              </div>
            ))}
          </Prose>
        </article>
        <aside>
          <p className="border-b border-navy pb-2 text-xs font-semibold uppercase tracking-widest text-navy">More insights</p>
          <ul>
            {others.map((o) => (<li key={o.slug} className="border-b border-rule"><Link href={`/insights/${o.slug}`} className="block py-3 text-sm text-ink hover:text-brass">{o.title}</Link></li>))}
          </ul>
        </aside>
      </Container>
      <CtaBand />
    </>
  );
}
