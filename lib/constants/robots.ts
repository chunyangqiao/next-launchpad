export const PRODUCTION_ROBOTS_RULES = `# Target Languages (In Priority Order):
# EN, ZH, KO, RU
# --------------------------------------------------

# 1. Rules for Global Search Engines (Google, Bing, Yahoo, DuckDuckGo)
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
Allow: /en/
Allow: /zh/
Allow: /ja/
Allow: /ko/
Allow: /ru/

# 2. Baidu Bot
User-agent: Baiduspider
User-agent: Baiduspider-image
User-agent: Baiduspider-video
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/
Disallow: /*?*
Allow: /zh/
Allow: /*.css
Allow: /*.js

# 3. Naver Bot
User-agent: Yeti
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/
Disallow: /*?*
Allow: /ko/
Allow: /*.css
Allow: /*.js

# 4. Yandex Bot
User-agent: Yandex
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/
Disallow: /*?*
Allow: /ru/
Allow: /*.css
Allow: /*.js`;

export const NON_PRODUCTION_ROBOTS_TXT = `User-agent: *
Disallow: /
`;
