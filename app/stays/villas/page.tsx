import { copy } from "@/components/stays/copy";
import { TypeLanding, TypeListing, typeLandingMetadata } from "@/components/stays/TypeLanding";

const SLUG = "villas";
const PATH = "/stays/villas";

export const generateMetadata = () => typeLandingMetadata(SLUG, PATH);

export default function VillasPage() {
  return (
    <TypeLanding
      slug={SLUG}
      path={PATH}
      listing={<TypeListing types={["villa"]} empty={copy.empty.noneOfType} source="stays-villas:empty" />}
    />
  );
}
