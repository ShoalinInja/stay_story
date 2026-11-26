"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Picks the header centre by route: the compact search on stay detail pages, the mega-menu elsewhere.
 * Both slots are server-rendered; this only chooses. Wrap in <Suspense fallback={nav}> (usePathname
 * suspends under Cache Components on routes with unknown dynamic params).
 */
export function HeaderCentre({ nav, search, detailPaths }: { nav: ReactNode; search: ReactNode; detailPaths: string[] }) {
  const pathname = usePathname();
  return <>{detailPaths.includes(pathname) ? search : nav}</>;
}
