"use client";

import { useEffect, useRef } from "react";
import { analytics } from "@/lib/analytics";

interface ScrollTrackerProps {
  variant: string;
}

export function ScrollTracker({ variant }: ScrollTrackerProps) {
  const tracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (window.scrollY / scrollHeight) * 100;

      const milestones = [25, 50, 75, 100] as const;

      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !tracked.current.has(milestone)) {
          tracked.current.add(milestone);
          analytics.scrollDepth(milestone, variant);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  return null;
}
