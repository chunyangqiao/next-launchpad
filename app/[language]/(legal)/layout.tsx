import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { BrandLink } from "@/components/feature/brand-link";

const legalPages = [
  { href: "about-us", label: "About" },
  { href: "privacy-policy", label: "Privacy" },
  { href: "terms-of-service", label: "Terms" },
  { href: "cookie-policy", label: "Cookies" },
] as const;

export default async function LegalRoutesSharedLayout({
  children,
  params,
}: LayoutProps<"/[language]">) {
  const { language } = await params;
  const home = `/${language}`;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5">
        <BrandLink href={home} />
        <Link
          href={home}
          className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to home
        </Link>
      </header>

      <main className="flex-1 py-12 sm:py-16">{children}</main>

      <footer className="grid gap-5 border-t border-line py-6 text-sm text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-center">
        <p>Sample legal pages for the Next.js starter. Replace with reviewed policies.</p>
        <nav aria-label="Legal pages" className="flex flex-wrap gap-x-5 gap-y-2 font-semibold">
          {legalPages.map(({ href, label }) => (
            <Link key={href} href={`${home}/${href}`} className="hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
