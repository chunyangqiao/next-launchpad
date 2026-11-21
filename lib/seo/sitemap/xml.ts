import type { SitemapUrlEntry } from "@/types/seo";

/** Pure sitemap XML serialization without route or data-source knowledge. */

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const SITEMAP_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9";
const XHTML_NAMESPACE = "http://www.w3.org/1999/xhtml";

/** XML 文本节点的 5 个保留字符。loc 里带 & 的查询串不转义会让整份文件解析失败。 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSitemapIndexXml(entries: readonly SitemapUrlEntry[]): string {
  const items = entries.map(
    (entry) =>
      `  <sitemap>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n  </sitemap>`,
  );

  return [
    XML_DECLARATION,
    `<sitemapindex xmlns="${SITEMAP_NAMESPACE}">`,
    ...items,
    "</sitemapindex>",
    "",
  ].join("\n");
}

export function buildUrlsetXml(entries: readonly SitemapUrlEntry[]): string {
  const items = entries.map((entry) =>
    [
      "  <url>",
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
      ...(entry.alternates ?? []).map(
        ({ href, hreflang }) =>
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`,
      ),
      "  </url>",
    ].join("\n"),
  );

  return [
    XML_DECLARATION,
    `<urlset xmlns="${SITEMAP_NAMESPACE}" xmlns:xhtml="${XHTML_NAMESPACE}">`,
    ...items,
    "</urlset>",
    "",
  ].join("\n");
}

/**
 * s-maxage 让 CDN 缓存 30 分钟；max-age=0 让浏览器每次回源，人工打开看到的总是最新一份。
 */
export function sitemapResponse(xml: string): Response {
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=1800",
    },
  });
}
