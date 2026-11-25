import * as React from "react";

import { cn } from "cn";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold",
        className,
      )}
    />
  );
}
