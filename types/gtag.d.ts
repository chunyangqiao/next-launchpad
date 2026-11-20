export type EventParams = Record<string, string | number | boolean>;

export type Gtag = {
  (command: "js", date: Date): void;
  (command: "config", measurementId: string, params?: EventParams): void;
  (command: "event", name: string, params?: EventParams): void;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}
