import * as React from "react";

import { cn } from "cn";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props} className={cn("rounded-2xl border border-line bg-surface p-6", className)} />
  );
}
