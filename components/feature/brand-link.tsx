import { Rocket } from "lucide-react";
import Link from "next/link";

import { BRAND } from "@/lib/constants/brand";

export function BrandLink({ href }: { href: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 font-bold tracking-tight">
      <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
        <Rocket aria-hidden="true" className="size-5" />
      </span>
      {BRAND}
    </Link>
  );
}
