import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/site";
import { privacy } from "@/content/legal";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = pageMetadata({ title: privacy.title, description: privacy.intro, path: "/privacy" });

export default function PrivacyPage() {
  return <LegalPage doc={privacy} href="/privacy" />;
}
