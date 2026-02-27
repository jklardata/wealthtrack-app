import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, AlertTriangle, Wallet, PiggyBank, TrendingUp, ArrowRightLeft, DollarSign, ShieldCheck, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Budget When Your Income Is Unpredictable: A System for Freelancers | SoloFI",
  description: "Traditional budgets break when income is variable. Here's the proven 3-account system that helps freelancers budget with irregular income and build lasting wealth.",
  openGraph: {
    title: "How to Budget When Your Income Is Unpredictable: A System for Freelancers",
    description: "Traditional budgets break when income is variable. Here's the proven 3-account system that helps freelancers budget with irregular income and build lasting wealth.",
    url: "https://solofi.io/articles/budgeting-irregular-income-freelancers",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=How%20to%20Budget%20With%20Irregular%20Income%3A%20A%20System%20for%20Freelancers&category=Budgeting",
        width: 1200,
        height: 630,
        alt: "How to Budget When Your Income Is Unpredictable: A System for Freelancers",
      },
    ],
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/articles/budgeting-irregular-income-freelancers",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Budget When Your Income Is Unpredictable: A System for Freelancers",
  description: "Traditional budgets break when income is variable. Here's the proven 3-account system that helps freelancers budget with irregular income and build lasting wealth.",
  datePublished: "2026-02-26",
  dateModified: "2026-02-26",
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
  url: "https://solofi.io/articles/budgeting-irregular-income-freelancers",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://solofi.io/articles/budgeting-irregular-income-freelancers",
  },
};

export default function BudgetingIrregularIncomeArticle() {
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
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop"
          alt="Freelancer budgeting and financial planning"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-orange-500 px-3 py-1 rounded-full">Budgeting</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-3">
            How to Budget When Your Income Is Unpredictable: A System for Freelancers
          </h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              February 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              9 min read
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">

        {/* Intro */}
        <p className="text-xl text-slate-600 leading-relaxed">
          If you've ever tried to follow a traditional budget as a freelancer, you already know the problem: the budget assumes you'll earn roughly the same amount every month. You won't. Some months you'll invoice $12,000. Others, $3,000. Traditional budgeting wasn't built for you—but a better system was.
        </p>

        {/* Section 1: Why traditional budgets fail */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">Why Traditional Budgets Fail for Freelancers</h2>
          <p className="text-slate-600 leading-relaxed">
            Standard budgeting advice tells you to allocate 50% to needs, 30% to wants, and 20% to savings. This works beautifully when you have a predictable paycheck. It falls apart the moment your income varies by 3x from one month to the next.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The core flaw is that traditional budgets are income-first. They start with what you earned and work backward. For freelancers, this creates an impossible moving target. A slow month triggers anxiety and overspending on credit. A strong month leads to lifestyle inflation. Neither builds lasting wealth.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The solution isn't to budget harder—it's to build a system that absorbs income volatility so you can live on a stable, predictable amount regardless of what clients pay you this month.
          </p>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">The freelancer's core problem</h4>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Inconsistent income isn't just a cash flow problem—it's a psychology problem. Without a system, you make spending decisions based on how flush you feel <em>right now</em>, not on your actual financial position.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&h=400&fit=crop"
            alt="Financial planning and budgeting worksheets"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Step 1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg">1</span>
            <h2 className="text-3xl font-black border-b-2 border-black pb-3 flex-1">Calculate Your Baseline</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Your baseline is the minimum amount you need to cover your essential monthly expenses. This is your number—not a budget category, not a goal. It's the floor below which life gets genuinely difficult.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Go through your last three months of bank statements and identify every non-negotiable expense. These are the bills that exist whether you work or not:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="font-semibold text-slate-900 mb-3">Fixed Expenses</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />Rent or mortgage</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />Health insurance premium</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />Loan payments (student, auto)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />Phone and internet</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />Essential subscriptions</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="font-semibold text-slate-900 mb-3">Variable Essentials</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />Groceries (use 3-month average)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />Utilities</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />Transportation</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />Basic personal care</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />Minimum debt payments</li>
              </ul>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Add these up. That total is your baseline. For most freelancers, it falls somewhere between $3,000 and $6,000 per month depending on location and lifestyle. Write it down. Everything else in this system flows from this number.
          </p>
        </section>

        {/* Step 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg">2</span>
            <h2 className="text-3xl font-black border-b-2 border-black pb-3 flex-1">Set Your Income Floor</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Your income floor is the minimum monthly revenue your business needs to generate to keep you financially stable. It's not the same as your baseline expenses—it's higher, because it also includes taxes, business costs, and a contribution to your buffer account.
          </p>

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
            <h4 className="font-semibold text-orange-800 mb-4">Income Floor Formula</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-orange-200">
                <span className="text-slate-700">Personal baseline expenses</span>
                <span className="font-mono font-semibold text-slate-900">$X,XXX</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-orange-200">
                <span className="text-slate-700">+ Tax reserve (25-30% of gross revenue)</span>
                <span className="font-mono font-semibold text-slate-900">$X,XXX</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-orange-200">
                <span className="text-slate-700">+ Business expenses (software, equipment)</span>
                <span className="font-mono font-semibold text-slate-900">$XXX</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-orange-200">
                <span className="text-slate-700">+ Minimum buffer contribution</span>
                <span className="font-mono font-semibold text-slate-900">$XXX</span>
              </div>
              <div className="flex justify-between items-center py-2 font-bold">
                <span className="text-slate-900">= Your Monthly Income Floor</span>
                <span className="font-mono text-orange-700">$X,XXX</span>
              </div>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Knowing your income floor removes the guesswork from slow months. When a month comes in below the floor, you know immediately: this is the moment to draw from your buffer, not to panic-spend on a credit card or accept any client at any rate.
          </p>
        </section>

        {/* Step 3 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg">3</span>
            <h2 className="text-3xl font-black border-b-2 border-black pb-3 flex-1">Build a Buffer Account</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            This is the most important account most freelancers don't have. The buffer account is a separate savings account that exists solely to smooth your income. It absorbs the feast-and-famine cycle so your personal spending remains consistent.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Your target: one to three months of baseline expenses, held in a high-yield savings account completely separate from your emergency fund. These serve different purposes:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border-2 border-orange-400 bg-orange-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-orange-600" />
                <h4 className="font-bold text-orange-800">Buffer Account</h4>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Covers income gaps during slow months. Gets depleted and refilled regularly. Target: 1-3 months of expenses. Think of it as your income smoothing engine.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <PiggyBank className="h-5 w-5 text-slate-500" />
                <h4 className="font-bold text-slate-700">Emergency Fund</h4>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Covers true emergencies: job loss, medical events, major repairs. Target: 6-12 months of expenses for the self-employed. Rarely touched.
              </p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Build your buffer first—it's faster to achieve and immediately reduces financial stress. A $10,000 buffer means a slow month no longer puts you in crisis mode.
          </p>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1000&h=400&fit=crop"
            alt="Multiple bank accounts system for freelancers"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Step 4 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg">4</span>
            <h2 className="text-3xl font-black border-b-2 border-black pb-3 flex-1">The 3-Account System</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            This is the structural backbone of freelance budgeting. Every dollar you earn flows through three dedicated accounts, each with a single job. Mixing them is what causes the chaos most freelancers experience.
          </p>

          <div className="space-y-4">
            {/* Operating Account */}
            <div className="rounded-xl border-2 border-black bg-white overflow-hidden">
              <div className="bg-black text-white px-5 py-3 flex items-center gap-3">
                <ArrowRightLeft className="h-5 w-5" />
                <h4 className="font-bold">Account 1: Operating Account (Business Checking)</h4>
              </div>
              <div className="p-5">
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  All client payments land here first. This is your business's hub. Nothing personal gets paid from this account directly—it distributes money to the other two accounts on a set schedule.
                </p>
                <p className="text-sm font-medium text-slate-700">Recommended bank: Mercury (no fees, built for freelancers)</p>
              </div>
            </div>

            {/* Tax Account */}
            <div className="rounded-xl border-2 border-purple-400 bg-purple-50 overflow-hidden">
              <div className="bg-purple-600 text-white px-5 py-3 flex items-center gap-3">
                <DollarSign className="h-5 w-5" />
                <h4 className="font-bold">Account 2: Tax Account (25-30% of Every Deposit)</h4>
              </div>
              <div className="p-5">
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  Every time money hits your operating account, move 25-30% immediately into a dedicated tax savings account. Treat this money as already gone. It belongs to the IRS, not to you.
                </p>
                <p className="text-sm font-medium text-slate-700">
                  This covers: self-employment tax (15.3%), federal income tax, and state income tax. Use the higher end (30%) if your net income exceeds $80,000/year.
                </p>
              </div>
            </div>

            {/* Personal Account */}
            <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 overflow-hidden">
              <div className="bg-emerald-600 text-white px-5 py-3 flex items-center gap-3">
                <Wallet className="h-5 w-5" />
                <h4 className="font-bold">Account 3: Personal Account (Your "Salary")</h4>
              </div>
              <div className="p-5">
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  You pay yourself a fixed amount from the operating account each month—your self-determined salary. All personal spending comes from here. This is where budgeting becomes simple: your income is now predictable because you made it that way.
                </p>
                <p className="text-sm font-medium text-emerald-700">Your personal account never sees a client payment. It only sees your salary transfer.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 5 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg">5</span>
            <h2 className="text-3xl font-black border-b-2 border-black pb-3 flex-1">Pay Yourself a Salary</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Once you have the 3-account system in place, pay yourself the same fixed amount on the same date every month. This is your salary. It's not tied to how much you earned this month—it's tied to your baseline plus a reasonable personal spending allowance.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Set your salary conservatively at first. If your baseline expenses are $4,500, start with a $5,500 monthly salary. The $1,000 gap covers discretionary spending and leaves a small buffer to rebuild your buffer account faster.
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-emerald-700 mb-2">How the salary transfer works</h4>
                <ol className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><span className="font-bold text-emerald-600">1.</span> Client pays $8,000 into operating account</li>
                  <li className="flex items-start gap-2"><span className="font-bold text-emerald-600">2.</span> You immediately move $2,200 (27.5%) to tax account</li>
                  <li className="flex items-start gap-2"><span className="font-bold text-emerald-600">3.</span> On the 1st, you transfer your $5,500 salary to personal account</li>
                  <li className="flex items-start gap-2"><span className="font-bold text-emerald-600">4.</span> Remaining $300 stays in operating account, building up over time</li>
                  <li className="flex items-start gap-2"><span className="font-bold text-emerald-600">5.</span> Slow month with only $4,000? Buffer account covers the salary shortfall</li>
                </ol>
              </div>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            The psychological shift here is profound. You stop thinking like a freelancer who earns variable amounts and start thinking like an employee with a stable income—because you've engineered that stability yourself.
          </p>
        </section>

        {/* Feast months */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">How to Handle Feast Months</h2>
          <p className="text-slate-600 leading-relaxed">
            You close a big contract. Three invoices get paid at once. You have $20,000 sitting in your operating account. What do you do?
          </p>
          <p className="text-slate-600 leading-relaxed">
            Most freelancers lifestyle inflate. They upgrade apartments, buy new gear, or eat out every night. This feels justified in the moment—after all, you earned it. But it erodes the one thing variable income demands most: financial resilience.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h4 className="font-semibold text-slate-900 mb-4">The feast month protocol</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <div>
                  <p className="font-medium text-slate-900">Pay your taxes first</p>
                  <p className="text-sm text-slate-500">Move 25-30% to your tax account before anything else. Non-negotiable.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <div>
                  <p className="font-medium text-slate-900">Top up your buffer to target</p>
                  <p className="text-sm text-slate-500">If your buffer dipped last month, restore it to your 1-3 month target before investing.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <div>
                  <p className="font-medium text-slate-900">Invest the surplus</p>
                  <p className="text-sm text-slate-500">Max out your Solo 401(k) or SEP-IRA. Then taxable brokerage. This is how you build wealth—not lifestyle.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <div>
                  <p className="font-medium text-slate-900">Optional: a small celebration</p>
                  <p className="text-sm text-slate-500">Allow yourself a deliberate, planned reward—not an impulsive splurge. Keep it under 5% of the surplus.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Lifestyle inflation warning:</strong> Upgrading your fixed expenses (rent, car payments, subscriptions) during a good stretch is the most dangerous move a freelancer can make. Fixed expenses don't shrink when income drops—but your income will.
              </p>
            </div>
          </div>
        </section>

        {/* Net worth as north star */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">Track Net Worth Monthly as Your North Star</h2>
          <p className="text-slate-600 leading-relaxed">
            Cash flow management gets you stable. Net worth tracking tells you if you're actually building wealth. For freelancers, monthly income is a terrible proxy for financial progress—you can have a great month and still be moving backward if you're spending everything.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Net worth (assets minus liabilities) is the one number that captures everything: your savings rate, your investment growth, your debt paydown, and your business income—all combined into a single, honest score.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                <h4 className="font-medium text-slate-900">Accountability</h4>
              </div>
              <p className="text-sm text-slate-500">
                Monthly tracking makes slow wealth accumulation visible. You see the compound effect of consistent behavior.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <h4 className="font-medium text-slate-900">Progress Signal</h4>
              </div>
              <p className="text-sm text-slate-500">
                A rising trend line tells you your system is working—even in months with lower income.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h4 className="font-medium text-slate-900">FI Target</h4>
              </div>
              <p className="text-sm text-slate-500">
                Net worth is the number you need to reach financial independence—not income, not savings rate alone.
              </p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Make it a monthly ritual: on the first of each month, update your net worth before you do anything else. This takes 10 minutes and is the single highest-leverage financial habit you can build. Over time, you'll have a data-driven picture of your trajectory—something no monthly income statement can give you.
          </p>

          <p className="text-slate-600 leading-relaxed">
            If you want to understand why this habit is so powerful for long-term wealth building, read{" "}
            <Link href="https://solofi.io/articles/why-track-net-worth" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
              Why Tracking Your Net Worth Over Time is Useful
            </Link>{" "}
            for the full breakdown.
          </p>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">Key Takeaways</h2>
          <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="font-black text-emerald-600 text-lg leading-none mt-0.5">1.</span>
              <p className="text-slate-700 leading-relaxed">
                Traditional budgets fail freelancers because they're income-first. Build an expense-first system that defines stability regardless of what you earn.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-black text-emerald-600 text-lg leading-none mt-0.5">2.</span>
              <p className="text-slate-700 leading-relaxed">
                Know your baseline (minimum monthly needs) and your income floor (minimum revenue to stay stable). These two numbers are your operating parameters.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-black text-emerald-600 text-lg leading-none mt-0.5">3.</span>
              <p className="text-slate-700 leading-relaxed">
                A buffer account (1-3 months of expenses, separate from your emergency fund) is the bridge between variable income and stable living. Build it first.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-black text-emerald-600 text-lg leading-none mt-0.5">4.</span>
              <p className="text-slate-700 leading-relaxed">
                The 3-account system—operating, tax (25-30%), and personal—gives every dollar a job and eliminates the chaos of mixing business and personal finances.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-black text-emerald-600 text-lg leading-none mt-0.5">5.</span>
              <p className="text-slate-700 leading-relaxed">
                Pay yourself a fixed salary each month. Feast months belong in your buffer, investment accounts, and retirement—not lifestyle upgrades.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-black text-emerald-600 text-lg leading-none mt-0.5">6.</span>
              <p className="text-slate-700 leading-relaxed">
                Track net worth monthly. It's the only metric that tells you whether you're building wealth—regardless of what your bank balance looked like this week.
              </p>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Read next</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Related articles</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="https://solofi.io/articles/why-track-net-worth" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    Why Tracking Your Net Worth Over Time is Useful
                  </Link>
                </li>
                <li>
                  <Link href="https://solofi.io/articles/30-percent-rule-self-employment-taxes" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    The 30% Rule: Why You Should Set Aside This Much for Taxes
                  </Link>
                </li>
                <li>
                  <Link href="https://solofi.io/articles/best-bank-accounts-for-consultants" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    Best Bank Accounts for Remote Workers and Independent Consultants
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Free tools</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="https://solofi.io/tools/fi-calculator" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    FI Calculator — Find your financial independence number
                  </Link>
                </li>
                <li>
                  <Link href="https://app.solofi.io/dashboard" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    Net Worth Tracker — Start tracking your progress
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Ready to see your full financial picture?</h3>
          <p className="text-slate-500 mb-6">
            Track your net worth, buffer account, and wealth trajectory—all in one place, built for the self-employed.
          </p>
          <Link href="https://app.solofi.io/dashboard">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <TrendingUp className="mr-2 h-4 w-4" />
              Start tracking your net worth
            </Button>
          </Link>
        </div>

      </div>
    </article>
  );
}
