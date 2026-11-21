/** 只接受 http(s) 地址并返回 origin：后台 / 环境变量里带了路径或尾斜杠时，canonical 不能跟着带。 */
export function normalizeSiteUrl(value: unknown): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";

  if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

/**
 * 站点配置暂时不可用时的 robots / sitemap 应答。
 *
 * 不能返回一份空的 Disallow 或 404：搜索引擎会把那份结果缓存下来。503 表示「稍后再来」，
 * 已收录的地址会保留。
 */
export function siteUnavailableResponse(): Response {
  return new Response("Site configuration temporarily unavailable", {
    status: 503,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "60",
    },
  });
}
