"use client";

import { Button } from "@/components/ui/button";
import { analytics, CTAAction, CTALocation } from "@/lib/analytics";
import { forwardRef, ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

interface TrackedButtonProps extends ButtonProps {
  trackingAction: CTAAction;
  trackingLocation: CTALocation;
  trackingVariant: string;
  trackingTier?: 'free' | 'pro';
}

export const TrackedButton = forwardRef<HTMLButtonElement, TrackedButtonProps>(
  ({ trackingAction, trackingLocation, trackingVariant, trackingTier, onClick, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      analytics.ctaClick(trackingAction, trackingLocation, trackingVariant, trackingTier);
      onClick?.(e);
    };

    return (
      <Button ref={ref} onClick={handleClick} {...props}>
        {children}
      </Button>
    );
  }
);

TrackedButton.displayName = "TrackedButton";
