import { htmlToPlainText } from "./text";
import { pageUrl, SITE_ORIGIN } from "./urls";
import { BRAND, BRAND_ALTERNATE_NAMES } from "@/lib/constants/brand";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  SIGNUP_ACTION_NAME,
  SIGNUP_PATH,
  SUPPORTED_LOCALES,
} from "@/lib/constants/seo";
import { SOCIAL_MEDIA_LINKS } from "@/lib/constants/social";

import type { Locale } from "@/lib/constants/seo";

type JsonLdObject = Record<string, unknown>;
type JsonLdData = JsonLdObject | null | readonly (JsonLdObject | null)[];
type Page = { language: Locale; path?: string };
type SeoDate = Date | number | string | null;

const SCHEMA = "https://schema.org";

function organization(origin: string) {
  return { "@type": "Organization", "@id": `${origin}/#organization`, name: BRAND };
}

function websiteId(origin: string): string {
  return `${origin}/#website`;
}

export function homeJsonLd(language: Locale): readonly (JsonLdObject | null)[] | null {
  if (!SITE_ORIGIN) {
    return null;
  }

  const url = pageUrl(SITE_ORIGIN, language);
  const publisher = organization(SITE_ORIGIN);
  const names = BRAND_ALTERNATE_NAMES.length ? { alternateName: BRAND_ALTERNATE_NAMES } : {};

  return [
    {
      "@context": SCHEMA,
      ...publisher,
      ...names,
      url,
      description: DEFAULT_SEO_DESCRIPTION,
      knowsLanguage: Intl.getCanonicalLocales(SUPPORTED_LOCALES),
      ...(SOCIAL_MEDIA_LINKS.length ? { sameAs: [...new Set(SOCIAL_MEDIA_LINKS)] } : {}),
    },
    {
      "@context": SCHEMA,
      "@type": "WebSite",
      "@id": websiteId(SITE_ORIGIN),
      ...names,
      name: BRAND,
      url,
      inLanguage: Intl.getCanonicalLocales(language)[0],
      publisher,
      potentialAction: [
        {
          "@type": "RegisterAction",
          name: SIGNUP_ACTION_NAME,
          target: {
            "@type": "EntryPoint",
            urlTemplate: pageUrl(SITE_ORIGIN, language, SIGNUP_PATH),
            actionPlatform: [`${SCHEMA}/DesktopWebPlatform`, `${SCHEMA}/MobileWebPlatform`],
          },
        },
      ],
    },
    webPageJsonLd({ language, name: DEFAULT_SEO_TITLE, description: DEFAULT_SEO_DESCRIPTION }),
  ];
}

export function webPageJsonLd({
  language,
  path,
  name,
  description,
  hasBreadcrumb,
}: Page & {
  name: string;
  description?: string;
  hasBreadcrumb?: boolean;
}): JsonLdObject | null {
  if (!SITE_ORIGIN || !name.trim()) {
    return null;
  }

  const url = pageUrl(SITE_ORIGIN, language, path);

  return {
    "@context": SCHEMA,
    "@type": "WebPage",
    "@id": url,
    url,
    name: name.trim(),
    ...(description?.trim() ? { description: description.trim() } : {}),
    inLanguage: Intl.getCanonicalLocales(language)[0],
    isPartOf: { "@id": websiteId(SITE_ORIGIN) },
    about: { "@id": organization(SITE_ORIGIN)["@id"] },
    ...(hasBreadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  };
}

export function webAppJsonLd({
  language,
  name,
  features,
  installPath,
  operatingSystem,
  category,
  subCategory,
  offers,
}: {
  language: Locale;
  name?: string;
  features?: readonly string[];
  installPath?: string;
  operatingSystem?: string;
  category?: string;
  subCategory?: string;
  offers?: JsonLdObject;
}): JsonLdObject | null {
  if (!SITE_ORIGIN) {
    return null;
  }

  return {
    "@context": SCHEMA,
    "@type": "WebApplication",
    "@id": `${SITE_ORIGIN}/#webapplication`,
    name: name?.trim() || BRAND,
    url: pageUrl(SITE_ORIGIN, language),
    ...(installPath ? { installUrl: pageUrl(SITE_ORIGIN, language, installPath) } : {}),
    ...(category?.trim() ? { applicationCategory: category.trim() } : {}),
    ...(subCategory?.trim() ? { applicationSubCategory: subCategory.trim() } : {}),
    ...(operatingSystem?.trim() ? { operatingSystem: operatingSystem.trim() } : {}),
    ...(features?.length ? { featureList: features } : {}),
    provider: organization(SITE_ORIGIN),
    ...(offers ? { offers } : {}),
  };
}

export function breadcrumbJsonLd({
  language,
  path,
  trail,
}: Page & { trail: readonly { name: string; path?: string }[] }): JsonLdObject | null {
  const origin = SITE_ORIGIN;
  const items = trail.filter((item) => item.name.trim());

  if (!origin || !items.length) {
    return null;
  }

  return {
    "@context": SCHEMA,
    "@type": "BreadcrumbList",
    "@id": `${pageUrl(origin, language, path)}#breadcrumb`,
    itemListElement: [{ name: BRAND, path: "" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name.trim(),
      ...(item.path === undefined ? {} : { item: pageUrl(origin, language, item.path) }),
    })),
  };
}

function isoDate(value: SeoDate | undefined): string | undefined {
  if (value == null || value === "") {
    return undefined;
  }

  const date = new Date(typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value);
  return date.getTime() > 0 ? date.toISOString() : undefined;
}

export function articleJsonLd({
  language,
  path,
  headline,
  published,
  modified,
  body,
}: Page & {
  headline: string;
  published?: SeoDate;
  modified?: SeoDate;
  body?: string | null;
}): JsonLdObject | null {
  if (!SITE_ORIGIN || !headline.trim()) {
    return null;
  }

  const url = pageUrl(SITE_ORIGIN, language, path);
  const description = htmlToPlainText(body).slice(0, 200).trim();
  const datePublished = isoDate(published);
  const dateModified = isoDate(modified) ?? datePublished;
  const publisher = organization(SITE_ORIGIN);

  return {
    "@context": SCHEMA,
    "@type": "Article",
    headline: headline.trim(),
    inLanguage: Intl.getCanonicalLocales(language)[0],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(description ? { description } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: publisher,
    publisher,
  };
}

/** Only include questions and answers visible on the page. */
export function faqJsonLd(
  items: readonly { question: string; answer: string }[],
): JsonLdObject | null {
  const questions = items
    .map(({ question, answer }) => ({ name: question.trim(), text: htmlToPlainText(answer) }))
    .filter(({ name, text }) => name && text);

  if (!questions.length) {
    return null;
  }

  return {
    "@context": SCHEMA,
    "@type": "FAQPage",
    mainEntity: questions.map(({ name, text }) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text },
    })),
  };
}

export function JsonLd({ data }: { data: JsonLdData }) {
  const items = (Array.isArray(data) ? data : [data]).filter((item) => item !== null);

  if (!items.length) {
    return null;
  }

  // Escape "<" so a value can't close the script tag.
  const json = JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
