"use client";

import * as React from "react";
import {
  Accordion as UiAccordion,
  AccordionContent as UiAccordionContent,
  AccordionItem as UiAccordionItem,
  AccordionTrigger as UiAccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function Accordion({ className, ...props }: React.ComponentProps<typeof UiAccordion>) {
  return <UiAccordion className={cn("border-t border-line-soft", className)} {...props} />;
}

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof UiAccordionItem>) {
  return <UiAccordionItem className={cn("border-b border-line-soft", className)} {...props} />;
}

export function AccordionTrigger({ className, ...props }: React.ComponentProps<typeof UiAccordionTrigger>) {
  return (
    <UiAccordionTrigger
      className={cn(
        // type-h3 metrics spelled out: cn can't see type-h3 conflicting with shadcn's text-sm/font-medium.
        "min-h-11 items-center rounded-none py-4 text-base leading-6 font-semibold text-ink hover:no-underline",
        "focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionContent({ className, ...props }: React.ComponentProps<typeof UiAccordionContent>) {
  return <UiAccordionContent className={cn("pb-4 type-body text-ink-2", className)} {...props} />;
}
