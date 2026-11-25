import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";

import { BRAND } from "@/lib/constants/brand";
import { isLocale, SEO_DEFAULTS_BY_LOCALE, SUPPORTED_LOCALES } from "@/lib/constants/seo";
import { GoogleAnalyticsScript } from "@/lib/gtag";
import { SITE_ORIGIN } from "@/lib/seo/urls";
import "../globals.css";

import type { Metadata, Viewport } from "next";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((language) => ({ language }));
}

async function getLanguage(params: LayoutProps<"/[language]">["params"]) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  return language;
}

export async function generateViewport(): Promise<Viewport> {
  return {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    viewportFit: "cover",
  };
}

export async function generateMetadata({ params }: LayoutProps<"/[language]">): Promise<Metadata> {
  const language = await getLanguage(params);
  const { title, description } = SEO_DEFAULTS_BY_LOCALE[language];

  return {
    metadataBase: SITE_ORIGIN ? new URL(SITE_ORIGIN) : null,
    title: { default: title, template: `%s | ${BRAND}` },
    description,
    applicationName: BRAND,
    openGraph: { type: "website", siteName: BRAND },
    formatDetection: { telephone: false },
  };
}

export default async function LanguageLayout({ children, params }: LayoutProps<"/[language]">) {
  const language = await getLanguage(params);

  return (
    <html lang={language} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="data-theme" defaultTheme="system" disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <GoogleAnalyticsScript />
      </body>
    </html>
  );
}
