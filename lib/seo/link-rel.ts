import { SITE_ORIGIN } from "./urls";
import { EXTERNAL_LINK_REL, OWN_HOST_LINK_REL } from "@/lib/constants/seo";

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
export function getExternalLinkRel(
  href: string | null | undefined,
  siteUrl: string | null = SITE_ORIGIN,
): string {
  if (!href) {
    return EXTERNAL_LINK_REL;
  }

  // 协议相对地址 (//example.com) 也可能指向站外。
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
