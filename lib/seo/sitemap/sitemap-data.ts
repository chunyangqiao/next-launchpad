import type { SitemapRoute } from "@/types/seo";

const SITEMAP_CACHE_KEY = "sitemap-dynamic-routes";

export async function getSitemapRoutes() {
  const staticRoutes = [];

  const dynamicRoutes: Array<SitemapRoute> = [];

  try {
  } catch (error) {}
}

export async function getSitemapFiles() {
  const present = new Set<string>();
}
