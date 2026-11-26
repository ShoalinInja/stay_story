import Image from "next/image";
import { TicketPercent } from "lucide-react";
import { Card, Rail, RailArrows, RailTrack, SectionHeader, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/primitives";
import type { Offer } from "@/lib/content";
import { cn } from "@/lib/utils";
import { CopyCodeButton } from "./CopyCodeButton";
import { HOME_COPY } from "./copy";

const T = HOME_COPY.offers;

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-12 place-items-center overflow-hidden rounded-input bg-brand-tint">
          {offer.icon ? (
            <Image src={offer.icon.src} alt="" width={48} height={48} className="object-cover" />
          ) : (
            <TicketPercent aria-hidden className="size-6 text-ink" />
          )}
        </span>
        <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink-2">
          {T.validTill} {offer.validTill}
        </span>
      </div>
      <h3 className="type-h3 text-ink">{offer.title}</h3>
      <p className="line-clamp-3 type-body text-muted-text">{offer.description}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="rounded-input border border-dashed border-ink-2 px-3 py-1.5 font-mono text-sm font-semibold text-ink">
          {offer.code}
        </span>
        <CopyCodeButton code={offer.code} />
      </div>
    </Card>
  );
}

/** Hidden when there are no offers (the case today). */
export function Offers({ offers, className }: { offers: Offer[]; className?: string }) {
  if (!offers.length) return null;
  const tabs = [
    { value: "all", label: T.tabs.all, offers },
    { value: "stay", label: T.tabs.stay, offers: offers.filter((o) => o.kind === "stay") },
    { value: "experience", label: T.tabs.experience, offers: offers.filter((o) => o.kind === "experience") },
  ].filter((t) => t.offers.length > 0);
  return (
    <section aria-labelledby="home-offers" className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id="home-offers" title={T.title} />
        <Tabs defaultValue="all">
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
                <RailTrack slideClassName="basis-[85%] sm:basis-[320px]">
                  {t.offers.map((o) => (
                    <OfferCard key={o.id} offer={o} />
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
