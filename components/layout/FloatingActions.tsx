import { MessageCircle, Phone } from "lucide-react";
import { getSite } from "@/lib/content";
import { UI, formatPhone, telHref, waHref } from "./copy";

const fab = "flex size-12 items-center justify-center rounded-full text-white shadow-card-hover transition-transform hover:-translate-y-0.5";

/** Bottom-left Call (+ WhatsApp when set). Desktop/tablet only; phones get MobileBottomBar. */
export async function FloatingActions() {
  const site = await getSite();
  return (
    <div className="fixed bottom-6 left-6 z-30 hidden flex-col gap-3 md:flex">
      {site.whatsapp && (
        <a href={waHref(site.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label={UI.whatsappUs} className={`${fab} bg-whatsapp`}>
          <MessageCircle aria-hidden className="size-6" />
        </a>
      )}
      <a href={telHref(site.phone)} aria-label={UI.callUs(formatPhone(site.phone))} className={`${fab} bg-cta`}>
        <Phone aria-hidden className="size-5" />
      </a>
    </div>
  );
}
