import { notFound } from "next/navigation";

import { LegalDocument } from "../_components/legal-document";
import { isLocale } from "@/lib/constants/seo";
import { pageMetadata } from "@/lib/seo/metadata";

const cookieSections = [
  {
    title: "1. What this policy covers",
    paragraphs: [
      "This template explains how [Company name] may use cookies and similar technologies on [product name]. Replace it with an accurate inventory of the technologies your deployed application actually sets or reads.",
    ],
  },
  {
    title: "2. Technologies you may use",
    paragraphs: [
      "Classify each technology by purpose and disclose its provider, name, duration, and whether it is strictly necessary or optional.",
    ],
    items: [
      "Essential storage that supports security, authentication, or requested functionality.",
      "Preference storage that remembers language, display, or accessibility choices.",
      "Analytics technologies that help measure and improve product usage.",
      "Marketing technologies used for personalized advertising or campaign measurement.",
    ],
  },
  {
    title: "3. Google Analytics and other providers",
    paragraphs: [
      "The starter includes Google Analytics integration when a measurement ID is configured. Before enabling it, document the provider, data sent, retention settings, and lawful basis or consent requirements that apply to your deployment.",
      "List every additional analytics, error monitoring, support, advertising, or embedded-content provider that can access device identifiers or personal information.",
    ],
  },
  {
    title: "4. Managing preferences",
    paragraphs: [
      "Explain how visitors can accept, reject, or withdraw optional technologies. The controls and preference record must match the technologies that run on your site.",
      "Browser settings may also allow users to block or delete cookies. Blocking essential storage can affect authentication and requested features.",
    ],
  },
  {
    title: "5. Retention and updates",
    paragraphs: [
      "Document how long each cookie or local-storage value remains available and when its expiration renews. Review this policy whenever you add or remove a vendor or technology.",
      "For questions about this policy, contact [privacy email]. Publish the effective date and a clear summary of any material changes.",
    ],
  },
] as const;

export async function generateMetadata({ params }: PageProps<"/[language]/cookie-policy">) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  return pageMetadata({
    language,
    path: "/cookie-policy",
    title: "Cookie Policy",
    description: "A template cookie policy for explaining browser storage and tracking choices.",
  });
}

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      title="Cookie Policy"
      summary="Use this template to document the cookies, local storage, analytics, and similar technologies used by your product."
      lastUpdated="[Month Day, Year]"
      sections={cookieSections}
    />
  );
}
