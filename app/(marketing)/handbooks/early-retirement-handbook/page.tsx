import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, TrendingUp, AlertTriangle, CheckSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "The Early Retirement Handbook | SoloFI",
  description: "A practical guide to retiring early as a self-employed professional. FI numbers, Roth conversion ladders, gap year strategy, healthcare, and Social Security.",
  openGraph: {
    title: "The Early Retirement Handbook",
    description: "A practical guide to retiring early as a self-employed professional.",
    url: "https://solofi.io/handbooks/early-retirement-handbook",
    siteName: "SoloFI",
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/handbooks/early-retirement-handbook",
  },
};

export default function EarlyRetirementHandbook() {
  return (
    <article>
      {/* Back Button */}
      <div className="mb-6">
        <Link href="https://solofi.io/blog">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            Back to Learn
          </Button>
        </Link>
      </div>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 md:p-14">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-blue-200" />
            <span className="text-sm font-medium text-blue-200 uppercase tracking-wide">Handbook</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">The Early Retirement Handbook</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            A practical guide to retiring early as a self-employed professional. From calculating your FI number to surviving the gap years.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-64 opacity-10 bg-gradient-to-l from-white" />
      </div>

      <div className="space-y-10">
        {/* Disclaimer */}
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">This handbook is for educational purposes only. Consult a financial advisor before making retirement planning decisions.</p>
        </div>

        {/* Table of Contents */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Contents</h2>
          <ol className="space-y-2 text-sm">
            {[
              "How to Calculate Your FI Number",
              "Safe Withdrawal Rates and the 4% Rule",
              "The Gap Years Strategy",
              "Roth Conversion Ladders",
              "Healthcare Before Medicare",
              "Social Security: When to Claim",
              "Portfolio Allocation for Early Retirement",
              "Sequence-of-Returns Risk",
            ].map((section, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                {section}
              </li>
            ))}
          </ol>
        </div>

        {/* Chapter 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">1. How to Calculate Your FI Number</h2>
          <p className="text-slate-600 leading-relaxed">
            Your FI (Financial Independence) number is the portfolio size at which your investment returns can cover your living expenses indefinitely. The standard calculation: multiply your annual expenses by 25.
          </p>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-center">
            <p className="text-sm text-blue-700 font-medium uppercase tracking-wide mb-2">The FI Formula</p>
            <p className="text-2xl font-black text-slate-900">Annual Expenses × 25 = FI Number</p>
            <p className="text-sm text-slate-500 mt-2">Based on a 4% withdrawal rate</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { expenses: "$40K/yr", fi: "$1,000,000" },
              { expenses: "$60K/yr", fi: "$1,500,000" },
              { expenses: "$80K/yr", fi: "$2,000,000" },
            ].map(({ expenses, fi }) => (
              <div key={expenses} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-sm text-slate-500">{expenses} spending</p>
                <p className="text-xl font-black text-blue-600">{fi}</p>
                <p className="text-xs text-slate-400">FI number</p>
              </div>
            ))}
          </div>
          <p className="text-slate-600 leading-relaxed">
            For self-employed workers, also factor in what changes at retirement: no more business expenses, but potentially new costs like full health insurance premiums. Model both a lean and comfortable spending scenario.
          </p>
        </section>

        {/* Chapter 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">2. Safe Withdrawal Rates and the 4% Rule</h2>
          <p className="text-slate-600 leading-relaxed">
            The 4% rule (from the Trinity Study) shows that withdrawing 4% of your portfolio in year one, then adjusting for inflation, has historically succeeded over 30-year retirements in almost all market scenarios. For early retirement spanning 40–50 years, many planners use 3–3.5% to be safer.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-2xl font-black text-blue-600">4%</p>
              <p className="text-sm text-slate-500 mt-1">Standard 30-year retirement</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-2xl font-black text-amber-600">3.5%</p>
              <p className="text-sm text-slate-500 mt-1">40-year retirement</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-2xl font-black text-emerald-600">3%</p>
              <p className="text-sm text-slate-500 mt-1">50-year retirement / very conservative</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            These are starting-point rules, not rigid constraints. Many early retirees use dynamic withdrawal strategies: spending more in good market years, pulling back in downturns. Even occasional part-time work or consulting can dramatically improve long-term survival rates.
          </p>
        </section>

        {/* Chapter 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">3. The Gap Years Strategy</h2>
          <p className="text-slate-600 leading-relaxed">
            If you retire between 50 and 60, you enter a gap period before Social Security (62–70) and Medicare (65) begin. During this window, your taxable income may be near zero if you live off Roth withdrawals or taxable account principal. This creates an opportunity that most people miss forever once it closes.
          </p>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">What to do during gap years</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-0.5">→</span> Convert Traditional IRA to Roth at the 10–22% bracket (instead of 24%+ later when RMDs force higher income)</li>
              <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-0.5">→</span> Harvest capital gains at 0% (single filers up to ~$47K income, married up to ~$94K)</li>
              <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-0.5">→</span> Manage ACA income to qualify for healthcare subsidies (100–400% of federal poverty level)</li>
            </ul>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Once Social Security and RMDs begin, your income floor rises permanently. The gap years are a one-time window. Use them.
          </p>
        </section>

        {/* Chapter 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">4. Roth Conversion Ladders</h2>
          <p className="text-slate-600 leading-relaxed">
            A Roth conversion ladder lets you access retirement funds before age 59½ without the 10% early withdrawal penalty. The strategy: convert Traditional IRA funds to Roth every year during your gap years, then access those converted funds 5 years later tax-free.
          </p>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">How the ladder works</h3>
            <div className="space-y-3 text-sm">
              {[
                { year: "Year 1 (age 50)", action: "Convert $50K from Traditional IRA to Roth. Pay income tax at low rate." },
                { year: "Years 2–4", action: "Continue converting $50K/year. Live off taxable accounts or Roth contributions meanwhile." },
                { year: "Year 5 (age 55)", action: "Withdraw the Year 1 conversion tax-free. No penalty since it's been 5 years." },
                { year: "Ongoing", action: "Each year, a new rung of the ladder becomes available." },
              ].map(({ year, action }) => (
                <div key={year} className="flex items-start gap-3">
                  <span className="text-blue-600 font-semibold flex-shrink-0 w-32">{year}</span>
                  <span className="text-slate-600">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">5. Healthcare Before Medicare</h2>
          <p className="text-slate-600 leading-relaxed">
            Healthcare is the biggest financial wildcard for early retirees. Without employer coverage, your options are the ACA marketplace, COBRA (limited to 18 months), a spouse's plan, or healthcare sharing ministries.
          </p>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-2">ACA Marketplace (recommended for most)</h3>
              <p className="text-sm text-slate-600">If your income stays between 100–400% of the federal poverty level (~$15K–$60K for a single person in 2026), you qualify for subsidies that can reduce premiums to near zero. Managing your Roth conversion income to stay within these thresholds is often worth thousands per year.</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-semibold text-slate-900 mb-2">The ACA income cliff</h3>
              <p className="text-sm text-slate-600">Going $1 over 400% FPL used to eliminate all subsidies (the "cliff"). The American Rescue Plan expanded subsidies, but income management still matters significantly for premium costs.</p>
            </div>
          </div>
        </section>

        {/* Chapter 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">6. Social Security: When to Claim</h2>
          <p className="text-slate-600 leading-relaxed">
            You can claim Social Security as early as 62, but your benefit is permanently reduced. Waiting until 70 increases your benefit by 8% per year beyond full retirement age (67 for most people born after 1960).
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="font-bold text-slate-900">Age 62</p>
              <p className="text-2xl font-black text-red-500">70%</p>
              <p className="text-xs text-slate-500">of full benefit</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="font-bold text-slate-900">Age 67 (FRA)</p>
              <p className="text-2xl font-black text-slate-700">100%</p>
              <p className="text-xs text-slate-500">of full benefit</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="font-bold text-slate-900">Age 70</p>
              <p className="text-2xl font-black text-emerald-600">124%</p>
              <p className="text-xs text-slate-500">of full benefit</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            For early retirees with significant portfolios, delaying to 70 often makes sense — it provides a higher guaranteed income floor that reduces sequence-of-returns risk later. During your gap years, withdrawing from investments while deferring Social Security is often the optimal strategy.
          </p>
        </section>

        {/* Chapter 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">7. Portfolio Allocation for Early Retirement</h2>
          <p className="text-slate-600 leading-relaxed">
            Early retirees need their portfolio to last 40–50 years, which requires more growth than a traditional retirement portfolio. But they also need to survive early market downturns without being forced to sell at the bottom.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Common early retirement allocations</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong className="text-slate-900">Aggressive (long runway):</strong> 80–90% stocks, 10–20% bonds/cash</p>
                <p><strong className="text-slate-900">Balanced:</strong> 60–70% stocks, 30–40% bonds/cash</p>
                <p><strong className="text-slate-900">Conservative:</strong> 40–50% stocks, 50–60% bonds/cash</p>
              </div>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">The bucket strategy</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong className="text-slate-900">Bucket 1:</strong> 2–3 years of expenses in cash/short bonds (never sell stocks in a downturn)</p>
                <p><strong className="text-slate-900">Bucket 2:</strong> 5–7 years in bonds/stable assets</p>
                <p><strong className="text-slate-900">Bucket 3:</strong> Remaining in growth equities</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 8 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">8. Sequence-of-Returns Risk</h2>
          <p className="text-slate-600 leading-relaxed">
            Sequence risk is the biggest threat to early retirees. If markets crash in your first 5–10 years of retirement and you're selling assets to cover expenses, you permanently shrink your portfolio before it can recover. A 30% market decline in year 2 of retirement is far more damaging than the same decline in year 20.
          </p>
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">How to protect against it</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2"><CheckSquare className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" /> Keep 2–3 years of expenses in cash so you never sell stocks during a downturn</li>
              <li className="flex items-start gap-2"><CheckSquare className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" /> Use a lower withdrawal rate (3–3.5%) in the first 10 years</li>
              <li className="flex items-start gap-2"><CheckSquare className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" /> Stay flexible: even $10–20K/year in part-time income dramatically reduces withdrawal pressure</li>
              <li className="flex items-start gap-2"><CheckSquare className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" /> Delay Social Security to create a guaranteed income floor that kicks in later</li>
              <li className="flex items-start gap-2"><CheckSquare className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" /> Rebalance annually — buying stocks low during downturns forces you to maintain allocation discipline</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-3">Model your retirement</h3>
          <p className="text-slate-600 mb-6">Use our calculators to find your FI number, run Roth conversion scenarios, and stress test your withdrawal strategy.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools/fi-calculator">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <TrendingUp className="mr-2 h-4 w-4" />
                FI Calculator
              </Button>
            </Link>
            <Link href="/tools/roth-conversion">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Roth Conversion Ladder
              </Button>
            </Link>
          </div>
        </div>

        {/* Read Next */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Read next</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Related handbooks</p>
              <ul className="space-y-2">
                <li><Link href="/handbooks/self-employed-tax-handbook" className="text-emerald-600 hover:underline font-medium">The Self-Employed Tax Handbook</Link></li>
                <li><Link href="/handbooks/freelancer-financial-setup-guide" className="text-emerald-600 hover:underline font-medium">The Freelancer's Financial Setup Guide</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Related articles</p>
              <ul className="space-y-2">
                <li><Link href="/articles/roth-conversion-strategy-engine-launch" className="text-emerald-600 hover:underline font-medium">Building a Roth Conversion Strategy Engine</Link></li>
                <li><Link href="/articles/why-track-net-worth" className="text-emerald-600 hover:underline font-medium">Why Tracking Your Net Worth Over Time is Useful</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
