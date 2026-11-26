"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Exact paths that render their own mobile Enquire bar (stay details: /stays/[slug]). */
  hidePaths: string[];
  /** Category slugs whose /[category]/[slug] detail pages render their own bar. */
  hideUnder: string[];
};

/** Hides MobileBottomBar (and its spacer) on routes that ship their own sticky mobile bar. Wrap in <Suspense fallback={children}>. */
export function BottomBarGate({ children, hidePaths, hideUnder }: Props) {
  const pathname = usePathname();
  const [, first, second, extra] = pathname.split("/");
  const isServiceDetail = !!second && extra === undefined && hideUnder.includes(first);
  return hidePaths.includes(pathname) || isServiceDetail ? null : <>{children}</>;
}
