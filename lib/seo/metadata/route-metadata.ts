import { DEFAULT_SEO_NAMESPACE } from "@/lib/constants/seo";
import { buildMetadata } from "@/lib/seo/metadata/build-metadata";

import type {
  RouteMetadataInput,
  RouteMetadataOptions,
  RouteParams,
  RouteSeoContext,
  RouteSeoText,
} from "@/types/seo";
import type { Metadata } from "next";

export function resolveRouteSeoText(
  route: string,
  context: RouteSeoContext,
  values?: Record<string, string>,
): RouteSeoText {
  const entry = context.table[route] ?? {};
  const namespace = context.namespace ?? DEFAULT_SEO_NAMESPACE;

  function clean(value: string | undefined): string | undefined {
    const trimmed = value?.trim();

    return trimmed || undefined;
  }

  function translate(key: string | undefined): string | undefined {
    if (!key) {
      return undefined;
    }

    if (!context.translate) {
      throw new Error(`[seo] Route "${route}" uses translation key "${key}" without a translator`);
    }

    const value = context.translate(key, values);

    return value === `${namespace}.${key}` ? undefined : clean(value);
  }

  return {
    title: clean(entry.title) ?? translate(entry.titleKey),
    description: clean(entry.description) ?? translate(entry.descKey),
    keywords: clean(entry.keywords) ?? translate(entry.keywordsKey),
    titleAbsolute: entry.titleAbsolute,
  };
}

/** Resolve route text before handing canonical and social fields to buildMetadata. */
export async function buildRouteMetadata(
  input: RouteMetadataInput,
  context: RouteSeoContext,
): Promise<Metadata> {
  const { locale, pathname, route, title, description, titleValues, noindex } = input;
  const text = resolveRouteSeoText(route ?? pathname, context, titleValues);

  return buildMetadata(
    {
      locale,
      pathname,
      title: title ?? text.title,
      titleAbsolute: text.titleAbsolute,
      description: description ?? text.description,
      keywords: text.keywords,
      noindex,
    },
    context.config,
  );
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
        throw new Error(`[seo] routeMetadata('${route}') is missing param "${key}"`);
      }

      return encodePathSegment(value);
    })
    .join("/");
}

/**
 * Create a generateMetadata export for a route-table entry.
 * Dynamic segments use Next.js route placeholders and are safely URL encoded.
 */
export function routeMetadata(
  route: string,
  context: RouteSeoContext,
  options: RouteMetadataOptions = {},
) {
  if (route.includes("...")) {
    throw new Error(`[seo] routeMetadata does not support catch-all segments: ${route}`);
  }

  return async function generateMetadata({
    params,
  }: {
    params: Promise<RouteParams>;
  }): Promise<Metadata> {
    const resolved = await params;
    const locale = resolved[options.localeParam ?? "language"];

    if (typeof locale !== "string" || !locale) {
      throw new Error(
        `[seo] routeMetadata('${route}') is missing locale param "${options.localeParam ?? "language"}"`,
      );
    }

    return buildRouteMetadata(
      {
        locale,
        pathname: fillRouteTemplate(route, resolved),
        route,
        noindex: options.noindex ?? context.table[route]?.noindex,
      },
      context,
    );
  };
}
