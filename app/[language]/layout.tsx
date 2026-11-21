import * as React from "react";

import { notFound } from "next/navigation";

import { SEO_CONFIG } from "@/lib/seo";

export function generateStaticParams() {
  return SEO_CONFIG.locales.map((language) => ({ language }));
}

export default async function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;

  if (!SEO_CONFIG.locales.includes(language)) {
    notFound();
  }

  return children;
}
