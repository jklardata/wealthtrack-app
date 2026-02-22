import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, Building2, BarChart3, Shield, FileText } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 3: Professional/Enterprise - Corporate, trust-focused
export const metadata = {
  title: "SoloFI - Enterprise-Grade Financial Planning for Independent Professionals",
  alternates: {
    canonical: "https://solofi.io",
  },
};

const VARIANT = "landing_3_professional";

export default function Landing3() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LandingAnalytics variant={VARIANT} />

      {/* Nav */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-slate-900" />
            <span className="text-xl font-semibold text-slate-900">SoloFI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-slate-600 hover:text-slate-900">Features</Link>
            <Link href="#security" className="text-slate-600 hover:text-slate-900">Security</Link>
            <Link href="#pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
          </div>
          <TrackedLink
            href="/dashboard"
            trackingAction="get_started"
            trackingLocation="nav"
            trackingVariant={VARIANT}
            buttonProps={{}}
          >
            Access Platform
          </TrackedLink>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-slate-400 uppercase tracking-wider text-sm mb-4">
              Financial Management Platform
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Sophisticated wealth management for independent professionals
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Comprehensive financial planning, tax optimization, and retirement projection tools designed for consultants, freelancers, and self-employed business owners.
            </p>
            <div className="flex flex-wrap gap-4">
              <TrackedLink
                href="/dashboard"
                trackingAction="start_trial"
                trackingLocation="hero"
                trackingVariant={VARIANT}
                buttonProps={{ size: "lg", className: "bg-white text-slate-900 hover:bg-slate-100" }}
              >
                Request Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </TrackedLink>
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 items-center text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Bank-Level Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span>Real-Time Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Financial Suite</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Purpose-built tools for the unique financial needs of self-employed professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-slate-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Net Worth Intelligence</h3>
                <p className="text-slate-600 mb-4">
                  Aggregate and analyze your complete financial position across all accounts. Track assets, liabilities, and net worth trends with institutional-grade reporting.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Multi-account aggregation</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Historical trend analysis</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Customizable reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Tax Optimization Engine</h3>
                <p className="text-slate-600 mb-4">
                  Maximize tax-advantaged contributions across Solo 401(k), SEP IRA, HSA, and other vehicles. Compare business structures for optimal tax efficiency.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Contribution limit calculations</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> S-Corp vs LLC analysis</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Quarterly tax estimates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Retirement Projections</h3>
                <p className="text-slate-600 mb-4">
                  Monte Carlo simulation-powered projections to understand your path to financial independence with confidence intervals and scenario analysis.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> 1,000+ simulation scenarios</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Safe withdrawal rate analysis</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Sequence of returns risk</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Portfolio Optimization</h3>
                <p className="text-slate-600 mb-4">
                  Risk-adjusted portfolio recommendations based on modern portfolio theory. Optimize asset allocation across tax-advantaged and taxable accounts.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Efficient frontier analysis</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Tax-loss harvesting</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Rebalancing recommendations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to optimize your financial strategy?
          </h2>
          <p className="text-slate-400 mb-8">
            Join leading independent professionals who trust SoloFI for comprehensive financial management.
          </p>
          <TrackedLink
            href="/dashboard"
            trackingAction="create_account"
            trackingLocation="cta_section"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg", className: "bg-white text-slate-900 hover:bg-slate-100" }}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-slate-900" />
              <span className="font-semibold text-slate-900">SoloFI</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-900">Terms of Service</Link>
              <Link href="/security" className="hover:text-slate-900">Security</Link>
            </div>
            <p className="text-sm text-slate-500">© 2026 SoloFI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
