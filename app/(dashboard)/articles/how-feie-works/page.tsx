"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Calendar, Clock, AlertTriangle, Check, X, Globe, Calculator } from "lucide-react";

export default function FEIEArticle() {
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
          src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=600&fit=crop"
          alt="International tax documents"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-cyan-500 px-3 py-1 rounded-full">Tax Planning</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">How the Foreign Earned Income Exclusion (FEIE) Works</h1>
          <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              January 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              12 min read
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">
        {/* Intro */}
        <p className="text-xl text-muted-foreground leading-relaxed">
          The Foreign Earned Income Exclusion allows US citizens and residents working abroad to exclude up to $130,000 (2026) of foreign earned income from US federal taxes. Here's everything you need to know.
        </p>

        {/* 2026 Limits Card */}
        <Card className="border-cyan-500/30 bg-cyan-500/5">
          <CardContent className="p-6">
            <h4 className="font-semibold text-cyan-600 mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              2026 FEIE Limits
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-2xl font-bold text-cyan-600">$130,000</p>
                <p className="text-xs text-muted-foreground">Maximum Exclusion</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-2xl font-bold text-cyan-600">$20,800</p>
                <p className="text-xs text-muted-foreground">Housing Exclusion Base</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-2xl font-bold text-cyan-600">~$40,000+</p>
                <p className="text-xs text-muted-foreground">Housing Max (varies by location)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">What Qualifies as "Foreign Earned Income"?</h2>
          <p className="text-muted-foreground leading-relaxed">
            FEIE applies only to income earned from personal services performed in a foreign country:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-500/30">
              <CardContent className="p-5">
                <h4 className="font-semibold text-green-600 mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Qualifies
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    Consulting fees earned abroad
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    Freelance income for work done abroad
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    Salary from foreign employer
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    Self-employment income earned abroad
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-red-500/30">
              <CardContent className="p-5">
                <h4 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
                  <X className="h-5 w-5" />
                  Does NOT Qualify
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    Investment income (dividends, interest)
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    Rental income
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    Capital gains
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    Pension or Social Security
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    US government employee wages
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1000&h=400&fit=crop"
            alt="Traveling abroad"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Qualification Tests</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must meet one of two tests to qualify for FEIE:
          </p>

          <h3 className="text-lg font-semibold mt-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            1. Physical Presence Test
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Be physically present in a foreign country for at least <strong>330 full days</strong> during any 12-month period.
          </p>
          <Card className="bg-muted/30">
            <CardContent className="p-6 space-y-3">
              <h4 className="font-semibold">Key Requirements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  Days don't need to be consecutive
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  The 12-month period can start on any day
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  Parts of days don't count—you need 330 full 24-hour periods
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  Days in international waters/airspace don't count
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-600">Important</h4>
                <p className="text-sm text-muted-foreground">Days spent in the US count against you. A two-week Christmas visit home could disqualify you if you're close to the 330-day threshold.</p>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-lg font-semibold mt-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-500" />
            2. Bona Fide Residence Test
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Be a bona fide resident of a foreign country for an uninterrupted period that includes an entire tax year.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>More flexible than physical presence test</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>Can spend time in the US without losing qualification</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>Requires establishing actual residency (visa, local ties, etc.)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>Must be resident for full calendar year to qualify</span>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Foreign Housing Exclusion</h2>
          <p className="text-muted-foreground leading-relaxed">
            In addition to the income exclusion, you can exclude certain housing expenses:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <span>Rent, utilities, property insurance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <span>Repairs and furniture rental</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <span>Base amount ($20,800 in 2026) is subtracted</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
              <span>Maximum varies by location—higher in expensive cities</span>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">How to Claim FEIE</h2>
          <ol className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span>File Form 2555 with your tax return</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span>Document your qualification (physical presence or bona fide residence)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span>Calculate your foreign earned income and housing expenses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span>File by the deadline (automatic 2-month extension for taxpayers abroad)</span>
            </li>
          </ol>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">FEIE vs. Foreign Tax Credit</h2>
          <p className="text-muted-foreground leading-relaxed">
            You can't use both FEIE and Foreign Tax Credit on the same income. Consider:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-2">FEIE</h4>
                <p className="text-sm text-muted-foreground">Better if you're in a <strong>low/no tax country</strong></p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-2">Foreign Tax Credit (FTC)</h4>
                <p className="text-sm text-muted-foreground">Better if you pay <strong>significant foreign taxes</strong></p>
              </CardContent>
            </Card>
          </div>
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-600">5-Year Rule</h4>
                <p className="text-sm text-muted-foreground">You can revoke FEIE election, but there's a 5-year waiting period to re-elect. Choose carefully.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Self-Employment Tax Trap</h2>
          <p className="text-muted-foreground leading-relaxed">
            FEIE does <strong>NOT</strong> exclude you from self-employment tax. Even if you exclude $130,000 of income from income tax, you still owe 15.3% SE tax on that amount.
          </p>
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-6">
              <h4 className="font-semibold text-red-600 mb-2">Example</h4>
              <p className="text-muted-foreground">
                On $130,000 of excluded income, you'd still owe approximately <strong className="text-foreground">$18,400</strong> in self-employment tax. This is why many digital nomads consider S-Corp election even while abroad.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Common Mistakes to Avoid</h2>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Forgetting to track days in/out of foreign countries</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Assuming investment income qualifies (it doesn't)</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Missing the filing deadline</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Not considering the self-employment tax implications</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Revoking FEIE without understanding the 5-year rule</span>
            </li>
          </ul>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Key Takeaways</h2>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>FEIE can exclude up to $130,000 of foreign earned income (2026)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>You must meet either the Physical Presence or Bona Fide Residence test</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Investment income, capital gains, and passive income don't qualify</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>Self-employment tax still applies to excluded income</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">5.</span>
                  <span>Keep meticulous records of your days in each country</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">6.</span>
                  <span>Consult a tax professional familiar with expat taxation</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
