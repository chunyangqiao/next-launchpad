import * as React from "react";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "cn";
import { ChevronDown } from "lucide-react";

const { Root: Accordion, Item: AccordionItem, Header: AccordionHeader } = AccordionPrimitive;

export { Accordion, AccordionHeader, AccordionItem };

type AccordionTriggerProps = Omit<
  React.ComponentProps<typeof AccordionPrimitive.Trigger>,
  "className"
> & { className?: string };

export function AccordionTrigger({ children, className, ...props }: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Trigger
      {...props}
      className={cn(
        "group flex w-full items-center justify-between gap-4 rounded-lg px-4 py-4 text-left font-semibold hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-text sm:px-5",
        className,
      )}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground motion-safe:transition-transform group-aria-expanded:rotate-180"
      />
    </AccordionPrimitive.Trigger>
  );
}

type AccordionPanelProps = Omit<
  React.ComponentProps<typeof AccordionPrimitive.Panel>,
  "className"
> & {
  className?: string;
};

export function AccordionPanel({ className, ...props }: AccordionPanelProps) {
  return (
    <AccordionPrimitive.Panel
      {...props}
      className={cn("px-4 pt-1 pb-5 text-sm/6 text-muted-foreground sm:px-5", className)}
    />
  );
}
