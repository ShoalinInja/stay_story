import type { Metadata } from "next";
import { Check } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { copy } from "@/components/stays/copy";

const t = copy.listYourProperty;

export const metadata: Metadata = {
  title: t.title,
  description: t.intro,
  alternates: { canonical: "/list-your-property" },
};

export default function ListYourPropertyPage() {
  return (
    <main id="main" className="container-site section-y flex-1">
      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <h1 className="type-h1 font-display text-ink">{t.title}</h1>
          <p className="mt-4 max-w-2xl type-body text-ink-2">{t.intro}</p>
          <ul className="mt-8 space-y-4">
            {t.benefits.map((b) => (
              <li key={b.lead} className="flex gap-3 type-body text-ink-2">
                <Check aria-hidden className="mt-1 size-5 shrink-0 text-success" />
                <span><strong className="text-ink">{b.lead}</strong> {b.body}</span>
              </li>
            ))}
          </ul>
        </div>
        <section aria-labelledby="owner-form" className="rounded-card bg-cream p-6 lg:self-start">
          <h2 id="owner-form" className="type-h2 font-display text-ink">{t.formTitle}</h2>
          <EnquiryForm variant="property-owner" source="list-your-property" submitLabel={t.submit} className="mt-4" />
        </section>
      </div>
    </main>
  );
}
