import * as React from "react";

import { Field } from "@base-ui/react/field";
import { cn } from "cn";

type StyledProps<T extends React.ElementType> = Omit<React.ComponentProps<T>, "className"> & {
  className?: string;
};

export function FieldRoot({ className, ...props }: StyledProps<typeof Field.Root>) {
  return <Field.Root {...props} className={cn("grid gap-2", className)} />;
}

export function FieldLabel({ className, ...props }: StyledProps<typeof Field.Label>) {
  return <Field.Label {...props} className={cn("text-sm font-semibold", className)} />;
}

export function FieldDescription({ className, ...props }: StyledProps<typeof Field.Description>) {
  return (
    <Field.Description {...props} className={cn("text-sm text-muted-foreground", className)} />
  );
}

export function FieldError({ className, ...props }: StyledProps<typeof Field.Error>) {
  return <Field.Error {...props} className={cn("text-sm font-medium text-danger", className)} />;
}
