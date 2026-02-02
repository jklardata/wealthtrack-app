import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Calendar, Clock, AlertTriangle, DollarSign, PiggyBank, TrendingUp, Shield, AlertCircle } from "lucide-react";

export const metadata = {
  title: "The 30% Rule: Why You Should Set Aside This Much for Taxes - SoloFI",
  description: "The simple rule that prevents tax-time panic for self-employed professionals. Learn why setting aside 30% of your income is the golden standard for consultants and freelancers.",
};

export default function ThirtyPercentRuleArticle() {
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
          src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1200&h=600&fit=crop"
          alt="Tax planning and savings"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-emerald-500 px-3 py-1 rounded-full">Tax Planning</span>
          <h1 className="text-3xl md:text-4xl font-medium text-white mt-3">The 30% Rule: Why You Should Set Aside This Much for Taxes</h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              February 2026
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
        <p className="text-xl text-slate-600 leading-relaxed">
          It's April 15th. Your accountant just told you that you owe $45,000 in taxes. You have $8,000 in your bank account. This is the nightmare scenario that keeps self-employed professionals up at night—and it's completely avoidable with one simple rule.
        </p>

        {/* The Rule */}
        <div className="rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <PiggyBank className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-900">The 30% Rule</h2>
              <p className="text-emerald-700">The simple formula for tax-time peace of mind</p>
            </div>
          </div>
          <div className="bg-white/80 rounded-xl p-6 mt-4">
            <p className="text-lg text-slate-700 mb-2">
              Set aside <span className="text-3xl font-bold text-emerald-600">30%</span> of every dollar you earn into a separate tax savings account.
            </p>
            <p className="text-sm text-slate-600">This covers federal taxes, state taxes, and self-employment tax for most consultants earning $75K-$250K.</p>
          </div>
        </div>

        {/* Why 30% */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Why 30%? Breaking Down the Math</h2>

          <p className="text-slate-600 leading-relaxed">
            When you're self-employed, you face a three-headed tax monster:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <h4 className="font-semibold text-red-900 mb-2">Self-Employment Tax</h4>
              <p className="text-3xl font-bold text-red-600">15.3%</p>
              <p className="text-sm text-slate-600 mt-2">Social Security (12.4%) + Medicare (2.9%)</p>
              <p className="text-xs text-slate-500 mt-2 italic">This hits you first, before income tax</p>
            </div>

            <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
              <h4 className="font-semibold text-orange-900 mb-2">Federal Income Tax</h4>
              <p className="text-3xl font-bold text-orange-600">10-24%</p>
              <p className="text-sm text-slate-600 mt-2">Depends on your income bracket</p>
              <p className="text-xs text-slate-500 mt-2 italic">Most consultants fall in the 22-24% range</p>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
              <h4 className="font-semibold text-purple-900 mb-2">State Income Tax</h4>
              <p className="text-3xl font-bold text-purple-600">0-13%</p>
              <p className="text-sm text-slate-600 mt-2">Varies by state</p>
              <p className="text-xs text-slate-500 mt-2 italic">California/NY highest, FL/TX have none</p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 mt-4">
            <h4 className="font-semibold mb-3 text-emerald-900 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Example Calculation
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Self-Employment Tax:</span>
                <span className="font-semibold text-slate-900">~15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Federal Income Tax (22% bracket):</span>
                <span className="font-semibold text-slate-900">~12-15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">State Tax (e.g., California):</span>
                <span className="font-semibold text-slate-900">~6%</span>
              </div>
              <div className="border-t border-emerald-200 pt-2 mt-2 flex justify-between">
                <span className="text-emerald-900 font-bold">Total Effective Rate:</span>
                <span className="text-2xl font-bold text-emerald-600">30-35%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Real Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Real-World Example: Sarah the Consultant</h2>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-slate-600 mb-4">
              Sarah is a marketing consultant earning $150,000 per year. She lives in Colorado (4.4% state tax).
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">❌ Without the 30% Rule</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-600">Annual income: $150,000</p>
                  <p className="text-slate-600">Spent throughout the year: $150,000</p>
                  <p className="text-red-600 font-semibold mt-3">Tax bill in April: $43,500</p>
                  <p className="text-red-600 font-semibold">Money available: $0</p>
                  <p className="text-xs text-slate-500 mt-2 italic">Result: Panic, payment plans, penalties</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">✅ With the 30% Rule</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-600">Annual income: $150,000</p>
                  <p className="text-slate-600">Set aside 30%: $45,000</p>
                  <p className="text-slate-600">Available to spend: $105,000</p>
                  <p className="text-emerald-600 font-semibold mt-3">Tax bill in April: $43,500</p>
                  <p className="text-emerald-600 font-semibold">Tax savings balance: $45,000</p>
                  <p className="text-xs text-slate-500 mt-2 italic">Result: Paid in full, $1,500 cushion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=1000&h=400&fit=crop"
            alt="Financial planning"
            className="w-full h-full object-cover"
          />
        </div>

        {/* How to Implement */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">How to Implement the 30% Rule</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Open a Separate Savings Account</h3>
                <p className="text-slate-600">Don't keep tax money in your checking account. Open a dedicated high-yield savings account labeled "Tax Savings."</p>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Pro tip:</strong> Look for accounts offering 4-5% interest. Your tax money can earn interest while waiting!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Transfer 30% Every Time You Get Paid</h3>
                <p className="text-slate-600 mb-3">The moment a client payment hits your account, immediately transfer 30% to your tax savings.</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-900">Manual Method</p>
                    <p className="text-xs text-slate-500 mt-1">Set a reminder to transfer after each payment</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-900">Automated Method</p>
                    <p className="text-xs text-slate-500 mt-1">Use tools like QuickBooks or Relay to automate</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-green-600">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Make Quarterly Estimated Payments</h3>
                <p className="text-slate-600 mb-3">Use your tax savings to pay quarterly estimates (due April 15, June 15, Sept 15, Jan 15).</p>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h4 className="font-semibold mb-3 text-slate-900">2026 Quarterly Deadlines</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900">Q1</p>
                      <p className="text-xs text-slate-500">Apr 15</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900">Q2</p>
                      <p className="text-xs text-slate-500">Jun 15</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900">Q3</p>
                      <p className="text-xs text-slate-500">Sep 15</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900">Q4</p>
                      <p className="text-xs text-slate-500">Jan 15</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-amber-600">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Never Touch the Tax Account</h3>
                <p className="text-slate-600">Pretend this money doesn't exist. It's not your money—it's the government's money that you're temporarily holding.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Adjusting the Percentage */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Should You Adjust the 30% Rule?</h2>

          <p className="text-slate-600 leading-relaxed">
            While 30% works for most consultants, you might need to adjust based on your situation:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Save More Than 30% If:
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">▲</span>
                  <span>You live in a high-tax state (CA, NY, NJ)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">▲</span>
                  <span>You earn over $200K annually</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">▲</span>
                  <span>You have limited business deductions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">▲</span>
                  <span>You want a larger cushion/refund</span>
                </li>
              </ul>
              <p className="text-xs text-green-800 mt-3 italic">Consider 35-40% for these situations</p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                You Might Save Less If:
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">▼</span>
                  <span>You live in a no-tax state (FL, TX, WA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">▼</span>
                  <span>You max out retirement contributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">▼</span>
                  <span>You have an S-Corp with reasonable salary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">▼</span>
                  <span>You have significant business expenses</span>
                </li>
              </ul>
              <p className="text-xs text-blue-800 mt-3 italic">You might get away with 25%, but start at 30%</p>
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Common Mistakes to Avoid</h2>

          <div className="space-y-3">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Thinking "I'll Save Later"</h4>
                <p className="text-sm text-slate-600">The money will be gone. Save it immediately, before you spend it.</p>
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Dipping Into Your Tax Savings</h4>
                <p className="text-sm text-slate-600">"I'll just borrow $5K and pay it back next month" never works out.</p>
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Not Adjusting for Major Changes</h4>
                <p className="text-sm text-slate-600">If you move states or change your business structure, recalculate your percentage.</p>
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Forgetting Quarterly Payments</h4>
                <p className="text-sm text-slate-600">Missing quarterly deadlines can result in penalties, even if you pay the full amount in April.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Peace of Mind Factor */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">The Peace of Mind Factor</h2>

          <p className="text-slate-600 leading-relaxed">
            Beyond avoiding tax-time panic, the 30% rule provides psychological benefits:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2">You sleep better</h4>
              <p className="text-sm text-slate-600">No 3 AM anxiety about owing thousands you don't have</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">You spend with confidence</h4>
              <p className="text-sm text-slate-600">Know your real take-home amount and budget accordingly</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">No surprises in April</h4>
              <p className="text-sm text-slate-600">Tax season becomes a non-event, not a crisis</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2">Potential tax refund</h4>
              <p className="text-sm text-slate-600">If you overpaid, you get a nice refund in April</p>
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
                <span className="text-slate-700">Set aside 30% of every payment you receive</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">2.</span>
                <span className="text-slate-700">Keep tax savings in a separate account you never touch</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">3.</span>
                <span className="text-slate-700">Make quarterly estimated tax payments to avoid penalties</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">4.</span>
                <span className="text-slate-700">Adjust the percentage based on your state and situation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">5.</span>
                <span className="text-slate-700">This simple rule prevents tax-time panic and saves thousands in penalties</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Calculate Your Exact Tax Rate</h3>
          <p className="text-slate-600 mb-6">Use our free tax calculator to find your personalized savings percentage.</p>
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
