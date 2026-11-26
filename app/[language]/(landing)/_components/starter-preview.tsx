import { CircleCheck, Terminal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const starterFiles = ["Landing page", "Account screens", "Theme tokens"];

export function StarterPreview() {
  return (
    <div className="rounded-3xl border border-line bg-muted bg-[radial-gradient(var(--control)_0.75px,transparent_0.75px)] bg-size-[16px_16px] p-4 sm:p-8 lg:p-10">
      <Card className="mx-auto max-w-md overflow-hidden p-0 shadow-xl shadow-black/10">
        <div className="flex items-center justify-between gap-2 border-b border-line px-5 py-3.5">
          <span className="text-sm font-bold">Starter workspace</span>
          <Badge className="bg-muted font-mono text-muted-foreground">Next.js</Badge>
        </div>
        <div className="grid gap-3 p-5">
          <ul className="grid gap-3">
            {starterFiles.map((file) => (
              <li
                key={file}
                className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm font-semibold"
              >
                <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-accent-text" />
                {file}
              </li>
            ))}
          </ul>
          <div className="rounded-lg bg-ink px-3.5 py-3 text-ink-foreground">
            <div className="flex items-center gap-2 font-mono text-xs tracking-wide text-ink-muted">
              <Terminal aria-hidden="true" className="size-3.5 text-accent" />
              Run locally
            </div>
            <code className="mt-2 block text-sm">pnpm dev</code>
          </div>
        </div>
      </Card>
    </div>
  );
}
