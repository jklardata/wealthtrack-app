import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Calendar, Clock, AlertTriangle, DollarSign, PiggyBank, TrendingUp, Shield, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "The 30% Rule: Why You Should Set Aside This Much for Taxes | SoloFI",
  description: "The simple rule that prevents tax-time panic for self-employed professionals. Learn why setting aside 30% of your income is the golden standard for consultants and freelancers.",
  openGraph: {
    title: "The 30% Rule: Why You Should Set Aside This Much for Taxes | SoloFI",
    description: "The simple rule that prevents tax-time panic for self-employed professionals.",
    url: "https://solofi.io/articles/30-percent-rule-self-employment-taxes",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=The%2030%%20Rule:%20Why%20You%20Should%20Set%20Aside%20This%20Much%20for%20Taxes&category=Taxes",
        width: 1200,
        height: 630,
        alt: "The 30% Rule: Why You Should Set Aside This Much for Taxes",
      },
    ],
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/articles/30-percent-rule-self-employment-taxes",
  },
};


const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The 30% Rule: Why You Should Set Aside This Much for Taxes",
  description: "The simple rule that prevents tax-time panic for self-employed professionals.",
  datePublished: "2025-12-01",
  dateModified: "2025-12-01",
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
  url: "https://solofi.io/articles/30-percent-rule-self-employment-taxes",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://solofi.io/articles/30-percent-rule-self-employment-taxes",
  },
};
export default function ThirtyPercentRuleArticle() {
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
            When you're self-employed, you're not just paying income tax—you're facing a three-headed tax monster that employees never see. The first blow comes from self-employment tax, a brutal 15.3% that covers both the employer and employee portions of Social Security and Medicare. When you're a W-2 employee, your company quietly pays half of this for you. As a consultant, you pay the full freight.
          </p>

          <p className="text-slate-600 leading-relaxed">
            But that's just the appetizer. On top of self-employment tax, you're still on the hook for regular federal income tax. Most consultants earning between $75,000 and $250,000 find themselves in the 22-24% marginal bracket—and that's before we even talk about state taxes. If you're in California or New York, add another 6-13% to the pile. Even "tax-friendly" states like Colorado still take their 4-5% cut.
          </p>

          <p className="text-slate-600 leading-relaxed">
            Do the math: 15% self-employment tax + 12-15% effective federal tax + 4-8% average state tax = 31-38% total effective rate for most consultants. We say 30% because it's a round number that works for most situations, and it's better to slightly over-save than come up short in April.
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

          <p className="text-slate-600 leading-relaxed">
            The mechanics are simple, but execution requires discipline. Most consultants who fail at this don't have a system problem—they have a psychology problem. Watching money sit in an account without touching it is harder than it sounds when cash flow is lumpy and expenses are constant. Here's how to make it automatic and painless.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Open a Separate Savings Account</h3>
                <p className="text-slate-600">The cardinal sin is keeping tax money in your operating account. It feels like you have more cash than you actually do, and you'll inevitably spend it. Open a dedicated high-yield savings account—literally label it "Tax Savings" so there's no confusion. Banks like Marcus, Ally, or American Express offer 4-5% interest right now, which means your tax money can earn $2,000+ per year while waiting for the IRS. That's found money.</p>
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
                <p className="text-slate-600 mb-3">This is where discipline meets automation. The moment a $10,000 client payment hits your account, $3,000 goes straight to tax savings—no exceptions, no delays. The longer that money sits in your checking account, the more likely you'll find a "reason" to use it. Treat this transfer like a non-negotiable business expense, because that's exactly what it is. You can do this manually, but I've seen too many consultants forget or "borrow" from their tax savings. Automation removes the temptation entirely.</p>
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
                <p className="text-slate-600 mb-3">The IRS doesn't wait until April to collect—they expect quarterly payments throughout the year. Miss these deadlines and you'll face underpayment penalties even if you pay the full amount in April. Your tax savings account funds these quarterly payments (due April 15, June 15, September 15, and January 15). Start with 100% of last year's total tax bill divided by four, or use the safe harbor method: pay 110% of last year's tax if you earned over $150,000, or 100% if under. This protects you from penalties even if your income spikes mid-year.</p>
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
            The 30% rule is a starting point, not gospel. Think of it as the baseline that works for a consultant earning $100,000-$150,000 in a moderate-tax state like Colorado or Georgia. But your situation might call for adjustments.
          </p>

          <p className="text-slate-600 leading-relaxed">
            If you're in California, New York, or New Jersey, you're looking at state taxes in the 6-13% range—significantly higher than the national average. In these states, bump your savings rate to 35-40%. The pain of over-saving by $5,000 is nothing compared to the panic of owing $15,000 you don't have. High earners above $200,000 face even steeper marginal rates and additional Medicare tax (0.9%), pushing some consultants into the 40-45% effective range.
          </p>

          <p className="text-slate-600 leading-relaxed">
            On the flip side, if you're in Texas, Florida, or Washington—states with zero income tax—you can drop to 25%. And if you're aggressively maximizing deductions through a Solo 401(k) ($69,000 max in 2025), HSA ($8,550 for families), and home office expenses, your effective rate could fall to 20-25%. The key is to review your actual tax return from last year: divide your total tax by your gross income to find your effective rate, then add 5% as a buffer. That's your personalized savings percentage.</p>

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

        
        {/* Internal Links */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Read next</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Related articles</p>
              <ul className="space-y-2 text-sm">
              <li key="tax-strategies-2026-self-employed"><Link href="https://solofi.io/articles/tax-strategies-2026-self-employed" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">Tax Strategies in 2026 for Self-Employed Workers</Link></li>
              <li key="overlooked-tax-deductions-consultants"><Link href="https://solofi.io/articles/overlooked-tax-deductions-consultants" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">Top 10 Overlooked Tax Deductions for Consultants</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Free tools</p>
              <ul className="space-y-2 text-sm">
              <li key="quarterly-tax"><Link href="https://solofi.io/tools" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">Quarterly Tax Estimator</Link></li>
              <li key="tax-savings"><Link href="https://solofi.io/tools" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">Tax Savings Calculator</Link></li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Calculate Your Exact Tax Rate</h3>
          <p className="text-slate-600 mb-6">Explore our free tools to help you plan and manage your taxes effectively.</p>
          <Link href="https://solofi.io/tools">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Calculator className="mr-2 h-4 w-4" />
              Explore Free Tools
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
