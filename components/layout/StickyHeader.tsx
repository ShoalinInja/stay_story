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
      className="sticky top-0 z-40 border-b border-line-soft bg-surface transition-shadow data-scrolled:shadow-card"
    >
      {children}
    </header>
  );
}
