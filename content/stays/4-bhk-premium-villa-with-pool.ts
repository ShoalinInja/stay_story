// A copy of the 4 BHK Luxury Villa listing (same shoot and video), with the photos in a different order.
import type { Stay } from "../../lib/content/types";
import { luxuryVilla4Bhk, photo4Bhk as photo } from "./4-bhk-luxury-villa-with-pool";

const ORDER = [5, 6, 18, 2, 4, 3, 8, 9, 10, 13, 15, 12, 1, 7, 14, 11, 16, 17, 19, 20, 21, 22, 23, 24];

export const premiumVilla4Bhk: Stay = {
  ...luxuryVilla4Bhk,
  slug: "4-bhk-premium-villa-with-pool",
  name: "4 BHK Premium Villa with Pool",
  images: ORDER.map(photo),
  spaces: [
    { name: "Pool and garden", description: "A long blue-tiled pool with a lawn, palms and a pergola terrace.", image: photo(18) },
    { name: "Covered patio", description: "Wicker sofas in the shade, a few steps from the pool.", image: photo(17) },
    { name: "Living and dining", description: "Open-plan living room with a TV wall, a table for eight and a breakfast bar.", image: photo(16) },
    { name: "Bedrooms", description: "Four bedrooms with their own bathrooms; one opens onto the balcony.", image: photo(8) },
    { name: "Balcony", description: "A long upstairs balcony with wicker chairs, looking over the trees.", image: photo(19) },
    { name: "Breakfast bar", description: "Red stools at a bar with a large leaf mural.", image: photo(13) },
  ],
};
