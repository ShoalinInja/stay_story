"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type BaseSyntheticEvent } from "react";
import Script from "next/script";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, MessageCircle, Phone } from "lucide-react";
import { Button, DateRangePicker, Input, inputClass } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { enquirySchema, type EnquiryData, type EnquiryInput } from "@/lib/leads/schema";
import { leadWhatsAppMessage, whatsAppUrl } from "@/lib/leads/whatsapp";
import { formatIndianPhone } from "@/lib/leads/contact";
import type { EnquiryResponse } from "@/lib/leads/handle";
import type { EnquiryFormProps } from "./EnquiryForm";

export type EnquiryFormClientProps = EnquiryFormProps & {
  /** site.whatsapp; null hides WhatsApp UI. Passed from a server parent. */
  whatsapp: string | null;
  /** site.phone (E.164) for the "Call us" fallback. */
  phone: string;
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const UTM_STORE = "ss_utm";
const ATTRIBUTION = /^(utm_[a-z]+|gclid|fbclid|msclkid)$/;

type Status = { kind: "idle" } | { kind: "sent"; lead: EnquiryData } | { kind: "error"; message: string };

const noopSubscribe = () => () => {};
/** False during SSR and for no-JS visitors, so the server HTML keeps a working native form. */
const useHydrated = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

function readAttribution(): Record<string, string> {
  const fromUrl = Object.fromEntries([...new URLSearchParams(window.location.search)].filter(([k]) => ATTRIBUTION.test(k)));
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(UTM_STORE) ?? "{}");
  } catch {
    /* storage blocked: current URL only */
  }
  return {
    ...stored,
    ...fromUrl,
    page: window.location.pathname,
    ...(document.referrer ? { referrer: document.referrer.slice(0, 500) } : {}),
  };
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    turnstile?: { reset: () => void };
  }
}

export function EnquiryFormClient({
  variant, source, staySlug, serviceSlug, stayMode = "dates", defaults, submitLabel, className, whatsapp, phone,
}: EnquiryFormClientProps) {
  const id = useId();
  const hydrated = useHydrated();
  const doneRef = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const type = variant === "contact" ? "general" : variant;
  const isStay = variant === "stay";
  const wantsGuests = (isStay && stayMode !== "site-visit") || variant === "service";
  const wantsEmail = variant !== "callback";
  const wantsMessage = variant !== "callback";
  const messageRequired = variant === "contact" || variant === "property-owner";

  const { register, control, handleSubmit, formState } = useForm<EnquiryInput, unknown, EnquiryData>({
    resolver: zodResolver(enquirySchema),
    mode: "onChange",
    defaultValues: {
      type, source, staySlug, serviceSlug,
      name: "", phone: "", email: "", website: "",
      message: defaults?.message ?? "",
      checkIn: defaults?.checkIn ?? "",
      checkOut: defaults?.checkOut ?? "",
      moveIn: "",
      adults: wantsGuests ? (defaults?.adults ?? 2) : undefined,
      children: wantsGuests ? (defaults?.children ?? 0) : undefined,
      rooms: defaults?.rooms,
    },
  });
  const { errors, isValid, isSubmitting } = formState;
  const err = (k: keyof EnquiryInput) => errors[k]?.message as string | undefined;

  // First-touch attribution survives client-side navigation within the tab.
  useEffect(() => {
    try {
      const a = Object.fromEntries([...new URLSearchParams(window.location.search)].filter(([k]) => ATTRIBUTION.test(k)));
      if (Object.keys(a).length && !sessionStorage.getItem(UTM_STORE)) sessionStorage.setItem(UTM_STORE, JSON.stringify(a));
    } catch {
      /* storage blocked */
    }
  }, []);

  useEffect(() => {
    if (status.kind === "sent") doneRef.current?.focus();
  }, [status.kind]);

  const contactLine = `Please call ${formatIndianPhone(phone)}${whatsapp ? " or message us on WhatsApp" : ""}.`;

  const onValid = async (data: EnquiryData, event?: BaseSyntheticEvent) => {
    const form = event?.target instanceof HTMLFormElement ? event.target : null;
    const turnstileToken = form ? new FormData(form).get("cf-turnstile-response") : null;
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ ...data, utm: readAttribution(), ...(turnstileToken ? { turnstileToken } : {}) }),
      });
      const body = (await res.json().catch(() => ({ ok: false }))) as EnquiryResponse;
      if (res.ok && body.ok) {
        if (GTM_ID) (window.dataLayer ??= []).push({ event: "generate_lead", lead_type: data.type, lead_source: data.source });
        setStatus({ kind: "sent", lead: data });
        return;
      }
      window.turnstile?.reset();
      const message =
        res.status === 429 ? `You've sent a few enquiries already. ${contactLine}`
        : res.status === 400 ? `Please check the form and try again. ${body.error === "captcha" ? "The spam check failed. " : ""}`
        : `We couldn't send your enquiry just now. ${contactLine}`;
      setStatus({ kind: "error", message });
    } catch {
      setStatus({ kind: "error", message: `We couldn't reach our server. ${contactLine}` });
    }
  };

  const waLink = (lead?: EnquiryData) =>
    whatsapp ? whatsAppUrl(whatsapp, leadWhatsAppMessage(lead ?? { type, staySlug, serviceSlug })) : null;

  if (status.kind === "sent") {
    const wa = waLink(status.lead);
    return (
      <div role="status" className={cn("flex flex-col items-start gap-3 rounded-card bg-surface-2 p-6", className)}>
        <CircleCheck aria-hidden className="size-8 text-success" />
        <h3 ref={doneRef} tabIndex={-1} className="type-h3 text-ink">Thank you, we&apos;ve got your enquiry</h3>
        <p className="type-body text-muted-text">We&apos;ll get back to you shortly{wa ? ". For a faster reply, continue on WhatsApp." : "."}</p>
        {wa && (
          <Button asChild variant="dark">
            <a href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden /> Continue on WhatsApp</a>
          </Button>
        )}
      </div>
    );
  }

  const f = (name: string) => `${id}-${name}`;
  const errorWa = status.kind === "error" ? waLink() : null;

  return (
    <form
      method="post"
      action="/api/enquiry"
      noValidate={hydrated}
      onSubmit={handleSubmit(onValid)}
      className={cn("flex flex-col gap-4", className)}
    >
      <input type="hidden" {...register("type")} />
      <input type="hidden" {...register("source")} />
      {staySlug && <input type="hidden" {...register("staySlug")} />}
      {serviceSlug && <input type="hidden" {...register("serviceSlug")} />}

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={f("website")}>Leave this field empty</label>
        <input id={f("website")} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Input id={f("name")} label="Name" autoComplete="name" required error={err("name")} {...register("name")} />
      <Input
        id={f("phone")} label="Phone" type="tel" inputMode="tel" autoComplete="tel" required
        placeholder="+91 98765 43210" error={err("phone")} {...register("phone")}
      />
      {wantsEmail && (
        <Input id={f("email")} label="Email (optional)" type="email" autoComplete="email" error={err("email")} {...register("email")} />
      )}

      {isStay && stayMode === "dates" && (
        <>
          <Controller
            control={control}
            name="checkIn"
            render={({ field }) => (
              <Controller
                control={control}
                name="checkOut"
                render={({ field: out }) => (
                  <DateRangePicker
                    id={f("dates")}
                    fromName="checkIn"
                    toName="checkOut"
                    value={{ from: (field.value as string) || null, to: (out.value as string) || null }}
                    onValueChange={(v) => {
                      field.onChange(v.from ?? "");
                      out.onChange(v.to ?? "");
                    }}
                    error={err("checkIn") ?? err("checkOut")}
                  />
                )}
              />
            )}
          />
          {/* No-JS fallback; the API takes the first non-empty value per field. */}
          <noscript>
            <div className="grid grid-cols-2 gap-3">
              <Input id={f("ns-in")} name="checkIn" type="date" label="Check-in" />
              <Input id={f("ns-out")} name="checkOut" type="date" label="Check-out" />
            </div>
          </noscript>
        </>
      )}
      {isStay && stayMode === "move-in" && (
        <Input id={f("moveIn")} label="Preferred move-in month" type="month" error={err("moveIn")} {...register("moveIn")} />
      )}
      {((isStay && stayMode === "site-visit") || variant === "service") && (
        <Input
          id={f("date")} label={variant === "service" ? "Preferred date (optional)" : "Preferred site-visit date"}
          type="date" error={err("checkIn")} {...register("checkIn")}
        />
      )}

      {wantsGuests && (
        <div className="grid grid-cols-2 gap-3">
          <Input id={f("adults")} label="Adults" type="number" min={1} max={99} inputMode="numeric" error={err("adults")} {...register("adults")} />
          {isStay && (
            <Input id={f("children")} label="Children" type="number" min={0} max={99} inputMode="numeric" error={err("children")} {...register("children")} />
          )}
        </div>
      )}

      {wantsMessage && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={f("message")} className="text-sm font-semibold text-ink">
            {variant === "property-owner" ? "About your property (location, type, bedrooms)" : messageRequired ? "Message" : "Message (optional)"}
          </label>
          <textarea
            id={f("message")} rows={4} required={messageRequired}
            aria-invalid={err("message") ? true : undefined}
            aria-describedby={err("message") ? f("message-error") : undefined}
            className={cn(inputClass, "h-auto py-2")}
            {...register("message")}
          />
          {err("message") && <p id={f("message-error")} className="text-sm text-destructive">{err("message")}</p>}
        </div>
      )}

      {TURNSTILE_SITE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
        </>
      )}

      {status.kind === "error" && (
        <div role="alert" className="flex flex-col gap-3 rounded-input border border-destructive p-4">
          <p className="type-body text-ink">{status.message}</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={`tel:${phone}`}><Phone aria-hidden /> Call us</a>
            </Button>
            {errorWa && (
              <Button asChild variant="outline" size="sm">
                <a href={errorWa} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden /> WhatsApp us</a>
              </Button>
            )}
          </div>
        </div>
      )}

      <Button type="submit" size="lg" disabled={hydrated && (!isValid || isSubmitting)} aria-busy={isSubmitting || undefined}>
        {isSubmitting ? "Sending…" : (submitLabel ?? (variant === "callback" ? "Request a callback" : "Enquire Now"))}
      </Button>
    </form>
  );
}
