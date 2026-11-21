import { NOINDEX_METADATA } from "@/lib/constants/seo";
import { SEO_CONFIG } from "@/lib/seo/config";
import {
  buildAlternateUrls,
  buildCanonicalUrl,
  matchesPathPrefix,
  normalizeLocale,
  normalizePathname,
} from "@/lib/seo/metadata/path";
import { normalizeSiteUrl } from "@/lib/seo/site-url";

import type { BuildMetadataInput, SEOConfig } from "@/types/seo";
import type { Metadata } from "next";

export function buildBaseMetadata(config: SEOConfig = SEO_CONFIG): Metadata {
  const metadata: Metadata = {
    title: {
      default: config.defaultTitle,
      template: `%s | ${config.siteName}`,
    },
    description: config.defaultDescription ?? null,
    applicationName: config.siteName,
    openGraph: {
      siteName: config.siteName,
      type: "website",
    },
  };

  if (config.siteUrl) {
    metadata.metadataBase = new URL(config.siteUrl);
  }

  return metadata;
}

/** Match noindex prefixes against a pathname that excludes the locale. */
export function isNoindexPath(
  pathname: string,
  prefixes: readonly string[] = SEO_CONFIG.noindexPrefixes,
): boolean {
  const path = normalizePathname(pathname);

  return prefixes.some((prefix) => matchesPathPrefix(path, prefix));
}

/**
 * Build Next.js metadata without guessing an origin. URL-dependent fields are
 * omitted when config.siteUrl is unavailable.
 */
export function buildMetadata(input: BuildMetadataInput, config: SEOConfig = SEO_CONFIG): Metadata {
  const { locale, pathname, title, titleAbsolute, description, keywords, images, noindex } = input;
  const siteUrl =
    input.siteUrl === undefined
      ? config.siteUrl
      : input.siteUrl === null
        ? null
        : normalizeSiteUrl(input.siteUrl);
  const normalizedLocale = normalizeLocale(locale, config);
  const path = normalizePathname(pathname);
  const canonical = siteUrl ? buildCanonicalUrl(siteUrl, normalizedLocale, path) : undefined;
  const languages = siteUrl ? buildAlternateUrls(siteUrl, path, config) : undefined;

  const resolvedTitle = title?.trim() || undefined;
  const resolvedDescription = description?.trim() || undefined;
  const resolvedKeywords = keywords?.trim() || undefined;
  const requestedImage =
    images === null ? undefined : images?.trim() || (siteUrl ? config.defaultOgImage : undefined);
  const resolvedImages =
    requestedImage && !siteUrl && requestedImage.startsWith("/") ? undefined : requestedImage;
  const shouldNoindex = noindex ?? isNoindexPath(path, config.noindexPrefixes);

  // A noindex response should not advertise a preferred indexing URL.
  const metadata: Metadata = {
    alternates:
      shouldNoindex || !canonical ? NOINDEX_METADATA.alternates : { canonical, languages },
    robots: shouldNoindex ? NOINDEX_METADATA.robots : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: config.siteName,
      ...(canonical ? { url: canonical } : {}),
      images: resolvedImages,
    },
    twitter: {
      card: "summary_large_image",
      images: resolvedImages,
    },
  };

  if (siteUrl) {
    metadata.metadataBase = new URL(siteUrl);
  }

  if (resolvedTitle) {
    metadata.title = titleAbsolute ? { absolute: resolvedTitle } : resolvedTitle;
    metadata.openGraph = { ...metadata.openGraph, title: resolvedTitle };
    metadata.twitter = { ...metadata.twitter, title: resolvedTitle };
  }

  metadata.description = resolvedDescription ?? null;
  metadata.keywords = resolvedKeywords ?? null;

  if (resolvedDescription) {
    metadata.openGraph = { ...metadata.openGraph, description: resolvedDescription };
    metadata.twitter = { ...metadata.twitter, description: resolvedDescription };
  }

  return metadata;
}
