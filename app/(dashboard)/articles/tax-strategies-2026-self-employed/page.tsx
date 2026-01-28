"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Calendar, Clock, AlertTriangle, DollarSign, Percent } from "lucide-react";

export default function TaxStrategiesArticle() {
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
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop"
          alt="Tax planning and calculations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-purple-500 px-3 py-1 rounded-full">Taxes</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">Tax Strategies in 2026 for Self-Employed Workers</h1>
          <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              January 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              15 min read
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">
        {/* Intro */}
        <p className="text-xl text-muted-foreground leading-relaxed">
          Self-employment comes with a significant tax burden—but also unique opportunities for tax optimization. Here are the most effective strategies for 2026.
        </p>

        {/* Disclaimer */}
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-600">Disclaimer</h4>
              <p className="text-sm text-muted-foreground">This article is for educational purposes only. Consult a qualified CPA or tax professional for advice specific to your situation.</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">1. S-Corp Election</h2>
          <p className="text-muted-foreground leading-relaxed">
            The single most impactful tax strategy for profitable freelancers. By electing S-Corp status, you can save 15.3% self-employment tax on a portion of your income.
          </p>

          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3 text-green-600 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Example Savings
              </h4>
              <p className="text-sm text-muted-foreground">
                On $200K profit with a $100K reasonable salary, you'd save approximately <strong className="text-foreground">$10,000-$15,000</strong> in self-employment taxes annually.
              </p>
            </CardContent>
          </Card>

          <h3 className="text-lg font-semibold mt-6">How It Works</h3>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Pay yourself a "reasonable salary"</strong>
                <p className="text-muted-foreground">Subject to payroll taxes (FICA)</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Take remaining profits as distributions</strong>
                <p className="text-muted-foreground">No self-employment tax on distributions</p>
              </div>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">When to Consider It</h3>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Consistent profit over $80-100K annually</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Willing to run payroll (services like Gusto make this easy)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Comfortable with additional compliance requirements</span>
            </li>
          </ul>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1000&h=400&fit=crop"
            alt="Financial planning"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">2. Solo 401(k) Maximization</h2>
          <p className="text-muted-foreground leading-relaxed">
            The most powerful retirement account for self-employed individuals. In 2026, you can contribute up to <strong>$70,000</strong> ($77,500 if over 50).
          </p>

          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                2026 Contribution Limits
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-bold text-primary">$23,500</p>
                  <p className="text-xs text-muted-foreground">Employee Contribution</p>
                  <p className="text-xs text-muted-foreground">($31,000 if 50+)</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">25%</p>
                  <p className="text-xs text-muted-foreground">Employer Contribution</p>
                  <p className="text-xs text-muted-foreground">of net SE income</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <p className="text-2xl font-bold text-green-500">$70,000</p>
                  <p className="text-xs text-muted-foreground">Total Maximum</p>
                  <p className="text-xs text-muted-foreground">($77,500 if 50+)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-lg font-semibold mt-6">Strategy Tips</h3>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Combine with S-Corp</strong>
                <p className="text-muted-foreground">Employer contributions based on W-2 salary</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Consider Roth contributions</strong>
                <p className="text-muted-foreground">Tax diversification for retirement</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Deadline</strong>
                <p className="text-muted-foreground">December 31 to establish, tax filing deadline to contribute</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">3. QBI Deduction (Section 199A)</h2>
          <p className="text-muted-foreground leading-relaxed">
            Deduct up to <strong>20%</strong> of your qualified business income from taxable income.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>Available to pass-through entities (sole props, S-Corps, partnerships)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <span>Phase-out begins at $191,950 single / $383,900 married (2026)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">Specified service businesses (consulting) have additional limitations</span>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">4. Health Insurance Deduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Self-employed individuals can deduct <strong>100%</strong> of health insurance premiums for themselves and their families.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Deducted from gross income (above the line)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Includes medical, dental, and long-term care insurance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>HSA contributions provide additional tax benefits</span>
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">5. Home Office Deduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you work from home, you can deduct a portion of housing expenses.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-2">Simplified Method</h4>
                <p className="text-sm text-muted-foreground">$5 per square foot, up to 300 sq ft</p>
                <p className="text-lg font-bold text-primary mt-2">$1,500 max</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-2">Actual Expenses</h4>
                <p className="text-sm text-muted-foreground">Percentage of rent/mortgage, utilities, insurance based on square footage</p>
                <p className="text-lg font-bold text-green-500 mt-2">Often higher</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">6. Estimated Tax Payments</h2>
          <p className="text-muted-foreground leading-relaxed">
            Avoid underpayment penalties by making quarterly estimated tax payments.
          </p>
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">2026 Deadlines</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-semibold">Q1</p>
                  <p className="text-sm text-muted-foreground">April 15, 2026</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-semibold">Q2</p>
                  <p className="text-sm text-muted-foreground">June 15, 2026</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-semibold">Q3</p>
                  <p className="text-sm text-muted-foreground">Sept 15, 2026</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="font-semibold">Q4</p>
                  <p className="text-sm text-muted-foreground">Jan 15, 2027</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">7. Retirement Account Order of Operations</h2>
          <p className="text-muted-foreground leading-relaxed">
            Maximize tax-advantaged accounts in this order:
          </p>
          <ol className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <div>
                <strong>HSA (if eligible)</strong>
                <p className="text-muted-foreground">Triple tax advantage - deductible, grows tax-free, tax-free withdrawals for medical</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <div>
                <strong>Solo 401(k) employee contribution</strong>
                <p className="text-muted-foreground">$23,500 limit</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <div>
                <strong>Solo 401(k) employer contribution</strong>
                <p className="text-muted-foreground">Up to 25% of net SE income</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <div>
                <strong>Backdoor Roth IRA</strong>
                <p className="text-muted-foreground">$7,000 for tax-free growth</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              <div>
                <strong>Taxable brokerage</strong>
                <p className="text-muted-foreground">Additional savings beyond tax-advantaged limits</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Key Takeaways</h2>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>S-Corp election can save $10-20K+ annually for high earners</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>Max out Solo 401(k) contributions before year-end</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Track all business expenses meticulously</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>Make quarterly estimated payments to avoid penalties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">5.</span>
                  <span>Work with a CPA who understands self-employment</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
