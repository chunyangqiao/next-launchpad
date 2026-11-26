"use client";

import * as React from "react";

import { scheduleAfterLoad } from "@/lib/dom";

interface IdleRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  idleTimeout?: number;
}

export function IdleRender({ children, fallback = null, idleTimeout }: IdleRenderProps) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(
    () => scheduleAfterLoad({ callback: () => setReady(true), options: { idleTimeout } }),
    [idleTimeout],
  );

  return <>{ready ? children : fallback}</>;
}
