import type { Faq } from "@/lib/article-template";

/** Renders an FAQ section and emits FAQPage JSON-LD for rich results / AEO. */
export default function FaqBlock({ faqs, heading = "Frequently Asked Questions" }: { faqs: Faq[]; heading?: string }) {
  if (faqs.length === 0) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section aria-labelledby="faq-heading" className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <h2 id="faq-heading" className="font-display text-2xl font-semibold text-foreground">
        {heading}
      </h2>
      <dl className="mt-5 flex flex-col divide-y divide-line">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
            <dt className="font-medium text-foreground">{faq.question}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-foreground/70">{faq.answer}</dd>
          </div>
        ))}
      </dl>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
