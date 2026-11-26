import { Suspense } from "react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/site";
import { AMENITIES, copy } from "@/components/stays/copy";
import { loadAreas, loadStays, loadStaysCategory } from "@/components/stays/data";
import { FilterBar } from "@/components/stays/FilterBar";
import { exceedsCapacity, parseStayParams } from "@/components/stays/params";
import { StayGrid, StaysEmpty } from "@/components/stays/StayGrid";
import type { AmenityKey } from "@/lib/content/types";

export async function generateMetadata(): Promise<Metadata> {
  const cat = await loadStaysCategory();
  return cat ? pageMetadata({ title: cat.seo.title, absoluteTitle: true, description: cat.seo.description, keywords: cat.seo.keywords, path: "/stays" }) : {};
}

export default async function StaysPage({ searchParams }: PageProps<"/stays">) {
  const cat = await loadStaysCategory();
  return (
    <main id="main" className="container-site section-y flex-1">
      <header className="max-w-3xl">
        <h1 className="type-h1 font-display text-ink">{cat?.tagline}</h1>
        {cat?.intro && <p className="mt-3 type-body text-ink-2">{cat.intro}</p>}
      </header>
      {/* searchParams are request-time under Cache Components: read them inside the boundary. */}
      {/* Fallback is the unfiltered listing (prerendered), so the page works without JS (BRIEF §7). */}
      <Suspense fallback={<Listing searchParams={Promise.resolve({})} />}>
        <Listing searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Listing({ searchParams }: Pick<PageProps<"/stays">, "searchParams">) {
  const [sp, areas, all] = await Promise.all([searchParams, loadAreas(), loadStays()]);
  const { filters, from, to } = parseStayParams(sp, areas.map((a) => a.key), Object.keys(AMENITIES) as AmenityKey[]);
  const stays = await loadStays(filters);
  const areaOptions = [{ value: "north-goa", label: copy.filters.northGoa }, ...areas.map((a) => ({ value: a.key, label: a.name }))];
  const enquiry = { variant: "stay" as const, defaults: { checkIn: from, checkOut: to, adults: filters.guests } };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
      <FilterBar areaOptions={areaOptions} filters={filters} from={from} to={to} total={stays.length} />
      <section aria-label={copy.filters.results(stays.length)}>
        <h2 className="sr-only">{copy.filters.results(stays.length)}</h2>
        {stays.length > 0 ? (
          <StayGrid stays={stays} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" />
        ) : exceedsCapacity(filters.guests, all) ? (
          <StaysEmpty
            title={copy.empty.largeGroup}
            body={copy.empty.largeGroupBody(filters.guests ?? 0)}
            form={{ ...enquiry, source: "stays:large-group" }}
          />
        ) : (
          <StaysEmpty title={copy.empty.noMatch} form={{ ...enquiry, source: "stays:no-match" }} />
        )}
      </section>
    </div>
  );
}
