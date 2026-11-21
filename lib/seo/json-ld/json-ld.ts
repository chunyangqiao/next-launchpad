import { ARTICLE_DESCRIPTION_MAX_LENGTH, SCHEMA_ORG_CONTEXT } from "@/lib/constants/seo";
import { SEO_CONFIG } from "@/lib/seo/config";
import { buildCanonicalUrl } from "@/lib/seo/metadata/path";

import type {
  ArticleJsonLdInput,
  BreadcrumbTrailItem,
  FaqJsonLdItem,
  JsonLdObject,
  OrganizationJsonLdInput,
  WebApplicationJsonLdInput,
  WebPageJsonLdInput,
} from "@/types/seo";

/**
 * @description JSON-LD 构建函数。根据已有数据生成符合 schema.org 规范的数据
 *
 * 1. 不发请求。每个 builder 的入参都来自页面已经拿到的数据或 URL 本身。
 * 2. 数据不全就返回 null。半个 Article、没有问题的 FAQPage 对搜索引擎是负分。
 * 3. 结构化数据必须和页面上看得见的内容一致。
 */

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
function organizationRef(siteUrl: string): JsonLdObject {
  return { "@type": "Organization", "@id": organizationId(siteUrl), name: SEO_CONFIG.siteName };
}

function organizationImageUrl(siteUrl: string): string | undefined {
  const path = SEO_CONFIG.defaultOgImage;

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

function absolute(siteUrl: string, locale: string, pathname: string): string {
  return buildCanonicalUrl(siteUrl, locale, pathname);
}

/** 时间戳 → ISO 字符串。认不出来就返回 undefined，让调用方少发一个字段。 */
function toIsoDate(value: number | string | undefined | null): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const timestamp = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return undefined;
  }

  const date = new Date(timestamp);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function clean(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

/** 富文本偶尔带 HTML；JSON-LD 里只能放纯文本。 */
function toPlainText(value: string | undefined | null): string | undefined {
  return clean(
    value
      ?.replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " "),
  );
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

export function buildOrganizationJsonLd(input: OrganizationJsonLdInput): JsonLdObject {
  const { siteUrl, locale, description, appLinks = [] } = input;
  const sameAs = [
    ...SEO_CONFIG.socialLinks,
    ...appLinks.filter(isHttpUrl).map((link) => link.trim()),
  ];
  const image = organizationImageUrl(siteUrl);
  const about = clean(description);
  const languages = SEO_CONFIG.locales.map(toBcp47);
  const contactPath = SEO_CONFIG.contactPath;

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "Organization",
    "@id": organizationId(siteUrl),
    name: SEO_CONFIG.siteName,
    ...(SEO_CONFIG.organizationAlternateNames.length
      ? { alternateName: SEO_CONFIG.organizationAlternateNames }
      : {}),
    url: absolute(siteUrl, locale, ""),
    ...(image ? { logo: image, image } : {}),
    ...(about ? { description: about } : {}),
    ...(languages.length ? { knowsLanguage: languages } : {}),
    ...(contactPath
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            url: absolute(siteUrl, locale, contactPath),
            ...(SEO_CONFIG.supportLanguages.length
              ? { availableLanguage: SEO_CONFIG.supportLanguages }
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
export function buildWebSiteJsonLd(siteUrl: string, locale: string): JsonLdObject {
  function entryPoint(pathname: string): JsonLdObject {
    return {
      "@type": "EntryPoint",
      urlTemplate: absolute(siteUrl, locale, pathname),
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    };
  }

  const actions: JsonLdObject[] = [];

  if (SEO_CONFIG.signupPath) {
    actions.push({
      "@type": "RegisterAction",
      name: "Create a free account",
      target: entryPoint(SEO_CONFIG.signupPath),
    });
  }

  if (SEO_CONFIG.downloadPath) {
    actions.push({
      "@type": "DownloadAction",
      name: `Download the ${SEO_CONFIG.siteName} app`,
      target: entryPoint(SEO_CONFIG.downloadPath),
    });
  }

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "WebSite",
    "@id": webSiteId(siteUrl),
    name: SEO_CONFIG.siteName,
    ...(SEO_CONFIG.organizationAlternateNames.length
      ? { alternateName: SEO_CONFIG.organizationAlternateNames }
      : {}),
    url: absolute(siteUrl, locale, ""),
    inLanguage: toBcp47(locale),
    publisher: organizationRef(siteUrl),
    ...(actions.length ? { potentialAction: actions } : {}),
  };
}

/** WebApplication —— 只在首页输出，声明站点是一个网页 / 移动端都能用的应用。 */
export function buildWebApplicationJsonLd(input: WebApplicationJsonLdInput): JsonLdObject {
  const { siteUrl, locale, offers } = input;
  const name = clean(input.name) ?? SEO_CONFIG.siteName;
  const installPath = input.installPath ?? SEO_CONFIG.downloadPath;
  const features = input.features ?? [];
  const operatingSystem = clean(input.operatingSystem);
  const category = clean(input.category);
  const subCategory = clean(input.subCategory);

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "WebApplication",
    "@id": webApplicationId(siteUrl),
    name,
    url: absolute(siteUrl, locale, ""),
    ...(installPath ? { installUrl: absolute(siteUrl, locale, installPath) } : {}),
    ...(category ? { applicationCategory: category } : {}),
    ...(subCategory ? { applicationSubCategory: subCategory } : {}),
    ...(operatingSystem ? { operatingSystem } : {}),
    ...(features.length ? { featureList: features } : {}),
    provider: organizationRef(siteUrl),
    ...(offers ? { offers } : {}),
  };
}

/** 某个页面的 BreadcrumbList 用的 @id，WebPage.breadcrumb 和 BreadcrumbList.@id 必须一致。 */
export function breadcrumbIdFor(siteUrl: string, locale: string, pathname: string): string {
  return `${absolute(siteUrl, locale, pathname)}#breadcrumb`;
}

/** WebPage —— 每个可收录页面一个，把页面挂到 WebSite（isPartOf）和 Organization（about）上。 */
export function buildWebPageJsonLd(input: WebPageJsonLdInput): JsonLdObject | null {
  const name = clean(input.name);

  if (!name) {
    return null;
  }

  const url = absolute(input.siteUrl, input.locale, input.pathname);
  const description = clean(input.description);

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    ...(description ? { description } : {}),
    inLanguage: toBcp47(input.locale),
    isPartOf: { "@id": webSiteId(input.siteUrl) },
    about: { "@id": organizationId(input.siteUrl) },
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
): JsonLdObject | null {
  const items = trail.filter((item) => clean(item.name));

  if (items.length === 0 && !options.homeOnly) {
    return null;
  }

  // 首页自己：唯一一项就是当前页，按规范当前页不带 item 链接
  const all: BreadcrumbTrailItem[] =
    items.length === 0
      ? [{ name: SEO_CONFIG.siteName }]
      : [{ name: SEO_CONFIG.siteName, path: "" }, ...items];

  return {
    "@context": SCHEMA_ORG_CONTEXT,
    "@type": "BreadcrumbList",
    ...(options.id ? { "@id": options.id } : {}),
    itemListElement: all.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name.trim(),
      ...(item.path === undefined ? {} : { item: absolute(siteUrl, locale, item.path) }),
    })),
  };
}

/** Article —— 公告 / CMS 详情页用。字段全部来自页面已经取回来的数据。 */
export function buildArticleJsonLd(input: ArticleJsonLdInput): JsonLdObject | null {
  const headline = clean(input.headline);

  if (!headline) {
    return null;
  }

  const url = absolute(input.siteUrl, input.locale, input.pathname);
  const datePublished = toIsoDate(input.datePublished);
  const dateModified = toIsoDate(input.dateModified) ?? datePublished;
  const plainBody = toPlainText(input.body);
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
    author: organizationRef(input.siteUrl),
    publisher: organizationRef(input.siteUrl),
  };
}

/**
 * FAQPage —— 传进来的必须是页面真的渲染了的那批问答。
 * 结构化数据和可见内容对不上是明确的违规项。
 */
export function buildFaqJsonLd(items: readonly FaqJsonLdItem[]): JsonLdObject | null {
  const entries = items
    .map((item) => ({ question: clean(item.question), answer: toPlainText(item.answer) }))
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
