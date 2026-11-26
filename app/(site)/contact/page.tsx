import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/site";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSite } from "@/lib/content";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { UI, formatPhone, mapsHref, telHref, waHref } from "@/components/layout/copy";

export const metadata: Metadata = pageMetadata({ title: UI.pages.contact, description: UI.contact.intro, path: "/contact" });

const row = "flex items-start gap-3";
const icon = "mt-0.5 size-5 shrink-0 text-brand-strong";
const linkCls = "font-semibold text-ink underline-offset-4 hover:underline";

export default async function ContactPage() {
  const site = await getSite();
  const a = site.address;
  const c = UI.contact;
  return (
    <main id="main" className="container-site section-y">
      <Breadcrumbs items={[{ label: UI.pages.contact, href: "/contact" }]} className="mb-6" />
      <h1 className="type-h1">{UI.pages.contact}</h1>
      <p className="mt-3 max-w-2xl type-body text-ink-2">{c.intro}</p>
      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <address className="flex flex-col gap-6 not-italic">
          <div className={row}>
            <MapPin aria-hidden className={icon} />
            <div>
              <h2 className="type-h3">{c.address}</h2>
              <p className="type-body text-ink-2">{a.line}, {a.locality}, {a.region} {a.postalCode}</p>
              <a href={mapsHref(a)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-semibold text-brand-strong underline-offset-4 hover:underline">
                {c.directions}
              </a>
            </div>
          </div>
          <div className={row}>
            <Phone aria-hidden className={icon} />
            <div>
              <h2 className="type-h3">{c.phone}</h2>
              <a href={telHref(site.phone)} className={linkCls}>{formatPhone(site.phone)}</a>
            </div>
          </div>
          {site.whatsapp && (
            <div className={row}>
              <MessageCircle aria-hidden className={icon} />
              <div>
                <h2 className="type-h3">{UI.whatsapp}</h2>
                <a href={waHref(site.whatsapp)} target="_blank" rel="noopener noreferrer" className={linkCls}>{UI.whatsappUs}</a>
              </div>
            </div>
          )}
          <div className={row}>
            <Mail aria-hidden className={icon} />
            <div>
              <h2 className="type-h3">{c.email}</h2>
              <a href={`mailto:${site.contactEmail}`} className={`${linkCls} break-all`}>{site.contactEmail}</a>
            </div>
          </div>
        </address>
        <section aria-labelledby="contact-form" className="rounded-card border border-line-soft bg-surface p-6 shadow-card">
          <h2 id="contact-form" className="mb-4 type-h2">{c.formTitle}</h2>
          <EnquiryForm variant="contact" source="contact-page" className="flex flex-col gap-4" />
        </section>
      </div>
    </main>
  );
}
