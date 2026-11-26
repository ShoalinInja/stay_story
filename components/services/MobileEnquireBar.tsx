import { EnquiryModal } from "@/components/forms/EnquiryModal";
import { Button } from "@/components/primitives";
import { SERVICES_COPY } from "./copy";

type Props = { source: string; serviceSlug: string; title: string };

/** Fixed bottom CTA below lg. Needs JS; the in-flow sidebar form stays as the no-JS fallback. */
export function MobileEnquireBar({ source, serviceSlug, title }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-soft bg-surface p-3 shadow-card lg:hidden">
      <EnquiryModal
        variant="service"
        source={source}
        serviceSlug={serviceSlug}
        title={title}
        submitLabel={SERVICES_COPY.enquireCta}
        trigger={<Button className="w-full">{SERVICES_COPY.enquireCta}</Button>}
      />
    </div>
  );
}
