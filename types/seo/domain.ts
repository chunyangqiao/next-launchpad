import type { JsonLdData, JsonLdObject, SeoDate } from "@/types/seo/base";

export interface SEOConfig {
  siteName: string;
  siteUrl: string | null;
  locales: readonly string[];
  defaultLocale: string;
  defaultTitle: string;
  defaultDescription?: string;
  defaultOgImage?: string;
  noindexPrefixes: readonly string[];
  socialLinks: readonly string[];
  organizationAlternateNames: readonly string[];
  supportLanguages: readonly string[];
  signupPath?: string;
  signupActionName?: string;
  downloadPath?: string;
  downloadActionName?: string;
  contactPath?: string;
}

export interface BuildMetadataInput {
  /** Language code used in the URL. Unknown values fall back to config.defaultLocale. */
  locale: string;
  /** Path without the locale prefix. An empty string represents the localized home page. */
  pathname: string;
  title?: string;
  titleAbsolute?: boolean;
  description?: string;
  keywords?: string;
  /** undefined uses the default image; null explicitly disables images. */
  images?: string | null;
  noindex?: boolean;
  /** Overrides config.siteUrl. null explicitly suppresses absolute URLs. */
  siteUrl?: string | null;
}

export interface MatchedRoute {
  route: string;
  params: Record<string, string>;
}

export type RouteMatcher = (pathname: string) => MatchedRoute | null;

export interface CompiledRoute {
  route: string;
  regex: RegExp;
  keys: string[];
}

export interface RouteSeoEntry {
  title?: string;
  description?: string;
  keywords?: string;
  titleKey?: string;
  descKey?: string;
  keywordsKey?: string;
  titleAbsolute?: boolean;
  noindex?: boolean;
}

export interface RouteSeoContext {
  table: Record<string, RouteSeoEntry>;
  translate?: (key: string, values?: Record<string, string>) => string;
  namespace?: string;
  config?: SEOConfig;
}

export interface RouteSeoText {
  title?: string;
  description?: string;
  keywords?: string;
  titleAbsolute?: boolean;
}

export interface RouteMetadataInput {
  locale: string;
  pathname: string;
  route?: string;
  title?: string;
  description?: string;
  titleValues?: Record<string, string>;
  noindex?: boolean;
}

export interface RouteMetadataOptions {
  noindex?: boolean;
  localeParam?: string;
}

export interface JsonLdProps {
  data: JsonLdData;
}

export interface OrganizationJsonLdInput {
  siteUrl: string;
  locale: string;
  description?: string;
  appLinks?: readonly (string | null | undefined)[];
}

export interface WebSiteJsonLdInput {
  siteUrl: string;
  locale: string;
}

export interface WebApplicationJsonLdInput {
  siteUrl: string;
  locale: string;
  name?: string;
  features?: readonly string[];
  installPath?: string;
  operatingSystem?: string;
  category?: string;
  subCategory?: string;
  offers?: JsonLdObject;
}

export interface WebPageJsonLdInput {
  siteUrl: string;
  locale: string;
  pathname: string;
  name: string;
  description?: string;
  breadcrumbId?: string;
}

export interface BreadcrumbTrailItem {
  name: string;
  /** Current breadcrumb items may omit the path. */
  path?: string;
}

export interface ArticleJsonLdInput {
  siteUrl: string;
  locale: string;
  pathname: string;
  headline?: string;
  datePublished?: SeoDate;
  dateModified?: SeoDate;
  body?: string | null;
}

export interface FaqJsonLdItem {
  question: string;
  answer: string;
}

export interface SitemapAlternate {
  href: string;
  hreflang: string;
}

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  alternates?: readonly SitemapAlternate[];
}

export interface SitemapRoute {
  /** Path without the locale prefix. "" is the localized home page. */
  path: string;
  lastModified?: string;
  locales?: readonly string[];
}

export interface RobotsTxtOptions {
  siteUrl: string;
  directives?: string;
  disallow?: readonly string[];
  sitemapPath?: string;
}
