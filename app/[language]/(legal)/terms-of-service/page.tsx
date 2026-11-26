import { notFound } from "next/navigation";

import { LegalDocument } from "../_components/legal-document";
import { isLocale } from "@/lib/constants/seo";
import { pageMetadata } from "@/lib/seo/metadata";

const termsSections = [
  {
    title: "1. Agreement and eligibility",
    paragraphs: [
      "These Terms of Service govern access to and use of [product name] provided by [Company name]. Users should be able to understand what they are agreeing to before creating an account or using the service.",
      "Replace this section with the minimum age, authority, account requirements, and acceptance mechanism that apply to your product.",
    ],
  },
  {
    title: "2. Using the service",
    paragraphs: [
      "You are responsible for your account credentials, for activity performed through your account, and for using the service in accordance with applicable law.",
    ],
    items: [
      "Do not attempt to bypass security, overload systems, or interfere with other users.",
      "Do not upload unlawful, harmful, infringing, or deceptive content.",
      "Do not use the service to violate another person's rights or applicable regulations.",
    ],
  },
  {
    title: "3. Accounts, plans, and payments",
    paragraphs: [
      "Describe how accounts are created and closed, how subscriptions renew, what taxes or fees may apply, and which cancellation or refund rules are available.",
      "If the starter does not offer accounts or payments yet, remove this section rather than presenting unsupported commitments.",
    ],
  },
  {
    title: "4. Your content and our service",
    paragraphs: [
      "You retain ownership of content you submit. State the limited license the service needs to host, display, process, and transmit that content so the product can operate.",
      "The product, software, documentation, branding, and related materials remain owned by [Company name] and its licensors, except for rights expressly granted to users.",
    ],
  },
  {
    title: "5. Availability and disclaimers",
    paragraphs: [
      "Describe the service as accurately as possible, including planned maintenance, support commitments, and any availability limitations. Do not promise uptime or performance guarantees unless they are actually offered.",
      "Add warranty disclaimers, liability limitations, indemnities, and consumer-law carve-outs only after review for the jurisdictions in which you operate.",
    ],
  },
  {
    title: "6. Changes, termination, and contact",
    paragraphs: [
      "Explain how updates to these terms will be communicated, when they take effect, and when access may be suspended or terminated.",
      "Questions about these terms can be sent to [legal email]. Also specify the governing law, dispute process, and [Company name] legal entity details required for your business.",
    ],
  },
] as const;

export async function generateMetadata({ params }: PageProps<"/[language]/terms-of-service">) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  return pageMetadata({
    language,
    path: "/terms-of-service",
    title: "Terms of Service",
    description: "A template agreement for the use of a product or service.",
  });
}

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      title="Terms of Service"
      summary="Use this template to explain the rules for using your product, the responsibilities of account holders, and the limits of the service."
      lastUpdated="[Month Day, Year]"
      sections={termsSections}
    />
  );
}
