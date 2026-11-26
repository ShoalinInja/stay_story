import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/site";
import { terms } from "@/content/legal";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = pageMetadata({ title: terms.title, description: terms.intro, path: "/terms" });

export default function TermsPage() {
  return <LegalPage doc={terms} href="/terms" />;
}
