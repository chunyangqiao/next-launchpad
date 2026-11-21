import { BRAND, BRAND_ALTERNATE_NAMES } from "@/lib/constants/brand";
import {
  DEFAULT_LOCALE,
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  NO_INDEX_PREFIXES,
  SIGNUP_ACTION_NAME,
  SIGNUP_PATH,
  SUPPORT_LANGUAGES,
  SUPPORTED_LOCALES,
} from "@/lib/constants/seo";
import { SOCIAL_MEDIA_LINKS } from "@/lib/constants/social";
import { normalizeSiteUrl } from "@/lib/seo/site-url";

import type { SEOConfig } from "@/types/seo";

/**
 * Runtime SEO configuration. Static values live in lib/constants so projects can
 * customize the template without changing the implementation modules.
 */
export const SEO_CONFIG: SEOConfig = {
  siteName: BRAND,
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  defaultTitle: DEFAULT_SEO_TITLE,
  defaultDescription: DEFAULT_SEO_DESCRIPTION,
  noindexPrefixes: NO_INDEX_PREFIXES,
  socialLinks: SOCIAL_MEDIA_LINKS,
  organizationAlternateNames: BRAND_ALTERNATE_NAMES,
  supportLanguages: SUPPORT_LANGUAGES,
  signupPath: SIGNUP_PATH,
  signupActionName: SIGNUP_ACTION_NAME,
};
