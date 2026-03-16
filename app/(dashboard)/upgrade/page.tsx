"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/UpgradeButton";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICING_TIERS } from "@/lib/stripe-config";
import type { EntitlementTier } from "@/lib/types";

type BillingInterval = "monthly" | "yearly";

interface PriceIds {
  pro: { monthly: string; yearly: string };
}

function PricingContent() {
  const searchParams = useSearchParams();
  const [currentTier, setCurrentTier] = useState<EntitlementTier>("free");
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const [priceIds, setPriceIds] = useState<PriceIds | null>(null);
  const canceled = searchParams.get("canceled");
  const promoCode = searchParams.get("promo") || undefined;

  useEffect(() => {
    async function fetchData() {
      try {
        const [subscriptionRes, pricesRes] = await Promise.all([
          fetch("/api/stripe/subscription"),
          fetch("/api/stripe/prices"),
        ]);

        const subscriptionData = await subscriptionRes.json();
        const pricesData = await pricesRes.json();

        if (subscriptionData.entitlement_tier) {
          setCurrentTier(subscriptionData.entitlement_tier);
        }
        setPriceIds(pricesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const getPriceId = (tier: "pro"): string => {
    if (!priceIds) return "";
    return billingInterval === "monthly" ? priceIds.pro.monthly : priceIds.pro.yearly;
  };

  const handleCancelSubscription = async () => {
    // Ask if they want immediate downgrade (for testing) or cancel at period end
    const immediateDowngrade = confirm(
      "Do you want to downgrade to Free immediately?\n\n" +
      "Click OK to downgrade NOW (for testing)\n" +
      "Click Cancel to downgrade at the end of your billing period"
    );

    if (immediateDowngrade === null) {
      return; // User clicked cancel on the dialog
    }

    try {
      setIsCanceling(true);
      const endpoint = immediateDowngrade
        ? "/api/stripe/downgrade-now"
        : "/api/stripe/cancel-subscription";

      const response = await fetch(endpoint, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        if (immediateDowngrade) {
          alert("Your subscription has been downgraded to Free immediately. Refreshing...");
        } else {
          alert("Your subscription will be canceled at the end of your billing period.");
        }
        // Refresh the page to update subscription status
        window.location.reload();
      } else {
        alert(data.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };

  const tiers: Array<{
    key: "free" | "pro";
    tier: typeof PRICING_TIERS[keyof typeof PRICING_TIERS];
    popular?: boolean;
  }> = [
    { key: "free", tier: PRICING_TIERS.free },
    { key: "pro", tier: PRICING_TIERS.pro, popular: true },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The decisions that cost self-employed people $15K–$40K a year in overpaid taxes—modeled for your specific situation.
        </p>

        {canceled && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-lg inline-block">
            Checkout was canceled. Feel free to try again when you&apos;re ready.
          </div>
        )}
        {promoCode && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 px-4 py-2 rounded-lg inline-flex items-center gap-2">
            <span className="font-semibold">🎉 {promoCode}</span> — 50% off applied at checkout
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant={billingInterval === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setBillingInterval("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={billingInterval === "yearly" ? "default" : "outline"}
            size="sm"
            onClick={() => setBillingInterval("yearly")}
          >
            Yearly
            <span className="ml-2 text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
              Save 33%
            </span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {tiers.map(({ key, tier, popular }) => {
          const isCurrent = currentTier === key;
          const price = billingInterval === "monthly" ? tier.monthlyPrice : tier.yearlyPrice;
          const priceLabel = billingInterval === "yearly" ? "/year" : "/month";

          return (
            <Card
              key={key}
              className={cn(
                "relative flex flex-col",
                popular && "border-primary shadow-lg scale-105",
                isCurrent && "ring-2 ring-primary"
              )}
            >
              {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Popular
                  </span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                <div className="text-center">
                  <span className="text-4xl font-bold">
                    ${price}
                  </span>
                  {price > 0 && (
                    <span className="text-muted-foreground">{priceLabel}</span>
                  )}
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {key === "free" ? (
                  isCurrent ? (
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={true}
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={handleCancelSubscription}
                      disabled={isLoading || isCanceling}
                    >
                      {isCanceling ? "Canceling..." : "Cancel Pro & Downgrade"}
                    </Button>
                  )
                ) : (
                  <UpgradeButton
                    priceId={getPriceId(key as "pro")}
                    couponCode={promoCode}
                    className="w-full"
                    variant={popular ? "default" : "outline"}
                    disabled={isCurrent || isLoading}
                  >
                    {isCurrent ? "Current Plan" : promoCode ? `Upgrade at 50% off` : `Upgrade to ${tier.name}`}
                  </UpgradeButton>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground space-y-2 max-w-2xl mx-auto">
        <p>All plans include a 14-day money-back guarantee. Cancel anytime.</p>
        <p>
          Questions? Contact us at{" "}
          <a href="mailto:support@solofi.com" className="text-primary hover:underline">
            support@solofi.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
