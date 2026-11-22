import { DEFAULT_LOCALE, NO_INDEX_PREFIXES, SUPPORTED_LOCALES } from "@/lib/constants/seo";

import type { Locale } from "@/lib/constants/seo";

function siteOrigin(value: string | undefined): string | null {
  const url = value?.trim();

  if (!url || !/^https?:\/\//i.test(url)) {
    return null;
  }

  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export const SITE_ORIGIN = siteOrigin(process.env.NEXT_PUBLIC_SITE_URL);

function normalizePath(path: string): string {
  const pathname = path
    .split(/[?#]/, 1)[0]
    .trim()
    .replace(/^\/+|\/+$/g, "");
  return pathname ? `/${pathname}` : "";
}

/** The path excludes the locale prefix; an empty path is the localized home page. */
export function pageUrl(origin: string, language: Locale, path = ""): string {
  return `${origin}/${language}${normalizePath(path)}`;
}

export function alternateUrls(
  origin: string,
  path: string,
  locales: readonly Locale[] = SUPPORTED_LOCALES,
): Record<string, string> {
  const defaultLocale = locales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : locales[0];

  if (!defaultLocale) {
    throw new Error(`[seo] No locales available for "${path || "/"}"`);
  }

  return {
    ...Object.fromEntries(locales.map((locale) => [locale, pageUrl(origin, locale, path)])),
    "x-default": pageUrl(origin, defaultLocale, path),
  };
}

export function isNoindexPath(path: string): boolean {
  const pathname = normalizePath(path);

  return NO_INDEX_PREFIXES.some((prefix) => {
    const segment = normalizePath(prefix);
    return pathname === segment || pathname.startsWith(`${segment}/`);
  });
}
