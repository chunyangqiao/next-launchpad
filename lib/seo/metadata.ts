import { alternateUrls, isNoindexPath, pageUrl, SITE_ORIGIN } from "./urls";
import { BRAND } from "@/lib/constants/brand";
import { NOINDEX_METADATA } from "@/lib/constants/seo";

import type { Locale } from "@/lib/constants/seo";
import type { Metadata } from "next";

type PageMetadataOptions = {
  language: Locale;
  path?: string;
  title: string | { absolute: string };
  description: string;
  image?: string;
  locales?: readonly Locale[];
  noindex?: boolean;
};

export function pageMetadata({
  language,
  path = "",
  title,
  description,
  image,
  locales,
  noindex,
}: PageMetadataOptions): Metadata {
  const canonical = SITE_ORIGIN ? pageUrl(SITE_ORIGIN, language, path) : undefined;
  const index = !noindex && !isNoindexPath(path);
  const social = {
    title: typeof title === "string" ? title : title.absolute,
    description,
    images: SITE_ORIGIN || (image && /^https?:\/\//i.test(image)) ? image : undefined,
  };

  return {
    title,
    description,
    alternates:
      index && SITE_ORIGIN
        ? { canonical, languages: alternateUrls(SITE_ORIGIN, path, locales) }
        : null,
    robots: index ? { index: true, follow: true } : NOINDEX_METADATA.robots,
    openGraph: { ...social, type: "website", siteName: BRAND, url: canonical },
    twitter: { ...social, card: "summary_large_image" },
  };
}
