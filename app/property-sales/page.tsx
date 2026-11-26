import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { copy } from "@/components/stays/copy";
import { TypeLanding, TypeListing, typeLandingMetadata } from "@/components/stays/TypeLanding";

const SLUG = "property-sales";
const PATH = "/property-sales";

export const generateMetadata = () => typeLandingMetadata(SLUG, PATH);

export default function PropertySalesPage() {
  return (
    <TypeLanding
      slug={SLUG}
      path={PATH}
      listingTitle={copy.sales.listings}
      listing={<TypeListing types={["for-sale"]} empty={copy.empty.noneForSale} source="property-sales:buyer-empty" stayMode="site-visit" />}
      after={
        <section className="bg-cream section-y">
          <div className="container-site grid gap-8 md:grid-cols-2">
            <div id="buy" className="rounded-card bg-surface p-6 shadow-card">
              <h2 className="type-h2 font-display text-ink">{copy.sales.buyerTitle}</h2>
              <EnquiryForm variant="stay" stayMode="site-visit" source="property-sales:buyer" submitLabel={copy.detail.siteVisit} className="mt-4" />
            </div>
            <div id="sell" className="rounded-card bg-surface p-6 shadow-card">
              <h2 className="type-h2 font-display text-ink">{copy.sales.ownerTitle}</h2>
              <p className="mt-2 type-body text-ink-2">{copy.sales.ownerBody}</p>
              <EnquiryForm variant="property-owner" source="property-sales:owner" className="mt-4" />
            </div>
          </div>
        </section>
      }
    />
  );
}
