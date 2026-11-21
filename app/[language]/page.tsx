import { SEO_ROUTE_TABLE } from "@/lib/constants/seo-routes";
import {
  buildOrganizationJsonLd,
  buildWebPageJsonLd,
  buildWebSiteJsonLd,
  JsonLdScript,
  routeMetadata,
  SEO_CONFIG,
} from "@/lib/seo";

export const generateMetadata = routeMetadata("/", {
  table: SEO_ROUTE_TABLE,
  config: SEO_CONFIG,
});

export default async function HomePage({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;
  const siteUrl = SEO_CONFIG.siteUrl;
  const route = SEO_ROUTE_TABLE["/"];
  const jsonLd = siteUrl
    ? [
        buildOrganizationJsonLd(
          {
            siteUrl,
            locale: language,
            description: SEO_CONFIG.defaultDescription,
          },
          SEO_CONFIG,
        ),
        buildWebSiteJsonLd({ siteUrl, locale: language }, SEO_CONFIG),
        buildWebPageJsonLd(
          {
            siteUrl,
            locale: language,
            pathname: "",
            name: route.title,
            description: route.description,
          },
          SEO_CONFIG,
        ),
      ]
    : null;

  return (
    <main>
      <h1>{SEO_CONFIG.defaultTitle}</h1>
      <p>{SEO_CONFIG.defaultDescription}</p>
      <JsonLdScript data={jsonLd} />
    </main>
  );
}
