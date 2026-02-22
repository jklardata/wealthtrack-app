import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 10: Dark Mode Premium - Sleek, modern, high-end feel
export const metadata = {
  title: "SoloFI - Premium Financial Planning for Independents",
  alternates: {
    canonical: "https://solofi.io",
  },
};

const VARIANT = "landing_10_dark";

export default function Landing10() {
  return (
    <div className="min-h-screen bg-black text-white">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="text-xl font-medium tracking-tight">SoloFI</span>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ variant: "outline", className: "border-white/20 text-white hover:bg-white/10" }}
        >
          Get Started
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full text-sm mb-8">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-white/70">For the ambitious self-employed</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-[1.1]">
            Master your
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              financial future
            </span>
          </h1>

          <p className="text-xl text-white/60 mb-12 max-w-2xl">
            The sophisticated financial platform for consultants, freelancers, and business owners
            who demand precision in their path to independence.
          </p>

          <div className="flex flex-wrap gap-4">
            <TrackedLink
              href="/dashboard"
              trackingAction="start_free"
              trackingLocation="hero"
              trackingVariant={VARIANT}
              buttonProps={{ size: "lg", className: "bg-white text-black hover:bg-white/90" }}
            >
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </TrackedLink>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Watch demo
            </Button>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-medium mb-6">Precision tools for serious planning</h2>
              <p className="text-white/60">
                Every feature designed for the unique needs of self-employed professionals.
              </p>
            </div>

            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <Zap className="h-8 w-8 text-amber-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Intelligent Tax Optimization</h3>
                <p className="text-white/60 text-sm">
                  Maximize Solo 401k, SEP IRA, and HSA contributions. Compare S-Corp vs LLC structures.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <Shield className="h-8 w-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Monte Carlo Projections</h3>
                <p className="text-white/60 text-sm">
                  1,000 simulated scenarios. Understand your probability of success with confidence intervals.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <Globe className="h-8 w-8 text-green-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Geo-Arbitrage Analysis</h3>
                <p className="text-white/60 text-sm">
                  Compare cost of living across 200+ cities. See how location impacts your FI timeline.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <Sparkles className="h-8 w-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Real-Time Net Worth</h3>
                <p className="text-white/60 text-sm">
                  Track every asset and liability. Visualize growth trends over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-5xl font-medium mb-2">$500M+</p>
              <p className="text-white/40">Assets tracked</p>
            </div>
            <div>
              <p className="text-5xl font-medium mb-2">10K+</p>
              <p className="text-white/40">Users</p>
            </div>
            <div>
              <p className="text-5xl font-medium mb-2">$47K</p>
              <p className="text-white/40">Avg tax savings</p>
            </div>
            <div>
              <p className="text-5xl font-medium mb-2">4.9</p>
              <p className="text-white/40">User rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium mb-4">Simple, transparent pricing</h2>
            <p className="text-white/60">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5">
              <h3 className="text-xl font-medium mb-2">Free</h3>
              <p className="text-white/40 mb-6">Everything you need to start</p>
              <p className="text-4xl font-medium mb-8">$0</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white/70">
                  <Check className="h-5 w-5 text-green-400" /> Net worth tracking
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <Check className="h-5 w-5 text-green-400" /> Tax calculator
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <Check className="h-5 w-5 text-green-400" /> Retirement projections
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <Check className="h-5 w-5 text-green-400" /> Geo-arbitrage
                </li>
              </ul>
              <TrackedLink
                href="/dashboard"
                trackingAction="get_started"
                trackingLocation="pricing_free"
                trackingVariant={VARIANT}
                trackingTier="free"
                buttonProps={{ className: "w-full", variant: "outline" }}
              >
                Get started
              </TrackedLink>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl border border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-transparent">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-medium">Pro</h3>
                <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-medium">
                  Popular
                </span>
              </div>
              <p className="text-white/40 mb-6">For serious planners</p>
              <p className="text-4xl font-medium mb-8">$29<span className="text-lg text-white/40">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white/70">
                  <Check className="h-5 w-5 text-amber-400" /> Everything in Free
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <Check className="h-5 w-5 text-amber-400" /> Advanced tax tools
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <Check className="h-5 w-5 text-amber-400" /> S-Corp vs LLC analysis
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <Check className="h-5 w-5 text-amber-400" /> Saved scenarios
                </li>
              </ul>
              <TrackedLink
                href="/dashboard"
                trackingAction="start_trial"
                trackingLocation="pricing_pro"
                trackingVariant={VARIANT}
                trackingTier="pro"
                buttonProps={{ className: "w-full bg-amber-500 text-black hover:bg-amber-400" }}
              >
                Start free trial
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-medium mb-6">
            Your independence starts here
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Join thousands of self-employed professionals building their future.
          </p>
          <TrackedLink
            href="/dashboard"
            trackingAction="create_account"
            trackingLocation="cta_section"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg", className: "bg-white text-black hover:bg-white/90" }}
          >
            Create free account
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-white/40">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
