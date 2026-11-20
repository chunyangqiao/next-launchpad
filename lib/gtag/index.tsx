import Script from "next/script";

import type { EventParams } from "@/types/gtag";
import type { ScriptProps } from "next/script";

const MEASUREMENT_ID_PATTERN = /^G-[A-Za-z0-9]+$/;

export function getGoogleAnalyticsMeasurementId() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) {
    return undefined;
  }
  if (!MEASUREMENT_ID_PATTERN.test(measurementId)) {
    return undefined;
  }
  return measurementId;
}

interface GoogleAnalyticsProps {
  measurementId?: string;
  strategy?: ScriptProps["strategy"];
}

export function GoogleAnalyticsScript(props: GoogleAnalyticsProps) {
  const { strategy = "lazyOnload", measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID } =
    props;

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script id="google-analytics-init" strategy={strategy}>
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag(){window.dataLayer.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', '${measurementId}');
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy={strategy}
      />
    </>
  );
}

export function sendEvent(name: string, params?: EventParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", name, params);
}
