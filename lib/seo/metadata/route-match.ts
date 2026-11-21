import type { CompiledRoute, MatchedRoute, RouteMatcher, RouteSeoEntry } from "@/types/seo";

const OPTIONAL_CATCH_ALL = /^\[\[\.\.\.\w+\]\]$/;
const DYNAMIC_SEGMENT = /^\[[\w-]+\]$/;

/** 把路由表的键编译成正则：'[id]' 匹配一段，'[[...rest]]' 匹配可有可无的一段。 */
function compile(route: string): CompiledRoute {
  const keys: string[] = [];
  const source = route
    .split("/")
    .map((segment) => {
      if (OPTIONAL_CATCH_ALL.test(segment)) {
        keys.push(segment.slice(5, -2));

        return "(?:/([^/]+))?";
      }

      if (DYNAMIC_SEGMENT.test(segment)) {
        keys.push(segment.slice(1, -1));

        return "/([^/]+)";
      }

      return segment ? `/${segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}` : "";
    })
    .join("");

  return { route, regex: new RegExp(`^${source}$`), keys };
}

/** Compile route patterns once, preferring static and then more specific dynamic routes. */
export function createRouteMatcher(table: Record<string, RouteSeoEntry>): RouteMatcher {
  const compiled = Object.keys(table)
    .filter((route) => route !== "/")
    .sort((a, b) => {
      const aDynamic = a.includes("[");
      const bDynamic = b.includes("[");

      if (aDynamic !== bDynamic) {
        return aDynamic ? 1 : -1;
      }

      return b.length - a.length;
    })
    .map(compile);

  return function matchRoute(pathname: string): MatchedRoute | null {
    const path = pathname.replace(/\/+$/, "");

    if (path === "" || path === "/") {
      return { route: "/", params: {} };
    }

    for (const { route, regex, keys } of compiled) {
      const result = regex.exec(path);

      if (!result) {
        continue;
      }

      const params: Record<string, string> = {};

      keys.forEach((key, index) => {
        const value = result[index + 1];

        if (value === undefined) {
          return;
        }

        try {
          params[key] = decodeURIComponent(value);
        } catch {
          params[key] = value;
        }
      });

      return { route, params };
    }

    return null;
  };
}

/** Remove a complete locale prefix, for example "/en/docs/item" → "/docs/item". */
export function stripLocalePrefix(pathname: string, locale: string): string {
  const prefix = `/${locale}`;

  if (pathname === prefix) {
    return "";
  }

  return pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
}
