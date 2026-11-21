import { normalizeSiteUrl } from "./site-url";
import { BRAND } from "@/lib/constants/brand";

import type { SEOConfig } from "@/types/seo";

/**
 * @description 站点级 SEO 配置。业务路由表、页面文案、后台 SEO 配置不在这里 —— 它们由调用方传入。
 *
 * @description 主域名只认 NEXT_PUBLIC_SITE_URL：没配就不猜域名，带绝对地址的 metadata 一律不发。
 */
export const SEO_CONFIG: SEOConfig = {
  siteName: BRAND,
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locales: ["en"],
  defaultLocale: "en",
  noindexPrefixes: [],
  socialLinks: [],
  organizationAlternateNames: [],
  supportLanguages: [],
};
