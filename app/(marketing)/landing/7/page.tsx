import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Calculator, PiggyBank, Globe, CreditCard, BarChart3,
  Shield, FileText, ArrowRight, Zap
} from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 7: Feature Grid - Icons and features layout, very scannable
export const metadata = {
  title: "SoloFI - All-in-One Financial Toolkit for Freelancers",
};

const VARIANT = "landing_7_features";

export default function Landing7() {
  const features = [
    {
      icon: TrendingUp,
      title: "Net Worth Tracker",
      desc: "Track all assets and debts in one dashboard",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Calculator,
      title: "Tax Calculator",
      desc: "Optimize Solo 401k, SEP IRA, and HSA contributions",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: PiggyBank,
      title: "Retirement Planner",
      desc: "Monte Carlo simulations with 1,000 scenarios",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: Globe,
      title: "Geo-Arbitrage",
      desc: "Compare cost of living across cities worldwide",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: CreditCard,
      title: "Credit Card Tracker",
      desc: "Manage bonuses, annual fees, and spend targets",
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      icon: BarChart3,
      title: "Portfolio Optimizer",
      desc: "Risk-adjusted allocation recommendations",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      icon: Shield,
      title: "Early Retirement",
      desc: "FI readiness, Coast FI, and withdrawal planning",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: FileText,
      title: "Business Structure",
      desc: "Compare LLC vs S-Corp tax implications",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">SoloFI</span>
          <TrackedLink
            href="/dashboard"
            trackingAction="get_started"
            trackingLocation="nav"
            trackingVariant={VARIANT}
            buttonProps={{}}
          >
            Get Started
          </TrackedLink>
        </div>
      </nav>

      {/* Hero - Compact */}
      <section className="bg-white py-16 border-b">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            8 powerful tools in one platform
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything you need for financial freedom
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            The complete toolkit for self-employed professionals to track wealth, optimize taxes, and plan retirement.
          </p>
          <TrackedLink
            href="/dashboard"
            trackingAction="start_free"
            trackingLocation="hero"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg" }}
          >
            Start Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-white py-20 border-t">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why SoloFI?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">$0</div>
              <p className="text-gray-600">Free to get started</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">10 min</div>
              <p className="text-gray-600">To see your complete picture</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">$50K+</div>
              <p className="text-gray-600">Average annual tax savings found</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for self-employed professionals
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border">
              <div className="text-2xl mb-4">💻</div>
              <h3 className="font-semibold text-gray-900 mb-2">Freelancers</h3>
              <p className="text-gray-600 text-sm">
                Track variable income, maximize deductions, plan for retirement without employer benefits.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border">
              <div className="text-2xl mb-4">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Consultants</h3>
              <p className="text-gray-600 text-sm">
                Compare S-Corp vs LLC, optimize Solo 401k contributions, understand quarterly taxes.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border">
              <div className="text-2xl mb-4">🏢</div>
              <h3 className="font-semibold text-gray-900 mb-2">Small Business Owners</h3>
              <p className="text-gray-600 text-sm">
                Separate business and personal finances, plan exit strategy, build generational wealth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to take control?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of self-employed professionals using SoloFI.
          </p>
          <TrackedLink
            href="/dashboard"
            trackingAction="create_account"
            trackingLocation="cta_section"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg", variant: "secondary" }}
          >
            Create Free Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
