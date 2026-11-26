// OWNER: A1 content-migrator. Every FAQ is drafted from legacy page claims and must be reviewed by the owner.
import type { Faq } from "../lib/content/types";

/** A drafted FAQ awaiting owner review (hidden in production until `needsReview` is removed). */
export const draft = (q: string, a: string): Faq => ({ q, a, needsReview: true });
