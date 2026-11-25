import * as React from "react";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "cn";
import { Check, Minus } from "lucide-react";

type CheckboxProps = Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "className"> & {
  className?: string;
};

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      className={cn(
        "inline-grid size-5 shrink-0 cursor-pointer place-items-center rounded border border-control bg-surface text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text data-checked:border-transparent data-checked:bg-accent data-disabled:cursor-not-allowed data-disabled:opacity-50 data-indeterminate:border-transparent data-indeterminate:bg-accent",
        className,
      )}
    >
      <CheckboxPrimitive.Indicator className="group">
        <Check aria-hidden="true" className="size-3.5 group-data-indeterminate:hidden" />
        <Minus aria-hidden="true" className="hidden size-3.5 group-data-indeterminate:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
