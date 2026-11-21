import { EXTERNAL_LINK_REL, OWN_HOST_LINK_REL } from "@/lib/constants/seo";
import { SEO_CONFIG } from "@/lib/seo/config";

const ABSOLUTE_URL = /^[a-z][a-z0-9+.-]*:/i;

function isOwnHost(host: string, siteUrl: string): boolean {
  try {
    const ownHost = new URL(siteUrl).hostname.toLowerCase().replace(/^www\./, "");

    return host === ownHost || host.endsWith(`.${ownHost}`);
  } catch {
    return false;
  }
}

/**
 * @description 第三方站点一律 nofollow；自家域名只加安全属性，保留 dofollow。
 */
export function externalLinkRel(
  href: string | null | undefined,
  siteUrl: string | null = SEO_CONFIG.siteUrl,
): string {
  if (!href) {
    return EXTERNAL_LINK_REL;
  }

  // 站内相对地址和协议相对地址都指向本站，不需要域名就能判断。
  if (!ABSOLUTE_URL.test(href) && !href.startsWith("//")) {
    return OWN_HOST_LINK_REL;
  }

  if (!siteUrl) {
    return EXTERNAL_LINK_REL;
  }

  try {
    const host = new URL(href, siteUrl).hostname.toLowerCase();

    return isOwnHost(host, siteUrl) ? OWN_HOST_LINK_REL : EXTERNAL_LINK_REL;
  } catch {
    return EXTERNAL_LINK_REL;
  }
}
