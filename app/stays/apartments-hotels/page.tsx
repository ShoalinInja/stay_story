import { copy } from "@/components/stays/copy";
import { TypeLanding, TypeListing, typeLandingMetadata } from "@/components/stays/TypeLanding";

const SLUG = "apartments-hotels";
const PATH = "/stays/apartments-hotels";

export const generateMetadata = () => typeLandingMetadata(SLUG, PATH);

export default function ApartmentsHotelsPage() {
  return (
    <TypeLanding
      slug={SLUG}
      path={PATH}
      listing={<TypeListing types={["apartment", "hotel"]} empty={copy.empty.noneOfType} source="stays-apartments-hotels:empty" />}
    />
  );
}
