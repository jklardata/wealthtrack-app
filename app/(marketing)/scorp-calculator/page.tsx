import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  DollarSign,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Calculator,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free S-Corp Calculator | Should You Form an S-Corp? | SoloFI",
  description: "Calculate if forming an S-Corp will save you money. Free calculator shows your exact savings on self-employment taxes. Compare LLC vs S-Corp for freelancers and consultants.",
  keywords: "s corp calculator, s corporation calculator, llc vs s corp calculator, self employment tax savings, should i form an s corp, s corp savings calculator",
  openGraph: {
    title: "Free S-Corp Calculator - Calculate Your Tax Savings",
    description: "Find out if forming an S-Corp will save you money. Free calculator compares LLC vs S-Corp tax savings for self-employed professionals.",
    type: "website",
  },
};

export default function SCorpCalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b-2 border-black py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border-2 border-blue-300">
                100% FREE • INSTANT RESULTS
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight">
              Should You Form
              <br />
              <span className="text-blue-600">an S-Corporation?</span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-slate-700 max-w-3xl mx-auto">
              Calculate your exact self-employment tax savings. Most self-employed people making over <strong className="text-blue-600">$60,000/year</strong> save money with an S-Corp.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/tools/scorp-calculator">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate My S-Corp Savings
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-600">
              ✓ Free forever • ✓ No signup required • ✓ Results in 30 seconds
            </p>
          </div>
        </div>
      </section>

      {/* Quick Example Section */}
      <section className="py-12 bg-white border-b-2 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-black rounded-lg p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">
              Quick Example: The S-Corp Advantage
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-slate-300 rounded-lg p-6">
                <h3 className="text-lg font-black text-slate-700 mb-4">
                  As LLC / Sole Proprietor
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Net profit:</span>
                    <span className="font-bold">$150,000</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Self-employment tax (15.3%):</span>
                    <span className="font-bold">-$22,950</span>
                  </div>
                  <div className="border-t-2 border-slate-200 pt-3 flex justify-between font-black text-lg">
                    <span>After SE tax:</span>
                    <span>$127,050</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-lg p-6">
                <h3 className="text-lg font-black text-emerald-700 mb-4">
                  As S-Corporation
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>W-2 salary:</span>
                    <span className="font-bold">$80,000</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Payroll tax (15.3%):</span>
                    <span className="font-bold">-$12,240</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>S-Corp distribution (tax-free):</span>
                    <span className="font-bold">+$70,000</span>
                  </div>
                  <div className="border-t-2 border-emerald-300 pt-3 flex justify-between font-black text-lg">
                    <span>After taxes:</span>
                    <span>$137,760</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg border-2 border-emerald-700">
                <div className="text-sm font-bold">Annual Tax Savings</div>
                <div className="text-3xl font-black">$10,710</div>
              </div>
              <p className="text-xs text-slate-600 mt-3">
                Plus: Avoid $750/year in extra Medicare tax
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              The Self-Employment Tax Problem
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              As a sole proprietor or LLC, you pay 15.3% self-employment tax on ALL your profit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  Double Taxation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  You pay both the employer (7.65%) AND employee (7.65%) portions of Social Security and Medicare taxes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-300 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                  No Salary Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  Every dollar of profit is subject to 15.3% SE tax, up to $168,600 (2024), then 2.9% Medicare tax continues forever.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-300 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Scales with Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  The more successful you become, the more you lose to SE tax. Making $200k? That's $30,600 in SE tax alone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-white border-t-2 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border-2 border-blue-300">
                THE SOLUTION
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              How S-Corps Save You Money
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Split your income into <strong>W-2 salary</strong> (subject to payroll tax) and <strong>distributions</strong> (not subject to SE tax).
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="text-2xl font-black flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  Step 1: Pay Yourself a Reasonable Salary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  The IRS requires you to pay yourself a "reasonable salary" for the work you do. This is subject to normal payroll taxes (15.3%).
                </p>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-sm font-medium text-slate-700">
                    <strong>Example:</strong> If you make $150k and industry standard salary is $80k, pay yourself $80k as W-2 wages.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="text-2xl font-black flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  Step 2: Take the Rest as Distributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  Any remaining profit can be distributed to you as an owner distribution. This is <strong>NOT subject to self-employment tax</strong>—you only pay income tax.
                </p>
                <div className="bg-emerald-50 p-4 rounded border border-emerald-300">
                  <p className="text-sm font-medium text-slate-700">
                    <strong>Example:</strong> The remaining $70k is distributed to you. You save 15.3% SE tax on this amount = <strong className="text-emerald-600">$10,710 savings</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-400 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-2xl font-black flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                  The Result: Massive Tax Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Save $8,000-$15,000/year on self-employment taxes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Avoid extra 0.9% Medicare tax on high earnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Write off more business expenses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Deduct health insurance premiums pre-tax</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/tools/scorp-calculator">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto"
              >
                Calculate My Exact Savings
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* When to Form Section */}
      <section className="py-16 bg-slate-50 border-t-2 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            When Should You Form an S-Corp?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-emerald-400 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-xl font-black text-emerald-900">
                  ✅ Form an S-Corp If:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>You're making <strong>$60,000+</strong> in net profit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Your business is <strong>stable and profitable</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>You can afford <strong>$2,000-$3,000/year</strong> in extra accounting costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>You want to <strong>maximize retirement contributions</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>You're planning to <strong>keep the business long-term</strong></span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-400 bg-red-50">
              <CardHeader>
                <CardTitle className="text-xl font-black text-red-900">
                  ❌ Stay LLC/Sole Prop If:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>You're making <strong>under $60,000</strong> in net profit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Your income is <strong>highly variable or unpredictable</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>You're in your <strong>first year</strong> of business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>You can't afford a <strong>CPA and payroll service</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>You want to <strong>keep things simple</strong></span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t-2 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "What's a 'reasonable salary' for S-Corp owners?",
                answer: "The IRS requires you to pay yourself what someone would earn doing your job in your industry and location. For most consultants, this is $60,000-$120,000 depending on experience and field. Industry salary data (BLS.gov) is a good benchmark."
              },
              {
                question: "What are the extra costs of running an S-Corp?",
                answer: "Expect to pay $2,000-$3,000/year for: CPA ($1,500-$2,500), payroll service ($500-$1,000), state filing fees ($200-$800). These costs are worth it once you're saving $8,000+ in taxes."
              },
              {
                question: "Can I convert my existing LLC to an S-Corp?",
                answer: "Yes! You file Form 2553 with the IRS to elect S-Corp tax treatment. Your LLC remains an LLC for state purposes, but is taxed as an S-Corp federally. This is the most common approach."
              },
              {
                question: "Do I need to do payroll if I'm the only employee?",
                answer: "Yes. You must run regular payroll (usually monthly or quarterly) to pay yourself a W-2 salary. Most people use Gusto, QuickBooks Payroll, or similar services ($40-$100/month)."
              },
              {
                question: "What if I pay myself too low of a salary?",
                answer: "The IRS can reclassify your distributions as salary and charge you back taxes, penalties, and interest. Always pay yourself at least industry standard to be safe. Our calculator shows recommended salary ranges."
              },
              {
                question: "Can I still deduct business expenses as an S-Corp?",
                answer: "Yes! All your normal business deductions still apply. Plus, you can deduct health insurance premiums pre-tax (not available to sole proprietors), and you may qualify for additional fringe benefits."
              }
            ].map((faq, idx) => (
              <Card key={idx} className="border-2 border-black">
                <CardHeader>
                  <CardTitle className="text-xl font-black">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 border-t-2 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Find Out If S-Corp is Right for You
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Calculate your exact tax savings in under 30 seconds. Free, no signup required.
          </p>
          <Link href="/tools/scorp-calculator">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-6 h-auto"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate My S-Corp Savings
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-white/80 mt-4">
            Used by 5,000+ self-employed professionals
          </p>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "S-Corp Calculator",
            "description": "Free calculator to determine if forming an S-Corporation will save you money on self-employment taxes",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "SoloFI"
            }
          })
        }}
      />
    </div>
  );
}
