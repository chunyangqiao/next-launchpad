import * as React from "react";

import { notFound } from "next/navigation";

import { isLocale, SUPPORTED_LOCALES } from "@/lib/constants/seo";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((language) => ({ language }));
}

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}

export default async function LanguageLayout(props: LanguageLayoutProps) {
  const { children, params } = props;
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  return children;
}
