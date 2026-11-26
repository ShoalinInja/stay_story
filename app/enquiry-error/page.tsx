import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert, MessageCircle, Phone } from "lucide-react";
import { getSite } from "@/lib/content";
import { Button } from "@/components/primitives";
import { formatIndianPhone } from "@/lib/leads/contact";
import { whatsAppUrl } from "@/lib/leads/whatsapp";

export const metadata: Metadata = {
  title: "We couldn't send your enquiry",
  robots: { index: false, follow: false },
};

// Landing page for a failed no-JS form post (POST /api/enquiry → 303 here). Static, so it renders without JS.
export default async function EnquiryErrorPage() {
  const site = await getSite();
  return (
    <main id="main" className="container-site section-y flex flex-1 flex-col items-center text-center">
      <CircleAlert aria-hidden className="size-12 text-brand-strong" />
      <h1 className="type-h1 mt-4 font-display text-ink">We couldn&apos;t send your enquiry</h1>
      <p role="alert" className="type-body mt-3 max-w-prose text-muted-text">
        Something went wrong on our side and your details didn&apos;t reach us. Please call or message the {site.name} team directly.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="dark" size="lg">
          <a href={`tel:${site.phone}`}>
            <Phone aria-hidden /> Call {formatIndianPhone(site.phone)}
          </a>
        </Button>
        {site.whatsapp && (
          <Button asChild variant="outline" size="lg">
            <a href={whatsAppUrl(site.whatsapp, `Hi ${site.name}, I tried to send an enquiry on your website.`)} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden /> WhatsApp us
            </a>
          </Button>
        )}
      </div>
      <Link href="/" className="type-body mt-8 text-brand-strong underline underline-offset-4">
        Back to home
      </Link>
    </main>
  );
}
