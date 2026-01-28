"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Calendar, Clock, Check, X, CreditCard, Wallet } from "lucide-react";

export default function BankAccountsArticle() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop"
          alt="Banking and finance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-green-500 px-3 py-1 rounded-full">Banking</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">Best Bank Accounts for Remote Workers and Independent Consultants</h1>
          <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              January 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              10 min read
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">
        {/* Intro */}
        <p className="text-xl text-muted-foreground leading-relaxed">
          The right bank account can save you thousands in fees and make managing your freelance finances much easier. Here's our comparison of the best options for independent consultants.
        </p>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Personal Banking: Charles Schwab Investor Checking</h2>
          <p className="text-muted-foreground leading-relaxed">
            The gold standard for personal banking, especially if you travel internationally.
          </p>
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 text-green-600 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Why We Recommend It
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>No foreign transaction fees</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Unlimited worldwide ATM fee rebates</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>No monthly fees or minimums</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Excellent customer service</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Requires linked brokerage account</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&h=400&fit=crop"
            alt="Business banking dashboard"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Business Banking: Mercury</h2>
          <p className="text-muted-foreground leading-relaxed">
            Built specifically for startups and freelancers, Mercury offers a modern banking experience with powerful features.
          </p>
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 text-blue-600 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Key Features
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>No monthly fees</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Free domestic and international wires</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Virtual and physical debit cards</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>API access and integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Treasury for higher interest rates</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Multi-Currency: Wise Business</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you work with international clients, Wise is essential for receiving payments in multiple currencies.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>50+ Currencies</strong>
                <p className="text-muted-foreground">Hold and convert between currencies in one account</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Local Bank Details</strong>
                <p className="text-muted-foreground">Get account numbers in USD, EUR, GBP, and more</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Real Exchange Rates</strong>
                <p className="text-muted-foreground">Mid-market rates with low, transparent fees</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">High-Yield Savings: Wealthfront Cash Account</h2>
          <p className="text-muted-foreground leading-relaxed">
            Park your emergency fund and earn competitive interest rates.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>4.5%+ APY</strong>
                <p className="text-muted-foreground">Competitive interest rate on your savings</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>FDIC Insured</strong>
                <p className="text-muted-foreground">Up to $8 million through partner banks</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>No Fees</strong>
                <p className="text-muted-foreground">No monthly fees or minimum balance requirements</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Comparison Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Comparison Table</h2>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-semibold">Bank</th>
                    <th className="text-left p-4 font-semibold">Best For</th>
                    <th className="text-left p-4 font-semibold">Monthly Fee</th>
                    <th className="text-left p-4 font-semibold">FX Fees</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Schwab</td>
                    <td className="p-4 text-muted-foreground">Personal/Travel</td>
                    <td className="p-4 text-green-600 font-medium">$0</td>
                    <td className="p-4 text-green-600 font-medium">None</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Mercury</td>
                    <td className="p-4 text-muted-foreground">Business</td>
                    <td className="p-4 text-green-600 font-medium">$0</td>
                    <td className="p-4 text-muted-foreground">1%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Wise</td>
                    <td className="p-4 text-muted-foreground">International</td>
                    <td className="p-4 text-green-600 font-medium">$0</td>
                    <td className="p-4 text-muted-foreground">0.4-1%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Wealthfront</td>
                    <td className="p-4 text-muted-foreground">Savings</td>
                    <td className="p-4 text-green-600 font-medium">$0</td>
                    <td className="p-4 text-muted-foreground">N/A</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* Our Recommended Setup */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Our Recommended Setup</h2>
          <p className="text-muted-foreground leading-relaxed">
            For most independent consultants, we recommend this combination:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <div className="h-3 bg-blue-500" />
              <CardContent className="p-4">
                <h4 className="font-semibold">1. Mercury</h4>
                <p className="text-sm text-muted-foreground">Business checking and receiving client payments</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-3 bg-green-500" />
              <CardContent className="p-4">
                <h4 className="font-semibold">2. Charles Schwab</h4>
                <p className="text-sm text-muted-foreground">Personal checking and travel spending</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-3 bg-purple-500" />
              <CardContent className="p-4">
                <h4 className="font-semibold">3. Wise</h4>
                <p className="text-sm text-muted-foreground">International clients paying in their currency</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-3 bg-orange-500" />
              <CardContent className="p-4">
                <h4 className="font-semibold">4. Wealthfront</h4>
                <p className="text-sm text-muted-foreground">Emergency fund and short-term savings</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Key Takeaways</h2>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>Separate personal and business finances from day one</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>Avoid banks that charge foreign transaction fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Consider multi-currency accounts if you have international clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>Keep 3-6 months expenses in a high-yield savings account</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
