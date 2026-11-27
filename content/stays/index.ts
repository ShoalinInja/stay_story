// OWNER: A1 content-migrator. One file per stay; add new stays here (see docs/ADD-A-STAY.md).
import type { Stay } from "../../lib/content/types";
import { luxuryVilla3BhkSiolim } from "./3-bhk-luxury-villa-with-pool-siolim";
import { luxuryVilla4Bhk } from "./4-bhk-luxury-villa-with-pool";
import { premiumVilla4Bhk } from "./4-bhk-premium-villa-with-pool";

export const stays: Stay[] = [
  luxuryVilla4Bhk,
  premiumVilla4Bhk,
  luxuryVilla3BhkSiolim,
];
