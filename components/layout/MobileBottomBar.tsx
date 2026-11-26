import { Suspense } from "react";
import { MessageCircle, MessageSquareText, Phone } from "lucide-react";
import { getCategories, getSite, getStays } from "@/lib/content";
import { EnquiryModal } from "@/components/forms/EnquiryModal";
import { BottomBarGate } from "./BottomBarGate";
import { UI, telHref, waHref } from "./copy";

const item = "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold";

/**
 * Phone-only sticky bar: Call · WhatsApp (if set) · Enquire. Renders its own 64px spacer so page
 * content and the footer aren't covered. Hidden on stay and service detail pages, which have their own bar.
 */
export async function MobileBottomBar() {
  const [site, stays, categories] = await Promise.all([getSite(), getStays(), getCategories()]);
  const bar = (
    <>
      <div aria-hidden className="h-16 shrink-0 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-line-soft bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        <a href={telHref(site.phone)} className={`${item} text-ink`}>
          <Phone aria-hidden className="size-5" />
          {UI.call}
        </a>
        {site.whatsapp && (
          <a href={waHref(site.whatsapp)} target="_blank" rel="noopener noreferrer" className={`${item} text-ink`}>
            <MessageCircle aria-hidden className="size-5" />
            {UI.whatsapp}
          </a>
        )}
        <EnquiryModal
          variant="contact"
          source="mobile-bar"
          trigger={
            <button type="button" className={`${item} bg-cta text-white`}>
              <MessageSquareText aria-hidden className="size-5" />
              {UI.enquireShort}
            </button>
          }
        />
      </div>
    </>
  );
  return (
    <Suspense fallback={bar}>
      <BottomBarGate hidePaths={stays.map((s) => `/stays/${s.slug}`)} hideUnder={categories.filter((c) => c.key !== "stays").map((c) => c.slug)}>
        {bar}
      </BottomBarGate>
    </Suspense>
  );
}
