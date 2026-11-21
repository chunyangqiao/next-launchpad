import { HREFLANG_X_DEFAULT } from "@/lib/constants/seo";
import { SEO_CONFIG } from "@/lib/seo/config";

import type { SEOConfig } from "@/types/seo";

/**
 * @description 去掉 query、hash 和结尾斜杠，保证同一个页面只产生一个 canonical。
 */
export function normalizePathname(pathname: string): string {
  const path = pathname.split("?")[0].split("#")[0].trim();

  if (!path || path === "/") {
    return "";
  }

  return (path.startsWith("/") ? path : `/${path}`).replace(/\/+$/, "");
}

export function normalizeLocale(locale: string, config: SEOConfig = SEO_CONFIG): string {
  return config.locales.includes(locale) ? locale : config.defaultLocale;
}

/** Match a complete path segment, not a string prefix such as "/profiled". */
export function matchesPathPrefix(path: string, prefix: string): boolean {
  const normalizedPrefix = normalizePathname(prefix);

  return path === normalizedPrefix || path.startsWith(`${normalizedPrefix}/`);
}

/**
 * @description canonical 和 JSON-LD 都使用绝对 URL。保证结构化数据里的地址和 <link rel="canonical"> 一致。
 *
 * @param pathname 不含语言前缀的路径，'' = 首页
 */
export function buildCanonicalUrl(
  siteUrl: string,
  locale: string,
  pathname: string,
  config: SEOConfig = SEO_CONFIG,
): string {
  return `${siteUrl}/${normalizeLocale(locale, config)}${normalizePathname(pathname)}`;
}

/** Build one alternate per locale plus a stable x-default entry. */
export function buildAlternateUrls(
  siteUrl: string,
  pathname: string,
  config: SEOConfig = SEO_CONFIG,
): Record<string, string> {
  const path = normalizePathname(pathname);
  const urls: Record<string, string> = {};

  for (const code of config.locales) {
    urls[code] = `${siteUrl}/${code}${path}`;
  }

  urls[HREFLANG_X_DEFAULT] = `${siteUrl}/${config.defaultLocale}${path}`;

  return urls;
}
