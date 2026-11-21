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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## SEO

Set `NEXT_PUBLIC_SITE_URL` to the public HTTP(S) origin before generating canonical
URLs, hreflang links, structured data, or sitemap entries. Production robots rules
are enabled with `NEXT_PUBLIC_APP_ENV=production` (the legacy
`NEXT_PUBLIC_ENV=production` value is also supported).

Project-specific values live in `lib/constants`: branding, locales, route SEO
text, noindex prefixes, sitemap routes, social links, and robots directives. The
generic implementation and public helpers are exposed from `lib/seo`. Shared
SEO types live in `types/seo`, split between base value types and SEO domain
contracts. Localized pages under `app/[language]` can use `routeMetadata` for
table-driven metadata or call `buildMetadata` directly for data-driven pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
