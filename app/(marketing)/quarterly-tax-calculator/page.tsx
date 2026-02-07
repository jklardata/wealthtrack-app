import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  Shield,
  TrendingDown,
  CheckCircle,
  ArrowRight,
  Calculator,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Quarterly Tax Calculator for Self-Employed | SoloFI",
  description: "Calculate your quarterly estimated taxes using IRS safe harbor rules. Free calculator for freelancers, consultants, and self-employed professionals. No signup required.",
  keywords: "quarterly tax calculator, estimated tax calculator, self employed tax calculator, freelance tax calculator, safe harbor calculator, quarterly taxes",
  openGraph: {
    title: "Free Quarterly Tax Calculator for Self-Employed",
    description: "Stop overpaying quarterly taxes. Use IRS safe harbor rules to calculate exactly what you owe. Free, no signup required.",
    type: "website",
  },
};

export default function QuarterlyTaxCalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-b-2 border-black py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold border-2 border-emerald-300">
                100% FREE • NO SIGNUP REQUIRED
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight">
              Stop Overpaying
              <br />
              <span className="text-emerald-600">Quarterly Taxes</span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-slate-700 max-w-3xl mx-auto">
              Most self-employed people overpay by <strong className="text-emerald-600">$5,000-$10,000</strong> per year. Use our free calculator to pay exactly what you owe using IRS safe harbor rules.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/tools/quarterly-tax">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6 h-auto"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate My Quarterly Taxes
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

      {/* Problem Section */}
      <section className="py-16 bg-white border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              The Problem with Quarterly Taxes
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Most online calculators (and even CPAs) tell you to pay 25% of your projected income each quarter. But that's wrong.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                  Overpayment Problem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  You tie up $20,000+ with the IRS for 9 months when you could be investing it or using it for business expenses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-300 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-amber-600" />
                  Penalty Fear
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  You're scared of IRS penalties, so you overpay "just to be safe." But there's a better way using safe harbor rules.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-300 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  Variable Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  Your income fluctuates wildly (some quarters $60k, others $15k), but you're paying the same amount each quarter.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold border-2 border-emerald-300">
                THE SOLUTION
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              IRS Safe Harbor Rules
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              You're safe from penalties if you pay the <strong>LOWER</strong> of:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-black bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-black">
                  Option 1: Current Year
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-black text-emerald-600">
                  90%
                </div>
                <p className="text-sm text-slate-700">
                  Pay 90% of your <strong>current year</strong> estimated tax liability
                </p>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-medium text-slate-600">
                    <strong>Example:</strong> If you'll owe $40k in taxes this year, you need to pay $36k (90%) in quarterly payments.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-black">
                  Option 2: Prior Year
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-black text-blue-600">
                  100% <span className="text-lg">(110% if AGI &gt; $150k)</span>
                </div>
                <p className="text-sm text-slate-700">
                  Pay 100% of your <strong>prior year</strong> tax (110% if your AGI was over $150k)
                </p>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <p className="text-xs font-medium text-slate-600">
                    <strong>Example:</strong> If you paid $15k in taxes last year, you only need to pay $15k this year (even if you'll owe $40k).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Card className="border-2 border-emerald-400 bg-emerald-50 max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  You're Safe from Penalties
                </h3>
                <p className="text-slate-700 mb-4">
                  Pay whichever amount is <strong>LOWER</strong>, and the IRS can't charge you underpayment penalties. This is official IRS policy.
                </p>
                <Link href="/tools/quarterly-tax">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Calculate My Safe Harbor Amount
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t-2 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              What Our Calculator Does
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to calculate and track quarterly estimated taxes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calculator,
                title: "Safe Harbor Calculator",
                description: "Shows both methods (prior year vs current year) and tells you which is lower."
              },
              {
                icon: Calendar,
                title: "Payment Timeline",
                description: "Visual quarterly timeline with color-coded status (paid, upcoming, overdue)."
              },
              {
                icon: DollarSign,
                title: "Payment Tracking",
                description: "Track what you've paid with progress bars and quick 'Mark Paid' buttons."
              },
              {
                icon: TrendingDown,
                title: "Auto-Population",
                description: "Pulls from prior year tax returns and your profile settings automatically."
              },
              {
                icon: Shield,
                title: "Penalty Calculator",
                description: "Estimates underpayment penalties if you're not meeting safe harbor (Pro)."
              },
              {
                icon: CheckCircle,
                title: "Variable Income Support",
                description: "Annualized Income Method for seasonal/fluctuating income (Pro)."
              }
            ].map((feature, idx) => (
              <Card key={idx} className="border-2 border-black">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-emerald-600 mb-3" />
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
            <Link href="/tools/quarterly-tax">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6 h-auto"
              >
                Try the Calculator Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "When are quarterly estimated taxes due?",
                answer: "Q1: April 15, Q2: June 15, Q3: September 15, Q4: January 15 of the following year. Note that Q4 is NOT December 31."
              },
              {
                question: "What happens if I don't pay enough?",
                answer: "If you meet safe harbor requirements (90% of current year OR 100%/110% of prior year), you won't face penalties. If you don't meet safe harbor, the IRS charges interest (currently ~8% annually) on the underpayment."
              },
              {
                question: "Can I use the prior year method if my income went up?",
                answer: "Yes! That's the beauty of safe harbor. Even if your income doubled, you can pay based on last year's tax and settle up when you file. No penalties."
              },
              {
                question: "Do I need to pay equally each quarter?",
                answer: "For the standard method, yes. But if your income is variable, you can use the Annualized Income Installment Method (Pro feature) to pay more in high-income quarters and less in low-income quarters."
              },
              {
                question: "Is this calculator accurate?",
                answer: "Yes. We use the official IRS Publication 505 rules for safe harbor calculations. However, this is for educational purposes only—always consult a tax professional for your specific situation."
              },
              {
                question: "Does this work for S-Corps or just sole proprietors?",
                answer: "This calculator works for any self-employed structure (sole proprietor, LLC, S-Corp, partnership). The safe harbor rules apply to all individual tax returns."
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
      <section className="py-16 bg-gradient-to-br from-emerald-600 to-blue-600 border-t-2 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to Stop Overpaying?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Calculate your exact quarterly tax payments in under 60 seconds.
          </p>
          <Link href="/tools/quarterly-tax">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-slate-100 text-lg px-8 py-6 h-auto"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Use the Free Calculator
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-white/80 mt-4">
            No signup required • Results in 60 seconds • 100% free forever
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
            "name": "Quarterly Tax Calculator",
            "description": "Free calculator for quarterly estimated taxes using IRS safe harbor rules",
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
