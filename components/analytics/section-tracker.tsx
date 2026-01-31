"use client";

import { useEffect, useRef } from "react";
import { analytics } from "@/lib/analytics";

interface SectionTrackerProps {
  sectionId: string;
  sectionType: 'pricing' | 'testimonial' | 'feature';
  variant: string;
  featureName?: string;
  children: React.ReactNode;
}

export function SectionTracker({
  sectionId,
  sectionType,
  variant,
  featureName,
  children
}: SectionTrackerProps) {
  const tracked = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !tracked.current) {
            tracked.current = true;

            switch (sectionType) {
              case 'pricing':
                analytics.pricingView(variant);
                break;
              case 'testimonial':
                analytics.testimonialView(variant);
                break;
              case 'feature':
                if (featureName) {
                  analytics.featureView(featureName, variant);
                }
                break;
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [sectionType, variant, featureName]);

  return (
    <div ref={sectionRef} id={sectionId}>
      {children}
    </div>
  );
}
