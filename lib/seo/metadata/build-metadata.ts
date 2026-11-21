import { SEO_CONFIG } from "@/lib/seo/config";
import {
  buildAlternateUrls,
  buildCanonicalUrl,
  matchesPathPrefix,
  normalizeLocale,
  normalizePathname,
} from "@/lib/seo/metadata/path";
import { normalizeSiteUrl } from "@/lib/seo/site-url";

import type { BuildMetadataInput } from "@/types/seo";
import type { Metadata } from "next";

/**
 * @description 获取不需要索引页面的Meta信息
 */
export function buildNOIndexMetaData() {
  return {
    robots: { index: false, follow: false },
    alternates: null,
    description: null,
    keywords: null,
  } as const satisfies Metadata;
}

/**
 * noindex 路由的 metadata，只有 robots + alternates 两个字段。
 *
 * 整段路由要 noindex 的 layout 直接 `export const metadata = NOINDEX_METADATA`。
 * 不能把 buildMetadata 的完整返回值放到 layout 上：openGraph / twitter 会整个覆盖掉父级的，
 * 整棵子树的 og:url 都会变成这个 layout 的路径。
 */
export const NOINDEX_METADATA = {
  robots: { index: false, follow: false },
  alternates: null,
  // 同 buildMetadata：不继承首页的 description / keywords
  description: null,
  keywords: null,
} as const satisfies Metadata;

/** 该路径是否命中 noindex 前缀名单。pathname 不含语言前缀。 */
export function isNoindexPath(
  pathname: string,
  prefixes: readonly string[] = SEO_CONFIG.noindexPrefixes,
): boolean {
  const path = normalizePathname(pathname);

  return prefixes.some((prefix) => matchesPathPrefix(path, prefix));
}

/**
 * 所有 generateMetadata 的唯一入口：canonical、hreflang、robots、og/twitter 都从这里出。
 *
 * 主域名未配置时 canonical / hreflang / og:url / metadataBase 一律不发 —— 不猜域名。
 * robots 不受影响。
 */
export async function buildMetadata(input: BuildMetadataInput): Promise<Metadata> {
  const { locale, pathname, title, titleAbsolute, description, keywords, images, noindex } = input;
  const siteUrl =
    input.siteUrl === undefined
      ? SEO_CONFIG.siteUrl
      : input.siteUrl === null
        ? null
        : normalizeSiteUrl(input.siteUrl);
  const normalizedLocale = normalizeLocale(locale);
  const path = normalizePathname(pathname);
  const canonical = siteUrl ? buildCanonicalUrl(siteUrl, normalizedLocale, path) : undefined;

  // 每种语言 + x-default 指向同一个页面的默认语言版本
  const languages = siteUrl ? buildAlternateUrls(siteUrl, path) : undefined;

  const resolvedTitle = title?.trim() || undefined;
  const resolvedDescription = description?.trim() || undefined;
  const resolvedKeywords = keywords?.trim() || undefined;
  // 子页面没有专属分享图时回落到站点默认图；传 null 的调用方明确不要兜底。
  // 没有主域名时相对路径的图不发：没有 metadataBase，Next 会把它拼成 http://localhost:3000/…
  const requestedImage =
    images === null
      ? undefined
      : images?.trim() || (siteUrl ? SEO_CONFIG.defaultOgImage : undefined);
  const resolvedImages =
    requestedImage && !siteUrl && requestedImage.startsWith("/") ? undefined : requestedImage;
  const shouldNoindex = noindex ?? isNoindexPath(path);

  // noindex 页面不发 canonical / hreflang：一边说别收录、一边指定收录哪个地址，是互相打架的信号。
  const metadata: Metadata = {
    alternates:
      shouldNoindex || !canonical ? NOINDEX_METADATA.alternates : { canonical, languages },
    robots: shouldNoindex ? NOINDEX_METADATA.robots : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SEO_CONFIG.siteName,
      ...(canonical ? { url: canonical } : {}),
      images: resolvedImages,
    },
    twitter: {
      card: "summary_large_image",
      images: resolvedImages,
    },
  };

  // 下面这些字段「值是 undefined」和「不写这个键」对 Next 不是一回事：mergeMetadata 会遍历
  // 自有键（含 undefined）去覆盖父级，resolveTitle(undefined, template) 返回空标题，
  // 于是根 layout 的 title.default 永远轮不到 —— 表现是整页没有 <title>。所以有值才写。
  if (siteUrl) {
    metadata.metadataBase = new URL(siteUrl);
  }

  if (resolvedTitle) {
    metadata.title = titleAbsolute ? { absolute: resolvedTitle } : resolvedTitle;
    metadata.openGraph = { ...metadata.openGraph, title: resolvedTitle };
    metadata.twitter = { ...metadata.twitter, title: resolvedTitle };
  }

  // description / keywords 没有文案时要显式写 null，而不是不写：Next 会把根 layout（首页）的值
  // 合并进来，结果是所有子页面共用首页那句描述 —— 正是重复内容要避免的。
  metadata.description = resolvedDescription ?? null;
  metadata.keywords = resolvedKeywords ?? null;

  if (resolvedDescription) {
    metadata.openGraph = { ...metadata.openGraph, description: resolvedDescription };
    metadata.twitter = { ...metadata.twitter, description: resolvedDescription };
  }

  return metadata;
}
