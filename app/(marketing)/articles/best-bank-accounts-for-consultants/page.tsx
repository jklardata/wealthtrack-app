import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Bank Accounts for Remote Workers and Independent Consultants - SoloFI",
  description: "The right bank account can save you money and headaches. Here are the best options for self-employed professionals in 2026.",
};
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Calendar, Clock, Check, X, CreditCard, Wallet } from "lucide-react";

export default function BankAccountsArticle() {
  return (
    <article>
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-2 text-white/60 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop"
          alt="Banking and finance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-emerald-600 px-3 py-1 rounded-full">Banking</span>
          <h1 className="text-3xl md:text-4xl font-medium text-slate-900 mt-3">Best Bank Accounts for Remote Workers and Independent Consultants</h1>
          <div className="flex items-center gap-4 mt-3 text-white/60 text-sm">
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
        <p className="text-xl text-white/70 leading-relaxed">
          The right bank account can save you thousands in fees and make managing your freelance finances much easier. Here's our comparison of the best options for independent consultants.
        </p>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Personal Banking: Charles Schwab Investor Checking</h2>
          <p className="text-white/70 leading-relaxed">
            The gold standard for personal banking, especially if you travel internationally.
          </p>
          <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6">
            <h4 className="font-semibold mb-4 text-emerald-600 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Why We Recommend It
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-white/80">No foreign transaction fees</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-white/80">Unlimited worldwide ATM fee rebates</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-white/80">No monthly fees or minimums</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-white/80">Excellent customer service</span>
              </li>
              <li className="flex items-center gap-3">
                <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                <span className="text-white/60">Requires linked brokerage account</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&h=400&fit=crop"
            alt="Business banking dashboard"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Business Banking: Mercury</h2>
          <p className="text-white/70 leading-relaxed">
            Built specifically for startups and freelancers, Mercury offers a modern banking experience with powerful features.
          </p>
          <div className="rounded-xl border border-slate-200 bg-emerald-600/10 p-6">
            <h4 className="font-semibold mb-4 text-slate-600 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Key Features
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-white/80">No monthly fees</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-white/80">Free domestic and international wires</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-white/80">Virtual and physical debit cards</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-white/80">API access and integrations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-white/80">Treasury for higher interest rates</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Multi-Currency: Wise Business</h2>
          <p className="text-white/70 leading-relaxed">
            If you work with international clients, Wise is essential for receiving payments in multiple currencies.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-white">50+ Currencies</strong>
                <p className="text-white/60">Hold and convert between currencies in one account</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-white">Local Bank Details</strong>
                <p className="text-white/60">Get account numbers in USD, EUR, GBP, and more</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-white">Real Exchange Rates</strong>
                <p className="text-white/60">Mid-market rates with low, transparent fees</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">High-Yield Savings: Wealthfront Cash Account</h2>
          <p className="text-white/70 leading-relaxed">
            Park your emergency fund and earn competitive interest rates.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-white">4.5%+ APY</strong>
                <p className="text-white/60">Competitive interest rate on your savings</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-white">FDIC Insured</strong>
                <p className="text-white/60">Up to $8 million through partner banks</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong className="text-white">No Fees</strong>
                <p className="text-white/60">No monthly fees or minimum balance requirements</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Comparison Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Comparison Table</h2>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 font-medium text-slate-900">Bank</th>
                  <th className="text-left p-4 font-medium text-slate-900">Best For</th>
                  <th className="text-left p-4 font-medium text-slate-900">Monthly Fee</th>
                  <th className="text-left p-4 font-medium text-slate-900">FX Fees</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-4 font-medium text-white">Schwab</td>
                  <td className="p-4 text-white/60">Personal/Travel</td>
                  <td className="p-4 text-emerald-600 font-medium">$0</td>
                  <td className="p-4 text-emerald-600 font-medium">None</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 font-medium text-white">Mercury</td>
                  <td className="p-4 text-white/60">Business</td>
                  <td className="p-4 text-emerald-600 font-medium">$0</td>
                  <td className="p-4 text-white/60">1%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 font-medium text-white">Wise</td>
                  <td className="p-4 text-white/60">International</td>
                  <td className="p-4 text-emerald-600 font-medium">$0</td>
                  <td className="p-4 text-white/60">0.4-1%</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Wealthfront</td>
                  <td className="p-4 text-white/60">Savings</td>
                  <td className="p-4 text-emerald-600 font-medium">$0</td>
                  <td className="p-4 text-white/60">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Our Recommended Setup */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Our Recommended Setup</h2>
          <p className="text-white/70 leading-relaxed">
            For most independent consultants, we recommend this combination:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="h-1.5 bg-emerald-600" />
              <div className="p-4">
                <h4 className="font-medium text-slate-900">1. Mercury</h4>
                <p className="text-sm text-white/60">Business checking and receiving client payments</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="h-1.5 bg-emerald-600" />
              <div className="p-4">
                <h4 className="font-medium text-slate-900">2. Charles Schwab</h4>
                <p className="text-sm text-white/60">Personal checking and travel spending</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="h-1.5 bg-purple-500" />
              <div className="p-4">
                <h4 className="font-medium text-slate-900">3. Wise</h4>
                <p className="text-sm text-white/60">International clients paying in their currency</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="h-1.5 bg-amber-500" />
              <div className="p-4">
                <h4 className="font-medium text-slate-900">4. Wealthfront</h4>
                <p className="text-sm text-white/60">Emergency fund and short-term savings</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Key Takeaways</h2>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">1.</span>
                <span className="text-white/80">Separate personal and business finances from day one</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">2.</span>
                <span className="text-white/80">Avoid banks that charge foreign transaction fees</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">3.</span>
                <span className="text-white/80">Consider multi-currency accounts if you have international clients</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">4.</span>
                <span className="text-white/80">Keep 3-6 months expenses in a high-yield savings account</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/20 to-blue-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Ready to optimize your finances?</h3>
          <p className="text-white/60 mb-6">Download our free First Year Freelance Checklist.</p>
          <Link href="/tools/freelance-checklist">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Building2 className="mr-2 h-4 w-4" />
              Get Checklist
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
