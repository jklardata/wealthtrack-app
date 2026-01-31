import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp, Calculator, Globe, PiggyBank } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 2: Bold/Energetic - Wise-inspired with gradients
export const metadata = {
  title: "SoloFI - Take Control of Your Financial Future",
};

const VARIANT = "landing_2_bold";

export default function Landing2() {
  const features = [
    { icon: TrendingUp, title: "Net Worth Tracking", desc: "See your complete financial picture" },
    { icon: Calculator, title: "Tax Optimization", desc: "Maximize deductions, minimize taxes" },
    { icon: PiggyBank, title: "Retirement Planning", desc: "Know exactly when you can retire" },
    { icon: Globe, title: "Geo-Arbitrage", desc: "Find your ideal retirement location" },
    { icon: Shield, title: "Portfolio Optimizer", desc: "Risk-adjusted asset allocation" },
    { icon: Zap, title: "FIRE Calculator", desc: "Monte Carlo wealth projections" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <LandingAnalytics variant={VARIANT} />

      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          SoloFI
        </span>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{}}
        >
          Get Started
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              Built for freelancers & consultants
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your money.
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Your rules.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The all-in-one financial dashboard for self-employed professionals. Track wealth, optimize taxes, and plan your path to financial independence.
            </p>
            <div className="flex flex-wrap gap-4">
              <TrackedLink
                href="/dashboard"
                trackingAction="start_free"
                trackingLocation="hero"
                trackingVariant={VARIANT}
                buttonProps={{ size: "lg", className: "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700" }}
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </TrackedLink>
              <Button size="lg" variant="outline">
                See Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Net Worth</span>
                  <span className="text-emerald-600 text-sm font-medium">+12.4% YTD</span>
                </div>
                <p className="text-5xl font-bold">$847,320</p>
                <div className="h-32 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-2xl" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">68%</p>
                    <p className="text-xs text-gray-500">FI Progress</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">7.2</p>
                    <p className="text-xs text-gray-500">Years to FI</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$42K</p>
                    <p className="text-xs text-gray-500">Tax Savings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to reach FI</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-2xl border hover:shadow-lg transition-shadow">
              <feature.icon className="h-10 w-10 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-5xl font-bold text-white">$50K+</p>
              <p className="text-gray-400 mt-2">Average tax savings per user</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white">10,000+</p>
              <p className="text-gray-400 mt-2">Self-employed professionals</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white">4.9/5</p>
              <p className="text-gray-400 mt-2">User satisfaction rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to take control?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of self-employed professionals building their path to financial freedom.
        </p>
        <TrackedLink
          href="/dashboard"
          trackingAction="create_account"
          trackingLocation="cta_section"
          trackingVariant={VARIANT}
          buttonProps={{ size: "lg", className: "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700" }}
        >
          Get Started Free
          <ArrowRight className="ml-2 h-5 w-5" />
        </TrackedLink>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
          <span>© 2026 SoloFI. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
