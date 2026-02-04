import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Calculator, PieChart, Building2, TrendingUp, Shield, Lock, Eye } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

export const metadata = {
  title: "SoloFI - Financial Decision Engine for Self-Employed Professionals",
  description: "SoloFI helps self-employed professionals model tax strategies, retirement outcomes, and portfolio decisions.",
};

// Force deployment refresh

const VARIANT = "landing_21_decision_engine";

export default function Landing21() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LandingAnalytics variant={VARIANT} />

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link href="https://solofi.io">
          <span className="text-lg sm:text-xl font-semibold text-slate-900 cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-emerald-600">Solo</span>FI
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/blog" className="hidden sm:block text-slate-600 hover:text-slate-900 text-sm">
            Resources
          </Link>
          <Link href="/pricing" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm">
            Pricing
          </Link>
          <TrackedLink
            href="/sign-in"
            trackingAction="sign_in"
            trackingLocation="nav"
            trackingVariant={VARIANT}
            buttonProps={{ variant: "ghost", className: "text-slate-600 text-xs sm:text-sm px-2 sm:px-4" }}
          >
            Sign in
          </TrackedLink>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-3 sm:mb-4 leading-tight">
            <span className="block">Build wealth.</span>
            <span className="block">Reduce taxes.</span>
            <span className="block">Retire on your terms.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed">
            Model tax strategies, retirement outcomes, and portfolio decisions.
          </p>
          <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8 max-w-xl mx-auto">
            No asset transfers. No account linking required. Just clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <TrackedLink
              href="/sign-up"
              trackingAction="get_started"
              trackingLocation="hero"
              trackingVariant={VARIANT}
              buttonProps={{ size: "lg", className: "bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-6 text-base sm:text-lg" }}
            >
              Start modeling
              <ArrowRight className="ml-2 h-5 w-5" />
            </TrackedLink>

          </div>
        </div>

        {/* Product Preview */}
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 overflow-hidden shadow-lg">
            <div className="bg-slate-100 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 border-b border-slate-200">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
              <span className="ml-2 sm:ml-4 text-xs sm:text-sm text-slate-500 font-mono">solofi.io</span>
            </div>
            <div className="p-3 sm:p-6 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-sm flex sm:block items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Net Worth</p>
                    <p className="text-xs text-emerald-600 sm:hidden">+12.4% YTD</p>
                  </div>
                  <p className="text-lg sm:text-2xl font-semibold text-slate-900 font-mono">$847K</p>
                  <p className="text-xs text-emerald-600 mt-0.5 hidden sm:block">+12.4% YTD</p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-sm flex sm:block items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Portfolio</p>
                    <p className="text-xs text-emerald-600 sm:hidden">Tax-optimized</p>
                  </div>
                  <p className="text-lg sm:text-2xl font-semibold text-slate-900 font-mono">$524K</p>
                  <p className="text-xs text-emerald-600 mt-0.5 hidden sm:block">Tax-optimized</p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-sm flex sm:block items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Tax Savings</p>
                    <p className="text-xs text-slate-500 sm:hidden">S-Corp</p>
                  </div>
                  <p className="text-lg sm:text-2xl font-semibold text-emerald-600 font-mono">$35K</p>
                  <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">S-Corp optimized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value Pillars */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-medium text-slate-900 text-center mb-3 sm:mb-4">What SoloFI does</h2>
          <p className="text-sm sm:text-base text-slate-600 text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            A <span className="font-semibold">decision engine</span>, not a brokerage. Understand the implications of financial choices before you make them.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-8 border-t-2 border-t-emerald-500">
              <h3 className="text-lg font-medium text-slate-900 mb-3">Decision Modeling</h3>
              <p className="text-slate-600 mb-4">
                Compare Self Employment vs W-2. Roth conversion now vs later. Retire at 40 vs 55.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Business structure comparison
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Retirement timeline scenarios
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Tax strategy simulations
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 border-t-2 border-t-emerald-500">
              <h3 className="text-lg font-medium text-slate-900 mb-3">Tax Optimization</h3>
              <p className="text-slate-600 mb-4">
                Understand your effective tax rate across federal, state, and self-employment taxes. Model the impact of contributions, deductions, and business decisions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Solo 401k and SEP IRA modeling
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  S-Corp salary optimization
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Quarterly tax estimates
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 border-t-2 border-t-emerald-500">
              <h3 className="text-lg font-medium text-slate-900 mb-3">Unified Financial View</h3>
              <p className="text-slate-600 mb-4">
                Track net worth across all accounts without linking them. Manual entry keeps you in control while giving you a complete picture of where you stand.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Net worth tracking over time
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Asset allocation analysis
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Tax-location optimization
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 border-t-2 border-t-emerald-500">
              <h3 className="text-lg font-medium text-slate-900 mb-3">Retirement Planning</h3>
              <p className="text-slate-600 mb-4">
                Run Monte Carlo simulations on your retirement plan. See probability of success across different withdrawal rates, market conditions, and timelines.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  FIRE number calculations
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Geographic arbitrage modeling
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Safe withdrawal rate analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who SoloFI is for */}
      <section className="bg-white border-y border-slate-200 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-medium text-slate-900 text-center mb-3 sm:mb-4">Built for complex financial lives</h2>
          <p className="text-sm sm:text-base text-slate-600 text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
            Built for people with multiple income streams, complicated taxes, and long term planning.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">Independent Consultants</h3>
              <p className="text-xs sm:text-sm text-slate-500">Managing variable income, quarterly taxes, and business structure decisions</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">Self-Employed Professionals</h3>
              <p className="text-xs sm:text-sm text-slate-500">Navigating Solo 401k, SEP IRA, and S-Corp election timing</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">Business Owners</h3>
              <p className="text-xs sm:text-sm text-slate-500">Coordinating personal and business finances with exit planning</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">High Earners</h3>
              <p className="text-xs sm:text-sm text-slate-500">Optimizing across tax brackets, investment accounts, and retirement vehicles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiation */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-medium text-center mb-3 sm:mb-4">A different kind of financial tool</h2>
          <p className="text-sm sm:text-base text-slate-400 text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            Most platforms want to hold your assets or sell you products. SoloFI exists to help you think clearly.
          </p>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5 text-slate-300">Typical platforms</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2" />
                  <span className="text-sm sm:text-base text-slate-400">Require asset transfers or account linking</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2" />
                  <span className="text-sm sm:text-base text-slate-400">Optimized for AUM fees or product sales</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2" />
                  <span className="text-sm sm:text-base text-slate-400">Generic advice that doesn't account for self-employment</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2" />
                  <span className="text-sm sm:text-base text-slate-400">Lock you into their ecosystem</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5 text-white">SoloFI</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">No asset transfers. Your money stays where it is.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Simple subscription. No hidden incentives.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Built specifically for self-employed tax complexity</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Use alongside any advisor or platform you choose</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Optimization Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Tax optimization that understands self-employment</h2>
              <p className="text-slate-600 mb-6">
                Self-employment taxes add 15.3% before you even get to income tax. The right structure and timing decisions can save tens of thousands per year—but only if you can model the tradeoffs accurately.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calculator className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">S-Corp election timing</h4>
                    <p className="text-sm text-slate-500">See exactly when an S-Corp saves you money vs adds complexity</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Retirement contribution strategy</h4>
                    <p className="text-sm text-slate-500">Solo 401k vs SEP IRA vs both—modeled for your specific income</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PieChart className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Quarterly estimate planning</h4>
                    <p className="text-sm text-slate-500">Avoid penalties and surprise bills with accurate projections</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-8 border-t-2 border-t-emerald-500">
              <div className="text-sm text-slate-500 mb-4">Example: $250k consulting income</div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Sole Proprietorship</span>
                    <span className="font-medium text-slate-900">$78,400 total tax</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full">
                    <div className="h-2 bg-slate-400 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">S-Corp (optimized salary)</span>
                    <span className="font-medium text-emerald-600">$64,200 total tax</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full">
                    <div className="h-2 bg-emerald-500 rounded-full" style={{ width: "82%" }}></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Annual savings</span>
                    <span className="font-medium text-emerald-600">$14,200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Retirement Planning Section */}
      <section className="bg-white border-y border-slate-200 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                <div className="text-sm text-slate-500 mb-6">Retirement scenario comparison</div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                    <div>
                      <div className="font-medium text-slate-900">Retire at 55</div>
                      <div className="text-sm text-slate-500">$2.1M target</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-amber-600">78% success</div>
                      <div className="text-sm text-slate-500">Monte Carlo</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200">
                    <div>
                      <div className="font-medium text-slate-900">Retire at 58</div>
                      <div className="text-sm text-slate-500">$2.1M target</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-emerald-600">94% success</div>
                      <div className="text-sm text-slate-500">Monte Carlo</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                    <div>
                      <div className="font-medium text-slate-900">Retire at 55 (Portugal)</div>
                      <div className="text-sm text-slate-500">$1.4M target</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-emerald-600">91% success</div>
                      <div className="text-sm text-slate-500">Monte Carlo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Retirement planning with real numbers</h2>
              <p className="text-slate-600 mb-6">
                Generic retirement calculators assume a steady salary and employer 401k match. Your situation is different. Model retirement scenarios that account for variable income, self-employment tax savings, and geographic flexibility.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Monte Carlo simulations with 1,000+ scenarios
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Coast FI and Barista FI calculations
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Geographic arbitrage with cost-of-living data
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Safe withdrawal rate sensitivity analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Principles */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-slate-900 text-center mb-4">Our principles</h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            How we think about building financial tools.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">Clarity over complexity</h3>
              <p className="text-sm text-slate-500">
                Financial decisions are hard enough. Our job is to make the implications clear, not to add more noise.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">Independence by design</h3>
              <p className="text-sm text-slate-500">
                We don't hold your assets or earn commissions. Our only incentive is to be useful enough that you keep subscribing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">Your data stays yours</h3>
              <p className="text-sm text-slate-500">
                No account linking required. No selling data. Export everything anytime. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-emerald-50 py-16">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-xl font-medium text-slate-900 mb-3">Tax strategies for the self-employed</h2>
          <p className="text-slate-600 mb-6">
            Occasional emails on tax optimization, retirement planning, and financial modeling. No spam, no sales pitches.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-lg border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm"
            />
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-medium text-slate-900 mb-4">Start modeling your financial decisions</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Free to start. No credit card required. See what clarity looks like before your next big financial decision.
          </p>
          <TrackedLink
            href="/sign-up"
            trackingAction="create_account"
            trackingLocation="cta_section"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg", className: "bg-emerald-600 hover:bg-emerald-700 text-white px-8" }}
          >
            Create free account
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
            <span>© 2026 SoloFI</span>
            <div className="flex gap-8">
              <Link href="/blog" className="hover:text-slate-700">Resources</Link>
              <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
