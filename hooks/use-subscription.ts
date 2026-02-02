"use client";

import { useState, useEffect } from "react";
import type { EntitlementTier } from "@/lib/types";

interface SubscriptionData {
  entitlement_tier: EntitlementTier;
  status: string;
  current_period_end: string | null;
  isLoading: boolean;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData>({
    entitlement_tier: "free",
    status: "active",
    current_period_end: null,
    isLoading: true,
  });

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch("/api/stripe/subscription");
        const data = await response.json();

        console.log('useSubscription - fetched data:', data);

        setSubscription({
          entitlement_tier: data.entitlement_tier || "free",
          status: data.status || "active",
          current_period_end: data.current_period_end || null,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setSubscription((prev) => ({ ...prev, isLoading: false }));
      }
    }

    fetchSubscription();
  }, []);

  const isPro = subscription.entitlement_tier === "pro" || subscription.entitlement_tier === "premium";
  const isFree = subscription.entitlement_tier === "free";

  return {
    ...subscription,
    isPro,
    isFree,
  };
}
