import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, DollarSign, Calculator, TrendingUp, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "2026 Federal Tax Brackets: What's Changed and What It Means for the Self-Employed | SoloFI",
  description: "The IRS adjusts tax brackets annually for inflation. Here are the 2026 federal income tax brackets, standard deductions, and how they affect self-employed professionals.",
  openGraph: {
    title: "2026 Federal Tax Brackets: Complete Guide for the Self-Employed",
    description: "The IRS adjusts tax brackets annually for inflation. Here are the 2026 brackets, standard deductions, and what they mean for self-employed professionals.",
    url: "https://solofi.io/articles/tax-brackets-2026",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=2026%20Federal%20Tax%20Brackets%20for%20the%20Self-Employed&category=Taxes",
        width: 1200,
        height: 630,
        alt: "2026 Federal Tax Brackets",
      },
    ],
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/articles/tax-brackets-2026",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "2026 Federal Tax Brackets: What's Changed and What It Means for the Self-Employed",
  description: "The IRS adjusts tax brackets annually for inflation. Here are the 2026 federal income tax brackets and standard deductions.",
  datePublished: "2026-03-01",
  dateModified: "2026-03-01",
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
  url: "https://solofi.io/articles/tax-brackets-2026",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://solofi.io/articles/tax-brackets-2026",
  },
};

const singleBrackets = [
  { rate: "10%", from: "$0", to: "$11,925", tax: "10% of taxable income" },
  { rate: "12%", from: "$11,926", to: "$48,475", tax: "$1,192.50 + 12% of amount over $11,925" },
  { rate: "22%", from: "$48,476", to: "$103,350", tax: "$5,578.50 + 22% of amount over $48,475" },
  { rate: "24%", from: "$103,351", to: "$197,300", tax: "$17,651.50 + 24% of amount over $103,350" },
  { rate: "32%", from: "$197,301", to: "$250,525", tax: "$40,199.50 + 32% of amount over $197,300" },
  { rate: "35%", from: "$250,526", to: "$626,350", tax: "$57,231.50 + 35% of amount over $250,525" },
  { rate: "37%", from: "$626,351", to: "and up", tax: "$188,769.75 + 37% of amount over $626,350" },
];

const marriedBrackets = [
  { rate: "10%", from: "$0", to: "$23,850", tax: "10% of taxable income" },
  { rate: "12%", from: "$23,851", to: "$96,950", tax: "$2,385 + 12% of amount over $23,850" },
  { rate: "22%", from: "$96,951", to: "$206,700", tax: "$11,157 + 22% of amount over $96,950" },
  { rate: "24%", from: "$206,701", to: "$394,600", tax: "$35,302 + 24% of amount over $206,700" },
  { rate: "32%", from: "$394,601", to: "$501,050", tax: "$80,398 + 32% of amount over $394,600" },
  { rate: "35%", from: "$501,051", to: "$751,600", tax: "$114,462 + 35% of amount over $501,050" },
  { rate: "37%", from: "$751,601", to: "and up", tax: "$202,154.50 + 37% of amount over $751,600" },
];

const rateColors: Record<string, string> = {
  "10%": "bg-emerald-100 text-emerald-800",
  "12%": "bg-green-100 text-green-800",
  "22%": "bg-yellow-100 text-yellow-800",
  "24%": "bg-orange-100 text-orange-800",
  "32%": "bg-red-100 text-red-800",
  "35%": "bg-red-200 text-red-900",
  "37%": "bg-red-300 text-red-900",
};

export default function TaxBrackets2026Article() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
          src="https://images.pexels.com/photos/7068839/pexels-photo-7068839.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop"
          alt="Tax documents and financial planning for 2026"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-purple-500 px-3 py-1 rounded-full">Taxes</span>
          <h1 className="text-3xl md:text-4xl font-medium text-white mt-3">
            2026 Federal Tax Brackets: What's Changed and What It Means for the Self-Employed
          </h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span>March 1, 2026</span>
            <span>·</span>
            <span>12 min read</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">
        <p className="text-xl text-slate-600 leading-relaxed">
          The IRS adjusts federal tax brackets each year for inflation under a process called indexing. For 2026, brackets shifted upward by approximately 2.8%—meaning you keep slightly more of the same income compared to 2025. Here's everything self-employed professionals need to know.
        </p>

        <div className="rounded-xl border border-slate-200 bg-yellow-500/10 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-slate-800">Disclaimer</h4>
            <p className="text-sm text-slate-500">This article is for educational purposes only and reflects projected 2026 figures. Always verify with the IRS or a qualified tax professional before filing.</p>
          </div>
        </div>

        {/* Key numbers */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Standard Deduction (Single)</p>
            <p className="text-3xl font-bold text-slate-900">$15,000</p>
            <p className="text-xs text-emerald-600 mt-1">↑ from $14,600 in 2025</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Standard Deduction (MFJ)</p>
            <p className="text-3xl font-bold text-slate-900">$30,000</p>
            <p className="text-xs text-emerald-600 mt-1">↑ from $29,200 in 2025</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">SS Wage Base</p>
            <p className="text-3xl font-bold text-slate-900">$176,100</p>
            <p className="text-xs text-emerald-600 mt-1">↑ from $168,600 in 2025</p>
          </div>
        </div>

        {/* Section 1 - Single Brackets */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">2026 Tax Brackets — Single Filers</h2>
          <p className="text-slate-600 leading-relaxed">
            These are the brackets that apply to <strong>taxable income</strong>—your net profit after deducting the SE tax deduction, retirement contributions, health insurance premiums, and the standard deduction (or itemized deductions if higher).
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-700">Rate</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Taxable Income</th>
                  <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">Tax Owed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {singleBrackets.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${rateColors[row.rate]}`}>{row.rate}</span>
                    </td>
                    <td className="p-4 text-slate-700">{row.from} – {row.to}</td>
                    <td className="p-4 text-slate-500 text-xs hidden md:table-cell">{row.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2 - MFJ Brackets */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">2026 Tax Brackets — Married Filing Jointly</h2>
          <p className="text-slate-600 leading-relaxed">
            For married couples filing jointly, brackets are roughly double the single filer thresholds. This matters significantly for two-income households where both spouses are self-employed.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-700">Rate</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Taxable Income</th>
                  <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">Tax Owed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marriedBrackets.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${rateColors[row.rate]}`}>{row.rate}</span>
                    </td>
                    <td className="p-4 text-slate-700">{row.from} – {row.to}</td>
                    <td className="p-4 text-slate-500 text-xs hidden md:table-cell">{row.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Photo break */}
        <div className="rounded-xl overflow-hidden h-52">
          <img
            src="https://images.pexels.com/photos/6863254/pexels-photo-6863254.jpeg?auto=compress&cs=tinysrgb&w=1200&h=420&fit=crop"
            alt="Tax planning and financial documents"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 3 - How Self-Employment Works */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">How This Works for the Self-Employed</h2>
          <p className="text-slate-600 leading-relaxed">
            Self-employed individuals pay income tax the same way as everyone else—using these progressive brackets on taxable income. The key difference is <em>what counts as taxable income</em> and the additional SE tax layer.
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6 space-y-4">
            <h4 className="font-semibold text-emerald-700 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              How Your Taxable Income Is Calculated
            </h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="text-slate-600">Gross business revenue</span>
                <span className="text-slate-900">$XXX,XXX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">− Business expenses</span>
                <span className="text-emerald-700">−$XX,XXX</span>
              </div>
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="font-semibold text-slate-700">= Net profit (Schedule C)</span>
                <span className="font-semibold text-slate-900">$XXX,XXX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">− ½ of SE tax deduction</span>
                <span className="text-emerald-700">−$X,XXX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">− Solo 401(k) / SEP IRA contributions</span>
                <span className="text-emerald-700">−$XX,XXX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">− Health insurance premiums deduction</span>
                <span className="text-emerald-700">−$X,XXX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">− Standard deduction ($15,000 single)</span>
                <span className="text-emerald-700">−$15,000</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-emerald-200">
                <span className="font-semibold text-slate-900">= Taxable income (apply brackets above)</span>
                <span className="font-bold text-slate-900">$XX,XXX</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">
              <strong>Important:</strong> SE tax (15.3%) is calculated separately on your net profit—<em>before</em> applying these income tax brackets. It's an additional tax, not a replacement for income tax.
            </p>
          </div>
        </section>

        {/* Section 4 - Strategic Implications */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Strategic Bracket Planning for 2026</h2>
          <p className="text-slate-600 leading-relaxed">
            Understanding where you land in the brackets opens up planning opportunities. Here are the most common scenarios for self-employed professionals:
          </p>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">22% bracket</span>
                The most common bracket for self-employed professionals
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Single filers with taxable income between $48,476–$103,350 sit in the 22% bracket. For many freelancers earning $100–$200K gross, strategic deductions (retirement contributions especially) can keep most income in this range.
              </p>
              <p className="text-sm text-emerald-700 font-medium">
                ✓ Priority: Max Solo 401(k) employee contribution ($23,500) to avoid spilling into the 24% bracket.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">24% bracket</span>
                The S-Corp sweet spot
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Single filers with taxable income in $103,351–$197,300 are in the 24% bracket. At this level, an S-Corp election becomes compelling—saving 15.3% SE tax on distributions while paying 24% income tax creates real arbitrage.
              </p>
              <p className="text-sm text-emerald-700 font-medium">
                ✓ Priority: Model the S-Corp breakeven and consider election before Q2.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">32%+ bracket</span>
                Maximum deferral territory
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Above $197,300 (single), every dollar deferred to a pre-tax retirement account saves 32+ cents in federal income tax, plus avoids SE tax. At this level, both the employer and employee portions of a Solo 401(k) should be maximized.
              </p>
              <p className="text-sm text-emerald-700 font-medium">
                ✓ Priority: Max Solo 401(k) ($70,000 total), consider defined benefit plan for even higher limits.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 - Capital Gains */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Long-Term Capital Gains Rates in 2026</h2>
          <p className="text-slate-600 leading-relaxed">
            If you hold investments in a taxable brokerage account, long-term capital gains (assets held 12+ months) are taxed at preferential rates. These are also indexed for inflation in 2026:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-700">Rate</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Single Filer Taxable Income</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Married Filing Jointly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-white">
                  <td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">0%</span></td>
                  <td className="p-4 text-slate-700">Up to $48,350</td>
                  <td className="p-4 text-slate-700">Up to $96,700</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">15%</span></td>
                  <td className="p-4 text-slate-700">$48,351 – $533,400</td>
                  <td className="p-4 text-slate-700">$96,701 – $600,050</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">20%</span></td>
                  <td className="p-4 text-slate-700">Over $533,400</td>
                  <td className="p-4 text-slate-700">Over $600,050</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
            <TrendingUp className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">
              <strong>Planning opportunity:</strong> If you have a low-income year (reduced freelance work, gap year, sabbatical), strategic Roth conversions or capital gains harvesting at 0% can significantly reduce lifetime taxes.
            </p>
          </div>
        </section>

        {/* Section 6 - Key Retirement Numbers */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Key 2026 Retirement Contribution Limits</h2>
          <p className="text-slate-600 leading-relaxed">
            These limits directly affect your taxable income and quarterly estimated tax calculations:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Solo 401(k) employee contribution", value: "$23,500", note: "+$7,500 catch-up if 50+" },
              { label: "Solo 401(k) employer contribution", value: "Up to 25% of W-2 salary (S-Corp) or 20% of net profit (sole prop)" , note: "Combined max: $70,000" },
              { label: "SEP IRA", value: "25% of net earnings", note: "Max $70,000" },
              { label: "Traditional / Roth IRA", value: "$7,000", note: "+$1,000 catch-up if 50+" },
              { label: "HSA (self-only)", value: "$4,300", note: "Must have HDHP" },
              { label: "HSA (family)", value: "$8,550", note: "Must have HDHP" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className="text-lg font-bold text-slate-900">{item.value}</p>
                <p className="text-xs text-emerald-600 mt-0.5">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
          <h3 className="font-semibold text-slate-900 text-lg mb-2">Model your 2026 tax picture</h3>
          <p className="text-slate-600 text-sm mb-4">
            SoloFI calculates your SE tax, federal income tax, quarterly estimates, and retirement contribution impacts—specific to your income and filing status.
          </p>
          <Link href="/sign-up">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Run your tax projection — free
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
