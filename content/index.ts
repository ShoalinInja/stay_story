// OWNER: A1 content-migrator. Barrel that assembles every content module into one bundle.
// Loaded by next.config.ts as well as lib/content, so: relative imports only, no `@/`, no next/* or server-only.
import type { ContentBundle } from "../lib/content/types";
import { areas } from "./areas";
import { concierge } from "./categories/concierge";
import { entertainment } from "./categories/entertainment";
import { events } from "./categories/events";
import { experiences } from "./categories/experiences";
import { stays as staysCategory } from "./categories/stays";
import { travel } from "./categories/travel";
import { collections } from "./collections";
import { mediaManifest } from "./media";
import { redirects } from "./redirects";
import { site } from "./site";
import { stays } from "./stays";

export const content: ContentBundle = {
  site,
  stays,
  categories: [staysCategory, travel, experiences, events, concierge, entertainment],
  areas,
  collections,
  offers: [], // none on the legacy site; the UI hides the rail when empty
  testimonials: [], // no real reviews yet; hidden when empty
  media: mediaManifest,
  redirects,
};
