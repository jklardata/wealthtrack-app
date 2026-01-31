import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, Wand2 } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 14: Purple/Violet Gradient - Creative, modern, magical
export const metadata = {
  title: "SoloFI - The Magic of Financial Clarity",
};

const VARIANT = "landing_14_purple";

export default function Landing14() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 via-purple-950 to-indigo-950 text-white">
      <LandingAnalytics variant={VARIANT} />
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Nav */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="text-xl font-semibold">SoloFI</span>
          </div>
          <TrackedLink
            href="/dashboard"
            trackingAction="sign_in"
            trackingLocation="nav"
            trackingVariant={VARIANT}
            buttonProps={{ variant: "outline", className: "border-purple-400/30 text-purple-300 hover:bg-purple-400/10" }}
          >
            Sign In
          </TrackedLink>
        </nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-4 py-2 rounded-full text-sm mb-8">
            <Wand2 className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300">Financial planning, reimagined</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Transform your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              financial future
            </span>
          </h1>

          <p className="text-xl text-purple-200/70 mb-12 max-w-2xl mx-auto">
            The intelligent platform for self-employed professionals.
            Track wealth, optimize taxes, and manifest your path to independence.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Begin your transformation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 mt-20 pt-12 border-t border-purple-500/20">
            <div>
              <p className="text-3xl font-bold text-purple-300">$500M+</p>
              <p className="text-purple-400/60 text-sm">Assets tracked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-300">10K+</p>
              <p className="text-purple-400/60 text-sm">Professionals</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-300">$47K</p>
              <p className="text-purple-400/60 text-sm">Avg savings</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Powerful tools, beautifully simple</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-8 rounded-3xl bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                  <Star className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Net Worth Tracking</h3>
                <p className="text-purple-200/60">
                  Connect all your accounts. Watch your wealth grow in real-time with beautiful visualizations.
                </p>
              </div>

              <div className="group p-8 rounded-3xl bg-gradient-to-br from-pink-900/50 to-pink-800/30 border border-pink-500/20 hover:border-pink-500/40 transition-colors">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-500/30 transition-colors">
                  <Sparkles className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Tax Optimization</h3>
                <p className="text-pink-200/60">
                  Discover hidden savings. Maximize Solo 401k, SEP IRA, and compare business structures.
                </p>
              </div>

              <div className="group p-8 rounded-3xl bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/30 transition-colors">
                  <Wand2 className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Retirement Projections</h3>
                <p className="text-indigo-200/60">
                  1,000 Monte Carlo scenarios reveal your probability of success with confidence intervals.
                </p>
              </div>

              <div className="group p-8 rounded-3xl bg-gradient-to-br from-violet-900/50 to-violet-800/30 border border-violet-500/20 hover:border-violet-500/40 transition-colors">
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-500/30 transition-colors">
                  <Star className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Geo-Arbitrage</h3>
                <p className="text-violet-200/60">
                  Compare 200+ cities worldwide. See how location impacts your path to freedom.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to transform your finances?
            </h2>
            <p className="text-purple-200/60 mb-10 text-lg">
              Join 10,000+ professionals who've discovered their path to freedom.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Start free today
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-purple-500/20 py-12">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-purple-300/40">
            <span>© 2026 SoloFI</span>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
