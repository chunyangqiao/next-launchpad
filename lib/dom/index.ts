interface ScheduleAfterLoadProps {
  callback: () => void;
  options?: {
    idleTimeout?: number;
  };
}

export function scheduleAfterLoad({ callback, options }: ScheduleAfterLoadProps): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  if (typeof window.requestIdleCallback === "function") {
    const idleCallback = window.requestIdleCallback(callback, {
      timeout: options?.idleTimeout,
    });

    return () => window.cancelIdleCallback(idleCallback);
  }

  const timeout = window.setTimeout(callback, options?.idleTimeout ?? 1);
  return () => window.clearTimeout(timeout);
}
