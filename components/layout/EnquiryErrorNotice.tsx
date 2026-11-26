import { Suspense } from "react";
import { getSite } from "@/lib/content";
import { EnquiryErrorBanner } from "./EnquiryErrorBanner";

/** Server wrapper: passes phone/WhatsApp to the client banner, inside Suspense so pages stay static. */
export async function EnquiryErrorNotice() {
  const { phone, whatsapp } = await getSite();
  return (
    <Suspense fallback={null}>
      <EnquiryErrorBanner phone={phone} whatsapp={whatsapp} />
    </Suspense>
  );
}
