import type { Metadata } from "next";
import { terms } from "@/content/legal";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: terms.title, description: terms.intro };

export default function TermsPage() {
  return <LegalPage doc={terms} href="/terms" />;
}
