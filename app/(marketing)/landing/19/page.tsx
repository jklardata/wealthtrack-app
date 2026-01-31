import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Activity, Cpu, Rocket } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 19: Electric Blue/Neon - High energy, tech-forward, gaming-inspired
export const metadata = {
  title: "SoloFI - Supercharge Your Finances",
};

const VARIANT = "landing_19_neon";

export default function Landing19() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <LandingAnalytics variant={VARIANT} />
      {/* Glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative">
        {/* Nav */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SoloFI
            </span>
          </div>
          <TrackedLink
            href="/dashboard"
            trackingAction="get_started"
            trackingLocation="nav"
            trackingVariant={VARIANT}
            buttonProps={{ className: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25" }}
          >
            Launch App
          </TrackedLink>
        </nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full text-sm mb-8">
            <Activity className="h-4 w-4 text-blue-400 animate-pulse" />
            <span className="text-blue-300">Real-time financial intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            SUPERCHARGE
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              YOUR FINANCES
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Next-gen financial tools for self-employed professionals.
            Track wealth at light speed. Optimize taxes like a pro.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <TrackedLink
              href="/dashboard"
              trackingAction="start_free"
              trackingLocation="hero"
              trackingVariant={VARIANT}
              buttonProps={{ size: "lg", className: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25" }}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Launch Now
            </TrackedLink>
            <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Watch Demo
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">$500M+</p>
                <p className="text-gray-500 text-sm">Assets Tracked</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">10K+</p>
                <p className="text-gray-500 text-sm">Power Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">$47K</p>
                <p className="text-gray-500 text-sm">Avg Tax Savings</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">99.9%</p>
                <p className="text-gray-500 text-sm">Uptime</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Core Systems
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                <Cpu className="h-10 w-10 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold mb-3">Net Worth Engine</h3>
                <p className="text-gray-400">
                  Real-time aggregation across all accounts. AI-powered categorization.
                  Beautiful visualizations.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
                <Zap className="h-10 w-10 text-cyan-400 mb-6" />
                <h3 className="text-xl font-bold mb-3">Tax Optimizer</h3>
                <p className="text-gray-400">
                  Solo 401k, SEP IRA, HSA maximization. S-Corp vs LLC analysis.
                  Instant savings calculation.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                <Activity className="h-10 w-10 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold mb-3">Monte Carlo Simulator</h3>
                <p className="text-gray-400">
                  1,000 parallel scenarios. Statistical confidence intervals.
                  Know your probability of success.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
                <Rocket className="h-10 w-10 text-cyan-400 mb-6" />
                <h3 className="text-xl font-bold mb-3">Geo-Arbitrage Scanner</h3>
                <p className="text-gray-400">
                  200+ cities analyzed. Cost of living comparison.
                  Optimize your FI timeline by location.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to level up?</h2>
              <p className="text-blue-100 mb-10">
                Join 10,000+ professionals already optimizing their finances.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
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
