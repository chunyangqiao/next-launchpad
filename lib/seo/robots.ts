/**
 * @description 生产环境 robots.txt 正文
 *
 * - Allow 的语言目录（/en-us/ /ja-jp/ …）只是显式声明，Allow 本来就是默认值，没有实际约束。
 * - Disallow: /*?*` 会挡 /_next/image?url=… 这类带查询串的图片地址。Googlebot 按「最长规则优先」，
 * - Allow: /*.png` `/*.webp` 比 `/*?*` 长，只要 url= 里带扩展名就仍放行
 * - Baidu / Yeti / Yandex 三组没有图片 Allow，会拿不到 /_next/image。
 *
 * ⚠️ 注意:
 *  - 不要把页面路径加进 Disallow：爬虫读不到被挡的页面，也就看不到页面上的 noindex，已收录的私有 URL 反而永远删不掉。
 *  - 不要过滤 /_next/: 页面使用了 'use client' 时， 过滤掉 /_next/static 等于让 Googlebot 渲染出空页面。
 */
export const PRODUCTION_ROBOTS_TXT = `# --------------------------------------------------
# Robots.txt for www.example.com
# Primary Domain: www.example.com
# Target Languages (In Priority Order):
# EN, ZH-Hans, ZH-Hant, JA, KO, RU, ES, PT, VI
# --------------------------------------------------

# 1. Rules for Global Search Engines (Google, Bing, Yahoo)
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

# 2. Baidu Bot
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

# 3. Naver Bot
User-agent: Yeti
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/
Disallow: /*?*
Allow: /ko-kr/
Allow: /*.css
Allow: /*.js

# 4. Yandex Bot
User-agent: Yandex
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/
Disallow: /*?*
Allow: /ru-ru/
Allow: /*.css
Allow: /*.js

# --------------------------------------------------
# Multilingual Sitemap Index Declarations
# Absolute URL: https://www.example.com
# --------------------------------------------------
Sitemap: https://www.example.com/sitemap.xml
`;

export const NON_PRODUCTION_ROBOTS_TXT = `User-agent: *
Disallow: /
`;
