"use client";

import { useEffect } from "react";
import { storeUTMParams, analytics } from "@/lib/analytics";

interface UTMCaptureProps {
  variant: string;
}

export function UTMCapture({ variant }: UTMCaptureProps) {
  useEffect(() => {
    // Store UTM params on page load
    storeUTMParams();

    // Track page view with variant
    analytics.pageView(variant);
  }, [variant]);

  return null;
}
