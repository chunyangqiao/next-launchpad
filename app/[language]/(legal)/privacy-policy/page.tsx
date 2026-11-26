import { notFound } from "next/navigation";

import { LegalDocument } from "../_components/legal-document";
import { isLocale } from "@/lib/constants/seo";
import { pageMetadata } from "@/lib/seo/metadata";

const privacySections = [
  {
    title: "1. Information we collect",
    paragraphs: [
      "[Company name] may collect information that you provide directly, information generated when you use the service, and information received from connected services.",
    ],
    items: [
      "Account details, such as your name, email address, and profile preferences.",
      "Usage information, such as pages visited, features used, device details, and diagnostic logs.",
      "Transaction or support information needed to deliver the service and respond to requests.",
    ],
  },
  {
    title: "2. How we use information",
    paragraphs: [
      "Describe the specific purposes for which your organization processes personal information. Avoid collecting data merely because it might be useful later.",
    ],
    items: [
      "Provide, maintain, and secure the service.",
      "Communicate service updates and respond to support requests.",
      "Understand usage, prevent abuse, and improve the product.",
      "Meet legal obligations and enforce our terms.",
    ],
  },
  {
    title: "3. Sharing and disclosures",
    paragraphs: [
      "We may share information with service providers that process it on our behalf, when required by law, to protect users and the service, or as part of a reviewed business transaction.",
      "Replace this summary with the actual categories of recipients, the purposes for each transfer, and any international transfer safeguards that apply to your product.",
    ],
  },
  {
    title: "4. Retention and security",
    paragraphs: [
      "Personal information should be kept only for as long as necessary for the purposes described in this policy, subject to legal, security, and backup requirements.",
      "Describe your retention periods and the technical and organizational measures used to protect personal information. Do not imply that any system can be guaranteed completely secure.",
    ],
  },
  {
    title: "5. Your choices and rights",
    paragraphs: [
      "Depending on your location, you may have rights to access, correct, delete, restrict, or transfer your personal information, and to object to certain processing.",
      "Provide the actual method for exercising those rights, your identity-verification process, any response timeframe, and details for contacting a relevant privacy regulator where applicable.",
    ],
  },
  {
    title: "6. Contact us",
    paragraphs: [
      "For questions about this policy or your personal information, contact [Company name] at [privacy email], [postal address]. Identify the data controller and representative required in your jurisdictions.",
    ],
  },
] as const;

export async function generateMetadata({ params }: PageProps<"/[language]/privacy-policy">) {
  const { language } = await params;

  if (!isLocale(language)) {
    notFound();
  }

  return pageMetadata({
    language,
    path: "/privacy-policy",
    title: "Privacy Policy",
    description: "A template privacy policy for explaining data practices and user rights.",
  });
}

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      summary="Use this template to describe what personal information your product collects, why it is used, and the choices available to the people who use it."
      lastUpdated="[Month Day, Year]"
      sections={privacySections}
    />
  );
}
