"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone } from "lucide-react";
import type { NavGroup } from "@/lib/content/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Sheet } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { UI, formatPhone, telHref } from "./copy";

export type MobileNavProps = { groups: NavGroup[]; phone: string; fallbackHref: string; triggerClassName?: string };

/**
 * Full-screen drawer with one accordion per nav group. Without JS the hamburger is a plain link
 * to the footer's link list (fallbackHref), so navigation still works.
 */
export function MobileNav({ groups, phone, fallbackHref, triggerClassName }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet
        // Passed as the Sheet trigger so Radix restores focus to it on close. Its own preventDefault
        // keeps the no-JS fallback href from navigating; Radix then skips its toggle, so open it here.
        trigger={
          <a
            href={fallbackHref}
            aria-label={UI.openMenu}
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            className={cn("flex size-11 items-center justify-center rounded-input text-ink hover:bg-surface-2 xl:hidden", triggerClassName)}
          >
            <Menu aria-hidden className="size-6" />
          </a>
        }
        open={open}
        onOpenChange={setOpen}
        side="left"
        title={UI.menu}
        className="w-full max-w-none data-[side=left]:w-full data-[side=left]:sm:max-w-none"
        footer={
          <a href={telHref(phone)} className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-ink font-semibold text-ink">
            <Phone aria-hidden className="size-4" />
            {UI.getInTouch} · {formatPhone(phone)}
          </a>
        }
      >
        <Accordion type="single" collapsible>
          {groups.map((g) => (
            <AccordionItem key={g.href} value={g.href}>
              <AccordionTrigger>{g.label}</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col">
                  {[{ label: g.label, href: g.href }, ...g.items].map((it, i) => (
                    <li key={it.href}>
                      <Link href={it.href} onClick={close} className={`flex min-h-11 items-center ${i === 0 ? "font-semibold text-ink" : "text-ink-2"}`}>
                        {it.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
    </Sheet>
  );
}
