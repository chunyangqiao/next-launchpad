import { sitemapXml, siteUnavailable } from "@/lib/seo/crawlers";
import { SITE_ORIGIN } from "@/lib/seo/urls";

import type { SitemapRoute } from "@/lib/seo/crawlers";

const routes: readonly SitemapRoute[] = [{ path: "/" }];

export function GET() {
  if (!SITE_ORIGIN) {
    return siteUnavailable();
  }

  return new Response(sitemapXml(SITE_ORIGIN, routes), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=1800",
    },
  });
}
