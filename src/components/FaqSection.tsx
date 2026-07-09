import type { Faq } from "@/lib/article-template";

export default function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-3 text-lg font-bold">
        FAQ
      </h2>
      <dl className="flex flex-col gap-4">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="font-medium">{faq.question}</dt>
            <dd className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
