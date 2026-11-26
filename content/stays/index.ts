// OWNER: A1 content-migrator. One file per stay; add new stays here (see docs/ADD-A-STAY.md).
import type { Stay } from "../../lib/content/types";
import { assagaoGardenHouse } from "./assagao-garden-house";
import { casaSiolim } from "./casa-siolim";
import { morjimRiversideVillaForSale } from "./morjim-riverside-villa-for-sale";
import { panjimLongStayResidence } from "./panjim-long-stay-residence";
import { southGoaBeachApartment } from "./south-goa-beach-apartment";
import { vagatorCliffsideVilla } from "./vagator-cliffside-villa";

export const stays: Stay[] = [
  casaSiolim,
  vagatorCliffsideVilla,
  assagaoGardenHouse,
  southGoaBeachApartment,
  panjimLongStayResidence,
  morjimRiversideVillaForSale,
];
