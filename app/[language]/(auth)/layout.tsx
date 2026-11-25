import { ArrowLeft, CircleCheck } from "lucide-react";
import Link from "next/link";

import { BrandLink } from "@/components/brand-link";
import { NOINDEX_METADATA } from "@/lib/constants/seo";

export const metadata = NOINDEX_METADATA;

const highlights = ["Reusable Base UI fields", "Responsive account pages", "Light and dark themes"];

export default async function AuthRoutesSharedLayout({
  children,
  params,
}: LayoutProps<"/[language]">) {
  const { language } = await params;
  const home = `/${language}`;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3 py-5">
        <BrandLink href={home} />
        <Link
          href={home}
          className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to home
        </Link>
      </header>
      <main className="flex flex-1 items-center py-4 sm:py-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-[2fr_3fr]">
          <aside className="hidden flex-col justify-between gap-12 bg-ink bg-[radial-gradient(var(--color-ink-grid)_1px,transparent_1px)] bg-size-[16px_16px] p-10 text-ink-foreground lg:flex">
            <p className="font-mono text-xs font-semibold tracking-widest text-accent">
              01 / ACCOUNT FLOWS
            </p>
            <div className="rounded-2xl bg-ink p-2">
              <p className="text-4xl font-bold tracking-tight">Make it yours.</p>
              <p className="mt-4 max-w-xs text-sm/6 text-ink-muted">
                Start with the account screens, then connect the authentication provider that fits
                your project.
              </p>
              <ul className="mt-8 grid gap-3 text-sm">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2.5">
                    <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-accent" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-ink-muted">A starting point, not a finished product.</p>
          </aside>
          <div className="flex items-center px-5 py-8 sm:px-10 sm:py-14">{children}</div>
        </div>
      </main>
      <footer className="py-5 text-center text-xs text-muted-foreground">
        Next.js starter template
      </footer>
    </div>
  );
}
