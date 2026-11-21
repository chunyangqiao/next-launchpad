import { DEFAULT_SEO_DESCRIPTION, DEFAULT_SEO_TITLE } from "@/lib/constants/seo";

import type { RouteSeoEntry } from "@/types/seo";

export const SEO_ROUTE_TABLE = {
  "/": {
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
    titleAbsolute: true,
  },
} satisfies Record<string, RouteSeoEntry>;
