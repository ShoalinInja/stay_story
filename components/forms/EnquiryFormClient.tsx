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
import { FORM_COPY as T } from "./copy";

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
  const all: Record<string, string> = {
    ...stored,
    ...fromUrl,
    page: window.location.pathname,
    ...(document.referrer ? { referrer: document.referrer } : {}),
  };
  // Match the schema caps so a long tracking param never turns into a 400.
  return Object.fromEntries(Object.entries(all).slice(0, 20).map(([k, v]) => [k.slice(0, 50), String(v).slice(0, 500)]));
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

  const contactLine = T.errors.contactLine(formatIndianPhone(phone), !!whatsapp);

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
        res.status === 429 ? `${T.errors.rateLimited} ${contactLine}`
        : res.status === 400 ? (body.error === "captcha" ? `${T.errors.invalid} ${T.errors.captcha}` : T.errors.invalid)
        : `${T.errors.failed} ${contactLine}`;
      setStatus({ kind: "error", message });
    } catch {
      setStatus({ kind: "error", message: `${T.errors.network} ${contactLine}` });
    }
  };

  const waLink = (lead?: EnquiryData) =>
    whatsapp ? whatsAppUrl(whatsapp, leadWhatsAppMessage(lead ?? { type, staySlug, serviceSlug })) : null;

  if (status.kind === "sent") {
    const wa = waLink(status.lead);
    return (
      <div role="status" className={cn("flex flex-col items-start gap-3 rounded-card bg-surface-2 p-6", className)}>
        <CircleCheck aria-hidden className="size-8 text-success" />
        <h3 ref={doneRef} tabIndex={-1} className="type-h3 text-ink">{T.sent.title}</h3>
        <p className="type-body text-muted-text">{T.sent.body(!!wa)}</p>
        {wa && (
          <Button asChild variant="dark">
            <a href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden /> {T.sent.whatsapp}</a>
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
      {/* Plain inputs with real values: register() only fills the DOM after hydration, and no-JS posts need these.
          The JS path gets them from defaultValues. */}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="source" value={source} />
      {staySlug && <input type="hidden" name="staySlug" value={staySlug} />}
      {serviceSlug && <input type="hidden" name="serviceSlug" value={serviceSlug} />}

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={f("website")}>{T.fields.honeypot}</label>
        <input id={f("website")} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Input id={f("name")} label={T.fields.name} autoComplete="name" required error={err("name")} {...register("name")} />
      <Input
        id={f("phone")} label={T.fields.phone} type="tel" inputMode="tel" autoComplete="tel" required
        placeholder={T.fields.phonePlaceholder} error={err("phone")} {...register("phone")}
      />
      {wantsEmail && (
        <Input id={f("email")} label={T.fields.email} type="email" autoComplete="email" error={err("email")} {...register("email")} />
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
              <Input id={f("ns-in")} name="checkIn" type="date" label={T.fields.checkIn} />
              <Input id={f("ns-out")} name="checkOut" type="date" label={T.fields.checkOut} />
            </div>
          </noscript>
        </>
      )}
      {isStay && stayMode === "move-in" && (
        <Input id={f("moveIn")} label={T.fields.moveIn} type="month" error={err("moveIn")} {...register("moveIn")} />
      )}
      {((isStay && stayMode === "site-visit") || variant === "service") && (
        <Input
          id={f("date")} label={variant === "service" ? T.fields.serviceDate : T.fields.siteVisitDate}
          type="date" defaultValue={defaults?.checkIn} error={err("checkIn")} {...register("checkIn")}
        />
      )}

      {wantsGuests && (
        <div className="grid grid-cols-2 gap-3">
          <Input id={f("adults")} label={T.fields.adults} type="number" min={1} max={99} inputMode="numeric" defaultValue={defaults?.adults ?? 2} error={err("adults")} {...register("adults")} />
          {isStay && (
            <Input id={f("children")} label={T.fields.children} type="number" min={0} max={99} inputMode="numeric" defaultValue={defaults?.children ?? 0} error={err("children")} {...register("children")} />
          )}
        </div>
      )}

      {wantsMessage && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={f("message")} className="text-sm font-semibold text-ink">
            {variant === "property-owner" ? T.fields.propertyMessage : messageRequired ? T.fields.message : T.fields.messageOptional}
          </label>
          <textarea
            id={f("message")} rows={4} required={messageRequired}
            aria-invalid={err("message") ? true : undefined}
            aria-describedby={err("message") ? f("message-error") : undefined}
            defaultValue={defaults?.message}
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
              <a href={`tel:${phone}`}><Phone aria-hidden /> {T.errors.call}</a>
            </Button>
            {errorWa && (
              <Button asChild variant="outline" size="sm">
                <a href={errorWa} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden /> {T.errors.whatsapp}</a>
              </Button>
            )}
          </div>
        </div>
      )}

      <Button type="submit" size="lg" disabled={hydrated && (!isValid || isSubmitting)} aria-busy={isSubmitting || undefined}>
        {isSubmitting ? T.submit.sending : (submitLabel ?? (variant === "callback" ? T.submit.callback : T.submit.default))}
      </Button>
    </form>
  );
}
