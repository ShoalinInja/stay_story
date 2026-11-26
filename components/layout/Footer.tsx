import Link from "next/link";
import { getAreas, getCategories, getSite } from "@/lib/content";
import { UI, formatPhone, mapsHref, telHref } from "./copy";
import { FOOTER_NAV_ID } from "./Header";
import { SeoFooterGrid } from "./SeoFooterGrid";

type L = { label: string; href: string };
const link = "text-sm text-footer-text/75 hover:text-footer-text hover:underline";

function Column({ title, links }: { title: string; links: L[] }) {
  return (
    <div>
      <h2 className="mb-3 type-h3">{title}</h2>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} prefetch={false} className={link}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const [site, areas, categories] = await Promise.all([getSite(), getAreas(), getCategories()]);
  const navItems = site.nav.flatMap((g) => g.items);
  const fromNav = (href: string) => navItems.filter((i) => i.href === href);
  const p = UI.pages;
  const a = site.address;

  return (
    <footer className="bg-footer-bg text-footer-text">
      <div className="container-site section-y flex flex-col gap-10">
        <SeoFooterGrid areas={areas} categories={categories} />

        <div id={FOOTER_NAV_ID} className="grid scroll-mt-20 gap-8 border-t border-footer-text/15 pt-10 sm:grid-cols-2 lg:grid-cols-5">
          <Column title={UI.footer.topAreas} links={areas.map((x) => ({ label: x.name, href: `/areas/${x.key}` }))} />
          <Column title={UI.footer.services} links={categories.map((c) => ({ label: c.title, href: `/${c.slug}` }))} />
          <Column
            title={UI.footer.about}
            links={[{ label: p.about, href: "/about" }, { label: p.gallery, href: "/gallery" }, ...fromNav("/property-sales"), ...fromNav("/list-your-property")]}
          />
          <Column title={UI.footer.support} links={[{ label: p.contact, href: "/contact" }, { label: p.privacy, href: "/privacy" }, { label: p.terms, href: "/terms" }]} />
          <address className="not-italic">
            <h2 className="mb-3 type-h3">{UI.footer.contact}</h2>
            <p className="text-sm text-footer-text/75">
              {a.line}, {a.locality}, {a.region} {a.postalCode}
            </p>
            <a href={mapsHref(a)} target="_blank" rel="noopener noreferrer" className={`${link} mt-1 inline-block`}>{UI.contact.directions}</a>
            <p className="mt-3 flex flex-col gap-2">
              <a href={telHref(site.phone)} className={link}>{formatPhone(site.phone)}</a>
              <a href={`mailto:${site.contactEmail}`} className={`${link} break-all`}>{site.contactEmail}</a>
            </p>
          </address>
        </div>

        {site.socials.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 border-t border-footer-text/15 pt-6">
            <span className="text-sm font-semibold">{UI.footer.follow}</span>
            {site.socials.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className={link}>{s.platform}</a>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-footer-text/15 pt-6 text-sm text-footer-text/75 sm:flex-row sm:items-center sm:justify-between">
          <p>{UI.footer.rights(site.name)}</p>
          <ul className="flex gap-4">
            <li><Link href="/privacy" prefetch={false} className={link}>{p.privacy}</Link></li>
            <li><Link href="/terms" prefetch={false} className={link}>{p.terms}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
