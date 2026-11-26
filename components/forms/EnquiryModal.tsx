// CONTRACT STUB (Lead). A7 owns the implementation; keep the exported props signature stable.
// Used for "Request Callback", "Get in Touch", "Enquire Now" triggers across the site.
import type { ReactNode } from "react";
import { Modal } from "@/components/primitives";
import { EnquiryForm, type EnquiryFormProps } from "./EnquiryForm";

export type EnquiryModalProps = EnquiryFormProps & {
  /** The element that opens the modal (a Button, link-styled button, etc.). */
  trigger: ReactNode;
  title?: string;
  description?: string;
};

export function EnquiryModal({ trigger, title, description, ...form }: EnquiryModalProps) {
  return (
    <Modal trigger={trigger} title={title ?? (form.variant === "callback" ? "Request a callback" : "Send an enquiry")} description={description}>
      <EnquiryForm {...form} />
    </Modal>
  );
}
