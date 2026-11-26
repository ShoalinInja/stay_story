import Link from "next/link";
import type { Area, ServiceCategory } from "@/lib/content/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/primitives";
import { UI } from "./copy";

type Tab = { key: string; label: string; links: { label: string; href: string }[] };

const items = (cats: ServiceCategory[], keys: string[]) =>
  cats.filter((c) => keys.includes(c.key)).flatMap((c) => c.items.map((i) => ({ label: i.title, href: `/${c.slug}/${i.slug}` })));

function buildTabs(areas: Area[], cats: ServiceCategory[]): Tab[] {
  const t = UI.footer.tabs;
  return [
    { key: "villas", label: t.villas, links: areas.map((a) => ({ label: UI.footer.villasIn(a.name), href: `/areas/${a.key}` })) },
    { key: "apartments", label: t.apartments, links: areas.map((a) => ({ label: UI.footer.apartmentsIn(a.name), href: `/stays?type=apartment&area=${a.key}` })) },
    { key: "long-term", label: t.longTerm, links: areas.map((a) => ({ label: UI.footer.longTermIn(a.name), href: `/stays?type=long-term&area=${a.key}` })) },
    { key: "experiences", label: t.experiences, links: items(cats, ["experiences"]) },
    { key: "events", label: t.events, links: items(cats, ["events"]) },
    { key: "services", label: t.services, links: items(cats, ["travel", "concierge", "entertainment"]) },
  ].filter((tab) => tab.links.length > 0);
}

/**
 * Tab row over a 5-col link grid. All panels are force-mounted so every link is in the HTML
 * (crawlers, no-JS); inactive panels are hidden with CSS.
 */
export function SeoFooterGrid({ areas, categories }: { areas: Area[]; categories: ServiceCategory[] }) {
  const tabs = buildTabs(areas, categories);
  if (!tabs.length) return null;
  return (
    <section aria-label={UI.footer.explore}>
      <Tabs defaultValue={tabs[0].key}>
        <TabsList className="border-footer-text/20">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.key}
              value={t.key}
              className="text-footer-text/70 after:bg-footer-text hover:text-footer-text data-active:text-footer-text"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} forceMount className="data-[state=inactive]:hidden">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 pt-2 sm:grid-cols-3 lg:grid-cols-5">
              {t.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} prefetch={false} className="text-sm text-footer-text/75 hover:text-footer-text hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
