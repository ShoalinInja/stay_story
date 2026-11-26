"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-media-query";
import { Button } from "./button";

type EmblaApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>;
type EmblaOptions = Parameters<typeof useEmblaCarousel>[0];

type RailState = {
  viewportRef: ReturnType<typeof useEmblaCarousel>[0];
  api: EmblaApi | undefined;
  canPrev: boolean;
  canNext: boolean;
  progress: number;
};

const RailContext = React.createContext<RailState | null>(null);

function useRail(): RailState {
  const ctx = React.useContext(RailContext);
  if (!ctx) throw new Error("Rail parts must be rendered inside <Rail>");
  return ctx;
}

const MIN_AUTOPLAY_MS = 5000;

export type RailProps = {
  /** Accessible name of the carousel region. */
  label: string;
  children: React.ReactNode;
  /** Embla options, e.g. { loop: true }. Defaults: align start, trim snaps. */
  options?: EmblaOptions;
  /** Autoplay interval in ms (clamped to ≥ 5000). Off by default; off under reduced motion; pauses on hover/focus. */
  autoplay?: number;
  className?: string;
};

/**
 * Carousel region. Compose: <Rail label><SectionHeader actions={<RailArrows />} /><RailTrack>…</RailTrack><RailProgress /></Rail>.
 * Arrow keys scroll while focus is inside the rail.
 */
export function Rail({ label, children, options, autoplay, className }: RailProps) {
  const [viewportRef, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", ...options });
  const [nav, setNav] = React.useState({ canPrev: false, canNext: false, progress: 0 });
  const [paused, setPaused] = React.useState(false);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (!api) return;
    const sync = () =>
      setNav({
        canPrev: api.canScrollPrev(),
        canNext: api.canScrollNext(),
        progress: Math.max(0, Math.min(1, api.scrollProgress())),
      });
    api.on("init", sync).on("reInit", sync).on("select", sync).on("scroll", sync).on("resize", sync);
    const raf = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(raf);
      api.off("init", sync).off("reInit", sync).off("select", sync).off("scroll", sync).off("resize", sync);
    };
  }, [api]);

  const autoplayMs = autoplay ? Math.max(MIN_AUTOPLAY_MS, autoplay) : 0;
  React.useEffect(() => {
    if (!api || !autoplayMs || paused || reducedMotion) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [api, autoplayMs, paused, reducedMotion]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Nested widgets (tabs, comboboxes, portalled dialogs) handle their own arrows.
    if (e.defaultPrevented || !e.currentTarget.contains(e.target as Node)) return;
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea, select, [contenteditable='true']")) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      api?.scrollPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      api?.scrollNext();
    }
  };

  const pauseHandlers = autoplayMs
    ? {
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
        onFocus: () => setPaused(true),
        onBlur: (e: React.FocusEvent) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
        },
      }
    : {};

  return (
    <RailContext.Provider value={{ viewportRef, api, ...nav }}>
      <section
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn("relative", className)}
        {...pauseHandlers}
      >
        {children}
      </section>
    </RailContext.Provider>
  );
}

export type RailTrackProps = {
  children: React.ReactNode;
  /** Classes for each slide wrapper, e.g. "basis-[280px]" or "basis-full md:basis-1/3". */
  slideClassName?: string;
  className?: string;
};

/** Scroll viewport. Each child becomes a slide (role=group, "n of total"). */
export function RailTrack({ children, slideClassName = "basis-[280px] sm:basis-[300px]", className }: RailTrackProps) {
  const { viewportRef } = useRail();
  const slides = React.Children.toArray(children);
  return (
    // Vertical padding keeps card hover lift, shadow and focus outlines from being clipped.
    <div ref={viewportRef} className="-my-4 overflow-hidden">
      <div className={cn("-ml-4 flex touch-pan-y py-4", className)}>
        {slides.map((child, i) => (
          <div
            key={React.isValidElement(child) && child.key != null ? child.key : i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={cn("min-w-0 shrink-0 grow-0 pl-4", slideClassName)}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

type ArrowProps = { label?: string; className?: string };

// aria-disabled (not disabled) so keyboard focus isn't dropped to <body> at the ends.
export function RailPrev({ label = "Previous", className }: ArrowProps) {
  const { api, canPrev } = useRail();
  return (
    <Button
      variant="icon-circle"
      aria-label={label}
      aria-disabled={!canPrev}
      onClick={() => canPrev && api?.scrollPrev()}
      className={cn("aria-disabled:pointer-events-auto aria-disabled:cursor-default", className)}
    >
      <ChevronLeft aria-hidden className="size-5" />
    </Button>
  );
}

export function RailNext({ label = "Next", className }: ArrowProps) {
  const { api, canNext } = useRail();
  return (
    <Button
      variant="icon-circle"
      aria-label={label}
      aria-disabled={!canNext}
      onClick={() => canNext && api?.scrollNext()}
      className={cn("aria-disabled:pointer-events-auto aria-disabled:cursor-default", className)}
    >
      <ChevronRight aria-hidden className="size-5" />
    </Button>
  );
}

export function RailArrows({ prevLabel, nextLabel }: { prevLabel?: string; nextLabel?: string }) {
  return (
    <div className="flex gap-2">
      <RailPrev label={prevLabel} />
      <RailNext label={nextLabel} />
    </div>
  );
}

/** Decorative scroll-progress bar; hidden when nothing scrolls. */
export function RailProgress({ className }: { className?: string }) {
  const { canPrev, canNext, progress } = useRail();
  if (!canPrev && !canNext) return null;
  return (
    <div aria-hidden className={cn("mx-auto mt-6 h-1 w-32 overflow-hidden rounded-full bg-line-soft", className)}>
      <div
        className="h-full w-full origin-left rounded-full bg-ink transition-transform duration-100"
        style={{ transform: `scaleX(${Math.max(0.08, progress)})` }}
      />
    </div>
  );
}
