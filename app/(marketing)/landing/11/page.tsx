import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, TrendingUp, Shield, Zap } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 11: Deep Navy Premium - Trust and sophistication
export const metadata = {
  title: "SoloFI - Sophisticated Financial Planning",
};

const VARIANT = "landing_11_navy";

export default function Landing11() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="text-xl font-semibold text-white">SoloFI</span>
        <TrackedLink
          href="/dashboard"
          trackingAction="sign_in"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ variant: "outline", className: "border-blue-400/30 text-blue-300 hover:bg-blue-400/10" }}
        >
          Sign In
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-sm mb-8">
            <span className="text-blue-400">Trusted by 10,000+ professionals</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 leading-[1.1]">
            Financial clarity for the
            <span className="text-blue-400"> self-employed</span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 leading-relaxed">
            Stop guessing about retirement. SoloFI gives consultants and freelancers
            the precision tools to optimize taxes, track wealth, and plan your path to independence.
          </p>

          <div className="flex flex-wrap gap-4">
            <TrackedLink
              href="/dashboard"
              trackingAction="start_free"
              trackingLocation="hero"
              trackingVariant={VARIANT}
              buttonProps={{ size: "lg", className: "bg-blue-500 hover:bg-blue-600 text-white" }}
            >
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </TrackedLink>
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              See how it works
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium">Net Worth Tracking</h3>
              <p className="text-slate-400">
                Connect all accounts. See your complete financial picture update in real-time.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-medium">Tax Optimization</h3>
              <p className="text-slate-400">
                Maximize Solo 401k, SEP IRA, and HSA. Compare S-Corp vs LLC structures.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-medium">Retirement Projections</h3>
              <p className="text-slate-400">
                Monte Carlo simulations with 1,000 scenarios. Know your probability of success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-semibold text-blue-400 mb-2">$500M+</p>
              <p className="text-slate-500">Assets tracked</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-emerald-400 mb-2">$47K</p>
              <p className="text-slate-500">Avg tax savings</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-amber-400 mb-2">10K+</p>
              <p className="text-slate-500">Active users</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-purple-400 mb-2">4.9/5</p>
              <p className="text-slate-500">User rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-4">Simple pricing</h2>
          <p className="text-slate-400 text-center mb-12">Start free, upgrade when ready</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50">
              <h3 className="text-xl font-medium mb-2">Free</h3>
              <p className="text-slate-500 mb-6">Everything to get started</p>
              <p className="text-4xl font-semibold mb-8">$0</p>
              <ul className="space-y-3 mb-8">
                {["Net worth tracking", "Tax calculator", "Retirement projections", "Geo-arbitrage"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <Check className="h-5 w-5 text-blue-400" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="w-full" variant="outline">Get started</Button>
              </Link>
            </div>

            <div className="p-8 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-medium">Pro</h3>
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Popular</span>
              </div>
              <p className="text-slate-500 mb-6">Advanced tools</p>
              <p className="text-4xl font-semibold mb-8">$29<span className="text-lg text-slate-500">/mo</span></p>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "S-Corp vs LLC analysis", "Advanced tax tools", "Unlimited scenarios"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <Check className="h-5 w-5 text-blue-400" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Start free trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to take control?</h2>
          <p className="text-slate-400 mb-10">
            Join thousands of self-employed professionals building wealth with confidence.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
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
