import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, TreePine, Mountain, Sprout } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 12: Forest Green - Natural, growth-focused, calming
export const metadata = {
  title: "SoloFI - Grow Your Wealth Naturally",
};

const VARIANT = "landing_12_green";

export default function Landing12() {
  return (
    <div className="min-h-screen bg-emerald-950 text-white">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-emerald-400" />
          <span className="text-xl font-semibold">SoloFI</span>
        </div>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ variant: "outline", className: "border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/10" }}
        >
          Get Started
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 leading-[1.1]">
            Plant the seeds of
            <span className="text-emerald-400"> financial freedom</span>
          </h1>

          <p className="text-xl text-emerald-200/70 mb-12 leading-relaxed">
            Like a well-tended garden, wealth grows with patience and the right tools.
            SoloFI helps self-employed professionals cultivate lasting financial independence.
          </p>

          <TrackedLink
            href="/dashboard"
            trackingAction="start_free"
            trackingLocation="hero"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg", className: "bg-emerald-500 hover:bg-emerald-600 text-white" }}
          >
            Start growing today
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-emerald-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-16">Nurture every aspect of your finances</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800">
              <Sprout className="h-10 w-10 text-emerald-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Track Growth</h3>
              <p className="text-emerald-200/60 text-sm">
                Watch your net worth flourish with real-time tracking across all accounts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800">
              <TreePine className="h-10 w-10 text-emerald-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Tax Shelter</h3>
              <p className="text-emerald-200/60 text-sm">
                Maximize Solo 401k, SEP IRA, and HSA contributions to shelter your earnings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800">
              <Mountain className="h-10 w-10 text-emerald-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">See the Summit</h3>
              <p className="text-emerald-200/60 text-sm">
                Monte Carlo projections show your path to the peak of financial independence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/50 border border-emerald-800">
              <Leaf className="h-10 w-10 text-emerald-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Go Anywhere</h3>
              <p className="text-emerald-200/60 text-sm">
                Geo-arbitrage tools help you find where your money grows furthest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-5xl font-semibold text-emerald-400 mb-2">$47K</p>
              <p className="text-emerald-200/50">Average tax savings discovered</p>
            </div>
            <div>
              <p className="text-5xl font-semibold text-emerald-400 mb-2">10K+</p>
              <p className="text-emerald-200/50">Professionals growing with us</p>
            </div>
            <div>
              <p className="text-5xl font-semibold text-emerald-400 mb-2">8.2 yrs</p>
              <p className="text-emerald-200/50">Average time to FI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-emerald-900/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-2xl font-medium leading-relaxed mb-8 text-emerald-100">
            "SoloFI showed me I was leaving $31,000 in tax savings on the table every year.
            Now I know exactly when I'll reach financial independence."
          </p>
          <p className="text-emerald-400">— Independent Consultant, 3 years to FI</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to grow?</h2>
          <p className="text-emerald-200/60 mb-10">
            Start free. No credit card required.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-800 py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-emerald-200/40">
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
