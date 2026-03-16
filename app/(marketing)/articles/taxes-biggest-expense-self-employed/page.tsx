import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, DollarSign, TrendingUp, Calculator, Percent } from "lucide-react";

export const metadata: Metadata = {
  title: "Taxes Are the Biggest Expense for the Self-Employed | SoloFI",
  description: "Most self-employed professionals underestimate their tax burden. Between self-employment tax and federal income tax, taxes often consume 35–45% of net profit. Here's the full breakdown—and what you can do about it.",
  openGraph: {
    title: "Taxes Are the Biggest Expense for the Self-Employed",
    description: "Between self-employment tax and federal income tax, taxes often consume 35–45% of net profit. Here's the breakdown—and what to do about it.",
    url: "https://solofi.io/articles/taxes-biggest-expense-self-employed",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=Taxes%20Are%20the%20Biggest%20Expense%20for%20the%20Self-Employed&category=Taxes",
        width: 1200,
        height: 630,
        alt: "Taxes Are the Biggest Expense for the Self-Employed",
      },
    ],
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/articles/taxes-biggest-expense-self-employed",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Taxes Are the Biggest Expense for the Self-Employed",
  description: "Most self-employed professionals underestimate their tax burden. Between self-employment tax and federal income tax, taxes often consume 35–45% of net profit.",
  datePublished: "2026-02-05",
  dateModified: "2026-02-05",
  author: {
    "@type": "Person",
    name: "Justin Leu",
    url: "https://solofi.io/about",
  },
  publisher: {
    "@type": "Organization",
    name: "SoloFI",
    url: "https://solofi.io",
  },
  url: "https://solofi.io/articles/taxes-biggest-expense-self-employed",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://solofi.io/articles/taxes-biggest-expense-self-employed",
  },
};

export default function TaxesBiggestExpenseArticle() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Back Button */}
      <div className="mb-6">
        <Link href="https://solofi.io/blog">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
        <img
          src="https://images.pexels.com/photos/6863243/pexels-photo-6863243.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop"
          alt="Self-employed professional reviewing tax documents"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-purple-500 px-3 py-1 rounded-full">Taxes</span>
          <h1 className="text-3xl md:text-4xl font-medium text-white mt-3">
            Taxes Are the Biggest Expense for the Self-Employed
          </h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span>February 5, 2026</span>
            <span>·</span>
            <span>10 min read</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">
        <p className="text-xl text-slate-600 leading-relaxed">
          When you leave a W-2 job, your employer quietly absorbed half of your payroll taxes and withheld the rest automatically. The moment you go self-employed, those taxes become your entire problem—and most people don't realize how large that bill is until they see it for the first time.
        </p>

        <div className="rounded-xl border border-slate-200 bg-yellow-500/10 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-slate-800">Disclaimer</h4>
            <p className="text-sm text-slate-500">This article is for educational purposes only. Consult a qualified CPA or tax professional for advice specific to your situation.</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">The Hidden Tax That W-2 Employees Never See</h2>
          <p className="text-slate-600 leading-relaxed">
            When you're employed, your employer pays half of your Social Security and Medicare taxes (FICA). You pay the other half, and it shows up on your pay stub as a small deduction you barely notice.
          </p>
          <p className="text-slate-600 leading-relaxed">
            When you're self-employed, you pay <em>both halves</em>. That's the self-employment (SE) tax, and it adds up to <strong>15.3%</strong> on the first $176,100 of net earnings (2026 limit), plus 2.9% Medicare on everything above that.
          </p>
          <p className="text-slate-600 leading-relaxed">
            This is applied to 92.35% of your net profit (you get a small reduction to account for the deductible portion). The result is a flat tax that hits before income taxes even begin.
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6">
            <h4 className="font-semibold mb-3 text-emerald-700 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Quick Example: $150,000 Net Profit
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="text-slate-600">Net business profit</span>
                <span className="font-bold text-slate-900">$150,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">SE tax (15.3% × 92.35%)</span>
                <span className="font-bold text-red-600">−$21,195</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">SE deduction (½ of SE tax)</span>
                <span className="font-bold text-emerald-700">+$10,598</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Standard deduction (single, 2026)</span>
                <span className="font-bold text-emerald-700">+$15,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Federal taxable income</span>
                <span className="font-bold text-slate-900">$124,402</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Federal income tax (~22% effective)</span>
                <span className="font-bold text-red-600">−$20,526</span>
              </div>
              <div className="flex justify-between border-t border-emerald-200 pt-2 mt-2">
                <span className="font-semibold text-slate-800">Total federal tax bill</span>
                <span className="font-bold text-red-700 text-base">$41,721 (27.8%)</span>
              </div>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Add state income taxes (ranging from 0% in Texas or Florida to 13.3% in California), and it's not hard to see effective total tax rates of 35–45% for high-earning self-employed professionals.
          </p>
        </section>

        {/* Photo break */}
        <div className="rounded-xl overflow-hidden h-56">
          <img
            src="https://images.pexels.com/photos/4386366/pexels-photo-4386366.jpeg?auto=compress&cs=tinysrgb&w=1200&h=450&fit=crop"
            alt="Financial planning documents and calculator"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Why Most People Underestimate This</h2>
          <p className="text-slate-600 leading-relaxed">
            There are three common failure modes when self-employed people think about taxes:
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-700 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Thinking in gross revenue, not net profit</h3>
                <p className="text-sm text-slate-600">
                  Taxes are calculated on net profit (revenue minus business expenses), not your top-line revenue. If you billed $200K but had $60K in legitimate business expenses, you're taxed on $140K—a significant difference.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-700 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Forgetting the SE tax entirely</h3>
                <p className="text-sm text-slate-600">
                  People planning their finances often look up their federal income tax bracket and stop there. The SE tax is a separate 15.3% that applies before brackets even matter. Ignoring it leads to a shocking April surprise.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-700 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Not setting aside money throughout the year</h3>
                <p className="text-sm text-slate-600">
                  Without automatic withholding, tax money mixes with operating cash. By Q4, many self-employed professionals have already spent money they owed the IRS—and face both a large tax bill and underpayment penalties.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">The Real Tax Rate at Different Income Levels</h2>
          <p className="text-slate-600 leading-relaxed">
            Here's how the combined federal tax burden (SE tax + income tax) looks across income levels for a single filer with no retirement contributions or other deductions beyond the standard deduction:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-700">Net Profit</th>
                  <th className="text-right p-4 font-semibold text-slate-700">SE Tax</th>
                  <th className="text-right p-4 font-semibold text-slate-700">Federal Income Tax</th>
                  <th className="text-right p-4 font-semibold text-slate-700">Total Federal</th>
                  <th className="text-right p-4 font-semibold text-slate-700">Effective Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { profit: "$60,000", se: "$8,478", income: "$4,726", total: "$13,204", rate: "22.0%" },
                  { profit: "$100,000", se: "$14,130", income: "$11,526", total: "$25,656", rate: "25.7%" },
                  { profit: "$150,000", se: "$21,195", income: "$20,526", total: "$41,721", rate: "27.8%" },
                  { profit: "$200,000", se: "$27,434", income: "$33,726", total: "$61,160", rate: "30.6%" },
                  { profit: "$300,000", se: "$31,574", income: "$66,526", total: "$98,100", rate: "32.7%" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="p-4 font-medium text-slate-900">{row.profit}</td>
                    <td className="p-4 text-right text-red-600">{row.se}</td>
                    <td className="p-4 text-right text-red-600">{row.income}</td>
                    <td className="p-4 text-right font-semibold text-red-700">{row.total}</td>
                    <td className="p-4 text-right">
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold text-xs">{row.rate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400">* Estimates only. Single filer, 2026 brackets, standard deduction. State tax not included.</p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">What You Can Actually Do About It</h2>
          <p className="text-slate-600 leading-relaxed">
            The good news: the tax code has more levers for self-employed people than for W-2 employees. Here are the highest-impact moves:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-emerald-700" />
                <h3 className="font-semibold text-slate-900">S-Corp Election</h3>
              </div>
              <p className="text-sm text-slate-600">
                If you're netting $80K+, electing S-Corp status lets you pay yourself a reasonable salary and take the rest as distributions—avoiding SE tax on the distribution portion. At $150K profit, this can save $8,000–$12,000 annually.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-blue-700" />
                <h3 className="font-semibold text-slate-900">Solo 401(k)</h3>
              </div>
              <p className="text-sm text-slate-600">
                Contribute up to $70,000 (2025) as both employee and employer. Every dollar contributed reduces your taxable income dollar-for-dollar. At a 35% combined rate, maxing a Solo 401k could save $24,500+ in taxes.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2 mb-3">
                <Percent className="h-5 w-5 text-purple-700" />
                <h3 className="font-semibold text-slate-900">QBI Deduction</h3>
              </div>
              <p className="text-sm text-slate-600">
                Many self-employed filers qualify for the Section 199A Qualified Business Income deduction—up to 20% of net profit deducted before income taxes. Income limits and profession restrictions apply.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-5 w-5 text-amber-700" />
                <h3 className="font-semibold text-slate-900">Maximize Deductions</h3>
              </div>
              <p className="text-sm text-slate-600">
                Home office, health insurance premiums, equipment, software, professional development, retirement plan contributions, half of SE tax—each legitimate deduction reduces net profit and, with it, both SE tax and income tax.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">The Right Mindset: Think in After-Tax Income</h2>
          <p className="text-slate-600 leading-relaxed">
            A self-employed professional earning $200K gross is not equivalent to a W-2 employee earning $200K. After federal taxes alone, the self-employed professional keeps roughly $138,840 while the W-2 employee—whose employer also absorbs payroll taxes—may keep $145,000+ after employer benefits.
          </p>
          <p className="text-slate-600 leading-relaxed">
            That's not an argument against self-employment—the flexibility, control, and income ceiling are often worth far more than the tax differential. But it means pricing your services correctly, understanding your actual take-home, and being aggressive about tax strategy from day one.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-6">
            <h3 className="font-semibold text-white mb-3">The Rule of Thumb</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              For most self-employed professionals earning $100K–$300K, setting aside <strong className="text-white">30–35% of every invoice</strong> in a separate tax account covers federal taxes. Add your state rate on top if applicable.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              This isn't what you'll ultimately owe—strategic contributions, deductions, and business structure will reduce it. But it ensures you always have enough to pay the IRS and never scramble in April.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
          <h3 className="font-semibold text-slate-900 text-lg mb-2">See your exact tax picture</h3>
          <p className="text-slate-600 text-sm mb-4">
            SoloFI models your SE tax, income tax, and estimated quarterly payments based on your actual income and business structure.
          </p>
          <Link href="/sign-up">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Calculate your tax bill — free
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
