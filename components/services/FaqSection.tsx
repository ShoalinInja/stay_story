import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, SectionHeader } from "@/components/primitives";
import type { Faq } from "@/lib/content/types";
import { SERVICES_COPY } from "./copy";

/** Hidden when empty (production strips needsReview FAQs, which is all of them today). */
export function FaqSection({ faqs, className }: { faqs?: Faq[]; className?: string }) {
  if (!faqs?.length) return null;
  return (
    <section aria-labelledby="faqs" className={className}>
      <SectionHeader id="faqs" title={SERVICES_COPY.faqs} />
      <Accordion type="single" collapsible>
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
