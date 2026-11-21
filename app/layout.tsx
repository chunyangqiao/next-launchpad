import { GoogleAnalyticsScript } from "@/lib/gtag";
import { buildBaseMetadata, SEO_CONFIG } from "@/lib/seo";
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
  ...buildBaseMetadata(),
  formatDetection: { telephone: false },
} satisfies Metadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={SEO_CONFIG.defaultLocale}>
      <body className="min-h-full flex flex-col">
        {children}
        <GoogleAnalyticsScript />
      </body>
    </html>
  );
}
