import { notFound } from "next/navigation";

import { LegalDocument } from "../_components/legal-document";
import { isLocale } from "@/lib/constants/seo";
import { pageMetadata } from "@/lib/seo/metadata";

const aboutSections = [
  {
    title: "Our story",
    paragraphs: [
      "[Company name] was created to solve a clear problem: [describe the problem your customers face]. Start with the moment that inspired the product and the outcome you set out to improve.",
      "Replace this sample with a concise, factual account of who founded the company, when it began, and what has changed since then. Avoid claims that cannot be supported.",
    ],
  },
  {
    title: "What we do",
    paragraphs: [
      "We build [short product description] for [primary audience]. The goal is to help people [key benefit] without making their workflow more complicated.",
      "Describe your current offering, the problems it handles, and the customers or use cases it serves best.",
    ],
    items: [
      "[Core capability one] with a short explanation of its practical value.",
      "[Core capability two] with a short explanation of its practical value.",
      "[Core capability three] with a short explanation of its practical value.",
    ],
  },
  {
    title: "Our principles",
    paragraphs: [
      "Use this section for a small number of principles that genuinely shape product and business decisions, not generic values.",
    ],
    items: [
      "Clarity over complexity: make the product and its tradeoffs easy to understand.",
      "Useful by default: solve the common case well before adding optional configuration.",
      "Trust through accountability: communicate limitations, protect customer data, and own mistakes.",
    ],
  },
  {
    title: "The team",
    paragraphs: [
      "Introduce the people behind the product, their relevant experience, and how the team is organized. For a distributed or growing team, mention locations and hiring status only if they are current.",
      "Add links to individual profiles or a careers page here if they are already published elsewhere on the site.",
    ],
  },
  {
    title: "Contact us",
    paragraphs: [
      "For product questions, partnerships, or press inquiries, contact [Company name] at [contact email].",
      "If your organization has a registered business address or customer support channel, add the appropriate details here and keep them consistent with the legal policies.",
    ],
  },
] as const;

export async function generateMetadata({ params }: PageProps<"/[language]/about-us">) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  return pageMetadata({
    language,
    path: "/about-us",
    title: "About Us",
    description:
      "A template company introduction for sharing the product story, mission, and team.",
  });
}

export default function AboutUsPage() {
  return (
    <LegalDocument
      title="About Us"
      summary="Use this template to introduce your company, explain what the product is for, and give visitors a clear sense of the people and principles behind it."
      lastUpdated="[Month Day, Year]"
      sections={aboutSections}
    />
  );
}
