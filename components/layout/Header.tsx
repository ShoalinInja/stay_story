import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getAreas, getSite, getStays } from "@/lib/content";
import { Button } from "@/components/primitives";
import { EnquiryModal } from "@/components/forms/EnquiryModal";
import { SearchBar } from "@/components/home/SearchBar";
import { UI, telHref } from "./copy";
import { HeaderCentre } from "./HeaderCentre";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { areaSearchOptions } from "./search-options";
import { StickyHeader } from "./StickyHeader";

export type HeaderProps = {
  /** "default": mega-menu centre. "detail": compact search centre. Omitted: auto (detail on /stays/[slug]). */
  variant?: "default" | "detail";
};

/** Id of the footer link list the no-JS hamburger falls back to. */
export const FOOTER_NAV_ID = "footer-nav";

export async function Header({ variant }: HeaderProps) {
  const [site, areas, stays] = await Promise.all([getSite(), getAreas(), getStays()]);
  const nav = <MegaMenu groups={site.nav} label={UI.menu} className="hidden xl:block" />;
  const search = (
    <div className="flex min-w-0 items-center gap-2">
      <SearchBar variant="compact" options={areaSearchOptions(areas)} className="hidden md:flex" />
      {/* The mega-menu isn't shown in this variant, so keep the drawer reachable on wide screens too. */}
      <MobileNav groups={site.nav} phone={site.phone} fallbackHref={`#${FOOTER_NAV_ID}`} triggerClassName="hidden xl:flex" />
    </div>
  );
  const centre =
    variant === "detail" ? search
    : variant === "default" ? nav
    : (
      <Suspense fallback={nav}>
        <HeaderCentre nav={nav} search={search} detailPaths={stays.map((s) => `/stays/${s.slug}`)} />
      </Suspense>
    );

  return (
    <StickyHeader>
      <div className="container-site flex h-16 items-center gap-4">
        <Link href="/" className="shrink-0">
          <Image src={site.logo.src} alt={site.name} width={site.logo.width} height={site.logo.height} preload className="h-10 w-auto" sizes="104px" />
        </Link>
        <div className="flex min-w-0 flex-1 justify-center">{centre}</div>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="pill" size="sm" className="hidden lg:inline-flex">
            <a href={telHref(site.phone)}>{UI.getInTouch}</a>
          </Button>
          <EnquiryModal
            variant="contact"
            source="header"
            trigger={<Button variant="dark" size="sm" className="hidden sm:inline-flex">{UI.enquire}</Button>}
          />
          <MobileNav groups={site.nav} phone={site.phone} fallbackHref={`#${FOOTER_NAV_ID}`} />
        </div>
      </div>
    </StickyHeader>
  );
}
