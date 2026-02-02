import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Calendar, Clock, AlertTriangle, DollarSign, Shield, Building2, CheckCircle2, XCircle, AlertCircle, Scale } from "lucide-react";

export const metadata = {
  title: "Sole Proprietor vs. LLC: Which Structure Saves You More Money? - SoloFI",
  description: "Should you form an LLC for your consulting business? A comprehensive comparison of sole proprietorship vs. LLC, covering taxes, liability, costs, and which structure is best for different income levels.",
};

export default function SoleProprietorVsLLCArticle() {
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
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=600&fit=crop"
          alt="Business structure planning"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-blue-500 px-3 py-1 rounded-full">Business Structure</span>
          <h1 className="text-3xl md:text-4xl font-medium text-white mt-3">Sole Proprietor vs. LLC: Which Structure Saves You More Money?</h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              February 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              14 min read
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">
        {/* Intro */}
        <p className="text-xl text-slate-600 leading-relaxed">
          You just landed your first consulting client. Congratulations! But now you're facing a decision that could impact your taxes, liability, and paperwork for years to come: Should you operate as a sole proprietor or form an LLC?
        </p>

        <p className="text-slate-600 leading-relaxed">
          The answer depends on your income level, risk tolerance, and long-term plans. Let's break down both structures so you can make an informed decision.
        </p>

        {/* Disclaimer */}
        <div className="rounded-xl border border-slate-200 bg-yellow-50 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">Legal Disclaimer</h4>
            <p className="text-sm text-slate-600">This article is for educational purposes only and not legal or tax advice. Consult a CPA, tax attorney, or business lawyer for advice specific to your situation.</p>
          </div>
        </div>

        {/* Quick Comparison */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Quick Comparison at a Glance</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sole Proprietor */}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-900">Sole Proprietor</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">No setup costs</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Minimal paperwork</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Simple tax filing</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">No liability protection</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Personal assets at risk</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">Best for:</p>
                <p className="text-xs text-blue-800 mt-1">Low-risk consultants earning under $50K</p>
              </div>
            </div>

            {/* LLC */}
            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900">LLC</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Liability protection</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Separates personal assets</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">More professional image</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Setup and annual fees</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">More paperwork</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-100 rounded-lg">
                <p className="text-sm font-semibold text-emerald-900">Best for:</p>
                <p className="text-xs text-emerald-800 mt-1">Consultants with liability risk or earning $50K+</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tax Comparison */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Tax Differences: The Truth</h2>

          <p className="text-slate-600 leading-relaxed">
            Here's the most important thing to understand: <strong className="text-slate-900">An LLC taxed as a disregarded entity pays the EXACT same taxes as a sole proprietor.</strong>
          </p>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h4 className="font-semibold mb-3 text-amber-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Common Misconception
            </h4>
            <p className="text-sm text-slate-700 mb-2">
              Many new consultants think forming an LLC will automatically save them on taxes. This isn't true.
            </p>
            <p className="text-sm text-slate-700">
              By default, a single-member LLC is <strong>"disregarded"</strong> for tax purposes—meaning the IRS treats it exactly like a sole proprietorship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="font-semibold text-slate-900 mb-3">Sole Proprietor Taxes</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• File Schedule C with personal return</li>
                <li>• Pay 15.3% self-employment tax</li>
                <li>• Pay federal income tax</li>
                <li>• Pay state income tax</li>
                <li>• Make quarterly estimated payments</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="font-semibold text-slate-900 mb-3">Single-Member LLC (Default)</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• File Schedule C with personal return</li>
                <li>• Pay 15.3% self-employment tax</li>
                <li>• Pay federal income tax</li>
                <li>• Pay state income tax</li>
                <li>• Make quarterly estimated payments</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-slate-500 italic text-center mt-4">
            ↑ Notice something? They're identical.
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 mt-4">
            <h4 className="font-semibold mb-2 text-emerald-900">When an LLC CAN Save Taxes</h4>
            <p className="text-sm text-slate-700 mb-2">
              An LLC can save taxes only if you elect S-Corp taxation. But this is available to both sole proprietors AND LLCs.
            </p>
            <p className="text-sm text-slate-700">
              <strong>Bottom line:</strong> The LLC structure itself doesn't save taxes. The S-Corp election does.
            </p>
          </div>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1554224311-beee2091c527?w=1000&h=400&fit=crop"
            alt="Business decisions"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Liability Protection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Liability Protection: The Real Difference</h2>

          <p className="text-slate-600 leading-relaxed">
            This is where the LLC shines. The primary benefit of an LLC is <strong className="text-slate-900">limited liability protection</strong>.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Sole Proprietor Risk
              </h4>
              <p className="text-sm text-slate-700 mb-4">
                You and your business are legally the same entity. If your business gets sued or goes into debt:
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Your home can be seized</li>
                <li>• Your personal savings can be taken</li>
                <li>• Your car can be repossessed</li>
                <li>• Your personal credit is affected</li>
              </ul>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
              <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                LLC Protection
              </h4>
              <p className="text-sm text-slate-700 mb-4">
                The LLC is a separate legal entity. In most cases, liability is limited to business assets:
              </p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span className="text-sm">Home is protected</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span className="text-sm">Personal savings protected</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span className="text-sm">Personal assets separate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span className="text-sm">Only business assets at risk</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mt-4">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Important Exception
            </h4>
            <p className="text-sm text-slate-600">
              LLCs don't protect you from liability due to your own negligence or malpractice. For example, if you make a critical error in your consulting work, you can still be held personally liable. This is why professional liability insurance (E&O insurance) is still important.
            </p>
          </div>
        </section>

        {/* Cost Comparison */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Cost Comparison: The Real Numbers</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h4 className="font-semibold text-blue-900 mb-4">Sole Proprietor Costs</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Setup</span>
                  <span className="font-semibold text-slate-900">$0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">DBA filing (optional)</span>
                  <span className="font-semibold text-slate-900">$10-$100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Annual fees</span>
                  <span className="font-semibold text-slate-900">$0</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span className="text-sm font-semibold text-blue-900">Total First Year</span>
                  <span className="text-lg font-bold text-blue-600">$0-$100</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
              <h4 className="font-semibold text-emerald-900 mb-4">LLC Costs</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">State filing fee</span>
                  <span className="font-semibold text-slate-900">$50-$800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Annual report/fee</span>
                  <span className="font-semibold text-slate-900">$0-$800/yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Registered agent (optional)</span>
                  <span className="font-semibold text-slate-900">$100-$300/yr</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200 pt-2">
                  <span className="text-sm font-semibold text-emerald-900">Total First Year</span>
                  <span className="text-lg font-bold text-emerald-600">$150-$1,900</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 mt-4">
            <h4 className="font-semibold text-slate-900 mb-3">LLC Costs by State (Examples)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-sm font-medium text-slate-900">California</p>
                <p className="text-xs text-slate-500 mt-1">$70 filing</p>
                <p className="text-xs text-slate-500">$800/yr franchise tax</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-sm font-medium text-slate-900">Delaware</p>
                <p className="text-xs text-slate-500 mt-1">$90 filing</p>
                <p className="text-xs text-slate-500">$300/yr tax</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-sm font-medium text-slate-900">Texas</p>
                <p className="text-xs text-slate-500 mt-1">$300 filing</p>
                <p className="text-xs text-slate-500">$0/yr</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-sm font-medium text-slate-900">Florida</p>
                <p className="text-xs text-slate-500 mt-1">$125 filing</p>
                <p className="text-xs text-slate-500">$138.75/yr</p>
              </div>
            </div>
          </div>
        </section>

        {/* When to Choose */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">When to Choose Each Structure</h2>

          <div className="space-y-4">
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Choose Sole Proprietor If:
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">You're just testing a side hustle</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">You're earning less than $30-50K annually</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Your work is low-risk (writing, design, coaching)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">You have professional liability insurance</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">You want to minimize paperwork and costs</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6">
              <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Choose LLC If:
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">You're earning $50K+ annually</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Your work involves liability risk (engineering, financial advice, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">You own significant personal assets to protect</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">You work with high-value clients or contracts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">You plan to grow and hire employees eventually</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">You want a more professional image</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Decision Framework */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Decision Framework by Income Level</h2>

          <div className="space-y-3">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900">$0 - $30,000/year</h4>
                <span className="text-sm font-medium text-blue-600">Sole Proprietor</span>
              </div>
              <p className="text-sm text-slate-600">Stay simple. Use that $800 for marketing instead of LLC fees.</p>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-slate-50 to-emerald-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900">$30,000 - $50,000/year</h4>
                <span className="text-sm font-medium text-amber-600">Consider LLC</span>
              </div>
              <p className="text-sm text-slate-600">Depends on your risk tolerance and whether you have assets to protect.</p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900">$50,000 - $100,000/year</h4>
                <span className="text-sm font-medium text-emerald-600">Form LLC</span>
              </div>
              <p className="text-sm text-slate-600">The liability protection is worth it at this income level.</p>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-purple-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900">$100,000+/year</h4>
                <span className="text-sm font-medium text-purple-600">LLC + Consider S-Corp</span>
              </div>
              <p className="text-sm text-slate-600">Form an LLC and consider S-Corp election to save on self-employment taxes.</p>
            </div>
          </div>
        </section>

        {/* Maintenance Requirements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Ongoing Maintenance Requirements</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="font-semibold text-slate-900 mb-3">Sole Proprietor</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• File Schedule C with tax return</li>
                <li>• Track business expenses</li>
                <li>• Keep business records 3+ years</li>
                <li>• Make quarterly tax payments</li>
                <li className="text-emerald-600 font-medium">Total time: ~5 hours/year</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="font-semibold text-slate-900 mb-3">LLC</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Everything sole proprietor does, plus:</li>
                <li>• File annual report with state</li>
                <li>• Maintain separate business bank account</li>
                <li>• Keep meeting minutes (if multi-member)</li>
                <li>• Update operating agreement as needed</li>
                <li className="text-amber-600 font-medium">Total time: ~8-10 hours/year</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Common Questions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Common Questions</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Can I switch from sole proprietor to LLC later?</h4>
              <p className="text-sm text-slate-600">
                Yes! Many consultants start as sole proprietors and form an LLC once their income reaches $50-75K. This is a common and reasonable path.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Do I need a lawyer to form an LLC?</h4>
              <p className="text-sm text-slate-600">
                Not necessarily. Services like Northwest Registered Agent or LegalZoom can help you file for $200-300. However, if your situation is complex (multiple members, unique operating agreements), consult a business attorney.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="font-semibold text-slate-900 mb-2">Will clients take me more seriously with an LLC?</h4>
              <p className="text-sm text-slate-600">
                Sometimes. Enterprise clients and government contracts often prefer working with LLCs or corporations. For small business clients, it rarely matters.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="font-semibold text-slate-900 mb-2">What about S-Corp vs. LLC?</h4>
              <p className="text-sm text-slate-600">
                S-Corp is a tax election, not a legal structure. You can elect S-Corp taxation whether you're a sole proprietor or LLC. S-Corp makes sense when you're earning $80K+ and want to save on self-employment taxes.
              </p>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Key Takeaways</h2>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">1.</span>
                <span className="text-slate-700">LLC doesn't automatically save taxes—it provides liability protection</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">2.</span>
                <span className="text-slate-700">Start as sole proprietor if you're earning under $30-50K</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">3.</span>
                <span className="text-slate-700">Form an LLC once you hit $50K+ or have assets to protect</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">4.</span>
                <span className="text-slate-700">Consider S-Corp election at $80-100K+ to save on self-employment taxes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">5.</span>
                <span className="text-slate-700">Get professional liability insurance regardless of structure</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Calculate Your Tax Savings Potential</h3>
          <p className="text-slate-600 mb-6">See how much you could save with different business structures and tax strategies.</p>
          <Link href="/tools/tax-savings">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Calculator className="mr-2 h-4 w-4" />
              Free Tax Calculator
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
