"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { ChevronDown } from "lucide-react";
import type { NavGroup } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { UI } from "./copy";
import { NavFeature } from "./NavFeature";

export type MegaMenuProps = { groups: NavGroup[]; label: string; className?: string };

/**
 * Desktop mega-menu. Every top-level item is a real <a>, so it works without JS.
 * Mouse: hover opens. Touch/pen: first tap opens, second tap navigates. Keyboard: chevron button
 * toggles; ←/→ move between top items; ↓ opens and enters the panel; ↑/↓ move inside; Esc closes.
 */
export function MegaMenu({ groups, label, className }: MegaMenuProps) {
  const [open, setOpen] = useState<number | null>(null);
  const pointerType = useRef("mouse");
  const root = useRef<HTMLElement>(null);
  const id = useId();

  useEffect(() => {
    if (open === null) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const tops = () => Array.from(root.current?.querySelectorAll<HTMLElement>("[data-top]") ?? []);
  const panelLinks = (i: number) => Array.from(root.current?.querySelectorAll<HTMLElement>(`[data-panel="${i}"] a`) ?? []);
  const focusPanel = (i: number, at: "first" | "last") =>
    requestAnimationFrame(() => {
      const links = panelLinks(i);
      links[at === "first" ? 0 : links.length - 1]?.focus();
    });

  function onKeyDown(e: KeyboardEvent) {
    const el = e.target as HTMLElement;
    const topIndex = el.closest("li[data-index]")?.getAttribute("data-index");
    const i = topIndex == null ? -1 : Number(topIndex);
    const inPanel = !!el.closest("[data-panel]");
    if (e.key === "Escape" && open !== null) {
      e.preventDefault();
      tops()[open]?.focus();
      setOpen(null);
      return;
    }
    if (!inPanel && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      e.preventDefault();
      const t = tops();
      t[(i + (e.key === "ArrowRight" ? 1 : -1) + t.length) % t.length]?.focus();
      setOpen(null);
      return;
    }
    if (!inPanel && e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(i);
      focusPanel(i, "first");
      return;
    }
    if (inPanel && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const links = panelLinks(i);
      const at = links.indexOf(el);
      const next = at + (e.key === "ArrowDown" ? 1 : -1);
      if (next < 0) tops()[i]?.focus();
      else links[Math.min(next, links.length - 1)]?.focus();
    }
  }

  function onTopClick(e: MouseEvent, i: number) {
    if (pointerType.current !== "mouse" && open !== i) {
      e.preventDefault(); // touch: first tap opens, second navigates
      setOpen(i);
    } else setOpen(null);
  }

  return (
    <nav
      ref={root}
      aria-label={label}
      className={cn("relative", className)}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => (pointerType.current = e.pointerType)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(null)}
    >
      <ul className="flex items-center gap-1">
        {groups.map((g, i) => {
          const panelId = `${id}-panel-${i}`;
          const isOpen = open === i;
          return (
            <li key={g.href} data-index={i} onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}>
              <div className="flex items-center">
                <Link
                  href={g.href}
                  data-top
                  onClick={(e) => onTopClick(e, i)}
                  className={cn(
                    "flex h-11 items-center rounded-input pl-3 text-sm font-semibold text-ink hover:text-brand-strong",
                    isOpen && "text-brand-strong",
                  )}
                >
                  {g.label}
                </Link>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={UI.submenu(g.label)}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex h-11 items-center rounded-input pr-2 pl-1 text-ink-2 hover:text-ink"
                >
                  <ChevronDown aria-hidden className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
                </button>
              </div>
              <div id={panelId} data-panel={i} hidden={!isOpen} className="absolute top-full left-1/2 z-50 w-[640px] -translate-x-1/2 pt-2">
                <div className="grid grid-cols-[1fr_260px] gap-6 rounded-card border border-line-soft bg-surface p-6 shadow-card-hover">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <Link href={g.href} onClick={() => setOpen(null)} className="block rounded-input px-3 py-2 type-h3 text-ink hover:bg-surface-2">
                        {g.label}
                      </Link>
                    </li>
                    {g.items.map((it) => (
                      <li key={it.href}>
                        <Link href={it.href} onClick={() => setOpen(null)} className="block rounded-input px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink">
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {g.feature && <NavFeature feature={g.feature} onNavigate={() => setOpen(null)} />}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
