// Server Component: renders the server EnquiryForm inside the client Modal. Keep the props signature stable.
// Used for "Request Callback", "Get in Touch", "Enquire Now" triggers. Render it from a Server Component
// (or pass it into a Client Component as children/props).
import type { ReactNode } from "react";
import { Modal } from "@/components/primitives";
import { EnquiryForm, type EnquiryFormProps } from "./EnquiryForm";
import { FORM_COPY } from "./copy";

export type EnquiryModalProps = EnquiryFormProps & {
  /** The element that opens the modal (a Button, link-styled button, etc.). */
  trigger: ReactNode;
  title?: string;
  description?: string;
};

export function EnquiryModal({ trigger, title, description, ...form }: EnquiryModalProps) {
  return (
    <Modal trigger={trigger} title={title ?? (form.variant === "callback" ? FORM_COPY.modal.callback : FORM_COPY.modal.default)} description={description}>
      <EnquiryForm {...form} />
    </Modal>
  );
}
