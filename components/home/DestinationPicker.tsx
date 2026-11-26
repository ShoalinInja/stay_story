import Link from "next/link";
import { IconBlob, Rail, RailArrows, RailProgress, RailTrack, SectionHeader } from "@/components/primitives";
import { resolveIcon } from "@/lib/icons";
import type { Area } from "@/lib/content";
import { cn } from "@/lib/utils";
import { AREA_ICONS, HOME_COPY } from "./copy";

const T = HOME_COPY.destinations;

export function DestinationPicker({ areas, className }: { areas: Area[]; className?: string }) {
  if (!areas.length) return null;
  return (
    <section aria-labelledby="home-destinations" className={cn("section-y", className)}>
      <div className="container-site">
        <Rail label={T.carouselLabel}>
          <SectionHeader id="home-destinations" title={T.title} actions={<RailArrows />} />
          <RailTrack slideClassName="basis-[128px] sm:basis-[148px]">
            {areas.map((a) => (
              <Link
                key={a.key}
                href={`/areas/${a.key}`}
                className="group flex flex-col items-center gap-3 rounded-card p-2 text-center"
              >
                <IconBlob icon={resolveIcon(AREA_ICONS[a.key])} size="lg" className="transition-transform group-hover:-translate-y-0.5" />
                <span className="text-sm font-semibold text-ink group-hover:underline">{a.name}</span>
              </Link>
            ))}
          </RailTrack>
          <RailProgress />
        </Rail>
      </div>
    </section>
  );
}
