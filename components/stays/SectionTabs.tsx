"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SectionLink = { id: string; label: string };

/** Sticky in-page nav with scroll-spy. Plain anchor links, so it works without JS. */
export function SectionTabs({ sections, label }: { sections: SectionLink[]; label: string }) {
  const [active, setActive] = React.useState(sections[0]?.id);

  React.useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    // Active = the last section whose top has passed the band just under the sticky header + tabs.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label={label} className="sticky top-16 z-20 -mx-4 border-b border-line-soft bg-surface/95 px-4 backdrop-blur md:mx-0 md:px-0">
      <ul className="flex gap-6 overflow-x-auto">
        {sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "location" : undefined}
              onClick={() => setActive(s.id)}
              className={cn(
                "relative flex h-12 items-center text-sm font-semibold text-muted-text hover:text-ink",
                active === s.id && "text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-ink",
              )}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
