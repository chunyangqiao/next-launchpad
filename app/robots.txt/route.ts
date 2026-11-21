import { NON_PRODUCTION_ROBOTS_TXT, PRODUCTION_ROBOTS_RULES } from "@/lib/constants/robots";
import { buildRobotsTxt, robotsResponse, SEO_CONFIG, siteUnavailableResponse } from "@/lib/seo";

export function GET() {
  const environment = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NEXT_PUBLIC_ENV;
  const isProduction = environment === "production";

  if (!isProduction) {
    return robotsResponse(NON_PRODUCTION_ROBOTS_TXT);
  }

  if (!SEO_CONFIG.siteUrl) {
    return siteUnavailableResponse();
  }

  return robotsResponse(
    buildRobotsTxt({
      siteUrl: SEO_CONFIG.siteUrl,
      directives: PRODUCTION_ROBOTS_RULES,
    }),
  );
}
