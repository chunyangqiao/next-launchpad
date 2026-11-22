import { alternateUrls, isNoindexPath } from "./urls";
import { SUPPORTED_LOCALES } from "@/lib/constants/seo";

import type { Locale } from "@/lib/constants/seo";

export type SitemapRoute = {
  path: string;
  locales?: readonly Locale[];
  lastModified?: string;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function sitemapXml(origin: string, routes: readonly SitemapRoute[]): string {
  const entries = new Map<string, string>();

  for (const { path, locales = SUPPORTED_LOCALES, lastModified } of routes) {
    if (isNoindexPath(path)) {
      continue;
    }

    const urls = alternateUrls(origin, path, locales);
    const links = Object.entries(urls).map(
      ([locale, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(locale)}" href="${escapeXml(href)}" />`,
    );

    for (const locale of locales) {
      const url = urls[locale];
      entries.set(
        url,
        [
          "  <url>",
          `    <loc>${escapeXml(url)}</loc>`,
          ...(lastModified ? [`    <lastmod>${escapeXml(lastModified)}</lastmod>`] : []),
          ...links,
          "  </url>",
        ].join("\n"),
      );
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...[...entries].sort(([left], [right]) => left.localeCompare(right)).map(([, entry]) => entry),
    "</urlset>",
    "",
  ].join("\n");
}

/** Tell crawlers to retry instead of serving an empty sitemap or robots policy. */
export function siteUnavailable(): Response {
  return new Response("Site configuration temporarily unavailable", {
    status: 503,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "60",
    },
  });
}
