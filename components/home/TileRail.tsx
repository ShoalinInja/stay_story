import { Rail, RailArrows, RailProgress, RailTrack, SectionHeader } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { CollectionTile, type CollectionTileProps } from "./CollectionTile";

type TileRailProps = {
  id: string;
  title: string;
  label: string;
  tiles: Omit<CollectionTileProps, "className">[];
  className?: string;
};

/** Section of CollectionTiles in a Rail ("Plan Your Goa", "Choose a Stay Collection"). */
export function TileRail({ id, title, label, tiles, className }: TileRailProps) {
  if (!tiles.length) return null;
  return (
    <section aria-labelledby={id} className={cn("section-y", className)}>
      <div className="container-site">
        <Rail label={label}>
          <SectionHeader id={id} title={title} actions={<RailArrows />} />
          <RailTrack slideClassName="basis-[60%] sm:basis-[240px] lg:basis-[264px]">
            {tiles.map((t) => (
              <CollectionTile key={t.href} {...t} />
            ))}
          </RailTrack>
          <RailProgress />
        </Rail>
      </div>
    </section>
  );
}
