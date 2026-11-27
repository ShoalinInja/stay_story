// Server Component: reads site contact details, then renders the interactive client form.
// Works without JS: a native POST to /api/enquiry, which 303-redirects to /thank-you.
// From a Client Component, render <EnquiryFormClient> and pass `whatsapp` / `phone` down instead.
import type { Enquiry } from "@/lib/content/types";
import { getSite } from "@/lib/content";
import { EnquiryFormClient } from "./EnquiryFormClient";

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

export async function EnquiryForm(props: EnquiryFormProps) {
  const site = await getSite();
  return <EnquiryFormClient {...props} whatsapp={site.whatsapp} phone={site.phone} replyTime={site.replyTime} />;
}
