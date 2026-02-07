"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Check } from "lucide-react";
import Link from "next/link";

interface ProFeatureGateProps {
  children: React.ReactNode;
  featureName: string;
  description?: string;
  benefits?: string[];
}

export function ProFeatureGate({
  children,
  featureName,
  description = "This feature is available in the Pro plan.",
  benefits = [
    "Advanced financial planning tools",
    "Unlimited scenarios and comparisons",
    "Priority support",
    "Regular feature updates"
  ]
}: ProFeatureGateProps) {
  const { isPro, isLoading, entitlement_tier } = useSubscription();

  // Debug logging
  console.log('ProFeatureGate:', { featureName, isPro, isLoading, entitlement_tier });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show content for pro users
  if (isPro) {
    return <>{children}</>;
  }

  // Show upgrade callout for free users
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Card className="border-2 border-emerald-200 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-medium text-slate-900">
              {featureName}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Included in Pro
            </h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-slate-900">
              Starting at <span className="text-2xl text-emerald-600">$19</span>/month
            </p>
            <p className="text-sm text-slate-500">
              or $199/year (save 17%)
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button asChild className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700" size="lg">
            <Link href="/upgrade">
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:flex-1" size="lg">
            <Link href="/dashboard">
              Return to Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Preview section (optional) */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 mb-4">
          Preview of what you'll get access to:
        </p>
        <div className="relative rounded-lg overflow-hidden border-2 border-slate-200">
          <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="bg-white/90 px-6 py-3 rounded-full shadow-lg">
              <Lock className="h-5 w-5 text-slate-600 inline mr-2" />
              <span className="text-sm font-medium text-slate-900">Pro Feature</span>
            </div>
          </div>
          <div className="blur-sm opacity-40 pointer-events-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
