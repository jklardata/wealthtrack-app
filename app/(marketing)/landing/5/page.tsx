import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, DollarSign, Clock, Target } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 5: Data-Driven - Numbers and stats upfront
export const metadata = {
  title: "SoloFI - The Numbers Behind Financial Independence",
};

const VARIANT = "landing_5_data";

export default function Landing5() {
  return (
    <div className="min-h-screen bg-white">
      <LandingAnalytics variant={VARIANT} />

      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="text-xl font-mono font-bold text-gray-900">SoloFI</span>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{}}
        >
          Start Tracking
        </TrackedLink>
      </nav>

      {/* Hero - Data focused */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Know your numbers. Reach FI faster.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Data-driven financial planning for self-employed professionals
          </p>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-5xl font-mono font-bold text-blue-600">4%</p>
            <p className="text-gray-600 mt-2">Safe Withdrawal Rate</p>
            <p className="text-xs text-gray-400 mt-1">Industry standard</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-5xl font-mono font-bold text-green-600">$70K</p>
            <p className="text-gray-600 mt-2">Solo 401k Limit 2025</p>
            <p className="text-xs text-gray-400 mt-1">Max contribution</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-5xl font-mono font-bold text-purple-600">25x</p>
            <p className="text-gray-600 mt-2">FI Formula</p>
            <p className="text-xs text-gray-400 mt-1">Annual expenses</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-5xl font-mono font-bold text-orange-600">7%</p>
            <p className="text-gray-600 mt-2">Historical Returns</p>
            <p className="text-xs text-gray-400 mt-1">Real, after inflation</p>
          </div>
        </div>

        <div className="text-center">
          <TrackedLink
            href="/dashboard"
            trackingAction="get_started"
            trackingLocation="hero"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg" }}
          >
            Calculate Your Numbers
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      {/* Calculator Preview */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">Your FI Dashboard</h2>
              <p className="text-gray-400 mb-8">
                See exactly where you stand and what it takes to reach financial independence.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">FI Number</p>
                    <p className="text-gray-400 text-sm">Expenses × 25 = Your target</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Progress %</p>
                    <p className="text-gray-400 text-sm">Portfolio ÷ FI Number</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Years to FI</p>
                    <p className="text-gray-400 text-sm">Based on savings rate + returns</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Tax Savings</p>
                    <p className="text-gray-400 text-sm">Optimized contributions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <span className="text-gray-400">Current Net Worth</span>
                  <span className="text-2xl font-mono font-bold text-white">$847,320</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <span className="text-gray-400">Annual Expenses</span>
                  <span className="text-2xl font-mono font-bold text-white">$80,000</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <span className="text-gray-400">FI Number (25x)</span>
                  <span className="text-2xl font-mono font-bold text-blue-400">$2,000,000</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-2xl font-mono font-bold text-green-400">42.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Years to FI</span>
                  <span className="text-2xl font-mono font-bold text-purple-400">8.3 yrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formula Breakdown */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">The Math Behind FI</h2>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="font-mono text-lg mb-4">
                <span className="text-blue-600">FI Number</span> = Annual Expenses × 25
              </p>
              <p className="text-gray-600">
                Based on the 4% safe withdrawal rate. If you spend $80,000/year, you need $2,000,000.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <p className="font-mono text-lg mb-4">
                <span className="text-green-600">Years to FI</span> = log((FI × r + S) / (P × r + S)) / log(1 + r)
              </p>
              <p className="text-gray-600">
                Where P = portfolio, S = annual savings, r = expected return. We calculate this for you.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <p className="font-mono text-lg mb-4">
                <span className="text-purple-600">Tax Savings</span> = Contributions × Marginal Rate
              </p>
              <p className="text-gray-600">
                Solo 401k ($70K) at 32% bracket = $22,400 saved. HSA, SEP IRA add more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Run Your Numbers</h2>
          <p className="text-blue-100 mb-8">
            Free to start. See your complete FI picture in minutes.
          </p>
          <TrackedLink
            href="/dashboard"
            trackingAction="create_account"
            trackingLocation="cta_section"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg", variant: "secondary" }}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
          <span className="font-mono">© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
