"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { UI, formatPhone, telHref, waHref } from "./copy";

export type EnquiryErrorBannerProps = { phone: string; whatsapp: string | null };

/**
 * Shown when A7's no-JS enquiry flow redirects back with ?enquiry=error (every lead sink failed).
 * Reads search params, so render it inside <Suspense fallback={null}> to keep pages static.
 */
export function EnquiryErrorBanner({ phone, whatsapp }: EnquiryErrorBannerProps) {
  const failed = useSearchParams().get("enquiry") === "error";
  const [dismissed, setDismissed] = useState(false);
  if (!failed || dismissed) return null;
  const display = formatPhone(phone);
  return (
    <div role="alert" className="border-b border-brand bg-brand-tint text-ink">
      <div className="container-site flex items-center gap-3 py-2 text-sm font-medium">
        <p className="flex-1">
          {UI.enquiryError.message}{" "}
          <a href={telHref(phone)} className="font-semibold underline underline-offset-2">{display}</a>
          {whatsapp && (
            <>
              {" "}{UI.enquiryError.or}{" "}
              <a href={waHref(whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2">
                <MessageCircle aria-hidden className="size-4" />
                {UI.whatsapp}
              </a>
            </>
          )}
          .
        </p>
        <button type="button" onClick={() => setDismissed(true)} aria-label={UI.dismiss} className="flex size-9 shrink-0 items-center justify-center rounded-input hover:bg-surface/60">
          <X aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
