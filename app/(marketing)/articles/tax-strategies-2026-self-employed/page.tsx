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

          <div className="space-y-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="text-slate-600 leading-relaxed">
                The S-Corp strategy splits your income into two buckets: reasonable salary and distributions. You pay yourself a W-2 salary that's subject to normal payroll taxes (FICA—Social Security and Medicare), just like any employee. The IRS requires this salary to be "reasonable" for your role and industry, typically 40-60% of your total profit. The remaining profits flow through as distributions, which are subject to income tax but NOT self-employment tax. That's where the savings come from—you're avoiding the 15.3% self-employment tax on potentially $50-100K+ of income.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">When to Consider It</h3>
              <p className="text-slate-600 leading-relaxed">
                S-Corp makes sense once you're consistently earning $80-100K+ in annual profit. Below that threshold, the administrative costs and complexity outweigh the tax savings. You'll need to run payroll (services like Gusto or ADP make this relatively painless for $40-100/month), file additional tax returns, and maintain stricter separation between personal and business finances. Most CPAs recommend waiting until you're clearing at least $80K in net income, at which point the $10,000-15,000 in annual tax savings more than covers the $2,000-3,000 in additional accounting and payroll costs.
              </p>
            </div>
          </div>
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

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Strategy Tips</h3>
            <p className="text-slate-600 leading-relaxed">
              The Solo 401(k) becomes even more powerful when combined with S-Corp taxation. If you're an S-Corp, your employer contributions are based on your W-2 salary, which can actually allow for larger total contributions in some scenarios. Don't overlook Roth contributions either—while traditional contributions give you an immediate tax deduction, Roth contributions grow tax-free forever, which is powerful tax diversification for retirement. You can even split your contributions, doing some traditional and some Roth to hedge your bets on future tax rates.
            </p>
            <p className="text-slate-600 leading-relaxed mt-3">
              Timing matters: you must establish your Solo 401(k) by December 31st of the tax year, but you have until your tax filing deadline (including extensions) to make contributions. This gives you flexibility to wait and see your final income before committing to contribution amounts. Many self-employed professionals make their employee contributions during the year, then calculate the optimal employer contribution when they file taxes in April.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">3. QBI Deduction (Section 199A)</h2>
          <p className="text-slate-600 leading-relaxed">
            The Qualified Business Income (QBI) deduction lets you deduct up to <strong className="text-slate-900">20%</strong> of your qualified business income from taxable income—not from gross income, but from taxable income, which makes it incredibly valuable. This deduction is available to all pass-through entities including sole proprietors, S-Corps, partnerships, and LLCs. If you're earning $100K in qualified business income, this deduction alone can save you $4,000-6,000 in federal taxes depending on your bracket.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The catch: specified service businesses (which includes most consulting work) face phase-outs starting at $191,950 for single filers and $383,900 for married couples in 2026. Below those thresholds, you get the full 20% deduction. Above them, the deduction phases out over the next $50K ($100K married). If you're a consultant earning $150K, you get the full benefit—a $30K reduction in taxable income worth roughly $7,500 in tax savings. This is one of the most valuable deductions created by the Tax Cuts and Jobs Act, and it's set to expire after 2025 unless Congress extends it.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">4. Health Insurance Deduction</h2>
          <p className="text-slate-600 leading-relaxed">
            Self-employed individuals can deduct <strong className="text-slate-900">100%</strong> of health insurance premiums for themselves and their families, and this is an above-the-line deduction that goes on line 17 of Schedule 1. "Above the line" means it reduces your adjusted gross income before you even get to itemized deductions, which makes it more valuable than standard business deductions. This includes medical insurance, dental, vision, and even long-term care insurance premiums for you, your spouse, and your dependents.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If you're paying $800/month for family health coverage, that's a $9,600 annual deduction that saves you roughly $3,400 in combined federal and self-employment taxes at a 35% effective rate. Stack this with an HSA (Health Savings Account) if you have a high-deductible health plan, and you create a triple tax advantage: contributions are deductible, growth is tax-free, and withdrawals for medical expenses are tax-free. The 2026 HSA limits are $4,300 individual / $8,550 family, plus an additional $1,000 catch-up contribution if you're 55+. This combination—health insurance deduction plus HSA max—can reduce your taxable income by $15,000-18,000 annually.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">5. Home Office Deduction</h2>
          <p className="text-slate-600 leading-relaxed">
            If you work from home, you can deduct a portion of housing expenses through two methods: simplified or actual expenses. The simplified method gives you $5 per square foot up to 300 square feet ($1,500 maximum deduction), with zero recordkeeping required. The actual expense method lets you deduct the business-use percentage of your rent/mortgage, utilities, insurance, repairs, and depreciation—often resulting in $3,000-5,000+ in deductions for consultants with dedicated office space. The actual method requires more documentation but typically yields higher savings, especially if you rent or have a mortgage in a high-cost area.
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
            The IRS requires you to pay taxes as you earn income, which means making quarterly estimated tax payments if you're self-employed. Miss these deadlines or underpay, and you'll face underpayment penalties—typically 5-8% annually on the shortfall. The safe harbor rule protects you: if you pay either 90% of current year's tax liability OR 100% of prior year's tax liability (110% if you earned over $150K), you avoid penalties. Most consultants target paying 100-110% of last year's taxes, then settle up when they file. This strategy eliminates penalty risk while preserving cash flow throughout the year.
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
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 space-y-3">
            <p className="text-slate-700 leading-relaxed">
              S-Corp election is the single highest-impact tax strategy for profitable consultants, potentially saving $10-20K+ annually once you're earning $80-100K+ in net income. The tax savings come from splitting income between salary (subject to payroll taxes) and distributions (exempt from self-employment tax), but it requires running payroll and additional compliance. Below that income threshold, focus on maxing out your Solo 401(k) contributions—up to $70,000 in 2026 ($77,500 if 50+)—which provides immediate tax deductions and decades of tax-free growth.
            </p>
            <p className="text-slate-700 leading-relaxed">
              The foundation of tax optimization is meticulous expense tracking. Every dollar you legitimately deduct reduces your taxable income by 30-40% (depending on your bracket and state), so missing deductions is literally leaving money on the table. Make quarterly estimated tax payments on time to avoid penalties—aim to pay 100-110% of last year's total tax bill to stay in the IRS safe harbor. These payments can feel painful, but underpayment penalties of 5-8% annually hurt more.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Finally, invest in a CPA who understands self-employment tax strategy. The $2,000-4,000 you spend on quality accounting advice will save you multiples of that in optimized deductions, retirement contributions, and S-Corp structuring. DIY tax software is fine for W-2 employees, but once you're self-employed and earning real money, professional guidance pays for itself many times over.
            </p>
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
