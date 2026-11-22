import { notFound } from "next/navigation";

import { DEFAULT_SEO_DESCRIPTION, DEFAULT_SEO_TITLE, isLocale } from "@/lib/constants/seo";
import { homeJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[language]">) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  return pageMetadata({
    language,
    title: { absolute: DEFAULT_SEO_TITLE },
    description: DEFAULT_SEO_DESCRIPTION,
  });
}

export default async function HomePage({ params }: PageProps<"/[language]">) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  return (
    <main>
      <h1>{DEFAULT_SEO_TITLE}</h1>
      <p>{DEFAULT_SEO_DESCRIPTION}</p>
      <JsonLd data={homeJsonLd(language)} />
    </main>
  );
}
