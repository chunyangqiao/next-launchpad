/** Production directives supplied by the SEO ruleset. The site URL is added at runtime. */
export const PRODUCTION_ROBOTS_RULES = `# 1. Rules for Global Search Engines (Google, Bing, Yahoo, DuckDuckGo)
User-agent: *
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/
Disallow: /cgi-bin/
Disallow: /search/
Disallow: /search?*
Disallow: /*?*
Disallow: /*?
Disallow: /*&
# Allow crawling of assets required for UI rendering
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.svg
Allow: /*.webp
# Allow crawling for prioritized target language directories
Allow: /en-us/
Allow: /zh-hans/
Allow: /zh-hant/
Allow: /ja-jp/
Allow: /ko-kr/
Allow: /ru-ru/
Allow: /es-es/
Allow: /pt-br/
Allow: /vi-vn/

# 2. Baidu Bot (Đặc quyền cho thị trường Trung Quốc - Zh-Hans / Zh-Hant)
User-agent: Baiduspider
User-agent: Baiduspider-image
User-agent: Baiduspider-video
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/
Disallow: /*?*
Allow: /zh-hans/
Allow: /zh-hant/
Allow: /*.css
Allow: /*.js

# 3. Naver Bot (Đặc quyền cho thị trường Hàn Quốc - Ko)
User-agent: Yeti
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/
Disallow: /*?*
Allow: /ko-kr/
Allow: /*.css
Allow: /*.js

# 4. Yandex Bot (Đặc quyền cho thị trường Nga & Đông Âu - Ru)
User-agent: Yandex
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/
Disallow: /*?*
Allow: /ru-ru/
Allow: /*.css
Allow: /*.js`;

export const NON_PRODUCTION_ROBOTS_TXT = `User-agent: *
Disallow: /
`;
