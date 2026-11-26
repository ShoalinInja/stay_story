// CONTRACT STUB (Lead). A7 owns the implementation; keep the exported props signature stable.
// Works without JS: native POST to /api/enquiry, which redirects to /thank-you.
import type { Enquiry } from "@/lib/content/types";

export type EnquiryVariant = "stay" | "service" | "callback" | "property-owner" | "contact";

export type EnquiryFormProps = {
  variant: EnquiryVariant;
  /** Where the lead came from, e.g. "stay-detail:casa-siolim", "home:cta-band". */
  source: string;
  staySlug?: string;
  serviceSlug?: string;
  /** "dates" (short stay, default) · "move-in" (long-term) · "site-visit" (for-sale) — BRIEF §7. */
  stayMode?: "dates" | "move-in" | "site-visit";
  defaults?: Partial<Pick<Enquiry, "checkIn" | "checkOut" | "adults" | "children" | "rooms" | "message">>;
  submitLabel?: string;
  className?: string;
};

export function EnquiryForm({ variant, source, staySlug, serviceSlug, submitLabel, className }: EnquiryFormProps) {
  return (
    <form method="post" action="/api/enquiry" className={className}>
      <input type="hidden" name="type" value={variant === "contact" ? "general" : variant} />
      <input type="hidden" name="source" value={source} />
      {staySlug && <input type="hidden" name="staySlug" value={staySlug} />}
      {serviceSlug && <input type="hidden" name="serviceSlug" value={serviceSlug} />}
      <label className="block">Name <input name="name" required autoComplete="name" className="border" /></label>
      <label className="block">Phone <input name="phone" required type="tel" autoComplete="tel" className="border" /></label>
      <button type="submit" className="bg-cta px-4 py-2 text-white">{submitLabel ?? "Enquire Now"}</button>
    </form>
  );
}
