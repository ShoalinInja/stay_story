import { Fragment, type ReactNode } from "react";
import {
  getAreas,
  getCategories,
  getCollections,
  getMedia,
  getMediaList,
  getOffers,
  getSite,
  getStays,
} from "@/lib/content";
import { HOME_COPY } from "@/components/home/copy";
import { DestinationPicker } from "@/components/home/DestinationPicker";
import { FeaturedStays, featuredTabs } from "@/components/home/FeaturedStays";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Offers } from "@/components/home/Offers";
import { SearchBar } from "@/components/home/SearchBar";
import { getSearchOptions } from "@/components/home/search-options";
import {
  CallbackStrip,
  EnquiryBand,
  FeatureGrid,
  GalleryMosaic,
  HomeFaq,
  ListYourProperty,
  Stats,
  TrustBlock,
} from "@/components/home/sections";
import { TileRail } from "@/components/home/TileRail";

// Static: no searchParams, no request APIs, no Date.now() — `/` prerenders.
export default async function Home() {
  const [site, areas, stays, offers, categories, collections, gallery, lypImage, searchOptions] = await Promise.all([
    getSite(),
    getAreas(),
    getStays(),
    getOffers(),
    getCategories(),
    getCollections(),
    getMediaList({ idPrefix: "gallery" }),
    getMedia(HOME_COPY.listYourProperty.imageId),
    getSearchOptions(),
  ]);

  // Category covers are mostly baked-text posters, so every "Plan Your Goa" tile puts its title below the image.
  const planTiles = categories.map((c) => ({
    href: c.key === "stays" ? "/stays" : `/${c.slug}`,
    title: c.title,
    image: c.cover,
    layout: "below" as const,
  }));
  const collectionTiles = collections.map((c) => ({ href: `/collections/${c.key}`, title: c.title, image: c.image }));

  // Only blocks with data render; backgrounds alternate cream/surface over what is actually shown.
  const blocks: [string, boolean, (bg: string) => ReactNode][] = [
    ["destinations", areas.length > 0, (bg) => <DestinationPicker areas={areas} className={bg} />],
    ["featured", featuredTabs(stays).length > 0, (bg) => <FeaturedStays stays={stays} className={bg} />],
    ["offers", offers.length > 0, (bg) => <Offers offers={offers} className={bg} />],
    ["plan", planTiles.length > 0, (bg) => <TileRail id="home-plan" title={HOME_COPY.plan.title} label={HOME_COPY.plan.carouselLabel} tiles={planTiles} className={bg} />],
    ["collections", collectionTiles.length > 0, (bg) => <TileRail id="home-collections" title={HOME_COPY.collections.title} label={HOME_COPY.collections.carouselLabel} tiles={collectionTiles} className={bg} />],
    ["features", site.features.length > 0, (bg) => <FeatureGrid features={site.features} className={bg} />],
    ["trust", site.trust.length > 0, (bg) => <TrustBlock trust={site.trust} className={bg} />],
    ["stats", !!site.stats?.length, (bg) => <Stats stats={site.stats} className={bg} />],
    ["gallery", gallery.length > 0, (bg) => <GalleryMosaic images={gallery} className={bg} />],
    ["lyp", true, (bg) => <ListYourProperty image={lypImage} className={bg} />],
    ["faq", site.faqs.length > 0, (bg) => <HomeFaq faqs={site.faqs} className={bg} />],
    ["enquiry", true, (bg) => <EnquiryBand className={bg} />],
  ];

  return (
    <main id="main" className="flex-1 bg-surface">
      <HeroCarousel hero={site.hero} />
      <div className="relative z-20 container-site -mt-10">
        <SearchBar options={searchOptions} />
      </div>
      <CallbackStrip />
      {blocks
        .filter(([, show]) => show)
        .map(([key, , render], i) => (
          <Fragment key={key}>{render(i % 2 === 0 ? "bg-cream" : "bg-surface")}</Fragment>
        ))}
    </main>
  );
}
