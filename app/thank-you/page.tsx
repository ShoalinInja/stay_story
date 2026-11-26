import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, MessageCircle, Phone } from "lucide-react";
import { getSite } from "@/lib/content";
import { Button } from "@/components/primitives";
import { formatIndianPhone } from "@/lib/leads/contact";
import { whatsAppUrl } from "@/lib/leads/whatsapp";
import { FORM_COPY } from "@/components/forms/copy";

const T = FORM_COPY.thankYou;

export const metadata: Metadata = {
  title: T.metaTitle,
  robots: { index: false, follow: false },
};

// Landing page for no-JS form posts (POST /api/enquiry → 303 here). Static, no client JS needed.
export default async function ThankYouPage() {
  const site = await getSite();
  return (
    <main id="main" className="container-site section-y flex flex-1 flex-col items-center text-center">
      <CircleCheck aria-hidden className="size-12 text-success" />
      <h1 className="type-h1 mt-4 font-display text-ink">{T.title}</h1>
      <p className="type-body mt-3 max-w-prose text-muted-text">
        {T.body(site.name)}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="dark" size="lg">
          <a href={`tel:${site.phone}`}>
            <Phone aria-hidden /> {FORM_COPY.call(formatIndianPhone(site.phone))}
          </a>
        </Button>
        {site.whatsapp && (
          <Button asChild variant="outline" size="lg">
            <a href={whatsAppUrl(site.whatsapp, T.whatsappMessage(site.name))} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden /> {FORM_COPY.whatsapp}
            </a>
          </Button>
        )}
      </div>
      <Link href="/" className="type-body mt-8 text-brand-strong underline underline-offset-4">
        {FORM_COPY.home}
      </Link>
    </main>
  );
}
