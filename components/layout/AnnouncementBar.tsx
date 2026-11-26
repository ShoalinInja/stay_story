import { getSite } from "@/lib/content";
import { AnnouncementBarClient } from "./AnnouncementBarClient";

/** Thin offer bar. Renders nothing while site.announcement is null. */
export async function AnnouncementBar() {
  const { announcement } = await getSite();
  if (!announcement) return null;
  return <AnnouncementBarClient {...announcement} />;
}
