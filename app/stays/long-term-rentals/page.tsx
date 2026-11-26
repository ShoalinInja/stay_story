import { copy } from "@/components/stays/copy";
import { TypeLanding, TypeListing, typeLandingMetadata } from "@/components/stays/TypeLanding";

const SLUG = "long-term-rentals";
const PATH = "/stays/long-term-rentals";

export const generateMetadata = () => typeLandingMetadata(SLUG, PATH);

export default function LongTermRentalsPage() {
  return (
    <TypeLanding
      slug={SLUG}
      path={PATH}
      listing={<TypeListing types={["long-term"]} empty={copy.empty.noneOfType} source="stays-long-term:empty" stayMode="move-in" />}
    />
  );
}
