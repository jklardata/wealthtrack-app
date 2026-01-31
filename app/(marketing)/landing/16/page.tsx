import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Sun, Zap } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 16: Sunset Orange/Gold - Warm, energetic, ambitious
export const metadata = {
  title: "SoloFI - Ignite Your Financial Independence",
};

const VARIANT = "landing_16_sunset";

export default function Landing16() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 via-orange-950 to-red-950 text-white">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-amber-400" />
          <span className="text-xl font-bold">SoloFI</span>
        </div>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ className: "bg-amber-500 hover:bg-amber-600 text-black font-semibold" }}
        >
          Get Started
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-full text-sm mb-8">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-amber-300">For ambitious self-employed professionals</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
          Ignite your path to
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            financial freedom
          </span>
        </h1>

        <p className="text-xl text-orange-200/70 mb-12 max-w-2xl mx-auto">
          Stop leaving money on the table. Track wealth, optimize taxes,
          and accelerate your journey to independence.
        </p>

        <TrackedLink
          href="/dashboard"
          trackingAction="start_free"
          trackingLocation="hero"
          trackingVariant={VARIANT}
          buttonProps={{ size: "lg", className: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold" }}
        >
          Start burning bright
          <Flame className="ml-2 h-4 w-4" />
        </TrackedLink>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-orange-500/20">
          <div>
            <p className="text-4xl font-bold text-amber-400">$47K</p>
            <p className="text-orange-300/50 text-sm">Avg tax savings</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-orange-400">10K+</p>
            <p className="text-orange-300/50 text-sm">Professionals</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-400">8.2 yrs</p>
            <p className="text-orange-300/50 text-sm">Avg to FI</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-yellow-400">4.9★</p>
            <p className="text-orange-300/50 text-sm">Rating</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-orange-950/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Fuel your financial engine</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-900/50 to-orange-900/30 border border-amber-500/20">
              <Sun className="h-10 w-10 text-amber-400 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Net Worth Dashboard</h3>
              <p className="text-orange-200/60">
                See your complete financial picture. All accounts, investments, and debts in one view.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-900/50 to-red-900/30 border border-orange-500/20">
              <Flame className="h-10 w-10 text-orange-400 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Tax Optimization</h3>
              <p className="text-orange-200/60">
                Maximize Solo 401k, SEP IRA, HSA. Compare S-Corp vs LLC to minimize taxes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-red-900/50 to-amber-900/30 border border-red-500/20">
              <Zap className="h-10 w-10 text-red-400 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Retirement Projections</h3>
              <p className="text-orange-200/60">
                Monte Carlo simulations with 1,000 scenarios. Know when you'll reach independence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-2xl font-medium leading-relaxed mb-8 text-orange-100">
            "I was working harder, not smarter. SoloFI showed me $31K in tax savings I was missing.
            Now I have a clear timeline to FI."
          </p>
          <p className="text-amber-400">— Tech Consultant, reached FI in 6 years</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to ignite your future?</h2>
          <p className="text-orange-100 mb-10">
            Start free. No credit card required.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-black text-white hover:bg-gray-900">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-orange-900">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-orange-300/40">
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
