import type { LegalDoc } from "@/content/legal";
import { Breadcrumbs } from "./Breadcrumbs";
import { UI } from "./copy";

/** Renders /privacy and /terms from content/legal.ts. Shows the draft notice while any block needs review. */
export function LegalPage({ doc, href }: { doc: LegalDoc; href: string }) {
  const draft = doc.sections.some((x) => x.needsReview);
  return (
    <main id="main" className="container-site section-y max-w-3xl">
      <Breadcrumbs items={[{ label: doc.title, href }]} className="mb-6" />
      <h1 className="type-h1">{doc.title}</h1>
      {draft && <p role="note" className="mt-4 rounded-input bg-brand-tint px-4 py-3 text-sm font-semibold text-ink">{UI.legalDraft}</p>}
      <p className="mt-6 type-body text-ink-2">{doc.intro}</p>
      {doc.sections.map((sec) => (
        <section key={sec.heading} className="mt-8">
          <h2 className="type-h2">{sec.heading}</h2>
          {sec.body.map((para) => <p key={para} className="mt-3 type-body text-ink-2">{para}</p>)}
        </section>
      ))}
    </main>
  );
}
