// OWNER: A1 content-migrator. Every legacy .php URL → new route (BRIEF §3.2). All 301, trailing slash optional.
import type { LegacyRedirect } from "../lib/content/types";

/** Legacy path (no trailing slash) → new route. Explicit on purpose: this table is the SEO contract. */
export const LEGACY_ROUTES: Record<string, string> = {
  "/index.php": "/",
  "/about-us.php": "/about",
  "/photo-gallery.php": "/gallery",
  "/contact-us.php": "/contact",

  "/stay-goa.php": "/stays",
  "/villas-goa.php": "/stays/villas",
  "/apartments-hotels-goa.php": "/stays/apartments-hotels",
  "/long-term-rentals-goa.php": "/stays/long-term-rentals",
  "/property-sales-goa.php": "/property-sales",

  "/travel-services-goa.php": "/travel",
  "/airport-transfers-goa.php": "/travel/airport-transfers",
  "/chauffeur-services-goa.php": "/travel/chauffeur",
  "/self-drive-cars-goa.php": "/travel/self-drive-cars",
  "/bike-rentals-goa.php": "/travel/bike-rentals",

  "/experiences-goa.php": "/experiences",
  "/yacht-cruises-goa.php": "/experiences/yacht-cruises",
  "/shisha-experience-goa.php": "/experiences/shisha",
  "/workshops-activities-goa.php": "/experiences/workshops-activities",
  "/spiritual-wellness-goa.php": "/experiences/wellness",
  "/vip-club-access-goa.php": "/experiences/vip-club-access",

  "/events-celebrations-goa.php": "/events",
  "/party-planning-goa.php": "/events/party-planning",
  "/wedding-services-goa.php": "/events/weddings",
  "/bachelor-party-goa.php": "/events/bachelor-parties",
  "/private-events-goa.php": "/events/private-events",

  "/dining-concierge-goa.php": "/concierge",
  "/private-chef-catering-goa.php": "/concierge/private-chef",
  "/bartenders-mixologists-goa.php": "/concierge/bartenders",
  "/cake-special-requests-goa.php": "/concierge/special-requests",

  "/artists-entertainment-goa.php": "/entertainment",
  "/djs-singers-in-goa.php": "/entertainment/djs-singers",
  "/dancers-performers-goa.php": "/entertainment/dancers-performers",
  "/makeup-styling-goa.php": "/entertainment/makeup-styling",
  "/tattoo-henna-face-art-goa.php": "/entertainment/tattoo-henna",
};

// `{/}?` matches with or without a trailing slash in one hop; query strings pass through to the destination.
export const redirects: LegacyRedirect[] = Object.entries(LEGACY_ROUTES).map(([source, destination]) => ({
  source: `${source}{/}?`,
  destination,
  statusCode: 301,
}));
