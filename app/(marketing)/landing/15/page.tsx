import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Waves, Anchor, Compass } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 15: Teal/Cyan - Fresh, modern, tech-forward
export const metadata = {
  title: "SoloFI - Navigate Your Financial Future",
};

const VARIANT = "landing_15_teal";

export default function Landing15() {
  return (
    <div className="min-h-screen bg-slate-900">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Waves className="h-6 w-6 text-cyan-400" />
          <span className="text-xl font-bold text-white">SoloFI</span>
        </div>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ className: "bg-cyan-500 hover:bg-cyan-600 text-white" }}
        >
          Get Started
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Navigate to
              <span className="text-cyan-400"> financial freedom</span>
            </h1>

            <p className="text-xl text-slate-400 mb-8">
              Chart your course with precision tools built for self-employed professionals.
              Track wealth, optimize taxes, and reach your destination faster.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <TrackedLink
                href="/dashboard"
                trackingAction="start_free"
                trackingLocation="hero"
                trackingVariant={VARIANT}
                buttonProps={{ size: "lg", className: "bg-cyan-500 hover:bg-cyan-600" }}
              >
                Start your journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </TrackedLink>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                See demo
              </Button>
            </div>

            <div className="flex gap-8 pt-8 border-t border-slate-700">
              <div>
                <p className="text-2xl font-bold text-cyan-400">$500M+</p>
                <p className="text-slate-500 text-sm">Assets tracked</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400">10K+</p>
                <p className="text-slate-500 text-sm">Navigators</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400">4.9★</p>
                <p className="text-slate-500 text-sm">Rating</p>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
              <Compass className="h-8 w-8 text-cyan-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Net Worth Compass</h3>
              <p className="text-slate-400 text-sm">
                Always know where you stand. Track every account and watch your progress in real-time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20">
              <Anchor className="h-8 w-8 text-teal-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Tax Safe Harbor</h3>
              <p className="text-slate-400 text-sm">
                Maximize Solo 401k, SEP IRA, HSA. Compare S-Corp vs LLC for optimal savings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
              <Waves className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Retirement Horizon</h3>
              <p className="text-slate-400 text-sm">
                Monte Carlo simulations chart 1,000 possible futures. Know your odds of success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-16">How it works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
              <p className="text-slate-400 text-sm">
                Link your accounts or manually add your assets and liabilities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analyze</h3>
              <p className="text-slate-400 text-sm">
                See your complete picture with tax optimization and retirement projections.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Navigate</h3>
              <p className="text-slate-400 text-sm">
                Follow your personalized roadmap to financial independence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Simple pricing</h2>
          <p className="text-slate-400 text-center mb-12">Start free, scale when ready</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-800 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
              <p className="text-4xl font-bold text-white mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                {["Net worth tracking", "Tax calculator", "FI projections", "Geo-arbitrage"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <Check className="h-5 w-5 text-cyan-400" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-700">
                  Get started
                </Button>
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-900/50 to-teal-900/50 border border-cyan-500/30">
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <p className="text-4xl font-bold text-white mb-6">$29<span className="text-lg text-slate-400">/mo</span></p>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "S-Corp analysis", "Advanced scenarios", "Priority support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <Check className="h-5 w-5 text-cyan-400" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
                  Start free trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-cyan-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to set sail?</h2>
          <p className="text-cyan-100 mb-10">
            Join 10,000+ professionals navigating to financial freedom.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-cyan-700 hover:bg-cyan-50">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-slate-500">
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
