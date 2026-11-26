import type { Metadata } from "next";
import { privacy } from "@/content/legal";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: privacy.title, description: privacy.intro };

export default function PrivacyPage() {
  return <LegalPage doc={privacy} href="/privacy" />;
}
