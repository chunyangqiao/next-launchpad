import { DO_NOT_NEED_INDEX_PAGE_METADATA } from "@/lib/constants/seo";

export const metadata = DO_NOT_NEED_INDEX_PAGE_METADATA;

interface AuthRoutesSharedProps {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}

export default async function AuthRoutesSharedLayout(props: AuthRoutesSharedProps) {
  return <div className={"min-h-full"}>{props.children}</div>;
}
