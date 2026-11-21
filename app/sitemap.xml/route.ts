import { SITEMAP_ROUTES } from "@/lib/constants/sitemap";
import {
  buildSitemapEntries,
  buildUrlsetXml,
  SEO_CONFIG,
  siteUnavailableResponse,
  sitemapResponse,
} from "@/lib/seo";

export function GET() {
  if (!SEO_CONFIG.siteUrl) {
    return siteUnavailableResponse();
  }

  const entries = buildSitemapEntries(SITEMAP_ROUTES, SEO_CONFIG.siteUrl, {
    config: SEO_CONFIG,
  });

  return sitemapResponse(buildUrlsetXml(entries));
}
