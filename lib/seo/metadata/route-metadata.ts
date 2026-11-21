import { DEFAULT_SEO_NAMESPACE } from "@/lib/constants/seo";
import { buildMetadata } from "@/lib/seo/metadata/build-metadata";

import type { RouteMetadataInput, RouteParams, RouteSeoContext, RouteSeoText } from "@/types/seo";
import type { Metadata } from "next";

/**
 * 路由 → 当前语言的文案。没配键的字段返回 undefined（buildMetadata 会直接输出 null）。
 *
 * 翻译库缺键时通常返回 `${namespace}.${key}` 这样一个非空字符串；照搬会让 <title> 变成字面量，
 * 而且因为非空还会赢过调用方的兜底值。所以把它当成「没配」。
 */
export function resolveRouteSeoText(
  route: string,
  context: RouteSeoContext,
  values?: Record<string, string>,
): RouteSeoText {
  const entry = context.table[route] ?? {};
  const namespace = context.namespace ?? DEFAULT_SEO_NAMESPACE;

  function translate(key: string | undefined): string | undefined {
    if (!key) {
      return undefined;
    }

    const value = context.translate(key, values);

    return value === `${namespace}.${key}` ? undefined : value;
  }

  return {
    title: translate(entry.titleKey),
    description: translate(entry.descKey),
    keywords: translate(entry.keywordsKey),
    titleAbsolute: entry.titleAbsolute,
  };
}

/**
 * 页面级 generateMetadata 的统一入口：路由 → 路由表 → 翻译 → buildMetadata。
 *
 * 只做「取键、翻译、转交」，canonical / hreflang / robots 全部由 buildMetadata 决定，
 * 所以每个页面只需要给出自己的真实 pathname。
 */
export async function buildRouteMetadata(
  input: RouteMetadataInput,
  context: RouteSeoContext,
): Promise<Metadata> {
  const { locale, pathname, route, title, description, titleValues, noindex } = input;
  const text = resolveRouteSeoText(route ?? pathname, context, titleValues);

  return buildMetadata({
    locale,
    pathname,
    title: title ?? text.title,
    titleAbsolute: text.titleAbsolute,
    description: description ?? text.description,
    keywords: text.keywords,
    noindex,
  });
}

const TEMPLATE_SEGMENT = /^\[[\w-]+\]$/;

/**
 * 动态段 → 可以直接拼进 canonical 的形态。
 *
 * Next 交给 params 的值还是 URL 里的编码形态（'a%20b'），再 encode 一遍会变成 'a%2520b'。
 * 先 decode 再 encode，得到唯一的规范写法；decode 不了的按原样 encode。
 */
export function encodePathSegment(segment: string): string {
  try {
    return encodeURIComponent(decodeURIComponent(segment));
  } catch {
    return encodeURIComponent(segment);
  }
}

function fillRouteTemplate(route: string, params: RouteParams): string {
  return route
    .split("/")
    .map((segment) => {
      if (!TEMPLATE_SEGMENT.test(segment)) {
        return segment;
      }

      const key = segment.slice(1, -1);
      const value = params[key];

      // 模板里的段名和目录名对不上（写错 / 目录改名）只会静默生成 '//'，这里直接抛出来让它第一次请求就暴露。
      if (typeof value !== "string" || !value) {
        throw new Error(
          `[seo] routeMetadata('${route}')：params 里没有 ${key}（模板段 ${segment}）`,
        );
      }

      return encodePathSegment(value);
    })
    .join("/");
}

/**
 * 直接当 generateMetadata 导出的工厂，给「只需要路由表文案 + canonical」的页面 / layout 用：
 *
 *   const { routeMetadata } = ...;
 *   export const generateMetadata = routeMetadata("/market", context);
 *   export const generateMetadata = routeMetadata("/copy-trading/traders/[traderId]/settings", context, {
 *     noindex: true,
 *   });
 *
 * 只传路由表的键，动态段写模板 `[param]`；真实 pathname 由 params 里的同名值填进去（已 encode）。
 * 要查后端判断存不存在、或标题要拼参数的页面，照旧手写 generateMetadata 并调用 buildRouteMetadata。
 */
export function routeMetadata(
  route: string,
  context: RouteSeoContext,
  options: { noindex?: boolean } = {},
) {
  if (route.includes("...")) {
    throw new Error(`[seo] routeMetadata 不支持 catch-all 段，请手写 generateMetadata：${route}`);
  }

  return async function generateMetadata({
    params,
  }: {
    params: Promise<RouteParams>;
  }): Promise<Metadata> {
    const resolved = await params;

    return buildRouteMetadata(
      {
        locale: resolved.language,
        pathname: fillRouteTemplate(route, resolved),
        route,
        noindex: options.noindex ?? context.table[route]?.noindex,
      },
      context,
    );
  };
}
