import Link from "next/link";
import { getSite } from "@/lib/content";
import { Button } from "@/components/primitives";
import { EnquiryModal } from "@/components/forms/EnquiryModal";
import { UI, telHref } from "./copy";
import { BrandLogo } from "./BrandLogo";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { StickyHeader } from "./StickyHeader";

/** Id of the footer link list the no-JS hamburger falls back to. */
export const FOOTER_NAV_ID = "footer-nav";

export async function Header() {
  const site = await getSite();

  return (
    <StickyHeader>
      <div className="container-site flex h-16 items-center gap-4">
        <Link href="/" className="shrink-0">
          <BrandLogo name={site.name} tagline={site.tagline} />
        </Link>
        <div className="flex min-w-0 flex-1 justify-center">
          <MegaMenu groups={site.nav} label={UI.menu} className="hidden xl:block" />
        </div>
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
