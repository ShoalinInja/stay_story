import type { Area, Faq, ServiceCategory, ServiceItem, Site, Stay } from "../content/types";
import { absoluteUrl, SITE_URL } from "./site";

// Plain builders, no React: unit-tested in schema.test.ts and rendered by <JsonLd>.
type Node = Record<string, unknown>;

export const ORG_ID = `${SITE_URL}/#organization`;

export function organizationLd(site: Site): Node {
  const { address: a } = site;
  return {
    "@type": ["TravelAgency", "LodgingBusiness"],
    "@id": ORG_ID,
    name: site.name,
    description: site.seo.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl(site.logo.src),
    image: absoluteUrl(site.logo.src),
    telephone: site.phone,
    email: site.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.line,
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    areaServed: { "@type": "State", name: "Goa" },
    ...(site.socials.length > 0 && { sameAs: site.socials.map((s) => s.url) }),
  };
}

const STAY_SCHEMA: Record<Stay["type"], string> = {
  villa: "VacationRental",
  apartment: "VacationRental",
  hotel: "Hotel",
  "long-term": "LodgingBusiness",
  "for-sale": "LodgingBusiness",
};

export function stayLd(stay: Stay, area?: Area): Node {
  const images = stay.images.filter((i) => !i.hasBakedText).map((i) => absoluteUrl(i.src));
  // Never publish ratings for placeholder stays or without real review data.
  const rating = !stay.isPlaceholder && stay.rating && stay.rating.count > 0 ? stay.rating : null;
  return {
    "@type": STAY_SCHEMA[stay.type],
    "@id": `${absoluteUrl(`/stays/${stay.slug}`)}#stay`,
    name: stay.name,
    description: stay.headline,
    url: absoluteUrl(`/stays/${stay.slug}`),
    ...(images.length > 0 && { image: images }),
    address: {
      "@type": "PostalAddress",
      ...(area && { addressLocality: area.name }),
      addressRegion: "Goa",
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: stay.location.lat, longitude: stay.location.lng },
    numberOfRooms: stay.bedrooms,
    petsAllowed: stay.amenities.includes("pet-friendly"),
    amenityFeature: stay.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
    ...(rating && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: rating.value, reviewCount: rating.count, bestRating: 5 },
    }),
  };
}

export function serviceLd(item: ServiceItem, category: ServiceCategory): Node {
  const url = absoluteUrl(`/${category.slug}/${item.slug}`);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: item.title,
    description: item.summary,
    serviceType: category.title,
    url,
    ...(!item.hero.hasBakedText && { image: absoluteUrl(item.hero.src) }),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "State", name: "Goa" },
  };
}

/** null when there is nothing to mark up, so callers can pass it straight to <JsonLd>. */
export function faqLd(faqs: Faq[] | undefined): Node | null {
  if (!faqs?.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbLd(trail: { label: string; href: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: absoluteUrl(c.href) })),
  };
}

/** Script-safe JSON: "<" escaped so content can never close the <script> tag. */
export function serializeLd(nodes: (Node | null | undefined)[]): string | null {
  const graph = nodes.filter((n): n is Node => !!n);
  if (!graph.length) return null;
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}
