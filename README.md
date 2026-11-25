This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Edit the localized home page in `app/[language]/(landing)/page.tsx`. The
`(landing)` and `(auth)` route groups organize pages without changing their URLs.

`proxy.ts` adds the default language to unprefixed page URLs. It treats two-letter
language codes, optionally with script and/or region subtags, as language
prefixes. Unsupported prefixes are replaced with the default language, keeping
the rest of the path and the query string.

## Styling

`app/globals.css` loads Tailwind, animation utilities, and `app/theme.css`, which
defines the theme tokens and base styles. The root layout uses `next-themes`
to set `data-theme` on `<html>` and follows the system preference by default.

## SEO

Set `NEXT_PUBLIC_SITE_URL` to the public HTTP(S) origin at build time. Canonical
URLs, hreflang, structured data, and the sitemap use this origin, not the request
host. Without a valid origin, URL-dependent page tags are omitted and the sitemap
returns `503`.

- **Page metadata:** `app/[language]/layout.tsx` sets `<html lang>` and uses
  `SEO_DEFAULTS_BY_LOCALE` from `lib/constants/seo.ts` for site defaults. For
  localized pages, call `pageMetadata` from the page's `generateMetadata` with
  its language, title, description, and path (without the language prefix).
  If a page is only available in some configured locales, pass those as `locales`
  when building its metadata and sitemap entry. Auth pages inherit `noindex`
  from their layout.
- **Structured data:** The home page renders `<JsonLd data={homeJsonLd(language)} />`.
  Other pages can import the relevant schema builder from `lib/seo/json-ld.tsx`.
- **Crawlers:** Add public routes in `app/sitemap.xml/route.ts`. Supply `lastModified`
  only when you know when the page changed. Paths in `NO_INDEX_PREFIXES` are
  excluded. `app/robots.txt/route.ts` blocks crawling unless `NEXT_PUBLIC_APP_ENV`
  is `production` (or, if unset, `NEXT_PUBLIC_ENV` is `production`). Production
  uses the directives in `lib/constants/robots.ts` and returns `503` if the origin
  is missing or invalid.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
