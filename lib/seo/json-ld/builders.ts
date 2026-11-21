import { ARTICLE_DESCRIPTION_MAX_LENGTH, SCHEMA_ORG_CONTEXT } from "@/lib/constants/seo";
import { SEO_CONFIG } from "@/lib/seo/config";
import { buildCanonicalUrl } from "@/lib/seo/metadata/path";
import { normalizeSiteUrl } from "@/lib/seo/site-url";
import { htmlToPlainText } from "@/lib/seo/text";

import type {
  ArticleJsonLdInput,
  BreadcrumbTrailItem,
  FaqJsonLdItem,
  JsonLdObject,
  OrganizationJsonLdInput,
  SEOConfig,
  WebApplicationJsonLdInput,
  WebPageJsonLdInput,
  WebSiteJsonLdInput,
} from "@/types/seo";

/** Pure schema.org builders. They never fetch data or emit a script tag. */

/**
 * @description 站点级`@id`, 让WebSite / Article 都能指回同一个 Organization 节点
 *
 */
function organizationId(url: string): string {
  return `${url}/#organization`;
}

function webSiteId(url: string): string {
  return `${url}/#website`;
}

function webApplicationId(url: string): string {
  return `${url}/#webapplication`;
}

/**
 * 其它页面引用 Organization 时用这个：只写 @id 的话，引用所在的页面上并没有那个节点，
 * 富媒体测试会报缺少 name。只带 name，避免同一个 @id 在两处给出不同的 url。
 */
function organizationRef(siteUrl: string, config: SEOConfig): JsonLdObject {
  return { "@type": "Organization", "@id": organizationId(siteUrl), name: config.siteName };
}

function organizationImageUrl(siteUrl: string, config: SEOConfig): string | undefined {
  const path = config.defaultOgImage;

  if (!path) {
    return undefined;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith("//")) {
    return undefined;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function absolute(siteUrl: string, locale: string, pathname: string, config: SEOConfig): string {
  return buildCanonicalUrl(siteUrl, locale, pathname, config);
}

/** Convert a supported date value to ISO 8601, omitting invalid values. */
function toIsoDate(value: Date | number | string | undefined | null): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed =
    value instanceof Date
      ? value.getTime()
      : typeof value === "string" && !/^\d+$/.test(value)
        ? new Date(value).getTime()
        : Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  const date = new Date(parsed);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function clean(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

/** Convert rich text into visible plain text. */
function requireSiteUrl(value: string): string {
  const siteUrl = normalizeSiteUrl(value);

  if (!siteUrl) {
    throw new Error("[seo] JSON-LD builders require an absolute HTTP(S) site URL");
  }

  return siteUrl;
}

function isHttpUrl(value: string | undefined | null): value is string {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

/**
 * 站点语言代码 → BCP 47 标签（结构化数据的 inLanguage / knowsLanguage 用这个写法）。
 * zh-hans → zh-Hans，en-us → en-US，pt-br → pt-BR。
 */
export function toBcp47(locale: string): string {
  const [language, ...subtags] = locale.split("-");

  if (!language) {
    return locale;
  }

  const parts = [language.toLowerCase()];

  for (const subtag of subtags) {
    if (/^[a-z]{4}$/i.test(subtag)) {
      parts.push(`${subtag.charAt(0).toUpperCase()}${subtag.slice(1).toLowerCase()}`);
    } else if (/^[a-z]{2}$/i.test(subtag)) {
      parts.push(subtag.toUpperCase());
    } else if (/^\d{3}$/.test(subtag)) {
      parts.push(subtag);
    } else {
      parts.push(subtag.toLowerCase());
    }
  }

  return parts.join("-");
}

export function buildOrganizationJsonLd(
  input: OrganizationJsonLdInput,
  config: SEOConfig = SEO_CONFIG,
): JsonLdObject {
  const { locale, description, appLinks = [] } = input;
  const siteUrl = requireSiteUrl(input.siteUrl);
  const sameAs = [...config.socialLinks, ...appLinks.filter(isHttpUrl).map((link) => link.trim())];
  const image = organizationImageUrl(siteUrl, config);
  const about = clean(description);
  const languages = config.locales.map(toBcp47);
  const contactPath = config.contactPath;

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "Organization",
    "@id": organizationId(siteUrl),
    name: config.siteName,
    ...(config.organizationAlternateNames.length
      ? { alternateName: config.organizationAlternateNames }
      : {}),
    url: absolute(siteUrl, locale, "", config),
    ...(image ? { logo: image, image } : {}),
    ...(about ? { description: about } : {}),
    ...(languages.length ? { knowsLanguage: languages } : {}),
    ...(contactPath
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            url: absolute(siteUrl, locale, contactPath, config),
            ...(config.supportLanguages.length
              ? { availableLanguage: config.supportLanguages }
              : {}),
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs: [...new Set(sameAs)] } : {}),
  };
}

/**
 * WebSite —— 只在首页输出。
 *
 * 不声明 SearchAction：站内没有全站搜索页时，指向不存在的入口会被判为与页面不符。
 */
export function buildWebSiteJsonLd(
  input: WebSiteJsonLdInput,
  config: SEOConfig = SEO_CONFIG,
): JsonLdObject {
  const { locale } = input;
  const siteUrl = requireSiteUrl(input.siteUrl);

  function entryPoint(pathname: string): JsonLdObject {
    return {
      "@type": "EntryPoint",
      urlTemplate: absolute(siteUrl, locale, pathname, config),
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    };
  }

  const actions: JsonLdObject[] = [];

  if (config.signupPath) {
    actions.push({
      "@type": "RegisterAction",
      name: config.signupActionName ?? "Create an account",
      target: entryPoint(config.signupPath),
    });
  }

  if (config.downloadPath) {
    actions.push({
      "@type": "DownloadAction",
      name: config.downloadActionName ?? `Download the ${config.siteName} app`,
      target: entryPoint(config.downloadPath),
    });
  }

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "WebSite",
    "@id": webSiteId(siteUrl),
    name: config.siteName,
    ...(config.organizationAlternateNames.length
      ? { alternateName: config.organizationAlternateNames }
      : {}),
    url: absolute(siteUrl, locale, "", config),
    inLanguage: toBcp47(locale),
    publisher: organizationRef(siteUrl, config),
    ...(actions.length ? { potentialAction: actions } : {}),
  };
}

/** WebApplication —— 只在首页输出，声明站点是一个网页 / 移动端都能用的应用。 */
export function buildWebApplicationJsonLd(
  input: WebApplicationJsonLdInput,
  config: SEOConfig = SEO_CONFIG,
): JsonLdObject {
  const { locale, offers } = input;
  const siteUrl = requireSiteUrl(input.siteUrl);
  const name = clean(input.name) ?? config.siteName;
  const installPath = input.installPath ?? config.downloadPath;
  const features = input.features ?? [];
  const operatingSystem = clean(input.operatingSystem);
  const category = clean(input.category);
  const subCategory = clean(input.subCategory);

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "WebApplication",
    "@id": webApplicationId(siteUrl),
    name,
    url: absolute(siteUrl, locale, "", config),
    ...(installPath ? { installUrl: absolute(siteUrl, locale, installPath, config) } : {}),
    ...(category ? { applicationCategory: category } : {}),
    ...(subCategory ? { applicationSubCategory: subCategory } : {}),
    ...(operatingSystem ? { operatingSystem } : {}),
    ...(features.length ? { featureList: features } : {}),
    provider: organizationRef(siteUrl, config),
    ...(offers ? { offers } : {}),
  };
}

/** 某个页面的 BreadcrumbList 用的 @id，WebPage.breadcrumb 和 BreadcrumbList.@id 必须一致。 */
export function breadcrumbIdFor(
  siteUrl: string,
  locale: string,
  pathname: string,
  config: SEOConfig = SEO_CONFIG,
): string {
  const origin = requireSiteUrl(siteUrl);

  return `${absolute(origin, locale, pathname, config)}#breadcrumb`;
}

/** WebPage —— 每个可收录页面一个，把页面挂到 WebSite（isPartOf）和 Organization（about）上。 */
export function buildWebPageJsonLd(
  input: WebPageJsonLdInput,
  config: SEOConfig = SEO_CONFIG,
): JsonLdObject | null {
  const name = clean(input.name);

  if (!name) {
    return null;
  }

  const siteUrl = requireSiteUrl(input.siteUrl);
  const url = absolute(siteUrl, input.locale, input.pathname, config);
  const description = clean(input.description);

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    ...(description ? { description } : {}),
    inLanguage: toBcp47(input.locale),
    isPartOf: { "@id": webSiteId(siteUrl) },
    about: { "@id": organizationId(siteUrl) },
    ...(input.breadcrumbId ? { breadcrumb: { "@id": input.breadcrumbId } } : {}),
  };
}

/**
 * BreadcrumbList —— 首页永远是第一级，后面的层级由调用方按路径给出。
 *
 * 首页之外一层都没有时默认返回 null：只有一项的面包屑不表达任何层级。
 * 传 homeOnly 才会为首页本身输出那唯一一项。
 */
export function buildBreadcrumbJsonLd(
  siteUrl: string,
  locale: string,
  trail: readonly BreadcrumbTrailItem[],
  options: { id?: string; homeOnly?: boolean } = {},
  config: SEOConfig = SEO_CONFIG,
): JsonLdObject | null {
  const items = trail.filter((item) => clean(item.name));

  if (items.length === 0 && !options.homeOnly) {
    return null;
  }

  const origin = requireSiteUrl(siteUrl);
  // 首页自己：唯一一项就是当前页，按规范当前页不带 item 链接
  const all: BreadcrumbTrailItem[] =
    items.length === 0
      ? [{ name: config.siteName }]
      : [{ name: config.siteName, path: "" }, ...items];

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "BreadcrumbList",
    ...(options.id ? { "@id": options.id } : {}),
    itemListElement: all.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name.trim(),
      ...(item.path === undefined ? {} : { item: absolute(origin, locale, item.path, config) }),
    })),
  };
}

/** Build Article data from content already fetched by the page. */
export function buildArticleJsonLd(
  input: ArticleJsonLdInput,
  config: SEOConfig = SEO_CONFIG,
): JsonLdObject | null {
  const headline = clean(input.headline);

  if (!headline) {
    return null;
  }

  const siteUrl = requireSiteUrl(input.siteUrl);
  const url = absolute(siteUrl, input.locale, input.pathname, config);
  const datePublished = toIsoDate(input.datePublished);
  const dateModified = toIsoDate(input.dateModified) ?? datePublished;
  const plainBody = clean(htmlToPlainText(input.body));
  const description = plainBody?.slice(0, ARTICLE_DESCRIPTION_MAX_LENGTH).trim();

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "Article",
    headline,
    inLanguage: toBcp47(input.locale),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(description ? { description } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: organizationRef(siteUrl, config),
    publisher: organizationRef(siteUrl, config),
  };
}

/** Structured FAQ entries must match the questions and answers visible on the page. */
export function buildFaqJsonLd(items: readonly FaqJsonLdItem[]): JsonLdObject | null {
  const entries = items
    .map((item) => ({
      question: clean(item.question),
      answer: clean(htmlToPlainText(item.answer)),
    }))
    .filter((item): item is { question: string; answer: string } =>
      Boolean(item.question && item.answer),
    );

  if (entries.length === 0) {
    return null;
  }

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}
