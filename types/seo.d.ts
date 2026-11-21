export interface SEOConfig {
  /**
   * @description 品牌名。用于 title 模板、og:site_name 和 JSON-LD。
   */
  siteName: string;
  /**
   * @description 主域名（带协议、不带尾斜杠）。未配置时不发 canonical / hreflang / og:url / metadataBase。
   */
  siteUrl: string | null;
  /**
   * @description 允许的语言代码，顺序即 hreflang 的输出顺序。
   */
  locales: readonly string[];
  /**
   * @description 默认语言，同时作为 x-default 和未知语言的回落值。
   */
  defaultLocale: string;
  /**
   * @description 没有专属分享图时的 og:image（相对主域名）。项目还没有 OG 图时留空。
   */
  defaultOgImage?: string;
  /**
   * @description 不允许收录的路径前缀（不含语言前缀）。匹配逻辑在 isNoindexPath。
   */
  noindexPrefixes: readonly string[];
  /**
   * @description JSON-LD Organization.sameAs。
   */
  socialLinks: readonly string[];
  /**
   * @description JSON-LD Organization.alternateName。
   */
  organizationAlternateNames: readonly string[];
  /**
   * @description JSON-LD ContactPoint.availableLanguage，写语言名称而不是代码。
   */
  supportLanguages: readonly string[];
  /**
   * @description JSON-LD WebSite 的注册入口；不配置就不发 potentialAction。
   */
  signupPath?: string;
  /**
   * @description JSON-LD WebSite / WebApplication 的下载入口；不配置就不发。
   */
  downloadPath?: string;
  /**
   * @description JSON-LD Organization 的联系页路径；不配置就不发 contactPoint。
   */
  contactPath?: string;
}

export interface BuildMetadataInput {
  /**
   * @description 标准语言代码，例如 'en-us'。不认识时回落到 SEO_CONFIG.defaultLocale。
   */
  locale: string;
  /**
   * @description 不含语言前缀的路径。'' = 首页；例如 '/market'、'/spot/BTC_USDT'。
   */
  pathname: string;
  /**
   * @description 已翻译好的标题。
   */
  title?: string;
  /**
   * @description 标题已自带品牌，不套根 layout 的 '%s | 站点名' 模板。
   */
  titleAbsolute?: boolean;
  /**
   * @description 已翻译好的描述。为空就输出 null，宁可缺，也不要所有语言共用同一句占位文案。
   */
  description?: string;
  /**
   * @description 已翻译好的关键词。为空就输出 null，避免所有语言共用同一句。
   */
  keywords?: string;
  /**
   * @description og:image / twitter:image。undefined = 用站点默认分享图；null = 明确不发分享图。
   */
  images?: string | null;
  /**
   * @description 覆盖 SEO_CONFIG.noindexPrefixes 的判断。
   */
  noindex?: boolean;
  /**
   * @description 覆盖 SEO_CONFIG.siteUrl；传 null 表示本次不输出任何绝对地址。
   */
  siteUrl?: string | null;
}

export interface MatchedRoute {
  /**
   * @description 路由表的键，例如 '/spot/[[...assetpair]]'。
   */
  route: string;
  /**
   * @description 动态段的值（已 decode），例如 { assetpair: 'BTC_USDT' }。
   */
  params: Record<string, string>;
}

export type RouteMatcher = (pathname: string) => MatchedRoute | null;

export interface CompiledRoute {
  /**
   * @description 路由表的原始键，未做任何改写。
   */
  route: string;
  /**
   * @description 把动态段编译成捕获组后的匹配正则。
   */
  regex: RegExp;
  /**
   * @description 捕获组对应的动态段名，顺序与正则里的捕获组一致。
   */
  keys: string[];
}

export interface RouteSeoEntry {
  /**
   * @description 文案表里的标题键。
   */
  titleKey?: string;
  /**
   * @description 文案表里的描述键；没有真实文案就别填。
   */
  descKey?: string;
  /**
   * @description 文案表里的关键词键。
   */
  keywordsKey?: string;
  /**
   * @description 标题文案已经自带品牌，不要再套根 layout 的 '%s | 站点名' 模板，
   * 否则会变成 '… | 站点名 | 站点名'。
   */
  titleAbsolute?: boolean;
  /**
   * @description 整页 noindex：robots 出 noindex，结构化数据也不发。
   */
  noindex?: boolean;
}

export interface RouteSeoContext {
  /**
   * @description 路由表：键 = 去掉语言前缀的路径，动态段沿用 Next 的写法。
   */
  table: Record<string, RouteSeoEntry>;
  /**
   * @description 当前语言的翻译函数，例如 next-intl 的 t。
   */
  translate: (key: string, values?: Record<string, string>) => string;
  /**
   * @description 翻译库缺键回落值的前缀，默认 'shared'。
   */
  namespace?: string;
}

export interface RouteSeoText {
  /**
   * @description 从路由表取到并翻译好的标题。
   */
  title?: string;
  /**
   * @description 从路由表取到并翻译好的描述。
   */
  description?: string;
  /**
   * @description 从路由表取到并翻译好的关键词。
   */
  keywords?: string;
  /**
   * @description 标题已自带品牌，不再套根 layout 的模板。
   */
  titleAbsolute?: boolean;
}

export interface RouteMetadataInput {
  /**
   * @description 标准语言代码，例如 'en-us'。
   */
  locale: string;
  /**
   * @description 真实路径，不含语言前缀，直接进 canonical。'' = 首页。
   */
  pathname: string;
  /**
   * @description 路由表的键。静态路由不用传（等于 pathname）；动态路由必须传模板本身。
   */
  route?: string;
  /**
   * @description 覆盖路由表的标题，例如详情页用文章标题。
   */
  title?: string;
  /**
   * @description 覆盖路由表的描述，例如详情页用正文摘要。
   */
  description?: string;
  /**
   * @description 标题 / 描述 / 关键词模板里的变量，例如 { pair: 'BTC/USDT' }。
   */
  titleValues?: Record<string, string>;
  /**
   * @description 覆盖 noindex 判断。
   */
  noindex?: boolean;
}

/**
 * @description Next 交给 generateMetadata 的 params：一定有 language，其余是该路由的动态段。
 */
export type RouteParams = {
  /**
   * @description 当前语言代码，对应路由里的 `[language]` 段。
   */
  language: string;
} & Record<string, string | string[] | undefined>;

export type JsonLdObject = Record<string, unknown>;

export interface JsonLdProps {
  /**
   * @description builder 的返回值。null 会被直接丢掉，所以调用方不用自己判空。
   */
  data: JsonLdObject | null | Array<JsonLdObject | null>;
}

export interface OrganizationJsonLdInput {
  /**
   * @description 主域名，配置里的非空结果。
   */
  siteUrl: string;
  /**
   * @description 标准语言代码，例如 'en-us'；用于拼 Organization 的地址。
   */
  locale: string;
  /**
   * @description 品牌简介，为空就不输出。
   */
  description?: string;
  /**
   * @description App Store / Google Play 等官方下载页；非 http(s) 的会被丢掉。
   */
  appLinks?: Array<string | undefined | null>;
}

export interface WebApplicationJsonLdInput {
  /**
   * @description 主域名，配置里的非空结果。
   */
  siteUrl: string;
  /**
   * @description 标准语言代码，例如 'en-us'；用于拼绝对地址。
   */
  locale: string;
  /**
   * @description 应用名，默认用站点名。
   */
  name?: string;
  /**
   * @description 页面实际展示的功能，不在页面上就别写。
   */
  features?: readonly string[];
  /**
   * @description 安装 / 下载页路径，默认 SEO_CONFIG.downloadPath。
   */
  installPath?: string;
  /**
   * @description 支持的运行平台，例如 'iOS, Android'。
   */
  operatingSystem?: string;
  /**
   * @description 应用分类，例如 'FinanceApplication'。
   */
  category?: string;
  /**
   * @description 应用子分类。
   */
  subCategory?: string;
  /**
   * @description 价格信息（schema.org Offer）；免费或不在页面上就别传。
   */
  offers?: JsonLdObject;
}

export interface WebPageJsonLdInput {
  /**
   * @description 主域名，配置里的非空结果。
   */
  siteUrl: string;
  /**
   * @description 标准语言代码，例如 'en-us'；用于拼绝对地址和 inLanguage。
   */
  locale: string;
  /**
   * @description 不含语言前缀的路径，'' = 首页。
   */
  pathname: string;
  /**
   * @description 页面完整标题（和 <title> 一致）。
   */
  name: string;
  /**
   * @description 和 <meta name="description"> 一致；没有就不输出。
   */
  description?: string;
  /**
   * @description 页面上 BreadcrumbList 的 @id；没有面包屑就不传。
   */
  breadcrumbId?: string;
}

export interface BreadcrumbTrailItem {
  /**
   * @description 面包屑上显示的名字。
   */
  name: string;
  /**
   * @description 不含语言前缀的路径。当前页（最后一项）可以不传。
   */
  path?: string;
}

export interface ArticleJsonLdInput {
  /**
   * @description 主域名，配置里的非空结果。
   */
  siteUrl: string;
  /**
   * @description 标准语言代码，例如 'en-us'；用于拼绝对地址和 inLanguage。
   */
  locale: string;
  /**
   * @description 不含语言前缀的路径，例如 '/announcement/123'。
   */
  pathname: string;
  /**
   * @description 文章标题；为空就不输出整个 Article。
   */
  headline?: string;
  /**
   * @description 发布时间（毫秒时间戳或它的字符串形式）。
   */
  datePublished?: number | string | null;
  /**
   * @description 更新时间；没有就退回发布时间。
   */
  dateModified?: number | string | null;
  /**
   * @description 正文（可以带 HTML，这里会剥成纯文本截断成摘要）。
   */
  body?: string | null;
}

export interface FaqJsonLdItem {
  /**
   * @description 页面上渲染的问题原文。
   */
  question: string;
  /**
   * @description 页面上渲染的答案原文；可以带 HTML，输出前会剥成纯文本。
   */
  answer: string;
}

export interface SitemapUrlEntry {
  /**
   * @description 页面的绝对地址；带 & 等保留字符的查询串会被转义。
   */
  loc: string;
  /**
   * @description W3C 日期，YYYY-MM-DD。
   */
  lastmod: string;
}

export type SitemapSection = "pages" | "trade";

export interface SitemapRoute {
  /**
   * @description 不含语言前缀的路径。
   * @example
   *  - '' -> 首页
   */
  path: string;
  section: SitemapSection;
  /**
   * @description 最后一次编辑时间。W3C 日期（YYYY-MM-DD）
   * @default 默认是当天的日期
   */
  lastModified?: string;
  /**
   * @description 只在这些语言下存在的条目。不填 = 9 种语言都有
   */
  locales?: readonly string[];
}
