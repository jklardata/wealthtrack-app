"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Check, Minus, ArrowRight, Shield, Lock, Eye } from "lucide-react";

interface PriceIds {
  pro: { monthly: string; yearly: string };
}

export default function PricingPage() {
  const { isSignedIn } = useAuth();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [priceIds, setPriceIds] = useState<PriceIds | null>(null);

  // Fetch price IDs from the server API
  useEffect(() => {
    async function fetchPriceIds() {
      try {
        const response = await fetch("/api/stripe/prices");
        const data = await response.json();
        setPriceIds(data);
      } catch (error) {
        console.error("Error fetching price IDs:", error);
      }
    }
    fetchPriceIds();
  }, []);

  const handleProCheckout = async () => {
    // Redirect to sign-up if not authenticated
    if (!isSignedIn) {
      window.location.href = "/sign-up";
      return;
    }

    setIsLoading(true);
    try {
      // Get price ID from fetched data
      const priceId = priceIds
        ? (billingInterval === "monthly" ? priceIds.pro.monthly : priceIds.pro.yearly)
        : "";

      // Validate that price ID is configured
      if (!priceId) {
        throw new Error("Stripe configuration is incomplete. Please contact support.");
      }

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create checkout";
      alert(`${errorMessage}. Please try again or contact support if the issue persists.`);
    } finally {
      setIsLoading(false);
    }
  };

  const monthlyPrice = 15;
  const yearlyPrice = 120;
  const displayPrice = billingInterval === "monthly" ? monthlyPrice : yearlyPrice;
  const priceLabel = billingInterval === "monthly" ? "/month" : "/year";
  const yearlyMonthlyEquivalent = (yearlyPrice / 12).toFixed(2);
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="https://solofi.io">
          <span className="text-xl font-semibold text-slate-900">
            <span className="text-emerald-600">Solo</span>fi
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-slate-600 hover:text-slate-900 text-sm">
            Resources
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" className="text-slate-600">
              Sign in
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Start with the free tier to see if Solofi fits your workflow. Upgrade when you need deeper modeling capabilities.
        </p>
      </section>

      {/* Billing Toggle */}
      <div className="flex flex-col items-center gap-3 mb-12">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBillingInterval("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              billingInterval === "monthly"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval("yearly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              billingInterval === "yearly"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Yearly
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
              Save ${yearlySavings}
            </span>
          </button>
        </div>
        {billingInterval === "yearly" && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-2 rounded-lg">
            <span className="font-semibold">🎉 Early access offer:</span>
            use code <span className="font-mono font-bold bg-emerald-100 px-1.5 py-0.5 rounded">EARLYWEALTH</span> at checkout for <span className="font-semibold">50% off your first year</span>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-slate-900 mb-2">Free</h2>
              <p className="text-slate-500 text-sm">Core visibility and education tools</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-semibold text-slate-900">$0</span>
              <span className="text-slate-500">/forever</span>
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Track your net worth, understand your tax situation, and explore retirement scenarios.
              Everything you need to see where you stand today.
            </p>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
                Get started free
              </Button>
            </Link>
            <ul className="mt-8 space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Net worth tracking and history
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Basic tax calculator
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Retirement projections
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Portfolio allocation view
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Geographic arbitrage explorer
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Credit card tracking
              </li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="bg-white border-2 border-emerald-500 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-6">
              <span className="bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Most popular
              </span>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-medium text-slate-900 mb-2">Pro</h2>
              <p className="text-slate-500 text-sm">Advanced modeling and optimization</p>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-slate-900">${displayPrice}</span>
                <span className="text-slate-500">{priceLabel}</span>
              </div>
              {billingInterval === "yearly" && (
                <div className="mt-2">
                  <span className="text-sm text-slate-400 line-through">${monthlyPrice * 12}/year</span>
                  <span className="ml-2 text-sm font-semibold text-emerald-600">
                    Save ${yearlySavings}/year
                  </span>
                  <div className="text-xs text-slate-500 mt-1">
                    ${yearlyMonthlyEquivalent}/month when billed annually
                  </div>
                </div>
              )}
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Model complex decisions before you make them. Compare entity structures, optimize tax timing,
              and simulate retirement scenarios with precision.
            </p>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleProCheckout}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign Up for Pro"}
            </Button>
            <ul className="mt-8 space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Everything in Free
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                S-Corp vs LLC comparison modeling
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Optimal salary calculator
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Quarterly tax estimates
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Roth conversion ladder planning
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Portfolio rebalancing recommendations
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Tax location optimization
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Capital gains strategy simulator
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Monte Carlo retirement scenarios
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Tax-loss harvesting analysis
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Saved scenario comparisons
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                Personalized optimization insights
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-slate-900 text-center mb-4">
            Compare the cost of financial guidance
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Solofi provides decision-modeling capabilities at a fraction of the cost of traditional services.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Traditional CPA */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-center mb-4">
                <h3 className="font-medium text-slate-900 mb-2">Traditional CPA</h3>
                <div className="text-3xl font-semibold text-slate-900 mb-1">$400</div>
                <div className="text-sm text-slate-500">per consultation</div>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-slate-600">
                  <span className="font-medium text-slate-900">Annual cost:</span> $1,600+
                  <span className="text-xs text-slate-500 block">Based on 4 sessions/year</span>
                </p>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Reactive advice after you've already made decisions. Limited modeling of future scenarios.
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Advisor */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-center mb-4">
                <h3 className="font-medium text-slate-900 mb-2">Financial Advisor</h3>
                <div className="text-3xl font-semibold text-slate-900 mb-1">1% AUM</div>
                <div className="text-sm text-slate-500">annual fee</div>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-slate-600">
                  <span className="font-medium text-slate-900">Annual cost:</span> $5,000/year
                  <span className="text-xs text-slate-500 block">On $500K portfolio</span>
                </p>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Requires asset custody. Commission incentives may not align with your goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Solofi */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl p-6 relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-white text-emerald-600 text-xs font-medium px-3 py-1 rounded-full">
                  Best value
                </span>
              </div>
              <div className="text-center mb-4">
                <h3 className="font-medium mb-2">Solofi Pro</h3>
                <div className="text-3xl font-semibold mb-1">$15</div>
                <div className="text-sm text-emerald-50">per month</div>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-emerald-50">
                  <span className="font-medium text-white">Annual cost:</span> $120/year
                  <span className="text-xs text-emerald-100 block">Less than 1 CPA session</span>
                </p>
                <div className="pt-3 border-t border-emerald-400/30">
                  <p className="text-emerald-50 text-xs leading-relaxed">
                    Model unlimited scenarios. No asset custody. No commissions. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              If one S-Corp decision saves you $3,000 in taxes, or one optimal Roth conversion timing
              saves $5,000 over a decade, Solofi pays for itself many times over.
            </p>
          </div>
        </div>
      </section>

      {/* Why Pro Exists */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-slate-900 text-center mb-4">Why Pro exists</h2>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
            The free tier gives you visibility. Pro gives you leverage.
          </p>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              Most financial decisions are irreversible—or at least expensive to reverse.
              Choosing the wrong entity structure, missing an optimal contribution window,
              or mistiming a Roth conversion can cost tens of thousands of dollars over a decade.
            </p>
            <p>
              Pro exists to help you model these decisions before you commit.
              It's built for people who want to understand the second and third-order effects
              of their choices, not just the surface-level math.
            </p>
            <p>
              The subscription model keeps our incentives aligned with yours.
              We don't earn commissions, hold assets, or benefit from you making more transactions.
              Our only goal is to be useful enough that you keep paying $15/month.
            </p>
          </div>
        </div>
      </section>

      {/* Who Pro is For */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-slate-900 text-center mb-4">Who Pro is for</h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Pro makes sense if you're navigating decisions like these:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-medium text-slate-900 mb-3">Entity structure decisions</h3>
              <p className="text-sm text-slate-500">
                Should I elect S-Corp status? At what income level does it make sense?
                What salary should I pay myself?
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-medium text-slate-900 mb-3">Tax timing optimization</h3>
              <p className="text-sm text-slate-500">
                When should I do a Roth conversion? How do I manage capital gains across multiple years?
                What's my optimal contribution strategy?
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-medium text-slate-900 mb-3">Retirement modeling</h3>
              <p className="text-sm text-slate-500">
                What's my probability of success at different withdrawal rates?
                How does relocating affect my timeline?
              </p>
            </div>
          </div>
          <p className="text-center text-slate-500 text-sm mt-8">
            If you're earning $150k+ and making decisions that affect your tax bill by thousands of dollars,
            Pro typically pays for itself in the first month of use.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-slate-900 text-center mb-12">Free vs Pro comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 font-medium text-slate-900">Feature</th>
                  <th className="text-center py-2 px-4 font-medium text-slate-900 w-28">Free</th>
                  <th className="text-center py-2 pl-4 font-medium text-slate-900 w-28">Pro</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Net worth tracking</td>
                  <td className="py-2 px-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Basic tax calculator</td>
                  <td className="py-2 px-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Retirement projections</td>
                  <td className="py-2 px-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Net worth trajectory graphs</td>
                  <td className="py-2 px-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Geographic arbitrage explorer</td>
                  <td className="py-2 px-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Tax optimization strategies</td>
                  <td className="py-2 px-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Spending analysis & cost breakdown</td>
                  <td className="py-2 px-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Portfolio expected performance</td>
                  <td className="py-2 px-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Retirement success probability</td>
                  <td className="py-2 px-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Quarterly tax tools (safe harbor, payment tracking)</td>
                  <td className="py-2 px-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">S-Corp vs LLC modeling</td>
                  <td className="py-2 px-4 text-center"><Minus className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Optimal salary calculator</td>
                  <td className="py-2 px-4 text-center"><Minus className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Capital gains simulator</td>
                  <td className="py-2 px-4 text-center"><Minus className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Annualized income installment method</td>
                  <td className="py-2 px-4 text-center"><Minus className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-base text-slate-700">Saved scenario comparisons</td>
                  <td className="py-2 px-4 text-center"><Minus className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-base text-slate-700">Personalized insights</td>
                  <td className="py-2 px-4 text-center"><Minus className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="py-2 pl-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What Solofi Does NOT Do */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-slate-900 text-center mb-4">What Solofi does not do</h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Clarity about what we are—and aren't.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">We don't hold your assets</h3>
              <p className="text-sm text-slate-500">
                Solofi is not a brokerage or custodian. Your money stays exactly where it is.
                We're a decision tool, not a financial product.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">We don't give financial advice</h3>
              <p className="text-sm text-slate-500">
                We provide modeling tools and educational information.
                For personalized advice, work with a licensed professional.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">We don't earn commissions</h3>
              <p className="text-sm text-slate-500">
                No affiliate fees, no product sales, no AUM charges.
                Our only revenue is your subscription.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-slate-900 text-center mb-12">Common questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-600 text-sm">
                Yes. Cancel with one click from your account settings.
                No calls, no hoops, no retention offers. You'll keep access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Is there a trial period?</h3>
              <p className="text-slate-600 text-sm">
                Pro comes with a 14-day money-back guarantee. If it doesn't work for you,
                email us and we'll refund you immediately—no questions asked.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Do I need to link my accounts?</h3>
              <p className="text-slate-600 text-sm">
                No. Solofi works with manual data entry. You control what information you share,
                and nothing connects to your actual financial accounts.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">What happens to my data if I cancel?</h3>
              <p className="text-slate-600 text-sm">
                You can export all your data anytime. After cancellation, we retain your data for 90 days
                in case you want to return, then permanently delete it.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Is annual billing refundable?</h3>
              <p className="text-slate-600 text-sm">
                Yes. We offer prorated refunds for annual subscriptions within the first 30 days.
                After that, you can cancel but won't receive a refund for the remaining months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-medium text-slate-900 mb-4">Start with Free. Upgrade when it makes sense.</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Most users start with the free tier to explore.
            Upgrade to Pro when you're ready to model a specific decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-6">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
            <span>© 2026 Solofi</span>
            <div className="flex gap-8">
              <Link href="/blog" className="hover:text-slate-700">Resources</Link>
              <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
