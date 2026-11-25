import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, isLocale } from "@/lib/constants/seo";

const LOCALE_SEGMENT = /^[a-z]{2}(?:-[a-z]{4})?(?:-(?:[a-z]{2}|\d{3}))?$/i;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [language] = pathname.slice(1).split("/", 1);

  if (isLocale(language)) {
    return NextResponse.next();
  }

  const path = LOCALE_SEGMENT.test(language) ? pathname.slice(language.length + 1) : pathname;
  const url = request.nextUrl.clone();
  url.pathname = path === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${path}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
