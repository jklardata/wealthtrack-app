"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { analytics, CTAAction, CTALocation } from "@/lib/analytics";
import { ReactNode, ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

interface TrackedLinkProps {
  href: string;
  trackingAction: CTAAction;
  trackingLocation: CTALocation;
  trackingVariant: string;
  trackingTier?: 'free' | 'pro';
  children: ReactNode;
  buttonProps?: ButtonProps;
  className?: string;
}

export function TrackedLink({
  href,
  trackingAction,
  trackingLocation,
  trackingVariant,
  trackingTier,
  children,
  buttonProps,
  className,
}: TrackedLinkProps) {
  const handleClick = () => {
    analytics.ctaClick(trackingAction, trackingLocation, trackingVariant, trackingTier);
  };

  if (buttonProps) {
    return (
      <Link href={href} onClick={handleClick} className={className}>
        <Button {...buttonProps}>{children}</Button>
      </Link>
    );
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
