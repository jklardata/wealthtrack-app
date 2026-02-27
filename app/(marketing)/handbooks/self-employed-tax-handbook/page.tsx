import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Calculator, AlertTriangle, DollarSign, CheckSquare } from "lucide-react";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "The Self-Employed Tax Handbook | SoloFI",
  description: "A complete guide to minimizing your tax burden as a self-employed professional. Covers S-Corp, Solo 401(k), HSA, QBI deduction, quarterly taxes, and more.",
  openGraph: {
    title: "The Self-Employed Tax Handbook",
    description: "A complete guide to minimizing your tax burden as a self-employed professional.",
    url: "https://solofi.io/handbooks/self-employed-tax-handbook",
    siteName: "SoloFI",
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/handbooks/self-employed-tax-handbook",
  },
};

export default function SelfEmployedTaxHandbook() {
  return (
    <article>
      {/* Back Button + Download */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            Back to Learn
          </Button>
        </Link>
        <PrintButton />
      </div>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-emerald-600 to-teal-700 p-10 md:p-14">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-emerald-200" />
            <span className="text-sm font-medium text-emerald-200 uppercase tracking-wide">Handbook</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">The Self-Employed Tax Handbook</h1>
          <p className="text-emerald-100 text-lg max-w-2xl">
            Everything you need to minimize your tax burden as a consultant, freelancer, or independent contractor.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-64 opacity-10 bg-gradient-to-l from-white" />
      </div>

      <div className="space-y-10">
        {/* Disclaimer */}
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">This handbook is for educational purposes only. Consult a qualified CPA or tax professional for advice specific to your situation.</p>
        </div>

        {/* Table of Contents */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Contents</h2>
          <ol className="space-y-2 text-sm">
            {[
              "Your Tax Situation as a Self-Employed Worker",
              "Choosing the Right Business Structure",
              "Solo 401(k): The Most Powerful Account",
              "Health Insurance and HSA Strategy",
              "The QBI Deduction (Section 199A)",
              "Quarterly Estimated Taxes",
              "Deductions That Save the Most Money",
              "Year-End Tax Planning Checklist",
            ].map((section, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                {section}
              </li>
            ))}
          </ol>
        </div>

        {/* Chapter 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">1. Your Tax Situation as a Self-Employed Worker</h2>
          <p className="text-slate-600 leading-relaxed">
            When you're self-employed, you pay both the employee and employer portions of Social Security and Medicare taxes. That's 15.3% on your first $168,600 of net earnings, then 2.9% on everything above that. This is your self-employment (SE) tax, and it's on top of income tax.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-3xl font-black text-red-500">15.3%</p>
              <p className="text-sm text-slate-500 mt-1">SE tax rate up to $168,600</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-3xl font-black text-amber-500">2.9%</p>
              <p className="text-sm text-slate-500 mt-1">Medicare-only above $168,600</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-3xl font-black text-emerald-600">50%</p>
              <p className="text-sm text-slate-500 mt-1">of SE tax is deductible</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            The good news: you can deduct half of your SE tax from gross income before calculating income tax. And with the right strategies, you can dramatically reduce how much SE tax you owe in the first place.
          </p>
        </section>

        {/* Chapter 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">2. Choosing the Right Business Structure</h2>
          <p className="text-slate-600 leading-relaxed">
            Your business structure is your single biggest tax lever. Most self-employed people start as sole proprietors by default, but as income grows, other structures offer significant advantages.
          </p>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-1">Sole Proprietor / Single-Member LLC</h3>
              <p className="text-sm text-slate-600">Simplest setup. All profit is subject to SE tax. Best when earning under $60–80K net.</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <h3 className="font-semibold text-slate-900 mb-1">S-Corporation Election</h3>
              <p className="text-sm text-slate-600 mb-2">
                Split income between salary (SE tax applies) and distributions (no SE tax). At $150K net profit with a $75K salary, you save roughly <strong className="text-slate-900">$11,500/year</strong> in SE taxes alone.
              </p>
              <p className="text-sm text-emerald-700 font-medium">Recommended once net profit consistently exceeds $80–100K.</p>
            </div>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-slate-700"><strong>Key rule:</strong> your S-Corp salary must be "reasonable" for your role. The IRS looks at this closely. Most CPAs recommend 40–60% of total profit as salary, with the remainder as distributions.</p>
          </div>
        </section>

        {/* Chapter 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">3. Solo 401(k): The Most Powerful Account</h2>
          <p className="text-slate-600 leading-relaxed">
            The Solo 401(k) lets you contribute as both employee and employer, creating one of the largest annual tax deductions available to any individual.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-2xl font-black text-blue-600">$23,500</p>
              <p className="text-xs text-slate-500 mt-1">Employee contribution (2026)</p>
              <p className="text-xs text-slate-400">$31,000 if age 50+</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-2xl font-black text-slate-600">25%</p>
              <p className="text-xs text-slate-500 mt-1">Employer contribution</p>
              <p className="text-xs text-slate-400">of net SE income</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-2xl font-black text-emerald-600">$70,000</p>
              <p className="text-xs text-slate-500 mt-1">Total max (2026)</p>
              <p className="text-xs text-slate-400">$77,500 if age 50+</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            You can split between traditional (tax deduction now) and Roth (tax-free in retirement). Most high earners front-load traditional contributions to reduce current-year taxes, then shift toward Roth as they approach retirement when marginal rates may be lower.
          </p>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-700"><strong>Deadline:</strong> the plan must be opened by December 31st of the tax year, but contributions can be made until your filing deadline including extensions.</p>
          </div>
        </section>

        {/* Chapter 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">4. Health Insurance and HSA Strategy</h2>
          <p className="text-slate-600 leading-relaxed">
            Self-employed individuals can deduct 100% of health insurance premiums for themselves and their family. This is an above-the-line deduction that reduces your adjusted gross income directly.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Pair this with an HSA (Health Savings Account) if you have a qualifying high-deductible health plan. HSAs offer a triple tax advantage: contributions are deductible, growth is tax-free, and withdrawals for medical expenses are tax-free.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-2">2026 HSA Limits</h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p>Individual: <strong className="text-slate-900">$4,300</strong></p>
                <p>Family: <strong className="text-slate-900">$8,550</strong></p>
                <p>Age 55+ catch-up: <strong className="text-slate-900">+$1,000</strong></p>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Combined deduction example</h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p>Family premiums ($800/mo): <strong className="text-slate-900">$9,600</strong></p>
                <p>HSA family max: <strong className="text-slate-900">$8,550</strong></p>
                <p className="text-emerald-700 font-semibold pt-1 border-t border-emerald-200">Total deduction: $18,150</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">5. The QBI Deduction (Section 199A)</h2>
          <p className="text-slate-600 leading-relaxed">
            The Qualified Business Income deduction lets eligible self-employed workers deduct up to 20% of qualified business income from taxable income. On $100K of QBI, that's a $20K deduction worth $4,400–7,400 in tax savings depending on your bracket.
          </p>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">2026 Phase-out thresholds (Specified Service Trades)</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Single filer phase-out starts at:</p>
                <p className="text-xl font-bold text-slate-900">$191,950</p>
              </div>
              <div>
                <p className="text-slate-500">Married filing jointly starts at:</p>
                <p className="text-xl font-bold text-slate-900">$383,900</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">Most consulting, legal, financial, and health services qualify as specified service trades. The deduction phases out over $50K ($100K married) above these thresholds.</p>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">
            Note: this deduction is currently set to expire after 2025 unless extended by Congress. File with it while it's available.
          </p>
        </section>

        {/* Chapter 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">6. Quarterly Estimated Taxes</h2>
          <p className="text-slate-600 leading-relaxed">
            The IRS requires you to pay taxes as you earn. Miss a quarterly deadline or underpay, and you'll owe underpayment penalties (currently around 8% annualized).
          </p>
          <p className="text-slate-600 leading-relaxed">
            The safe harbor rule: pay at least 100% of last year's total tax (110% if you earned over $150K), and you avoid all penalties regardless of how much you owe at filing. Most self-employed professionals use this approach — pay 100–110% of prior year taxes in four equal installments, then settle the actual difference in April.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { q: "Q1", due: "April 15, 2026" },
              { q: "Q2", due: "June 16, 2026" },
              { q: "Q3", due: "Sept 15, 2026" },
              { q: "Q4", due: "Jan 15, 2027" },
            ].map(({ q, due }) => (
              <div key={q} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <p className="font-bold text-slate-900">{q}</p>
                <p className="text-xs text-slate-500 mt-1">{due}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Chapter 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">7. Deductions That Save the Most Money</h2>
          <p className="text-slate-600 leading-relaxed">
            Every dollar of legitimate deductions reduces your taxable income by your combined marginal rate (income tax + SE tax), typically 35–50% for most self-employed professionals. Here are the highest-impact ones.
          </p>
          <div className="space-y-3">
            {[
              { title: "Home office", detail: "Actual expense method: deduct business-use % of rent, utilities, insurance. A dedicated office in a 1,500 sq ft apartment at 15% = deducting 15% of all housing costs." },
              { title: "Vehicle / mileage", detail: "$0.70/mile standard rate in 2026, or deduct actual expenses (gas, insurance, depreciation) prorated for business use. Log every business trip." },
              { title: "Equipment and software", detail: "Computers, monitors, cameras, subscriptions — all deductible if used for business. Section 179 lets you deduct the full cost in year one instead of depreciating." },
              { title: "Professional development", detail: "Courses, books, conferences, certifications directly related to your business. Maintain receipts and note the business purpose." },
              { title: "Travel", detail: "Flights, hotels, and 50% of meals when traveling for business. The trip must be primarily for business — personal days don't disqualify it entirely." },
              { title: "Retirement contributions", detail: "Solo 401(k) contributions directly reduce your taxable income dollar-for-dollar. This is the biggest lever after structure choice." },
            ].map(({ title, detail }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Chapter 8 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">8. Year-End Tax Planning Checklist</h2>
          <p className="text-slate-600 leading-relaxed">
            Run through this every November and December before the year closes.
          </p>
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            {[
              "Estimate your year-end profit and effective tax rate",
              "Max out Solo 401(k) employee contribution ($23,500 / $31,000 if 50+)",
              "Calculate optimal employer contribution to Solo 401(k)",
              "Fund HSA to the annual maximum",
              "Review all expense receipts — anything you can prepay before Dec 31?",
              "Consider timing of invoices: can you defer income to January?",
              "Assess whether S-Corp election makes sense for next year",
              "Confirm your Q4 estimated tax payment covers safe harbor",
              "Check if Roth conversion makes sense in low-income years",
              "Schedule a year-end meeting with your CPA",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckSquare className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-3">Put this into practice</h3>
          <p className="text-slate-600 mb-6">Use our free tax tools to estimate your savings from S-Corp, Solo 401(k), and more.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools/tax-savings">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Calculator className="mr-2 h-4 w-4" />
                Tax Savings Calculator
              </Button>
            </Link>
            <Link href="/tools/quarterly-tax">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Quarterly Tax Estimator
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
                <li><Link href="/handbooks/early-retirement-handbook" className="text-emerald-600 hover:underline font-medium">The Early Retirement Handbook</Link></li>
                <li><Link href="/handbooks/freelancer-financial-setup-guide" className="text-emerald-600 hover:underline font-medium">The Freelancer's Financial Setup Guide</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Related articles</p>
              <ul className="space-y-2">
                <li><Link href="/articles/tax-strategies-2026-self-employed" className="text-emerald-600 hover:underline font-medium">Tax Strategies in 2026 for Self-Employed Workers</Link></li>
                <li><Link href="/articles/overlooked-tax-deductions-consultants" className="text-emerald-600 hover:underline font-medium">Top 10 Overlooked Tax Deductions for Consultants</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Print styles */}
      <style>{`
        @media print {
          @page { margin: 0.75in; size: letter; }

          /* Hide nav, buttons, read-next, CTA */
          nav, header, footer,
          .print\\:hidden { display: none !important; }

          body { background: #fff; }

          /* Page title area */
          article { font-family: Georgia, serif; color: #111; }

          /* Hero block */
          article > div:nth-child(2) {
            background: #1a3328 !important;
            color: #fff !important;
            border-radius: 4px;
            padding: 32px !important;
            margin-bottom: 24px;
            page-break-inside: avoid;
          }

          /* Chapter headings */
          h2 {
            color: #1a3328 !important;
            border-bottom: 2px solid #1a3328 !important;
            font-size: 16pt;
            margin-top: 24pt;
            page-break-after: avoid;
          }

          h3 { color: #1a3328 !important; }

          /* Stat boxes — green/tan alternating */
          .rounded-xl {
            border: 1px solid #c8b99a !important;
            background: #faf6ef !important;
            page-break-inside: avoid;
          }

          /* Highlighted/accent boxes */
          .bg-emerald-50, .bg-emerald-600, .bg-emerald-800 {
            background: #e8f0eb !important;
            border: 1px solid #2d5a3d !important;
          }

          .bg-amber-50 { background: #f2e8d5 !important; border: 1px solid #c8b99a !important; }
          .bg-blue-50  { background: #e8eef5 !important; border: 1px solid #9ab0c8 !important; }
          .bg-yellow-50 { background: #fdf6e3 !important; border: 1px solid #d4b08c !important; }

          /* Stat number colors */
          .text-red-500    { color: #c0392b !important; }
          .text-amber-500  { color: #d4892b !important; }
          .text-emerald-600, .text-emerald-700 { color: #1a3328 !important; }
          .text-blue-600   { color: #1a3358 !important; }

          /* Body text */
          .text-slate-600, .text-slate-700 { color: #333 !important; }
          .text-slate-500, .text-slate-400 { color: #555 !important; }
          .text-slate-900  { color: #111 !important; }

          /* Links */
          a { color: #1a3328 !important; text-decoration: underline; }

          /* CheckSquare icons */
          svg { color: #1a3328 !important; }

          /* CTA and read-next — hide in print */
          article > div:last-child,
          article > div:nth-last-child(2) { display: none !important; }

          /* Page breaks */
          section { page-break-inside: avoid; }

          /* SoloFI print header */
          article::before {
            content: "SoloFI · solofi.io";
            display: block;
            font-size: 9pt;
            color: #888;
            text-align: right;
            margin-bottom: 16pt;
            border-bottom: 1px solid #ddd;
            padding-bottom: 6pt;
          }
        }
      `}</style>
    </article>
  );
}
