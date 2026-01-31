import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 1: Minimalist/Clean - Wealthsimple-inspired
export const metadata = {
  title: "SoloFI - Financial Freedom for the Self-Employed",
};

const VARIANT = "landing_1_minimalist";

export default function Landing1() {
  return (
    <div className="min-h-screen bg-white">
      <LandingAnalytics variant={VARIANT} />

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="text-2xl font-semibold">SoloFI</span>
        <TrackedLink
          href="/dashboard"
          trackingAction="sign_in"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ variant: "ghost" }}
        >
          Sign in
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-6">
          Money management,
          <br />
          <span className="font-medium">simplified.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
          Track your net worth, optimize taxes, and plan for financial independence. Built for freelancers and consultants.
        </p>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="hero"
          trackingVariant={VARIANT}
          buttonProps={{ size: "lg", className: "rounded-full px-8" }}
        >
          Get started free
          <ArrowRight className="ml-2 h-4 w-4" />
        </TrackedLink>
      </section>

      {/* Simple visual */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gray-50 rounded-3xl p-12 aspect-video flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl font-light text-gray-900">$2.1M</p>
            <p className="text-gray-500 mt-2">Your FI number, visualized</p>
          </div>
        </div>
      </section>

      {/* Features - minimal */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-light mb-4">Track everything in one place</h2>
            <p className="text-gray-500 text-lg">
              Net worth, investments, credit cards, and retirement projections. All your financial data, unified.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-light mb-4">Optimize your taxes</h2>
            <p className="text-gray-500 text-lg">
              Solo 401k, SEP IRA, HSA contributions. See exactly how much you can save with tax-advantaged accounts.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-light mb-4">Plan your independence</h2>
            <p className="text-gray-500 text-lg">
              Monte Carlo simulations, Coast FI calculations, and geo-arbitrage planning. Know your number.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-light mb-6">Start your journey today</h2>
        <TrackedLink
          href="/dashboard"
          trackingAction="create_account"
          trackingLocation="cta_section"
          trackingVariant={VARIANT}
          buttonProps={{ size: "lg", className: "rounded-full px-8" }}
        >
          Create free account
        </TrackedLink>
        <p className="text-sm text-gray-400 mt-4">No credit card required</p>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
