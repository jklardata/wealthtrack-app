import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Calendar, Clock, AlertTriangle, DollarSign, Percent } from "lucide-react";

export const metadata = {
  title: "Tax Strategies in 2026 for Self-Employed Workers - SoloFI",
  description: "Self-employment comes with a significant tax burden—but also unique opportunities for tax optimization. Here are the most effective strategies for 2026.",
};

export default function TaxStrategiesArticle() {
  return (
    <article>
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop"
          alt="Tax planning and calculations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-purple-500 px-3 py-1 rounded-full">Taxes</span>
          <h1 className="text-3xl md:text-4xl font-medium text-white mt-3">Tax Strategies in 2026 for Self-Employed Workers</h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
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
        <p className="text-xl text-slate-600 leading-relaxed">
          Self-employment comes with a significant tax burden—but also unique opportunities for tax optimization. Here are the most effective strategies for 2026.
        </p>

        {/* Disclaimer */}
        <div className="rounded-xl border border-slate-200 bg-yellow-500/10 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-600">Disclaimer</h4>
            <p className="text-sm text-slate-500">This article is for educational purposes only. Consult a qualified CPA or tax professional for advice specific to your situation.</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">1. S-Corp Election</h2>
          <p className="text-slate-600 leading-relaxed">
            The single most impactful tax strategy for profitable freelancers. By electing S-Corp status, you can save 15.3% self-employment tax on a portion of your income.
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6">
            <h4 className="font-semibold mb-3 text-emerald-600 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Example Savings
            </h4>
            <p className="text-sm text-slate-600">
              On $200K profit with a $100K reasonable salary, you'd save approximately <strong className="text-slate-900">$10,000-$15,000</strong> in self-employment taxes annually.
            </p>
          </div>

          <h3 className="text-lg font-semibold mt-6 text-slate-900">How It Works</h3>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Pay yourself a "reasonable salary"</strong>
                <p className="text-slate-500">Subject to payroll taxes (FICA)</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Take remaining profits as distributions</strong>
                <p className="text-slate-500">No self-employment tax on distributions</p>
              </div>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 text-slate-900">When to Consider It</h3>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-slate-600">Consistent profit over $80-100K annually</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-slate-600">Willing to run payroll (services like Gusto make this easy)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-slate-600">Comfortable with additional compliance requirements</span>
            </li>
          </ul>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1000&h=400&fit=crop"
            alt="Financial planning"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">2. Solo 401(k) Maximization</h2>
          <p className="text-slate-600 leading-relaxed">
            The most powerful retirement account for self-employed individuals. In 2026, you can contribute up to <strong className="text-slate-900">$70,000</strong> ($77,500 if over 50).
          </p>

          <div className="rounded-xl border border-slate-200 bg-white/5 p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Percent className="h-5 w-5 text-amber-400" />
              2026 Contribution Limits
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl border border-slate-200">
                <p className="text-2xl font-bold text-amber-400">$23,500</p>
                <p className="text-xs text-slate-500">Employee Contribution</p>
                <p className="text-xs text-white/40">($31,000 if 50+)</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-slate-200">
                <p className="text-2xl font-bold text-slate-600">25%</p>
                <p className="text-xs text-slate-500">Employer Contribution</p>
                <p className="text-xs text-white/40">of net SE income</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-slate-200">
                <p className="text-2xl font-bold text-emerald-600">$70,000</p>
                <p className="text-xs text-slate-500">Total Maximum</p>
                <p className="text-xs text-white/40">($77,500 if 50+)</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 text-slate-900">Strategy Tips</h3>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Combine with S-Corp</strong>
                <p className="text-slate-500">Employer contributions based on W-2 salary</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Consider Roth contributions</strong>
                <p className="text-slate-500">Tax diversification for retirement</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-slate-900">Deadline</strong>
                <p className="text-slate-500">December 31 to establish, tax filing deadline to contribute</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">3. QBI Deduction (Section 199A)</h2>
          <p className="text-slate-600 leading-relaxed">
            Deduct up to <strong className="text-slate-900">20%</strong> of your qualified business income from taxable income.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-slate-600">Available to pass-through entities (sole props, S-Corps, partnerships)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-slate-600">Phase-out begins at $191,950 single / $383,900 married (2026)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-slate-500">Specified service businesses (consulting) have additional limitations</span>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">4. Health Insurance Deduction</h2>
          <p className="text-slate-600 leading-relaxed">
            Self-employed individuals can deduct <strong className="text-slate-900">100%</strong> of health insurance premiums for themselves and their families.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-slate-600">Deducted from gross income (above the line)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-slate-600">Includes medical, dental, and long-term care insurance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-slate-600">HSA contributions provide additional tax benefits</span>
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">5. Home Office Deduction</h2>
          <p className="text-slate-600 leading-relaxed">
            If you work from home, you can deduct a portion of housing expenses.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white/5 p-5">
              <h4 className="font-semibold mb-2 text-slate-900">Simplified Method</h4>
              <p className="text-sm text-slate-500">$5 per square foot, up to 300 sq ft</p>
              <p className="text-lg font-bold text-amber-400 mt-2">$1,500 max</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/5 p-5">
              <h4 className="font-semibold mb-2 text-slate-900">Actual Expenses</h4>
              <p className="text-sm text-slate-500">Percentage of rent/mortgage, utilities, insurance based on square footage</p>
              <p className="text-lg font-bold text-emerald-600 mt-2">Often higher</p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">6. Estimated Tax Payments</h2>
          <p className="text-slate-600 leading-relaxed">
            Avoid underpayment penalties by making quarterly estimated tax payments.
          </p>
          <div className="rounded-xl border border-slate-200 bg-white/5 p-6">
            <h4 className="font-semibold mb-4 text-slate-900">2026 Deadlines</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-white/5 rounded-xl border border-slate-200">
                <p className="font-medium text-slate-900">Q1</p>
                <p className="text-sm text-slate-500">April 15, 2026</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-slate-200">
                <p className="font-medium text-slate-900">Q2</p>
                <p className="text-sm text-slate-500">June 15, 2026</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-slate-200">
                <p className="font-medium text-slate-900">Q3</p>
                <p className="text-sm text-slate-500">Sept 15, 2026</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-slate-200">
                <p className="font-medium text-slate-900">Q4</p>
                <p className="text-sm text-slate-500">Jan 15, 2027</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">7. Retirement Account Order of Operations</h2>
          <p className="text-slate-600 leading-relaxed">
            Maximize tax-advantaged accounts in this order:
          </p>
          <ol className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <div>
                <strong className="text-slate-900">HSA (if eligible)</strong>
                <p className="text-slate-500">Triple tax advantage - deductible, grows tax-free, tax-free withdrawals for medical</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <div>
                <strong className="text-slate-900">Solo 401(k) employee contribution</strong>
                <p className="text-slate-500">$23,500 limit</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <div>
                <strong className="text-slate-900">Solo 401(k) employer contribution</strong>
                <p className="text-slate-500">Up to 25% of net SE income</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <div>
                <strong className="text-slate-900">Backdoor Roth IRA</strong>
                <p className="text-slate-500">$7,000 for tax-free growth</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-white/20 text-slate-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              <div>
                <strong className="text-slate-600">Taxable brokerage</strong>
                <p className="text-slate-500">Additional savings beyond tax-advantaged limits</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Key Takeaways</h2>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">1.</span>
                <span className="text-slate-700">S-Corp election can save $10-20K+ annually for high earners</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">2.</span>
                <span className="text-slate-700">Max out Solo 401(k) contributions before year-end</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">3.</span>
                <span className="text-slate-700">Track all business expenses meticulously</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">4.</span>
                <span className="text-slate-700">Make quarterly estimated payments to avoid penalties</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">5.</span>
                <span className="text-slate-700">Work with a CPA who understands self-employment</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Ready to optimize your taxes?</h3>
          <p className="text-slate-500 mb-6">Use our free Tax Savings Calculator to find your opportunities.</p>
          <Link href="/tools/tax-savings">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-slate-900">
              <Calculator className="mr-2 h-4 w-4" />
              Try Tax Calculator
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
