import type { ReactNode } from "react";
import { EnquiryForm, type EnquiryFormProps } from "@/components/forms/EnquiryForm";
import type { Stay } from "@/lib/content/types";
import { StayCard } from "./StayCard";

export function StayGrid({ stays, className }: { stays: Stay[]; className?: string }) {
  return (
    <ul className={className ?? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
      {stays.map((s, i) => (
        <li key={s.slug}>
          <StayCard stay={s} priority={i === 0} />
        </li>
      ))}
    </ul>
  );
}

/** Empty listing → enquiry (BRIEF §6 A5). */
export function StaysEmpty({ title, body, form }: { title: string; body?: ReactNode; form: EnquiryFormProps }) {
  return (
    <div className="rounded-card bg-cream p-6 md:p-8">
      <h2 className="type-h2 font-display text-ink">{title}</h2>
      {body && <p className="mt-2 type-body text-ink-2">{body}</p>}
      <EnquiryForm {...form} className="mt-6 max-w-xl" />
    </div>
  );
}
