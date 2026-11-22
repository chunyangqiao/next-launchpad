import { BRAND } from "@/lib/constants/brand";
import { DEFAULT_LOCALE, DEFAULT_SEO_DESCRIPTION, DEFAULT_SEO_TITLE } from "@/lib/constants/seo";
import { GoogleAnalyticsScript } from "@/lib/gtag";
import { SITE_ORIGIN } from "@/lib/seo/urls";
import "./globals.css";

import type { Metadata, Viewport } from "next";

export async function generateViewport(): Promise<Viewport> {
  return {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    viewportFit: "cover",
  };
}

export const metadata = {
  metadataBase: SITE_ORIGIN ? new URL(SITE_ORIGIN) : null,
  title: { default: DEFAULT_SEO_TITLE, template: `%s | ${BRAND}` },
  description: DEFAULT_SEO_DESCRIPTION,
  applicationName: BRAND,
  openGraph: { type: "website", siteName: BRAND },
  formatDetection: { telephone: false },
} satisfies Metadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="min-h-full flex flex-col">
        {children}
        <GoogleAnalyticsScript />
      </body>
    </html>
  );
}
