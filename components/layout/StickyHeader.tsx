"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Sticky 64px header shell; adds a shadow once the page scrolls. */
export function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      data-scrolled={scrolled || undefined}
      // Exactly 64px: the hairline is an inset shadow so it adds no height (A5 sticks tabs at top-16).
      className="sticky top-0 z-40 h-16 bg-surface shadow-[inset_0_-1px_0_var(--line-soft)] transition-shadow data-scrolled:shadow-card"
    >
      {children}
    </header>
  );
}
