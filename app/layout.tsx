import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { Toaster } from "@/components/primitives";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { UI } from "@/components/layout/copy";
import { EnquiryErrorNotice } from "@/components/layout/EnquiryErrorNotice";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

// Legacy Search Console token from staystory.in's <head>, kept so verification survives the cutover.
const LEGACY_GOOGLE_VERIFICATION = "48uGtrzRyeqlaJ6l5gaUYk6bn8KysztdHWq6qr0MEVY";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "Villas, stays, travel, experiences and events in Goa, handled end to end.",
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || LEGACY_GOOGLE_VERIFICATION },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

// A3 (shell-navigation) owns the <body> contents: header, footer, floating actions.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-input focus:bg-surface focus:px-4 focus:py-2 focus:shadow-card">
          {UI.skip}
        </a>
        <EnquiryErrorNotice />
        <AnnouncementBar />
        <Header />
        {/* Not a <main>: every page renders its own <main id="main">, the skip-link target. */}
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <FloatingActions />
        <MobileBottomBar />
        <Toaster />
      </body>
    </html>
  );
}
