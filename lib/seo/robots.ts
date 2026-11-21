import { normalizeSiteUrl } from "@/lib/seo/site-url";

import type { RobotsTxtOptions } from "@/types/seo";

export function buildRobotsTxt({
  siteUrl,
  directives,
  disallow = [],
  sitemapPath = "/sitemap.xml",
}: RobotsTxtOptions): string {
  const origin = normalizeSiteUrl(siteUrl);

  if (!origin) {
    throw new Error("[seo] buildRobotsTxt requires an absolute HTTP(S) site URL");
  }

  const rules = [...new Set(disallow.map((path) => path.trim()).filter(Boolean))].map(
    (path) => `Disallow: ${path}`,
  );
  const body =
    directives?.trim() ?? ["User-agent: *", ...(rules.length ? rules : ["Allow: /"])].join("\n");

  return [
    body,
    "",
    "# --------------------------------------------------",
    "# Multilingual Sitemap Index Declarations",
    `# Absolute URL: ${origin}`,
    "# --------------------------------------------------",
    `Sitemap: ${new URL(sitemapPath, origin).toString()}`,
    "",
  ].join("\n");
}

export function robotsResponse(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
