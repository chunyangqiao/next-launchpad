import { ArrowRight, Layers3, Palette, PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StarterPreview } from "./_components/starter-preview";
import { BrandLink } from "@/components/feature/brand-link";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isLocale, SEO_DEFAULTS_BY_LOCALE, SIGNUP_PATH } from "@/lib/constants/seo";
import { homeJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

const features = [
  {
    icon: Layers3,
    title: "Composable UI",
    description: "Themeable Base UI controls and Tailwind styles you can reuse across pages.",
  },
  {
    icon: PanelsTopLeft,
    title: "Account screens",
    description: "Sign-in, registration, and password reset examples with client-side validation.",
  },
  {
    icon: Palette,
    title: "App fundamentals",
    description: "System-aware themes, language-prefixed routes, and SEO metadata to build on.",
  },
];

const questions = [
  {
    question: "Can I sign in or create a real account?",
    answer:
      "Not yet. The account screens are frontend previews. They validate sample inputs locally and never send or store them.",
  },
  {
    question: "How do I change the look and feel?",
    answer:
      "Update the light and dark tokens in app/theme.css. The starter follows your system theme by default.",
  },
  {
    question: "Where do I start building?",
    answer:
      "Run pnpm dev, then edit the landing page under app/[language]/(landing). Import the controls you need from components/ui.",
  },
];

export async function generateMetadata({ params }: PageProps<"/[language]">) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  const { title, description } = SEO_DEFAULTS_BY_LOCALE[language];

  return pageMetadata({
    language,
    title: { absolute: title },
    description,
  });
}

export default async function HomePage({ params }: PageProps<"/[language]">) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  const { description } = SEO_DEFAULTS_BY_LOCALE[language];
  const home = `/${language}`;
  const signIn = `${home}/sign-in`;
  const signUp = `${home}${SIGNUP_PATH}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <header className="flex min-h-18 flex-wrap items-center justify-between gap-3 border-b border-line py-3">
        <BrandLink href={home} />
        <nav
          aria-label="On this page"
          className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground sm:flex"
        >
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
        </nav>
        <Link href={signIn} className={buttonVariants({ variant: "outline", size: "small" })}>
          Sign in
        </Link>
      </header>

      <main>
        <section className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-12">
          <div>
            <Badge className="font-mono tracking-wide uppercase">
              <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
              The Next.js starter kit
            </Badge>
            <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.06em]">
              Start with the <span className="sm:block">good stuff.</span>
            </h1>
            <p className="mt-5 max-w-md text-base/7 text-muted-foreground sm:text-lg/8">
              {description} Build your idea instead of rebuilding the basics.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={signUp} className={buttonVariants()}>
                Get started
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <a href="#features" className={buttonVariants({ variant: "outline" })}>
                See what&apos;s included
              </a>
            </div>
          </div>
          <StarterPreview />
        </section>

        <section id="features" className="scroll-mt-6 border-t border-line py-12 sm:py-16">
          <p className="font-mono text-xs font-semibold tracking-widest text-accent-text">
            01 / FEATURES
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            The essentials, already wired.
          </h2>
          <ul className="mt-7 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title}>
                <Card className="h-full">
                  <span className="inline-grid size-10 place-items-center rounded-lg bg-muted text-accent-text">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-sm/6 text-muted-foreground">{description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="faq"
          className="grid scroll-mt-6 gap-6 border-t border-line py-12 sm:py-16 lg:grid-cols-[2fr_3fr] lg:gap-12"
        >
          <div>
            <p className="font-mono text-xs font-semibold tracking-widest text-accent-text">
              02 / FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Good to know.</h2>
          </div>
          <Accordion className="overflow-hidden rounded-2xl border border-line bg-surface">
            {questions.map(({ question, answer }) => (
              <AccordionItem
                key={question}
                value={question}
                className="border-b border-line last:border-b-0"
              >
                <AccordionHeader>
                  <AccordionTrigger>{question}</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>{answer}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-muted-foreground">
        <BrandLink href={home} />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p>Built with Next.js, Base UI, and Tailwind CSS.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-4 font-semibold">
            <Link href={`${home}/about-us`} className="hover:text-foreground">
              About
            </Link>
            <Link href={`${home}/privacy-policy`} className="hover:text-foreground">
              Privacy
            </Link>
            <Link href={`${home}/terms-of-service`} className="hover:text-foreground">
              Terms
            </Link>
            <Link href={`${home}/cookie-policy`} className="hover:text-foreground">
              Cookies
            </Link>
          </nav>
        </div>
      </footer>
      <JsonLd data={homeJsonLd(language)} />
    </div>
  );
}
