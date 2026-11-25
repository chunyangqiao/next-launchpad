import * as React from "react";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

type InputProps = Omit<React.ComponentProps<typeof InputPrimitive>, "className"> & {
  className?: string;
};

export function Input({ className, ...props }: InputProps) {
  return (
    <InputPrimitive
      {...props}
      className={cn(
        "h-11 w-full rounded-lg border border-control bg-surface px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-danger",
        className,
      )}
    />
  );
}
