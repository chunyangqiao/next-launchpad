import { NOINDEX_METADATA } from "@/lib/constants/seo";

export const metadata = NOINDEX_METADATA;

export default function AuthRoutesSharedLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-full">{children}</div>;
}
