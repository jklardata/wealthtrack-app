import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Flame,
  DollarSign,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Calculator,
  Target,
  PiggyBank,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free FIRE Calculator | Financial Independence Calculator | SoloFI",
  description: "Calculate when you can retire early with our free FIRE calculator. Find your FIRE number, retirement age, and savings rate. Perfect for financial independence planning.",
  keywords: "fire calculator, financial independence calculator, early retirement calculator, fire number calculator, coastFI calculator, baristaFI calculator, how much to retire early",
  openGraph: {
    title: "Free FIRE Calculator - When Can You Retire Early?",
    description: "Calculate your path to financial independence and early retirement. Free calculator shows your FIRE number, timeline, and savings strategy.",
    type: "website",
  },
};

export default function FIRECalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 border-b-2 border-black py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold border-2 border-orange-300">
                100% FREE • NO SIGNUP
              </span>
            </div>

            <div className="inline-flex items-center justify-center gap-2">
              <Flame className="h-16 w-16 text-orange-600" />
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight">
              When Can You
              <br />
              <span className="text-orange-600">Retire Early?</span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-slate-700 max-w-3xl mx-auto">
              Calculate your Financial Independence, Retire Early (FIRE) number and find out exactly when you can quit your job and live off investments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/tools/fi-calculator">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-6 h-auto"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate My FIRE Number
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-600">
              ✓ Free forever • ✓ No credit card • ✓ Results in 60 seconds
            </p>
          </div>
        </div>
      </section>

      {/* Quick Example */}
      <section className="py-12 bg-white border-b-2 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-black rounded-lg p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">
              Quick Example: Path to FIRE
            </h2>

            <div className="space-y-6">
              <div className="bg-white border-2 border-slate-300 rounded-lg p-6">
                <h3 className="text-lg font-black text-slate-700 mb-4">Your Situation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current age:</span>
                    <span className="font-bold">35 years old</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual expenses:</span>
                    <span className="font-bold">$60,000/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current savings:</span>
                    <span className="font-bold">$100,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual savings:</span>
                    <span className="font-bold">$40,000/year</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-6">
                <h3 className="text-lg font-black text-orange-700 mb-4">Your FIRE Results</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">FIRE Number (25x expenses):</span>
                    <span className="text-2xl font-black text-orange-600">$1,500,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Years to FIRE:</span>
                    <span className="text-2xl font-black text-orange-600">15.8 years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retirement age:</span>
                    <span className="text-2xl font-black text-orange-600">51 years old</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg border-2 border-emerald-700">
                  <div className="text-sm font-bold">Safe Withdrawal Rate</div>
                  <div className="text-3xl font-black">4% ($60,000/year)</div>
                </div>
                <p className="text-xs text-slate-600 mt-3">
                  Based on the Trinity Study - 95% success rate over 30 years
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is FIRE Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              What is FIRE?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Financial Independence, Retire Early (FIRE) is a movement focused on extreme saving and investing to retire decades earlier than traditional retirement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-orange-300 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-600" />
                  The Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  Accumulate enough invested assets (typically 25-30x your annual expenses) so you can live off 4% withdrawals indefinitely without running out of money.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-300 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <PiggyBank className="h-6 w-6 text-emerald-600" />
                  The Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  Live below your means, maximize your savings rate (50%+ is common), invest in index funds, and optimize taxes to reach financial independence faster.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-300 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  The Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  Depending on your savings rate, you can reach FIRE in 10-20 years. A 50% savings rate gets you there in ~17 years, 60% in ~12 years.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FIRE Variations Section */}
      <section className="py-16 bg-white border-t-2 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Types of FIRE
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the FIRE path that matches your lifestyle goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="text-lg font-black">
                  Lean FIRE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-orange-600 mb-2">
                  $1M
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  $40k/year expenses
                </p>
                <p className="text-sm text-slate-700">
                  Minimalist lifestyle, frugal living, low expenses. Fastest path to FIRE.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="text-lg font-black">
                  Regular FIRE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-blue-600 mb-2">
                  $2M
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  $80k/year expenses
                </p>
                <p className="text-sm text-slate-700">
                  Comfortable middle-class lifestyle, moderate expenses, balanced approach.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="text-lg font-black">
                  Fat FIRE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-emerald-600 mb-2">
                  $5M+
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  $200k+/year expenses
                </p>
                <p className="text-sm text-slate-700">
                  Luxurious lifestyle, high expenses, travel extensively, no compromises.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="text-lg font-black">
                  Barista FIRE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-purple-600 mb-2">
                  $0.8M
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  $32k/year + part-time
                </p>
                <p className="text-sm text-slate-700">
                  Part-time work covers expenses, investments provide security and health insurance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The 4% Rule Section */}
      <section className="py-16 bg-slate-50 border-t-2 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              The 4% Rule (Trinity Study)
            </h2>
            <p className="text-lg text-slate-600">
              The foundation of FIRE planning
            </p>
          </div>

          <Card className="border-2 border-black">
            <CardContent className="pt-6 space-y-6">
              <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
                <h3 className="text-xl font-black text-slate-900 mb-3">
                  How It Works
                </h3>
                <p className="text-slate-700 mb-4">
                  The Trinity Study (1998) found that withdrawing 4% of your portfolio annually (adjusted for inflation) has a <strong className="text-orange-600">95% success rate</strong> of lasting 30+ years.
                </p>
                <div className="bg-white p-4 rounded border border-orange-200">
                  <p className="text-sm font-medium text-slate-700">
                    <strong>Formula:</strong> FIRE Number = Annual Expenses × 25
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    If you spend $60,000/year, you need $1,500,000 invested (60,000 × 25)
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4">
                  <h4 className="font-black text-emerald-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Success Factors
                  </h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• 60% stocks / 40% bonds allocation</li>
                    <li>• Low-cost index funds</li>
                    <li>• Inflation-adjusted withdrawals</li>
                    <li>• Rebalance annually</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                  <h4 className="font-black text-blue-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Conservative Options
                  </h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• 3.5% withdrawal = 28.5x expenses</li>
                    <li>• 3% withdrawal = 33x expenses</li>
                    <li>• Better for early retirees (40+ years)</li>
                    <li>• Lower risk of portfolio depletion</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Calculator Features */}
      <section className="py-16 bg-white border-t-2 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              What Our Calculator Shows You
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Your FIRE Number",
                description: "Exact amount you need invested based on your annual expenses and withdrawal rate"
              },
              {
                icon: Calendar,
                title: "Years to FIRE",
                description: "Timeline showing when you'll reach financial independence based on savings rate"
              },
              {
                icon: DollarSign,
                title: "Safe Withdrawal Amount",
                description: "How much you can withdraw annually without running out of money"
              },
              {
                icon: TrendingUp,
                title: "Savings Rate Impact",
                description: "See how increasing your savings rate dramatically shortens your timeline"
              },
              {
                icon: PiggyBank,
                title: "Monthly Savings Goal",
                description: "Exact monthly savings needed to hit your FIRE target date"
              },
              {
                icon: CheckCircle,
                title: "Multiple FIRE Scenarios",
                description: "Compare Lean FIRE, Regular FIRE, Fat FIRE, and Barista FIRE options"
              }
            ].map((feature, idx) => (
              <Card key={idx} className="border-2 border-black">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-orange-600 mb-3" />
                  <CardTitle className="text-lg font-black">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/tools/fi-calculator">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-6 h-auto"
              >
                Calculate Your FIRE Number
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50 border-t-2 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "Is 4% withdrawal rate safe?",
                answer: "The Trinity Study showed a 95% success rate over 30 years with a 60/40 portfolio. For longer retirements (40+ years), consider 3.5% or 3% for extra safety. Adjust withdrawals based on market performance."
              },
              {
                question: "What if I retire before 59.5? Can I access retirement accounts?",
                answer: "Yes! Use the Roth Conversion Ladder or 72(t) SEPP to access retirement funds penalty-free before 59.5. Many FIRE retirees use a combination of taxable accounts, Roth conversions, and strategic withdrawals."
              },
              {
                question: "How much should I save each month to reach FIRE?",
                answer: "It depends on your FIRE number and timeline. A 50% savings rate gets you to FIRE in ~17 years, 60% in ~12 years, 70% in ~8.5 years. Our calculator shows your exact monthly savings goal."
              },
              {
                question: "Should I pay off my mortgage before FIRE?",
                answer: "It depends on your interest rate and risk tolerance. Low-rate mortgages (<4%) can be kept while investing returns more. High-rate debt should be paid off. Many FIRE retirees keep mortgages for flexibility."
              },
              {
                question: "What about healthcare costs before Medicare?",
                answer: "Healthcare is a major expense from FIRE to age 65. Options include: ACA marketplace (with subsidies if MAGI is low), spouse's employer coverage, part-time work for benefits, health sharing ministries, or international living."
              },
              {
                question: "Can I really retire in my 30s or 40s?",
                answer: "Yes! Thousands have done it. The key is high income, low expenses, and aggressive saving (50%+ savings rate). It requires lifestyle optimization and investment discipline, but it's mathematically achievable."
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
      <section className="py-16 bg-gradient-to-br from-orange-600 to-red-600 border-t-2 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Flame className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Start Your FIRE Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Calculate your path to financial independence in under 60 seconds.
          </p>
          <Link href="/tools/fi-calculator">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-slate-100 text-lg px-8 py-6 h-auto"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate My FIRE Number
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-white/80 mt-4">
            Free forever • No signup required • Join 10,000+ on the path to FIRE
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
            "name": "FIRE Calculator",
            "description": "Free Financial Independence Retire Early calculator to determine when you can retire",
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
