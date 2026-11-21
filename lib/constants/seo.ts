import { BRAND } from "@/lib/constants/brand";

import type { Metadata } from "next";

/**
 * Stable SEO values that projects can customize without entering lib/seo implementation modules.
 */
export const EXTERNAL_LINK_REL = "nofollow noopener noreferrer";
export const OWN_HOST_LINK_REL = "noopener noreferrer";
export const SEO_EXCERPT_MAX_LENGTH = 155;
export const ARTICLE_DESCRIPTION_MAX_LENGTH = 200;
export const HREFLANG_X_DEFAULT = "x-default";
export const SCHEMA_ORG_CONTEXT = "https://schema.org";
export const DEFAULT_SEO_NAMESPACE = "shared";

/**
 * Segment-safe path prefixes that should not enter a search index.
 * These paths do not include the locale prefix.
 */
export const NO_INDEX_PREFIXES = ["/sign-in", "/sign-up", "/reset-pwd", "/profile", "/order"];
export const SUPPORTED_LOCALES = ["en"] as const;
export const DEFAULT_LOCALE = "en";
export const DEFAULT_SEO_TITLE = BRAND;
export const DEFAULT_SEO_DESCRIPTION = "A modern Next.js application.";
export const SUPPORT_LANGUAGES = ["English"] as const;
export const SIGNUP_PATH = "/sign-up";
export const SIGNUP_ACTION_NAME = "Create a free account";

/** Use at a layout segment whose whole subtree must not be indexed. */
export const NOINDEX_METADATA = {
  robots: { index: false, follow: false },
  alternates: null,
  description: null,
  keywords: null,
} as const satisfies Metadata;
