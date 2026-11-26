import { Rail, RailArrows, RailTrack, SectionHeader, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/primitives";
import { StayCard } from "@/components/stays/StayCard";
import type { Stay } from "@/lib/content";
import { cn } from "@/lib/utils";
import { HOME_COPY } from "./copy";

const T = HOME_COPY.featured;

/** Tabs filter all bookable stays (featured first); for-sale is excluded and empty tabs are dropped. */
export function featuredTabs(stays: Stay[]) {
  const bookable = stays.filter((s) => s.type !== "for-sale");
  return [
    { value: "all", label: T.tabs.all, stays: bookable },
    { value: "north-goa", label: T.tabs.north, stays: bookable.filter((s) => s.region === "north-goa") },
    { value: "south-goa", label: T.tabs.south, stays: bookable.filter((s) => s.region === "south-goa") },
    { value: "pool-villas", label: T.tabs.pool, stays: bookable.filter((s) => s.collections.includes("pool-villas")) },
  ].filter((t) => t.stays.length > 0);
}

export function FeaturedStays({ stays, className }: { stays: Stay[]; className?: string }) {
  const tabs = featuredTabs(stays);
  if (!tabs.length) return null;
  return (
    <section aria-labelledby="home-featured" className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id="home-featured" title={T.title} link={T.link} />
        <Tabs defaultValue={tabs[0].value}>
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              <Rail label={`${T.title}: ${t.label}`}>
                <div className="mb-4 flex justify-end">
                  <RailArrows />
                </div>
                <RailTrack slideClassName="basis-[85%] sm:basis-[300px] lg:basis-1/3">
                  {t.stays.map((s) => (
                    <StayCard key={s.slug} stay={s} className="block h-full" />
                  ))}
                </RailTrack>
              </Rail>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
