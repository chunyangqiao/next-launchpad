import { notFound } from "next/navigation";

import { isLocale, SEO_DEFAULTS_BY_LOCALE } from "@/lib/constants/seo";
import { homeJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[language]">) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  const { title, description } = SEO_DEFAULTS_BY_LOCALE[language];

  return pageMetadata({
    language,
    title: { absolute: title },
    description,
  });
}

export default async function HomePage({ params }: PageProps<"/[language]">) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  const { title, description } = SEO_DEFAULTS_BY_LOCALE[language];

  return (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>
      <JsonLd data={homeJsonLd(language)} />
    </main>
  );
}
