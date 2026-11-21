import { HREFLANG_X_DEFAULT } from "@/lib/constants/seo";
import { SEO_CONFIG } from "@/lib/seo/config";
import { buildCanonicalUrl, normalizePathname } from "@/lib/seo/metadata/path";
import { normalizeSiteUrl } from "@/lib/seo/site-url";

import type { SEOConfig, SitemapAlternate, SitemapRoute, SitemapUrlEntry } from "@/types/seo";

export function getTodayUTCW3cDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Expand public routes into one sitemap entry per available locale and attach
 * hreflang alternates that point only to real localized versions.
 */
export function buildSitemapEntries(
  routes: readonly SitemapRoute[],
  siteUrl: string,
  options: {
    config?: SEOConfig;
    defaultLastModified?: string;
  } = {},
): SitemapUrlEntry[] {
  const config = options.config ?? SEO_CONFIG;
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

  if (!normalizedSiteUrl) {
    throw new Error("[seo] buildSitemapEntries requires an absolute HTTP(S) site URL");
  }

  const defaultLastModified = options.defaultLastModified ?? getTodayUTCW3cDate();
  const entries = new Map<string, SitemapUrlEntry>();

  for (const route of routes) {
    const path = normalizePathname(route.path);
    const locales = [...new Set(route.locales ?? config.locales)].filter((locale) =>
      config.locales.includes(locale),
    );

    if (locales.length === 0) {
      throw new Error(
        `[seo] Sitemap route "${route.path}" must include at least one configured locale`,
      );
    }

    const alternates: SitemapAlternate[] = locales.map((locale) => ({
      href: buildCanonicalUrl(normalizedSiteUrl, locale, path, config),
      hreflang: locale,
    }));
    const defaultLocale = locales.includes(config.defaultLocale)
      ? config.defaultLocale
      : locales[0];

    alternates.push({
      href: buildCanonicalUrl(normalizedSiteUrl, defaultLocale, path, config),
      hreflang: HREFLANG_X_DEFAULT,
    });

    for (const locale of locales) {
      const loc = buildCanonicalUrl(normalizedSiteUrl, locale, path, config);

      entries.set(loc, {
        loc,
        lastmod: route.lastModified ?? defaultLastModified,
        alternates,
      });
    }
  }

  return [...entries.values()].sort((left, right) => left.loc.localeCompare(right.loc));
}
