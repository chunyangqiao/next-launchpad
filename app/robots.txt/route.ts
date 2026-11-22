import { NON_PRODUCTION_ROBOTS_TXT, PRODUCTION_ROBOTS_RULES } from "@/lib/constants/robots";
import { siteUnavailable } from "@/lib/seo/crawlers";
import { SITE_ORIGIN } from "@/lib/seo/urls";

const headers = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=0, must-revalidate",
};

export function GET() {
  const environment = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NEXT_PUBLIC_ENV;
  if (environment !== "production") {
    return new Response(NON_PRODUCTION_ROBOTS_TXT, { headers });
  }

  if (!SITE_ORIGIN) {
    return siteUnavailable();
  }

  const hostname = process.env.NEXT_HOST_NAME || new URL(SITE_ORIGIN).hostname;
  const body = `# --------------------------------------------------
# Robots.txt for ${hostname}
# Primary Domain: ${SITE_ORIGIN}
${PRODUCTION_ROBOTS_RULES}

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;

  return new Response(body, { headers });
}
