import { BRAND } from "@/lib/constants/brand";

import type { Metadata } from "next";

export const OWN_HOST_LINK_REL = "noopener noreferrer";
export const NO_FOLLOW_NO_OPENER_NO_REFERRER = `nofollow ${OWN_HOST_LINK_REL}`;
export const EXTERNAL_LINK_REL = NO_FOLLOW_NO_OPENER_NO_REFERRER;

/**
 * Segment-safe path prefixes that should not enter a search index.
 * These paths do not include the locale prefix.
 */
export const NO_INDEX_PREFIXES = ["/sign-in", "/sign-up", "/reset-pwd", "/profile", "/order"];

export const SUPPORTED_LOCALES = ["en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE = "en" satisfies Locale;

export function isLocale(language: string): language is Locale {
  return SUPPORTED_LOCALES.some((locale) => locale === language);
}

export const DEFAULT_SEO_TITLE = BRAND;
export const DEFAULT_SEO_DESCRIPTION = "A modern Next.js application.";
export const SIGNUP_PATH = "/sign-up";
export const SIGNUP_ACTION_NAME = "Create a free account";

/** Use at a layout segment whose whole subtree must not be indexed. */
export const NOINDEX_METADATA = {
  robots: { index: false, follow: false },
  alternates: null,
  description: null,
  keywords: null,
} as const satisfies Metadata;
