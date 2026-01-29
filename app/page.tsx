import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import {
  TrendingUp,
  CreditCard,
  PieChart,
  Calculator,
  Clock,
  Globe,
  CheckCircle,
  Star,
  Shield,
  ChevronDown,
} from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Custom styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-gradient {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        }
        .card-glow {
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.1);
        }
        .btn-glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
        .btn-glow:hover {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
        }
      `}} />

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
              <span className="font-bold text-xl text-slate-900">SoloFI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition">Pricing</a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 transition">FAQ</a>
            </div>
            <SignInButton mode="modal">
              <button className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition btn-glow">
                Launch App
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient pt-16 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Social Proof Bar */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 border-2 border-white"></div>
              </div>
              <span className="text-sm text-slate-600"><strong className="text-slate-900">2,847+</strong> consultants optimizing their finances</span>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-slate-900">
              <span className="gradient-text">Build wealth. Reduce taxes.</span>
              <br />Retire on your terms.
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Track net worth, optimize your portfolio, plan retirement, and maximize tax savings. Built for self-employed professionals and independent consultants.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <SignInButton mode="modal">
                <button className="bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition btn-glow">
                  Start Free - Launch App
                </button>
              </SignInButton>
              <a href="#features" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 transition border border-slate-200 shadow-sm">
                See All Features
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span>14-Day Money Back</span>
              </div>
            </div>
          </div>

          {/* Product Preview */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-w-4xl mx-auto card-glow shadow-xl">
              <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-4 text-sm text-slate-500 font-mono">solofi.com</span>
              </div>
              <div className="p-8 bg-slate-50">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Net Worth</p>
                    <p className="text-2xl font-bold text-blue-600 font-mono">$847,293</p>
                    <p className="text-xs text-green-600 mt-1">+12.4% YTD</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Portfolio Value</p>
                    <p className="text-2xl font-bold text-blue-600 font-mono">$523,800</p>
                    <p className="text-xs text-cyan-600 mt-1">Optimized</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Tax Savings</p>
                    <p className="text-2xl font-bold text-blue-600 font-mono">$34,800</p>
                    <p className="text-xs text-emerald-600 mt-1">S-Corp Optimized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / As Seen In */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm text-slate-400 uppercase tracking-wider mb-8">Trusted by consultants from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            <div className="text-2xl font-bold text-slate-400">McKinsey</div>
            <div className="text-2xl font-bold text-slate-400">Deloitte</div>
            <div className="text-2xl font-bold text-slate-400">BCG</div>
            <div className="text-2xl font-bold text-slate-400">Accenture</div>
            <div className="text-2xl font-bold text-slate-400">KPMG</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-2">EVERYTHING YOU NEED</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Built for Financial Optimization</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A complete financial command center. Track, analyze, and optimize every dollar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Net Worth Dashboard</h3>
              <p className="text-slate-600">
                Real-time net worth tracking across all accounts. Visualize your complete financial picture with interactive charts and trends.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Credit Card Optimizer</h3>
              <p className="text-slate-600">
                Track sign-up bonuses, spending requirements, and annual fees. Never miss a deadline or overpay for cards again.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Portfolio Optimizer</h3>
              <p className="text-slate-600">
                Asset allocation analysis with tax-location strategy. See exactly where to place assets for maximum tax efficiency.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Tax Calculator</h3>
              <p className="text-slate-600">
                S-Corp vs Sole Prop analysis, FEIE support, quarterly estimated taxes, and Solo 401k optimization. Maximize every write-off.
              </p>
            </div>

            {/* Feature: Tax Optimization */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Tax Optimization Dashboard</h3>
              <p className="text-slate-600">
                Import TurboTax returns, analyze tax health score, track deduction efficiency, and get quarterly payment reminders. Find your S-Corp break-even point.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Retirement Calculator</h3>
              <p className="text-slate-600">
                FIRE planning with geo-arbitrage insights. Calculate your retirement number based on location, lifestyle, and withdrawal strategy.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Geo Arbitrage Planner</h3>
              <p className="text-slate-600">
                Compare cost of living across 100+ cities worldwide. See how relocating could accelerate your path to financial independence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Loved by Optimization Nerds</h2>
            <p className="text-xl text-slate-600">Join thousands of consultants who&apos;ve transformed their financial tracking</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-blue-500 fill-blue-500" />
                ))}
              </div>
              <p className="text-slate-600 mb-6">&quot;The tax calculator alone saved me $12K by showing me when to switch to S-Corp. The portfolio optimizer is next level.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                <div>
                  <p className="font-semibold text-slate-900">Sarah K.</p>
                  <p className="text-sm text-slate-500">Strategy Consultant</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-blue-500 fill-blue-500" />
                ))}
              </div>
              <p className="text-slate-600 mb-6">&quot;The retirement calculator with geo-arbitrage was eye-opening. I can retire 5 years earlier than I thought possible.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600"></div>
                <div>
                  <p className="font-semibold text-slate-900">Marcus T.</p>
                  <p className="text-sm text-slate-500">Independent Consultant</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-blue-500 fill-blue-500" />
                ))}
              </div>
              <p className="text-slate-600 mb-6">&quot;Finally a tool that understands consultant finances. The Sole Prop vs S-Corp comparison is exactly what I needed. My CPA was impressed.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600"></div>
                <div>
                  <p className="font-semibold text-slate-900">Jennifer L.</p>
                  <p className="text-sm text-slate-500">Fractional CFO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-2">SIMPLE PRICING</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Choose Your Plan</h2>
            <p className="text-xl text-slate-600">Start free, upgrade when you need more. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition bg-white">
              <h3 className="text-lg font-semibold text-slate-500 mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-600 mb-6">Get started with basic features.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-700">Net Worth Tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-700">Basic Dashboard</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Portfolio Optimizer</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Retirement Calculator</span>
                </li>
              </ul>
              <SignInButton mode="modal">
                <button className="block w-full text-center bg-slate-100 text-slate-900 py-3 rounded-xl font-semibold hover:bg-slate-200 transition border border-slate-200">
                  Get Started Free
                </button>
              </SignInButton>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="border-2 border-blue-500 rounded-2xl p-8 relative bg-white card-glow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full">MOST POPULAR</span>
              </div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-slate-900">$9</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-600 mb-6">Advanced tools for serious planners.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-700">Everything in Free</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900">Portfolio Optimizer</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900">Credit Card Tracker</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900">Retirement Calculator</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900">Google Sheets Sync</span>
                </li>
              </ul>
              <Link href="/pricing" className="block w-full text-center bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition btn-glow">
                Get Pro
              </Link>
              <p className="text-center text-sm text-slate-500 mt-3">or $90/year (save 17%)</p>
            </div>

            {/* Premium Tier */}
            <div className="border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition bg-white">
              <h3 className="text-lg font-semibold text-cyan-600 mb-2">Premium</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-slate-900">$19</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-600 mb-6">Full access to all features.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-700">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900">Geo Arbitrage Analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900">Scenario Comparisons</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900">Tax Calculator</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900">Priority Support</span>
                </li>
              </ul>
              <Link href="/pricing" className="block w-full text-center bg-cyan-500 text-white py-3 rounded-xl font-semibold hover:bg-cyan-600 transition">
                Get Premium
              </Link>
              <p className="text-center text-sm text-slate-500 mt-3">or $190/year (save 17%)</p>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 px-6 py-3 rounded-full">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="text-blue-700 font-medium">14-Day Money-Back Guarantee - Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Everything you need to know before you start</p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Is this a web app or a spreadsheet?"
              answer="SoloFI is a modern web application that works on any device with a browser. Your data is securely stored in the cloud, so you can access your finances from anywhere. No downloads required."
            />
            <FAQItem
              question="Is my financial data secure?"
              answer="Absolutely. We use bank-level encryption (AES-256) and your data is never shared with third parties. We use Clerk for authentication, ensuring enterprise-grade security for your account."
            />
            <FAQItem
              question="How accurate is the tax calculator?"
              answer="The tax calculator uses 2024 federal tax brackets and supports state taxes for major states. It includes S-Corp vs Sole Prop analysis, Solo 401k calculations, and FEIE support. While highly accurate for planning, always consult a CPA for final tax decisions."
            />
            <FAQItem
              question="Can I try it before I pay?"
              answer="Yes! You can sign up and explore the app for free. The basic features are available immediately. We also offer a 14-day money-back guarantee on all paid plans, so you can try the full experience risk-free."
            />
            <FAQItem
              question="What if I'm not satisfied with the purchase?"
              answer="We offer a 14-day, no-questions-asked money-back guarantee. If SoloFI doesn't meet your expectations for any reason, just email us at support@solofi.com and we'll refund you in full. Zero risk."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-cyan-50 border-y border-blue-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900">Ready to Optimize Your Finances?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join 2,847+ consultants who&apos;ve taken control of their net worth, optimized their portfolios, and maximized their tax savings.
          </p>
          <SignInButton mode="modal">
            <button className="inline-block bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition btn-glow">
              Launch App - Start Free
            </button>
          </SignInButton>
          <p className="text-slate-500 mt-4 text-sm">Subscription plans. Cancel anytime. 14-day money-back guarantee.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
              <span className="font-bold text-white text-xl">SoloFI</span>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="mailto:support@solofi.com" className="hover:text-white transition">Contact</a>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} SoloFI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="bg-slate-50 border border-slate-200 rounded-xl group">
      <summary className="flex justify-between items-center w-full text-left p-6 cursor-pointer list-none">
        <span className="font-semibold text-lg text-slate-900">{question}</span>
        <ChevronDown className="w-5 h-5 text-slate-500 transform transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-6 text-slate-600">
        {answer}
      </div>
    </details>
  );
}
