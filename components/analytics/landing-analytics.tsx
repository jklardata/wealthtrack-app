"use client";

import { ScrollTracker } from "./scroll-tracker";
import { UTMCapture } from "./utm-capture";

interface LandingAnalyticsProps {
  variant: string;
}

export function LandingAnalytics({ variant }: LandingAnalyticsProps) {
  return (
    <>
      <UTMCapture variant={variant} />
      <ScrollTracker variant={variant} />
    </>
  );
}
