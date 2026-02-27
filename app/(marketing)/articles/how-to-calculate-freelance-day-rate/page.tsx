import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Calculator,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How to Calculate Your Freelance Day Rate (Without Undercutting Yourself) | SoloFI",
  description:
    "Most freelancers underprice themselves by starting from the wrong number. Here's the exact formula to calculate your minimum hourly rate and day rate—with a worked example targeting $150K/year.",
  openGraph: {
    title: "How to Calculate Your Freelance Day Rate (Without Undercutting Yourself)",
    description:
      "Most freelancers underprice themselves by starting from the wrong number. Here's the exact formula to calculate your minimum hourly rate and day rate—with a worked example targeting $150K/year.",
    url: "https://solofi.io/articles/how-to-calculate-freelance-day-rate",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=How%20to%20Calculate%20Your%20Freelance%20Day%20Rate&category=Freelancing",
        width: 1200,
        height: 630,
        alt: "How to Calculate Your Freelance Day Rate",
      },
    ],
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/articles/how-to-calculate-freelance-day-rate",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Calculate Your Freelance Day Rate (Without Undercutting Yourself)",
  description:
    "Most freelancers underprice themselves by starting from the wrong number. Here's the exact formula to calculate your minimum hourly rate and day rate—with a worked example targeting $150K/year.",
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
  url: "https://solofi.io/articles/how-to-calculate-freelance-day-rate",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://solofi.io/articles/how-to-calculate-freelance-day-rate",
  },
};

export default function FreelanceDayRateArticle() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Back Button */}
      <div className="mb-6">
        <Link href="https://solofi.io/blog">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=1200&h=600&fit=crop"
          alt="Freelancer calculating rates at a desk"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-pink-500 px-3 py-1 rounded-full">
            Freelancing
          </span>
          <h1 className="text-3xl md:text-4xl font-medium text-white mt-3">
            How to Calculate Your Freelance Day Rate (Without Undercutting Yourself)
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
          Most freelancers set their rates by asking one of two questions: "What did I make as an
          employee?" or "What are other people charging?" Both approaches lead to the same trap—you
          end up pricing yourself too low to actually build a sustainable business. Here's the math
          you need to charge what you're worth.
        </p>

        {/* Disclaimer */}
        <div className="rounded-xl border border-slate-200 bg-yellow-500/10 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-600">Note</h4>
            <p className="text-sm text-slate-500">
              The numbers here are illustrative examples. Your specific tax situation, health costs,
              and business expenses will vary. Consult a CPA for personalized guidance.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">
            Why Most Freelancers Underprice Themselves
          </h2>
          <p className="text-slate-600 leading-relaxed">
            When you were an employee earning $80,000 a year, your employer was quietly paying
            another $20,000–$30,000 on top of your salary: employer payroll taxes, health insurance
            contributions, 401(k) matches, paid vacation, and office overhead. You never saw that
            number—it wasn't on your paycheck.
          </p>
          <p className="text-slate-600 leading-relaxed">
            When you go freelance, all of those costs shift entirely to you. But the mental anchor of
            your old salary stays. So you divide $80,000 by 2,000 working hours and arrive at $40/hour,
            thinking it sounds reasonable. It isn't. At $40/hour as a freelancer, you're almost
            certainly taking a significant pay cut once you run the real numbers.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The other mistake: basing your rate on what competitors charge without understanding
            whether those rates are actually profitable. Plenty of freelancers are busy and broke.
            Pricing based on the market is a useful sanity check—not a foundation.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If you're just getting started as a freelancer, read our guide on{" "}
            <Link
              href="https://solofi.io/articles/become-self-employed-freelancer-2026"
              className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
            >
              how to become a self-employed freelancer in 2026
            </Link>{" "}
            first.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">
            Step 1: Start with Your Target Annual Income
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Don't ask yourself what you made as an employee. Ask: what do I actually want to earn
            this year, after all personal expenses, with money left over for savings and retirement?
          </p>
          <p className="text-slate-600 leading-relaxed">
            Be honest and specific. Include your mortgage or rent, groceries, travel, childcare,
            entertainment—everything. Then add a retirement savings target (more on that below) and
            an emergency fund buffer. That total becomes your <strong className="text-slate-900">target take-home</strong>.
          </p>
          <p className="text-slate-600 leading-relaxed">
            From there, you work backward. The target take-home is the output you need. Your rate is
            the input you control. Every step below adds costs on top of your take-home target to
            arrive at the gross revenue you need to generate.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">
            Step 2: Add the Costs Employers Used to Cover
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Once you have a target income number, layer in the real costs of self-employment. These
            aren't optional—they're the overhead you must cover before you take home a dollar.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold text-slate-900">Self-Employment Tax</h4>
              </div>
              <p className="text-sm text-slate-600">
                ~15.3% on the first $176,100 of net earnings (2026). This covers both the employer
                and employee share of Social Security and Medicare—taxes your employer used to split
                with you. You can deduct half of it, which softens the blow slightly.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold text-slate-900">Health Insurance</h4>
              </div>
              <p className="text-sm text-slate-600">
                Individual ACA plans typically run $400–$600/month. Family plans can reach
                $1,200–$1,500/month or more. The self-employed health insurance deduction lets you
                write off 100% of premiums, but you still need to pay them first.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold text-slate-900">Retirement Contributions</h4>
              </div>
              <p className="text-sm text-slate-600">
                No employer 401(k) match. You fund it entirely. A Solo 401(k) allows up to
                $23,500 in employee contributions in 2026, plus up to 25% of net SE income as an
                employer contribution—hitting $70,000 total if you can swing it.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold text-slate-900">Business Expenses</h4>
              </div>
              <p className="text-sm text-slate-600">
                Software subscriptions, equipment, professional development, accounting fees, home
                office costs, and liability insurance. Even a lean freelance operation runs
                $500–$1,000/month in legitimate business expenses.
              </p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            For a deeper look at how to minimize these costs through smart tax strategies, see our{" "}
            <Link
              href="https://solofi.io/articles/tax-strategies-2026-self-employed"
              className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
            >
              tax strategies guide for self-employed workers in 2026
            </Link>
            .
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">
            Step 3: Account for Unbillable Time
          </h2>
          <p className="text-slate-600 leading-relaxed">
            This is the step most freelancers skip entirely—and it's where the math falls apart.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Not every hour you work is a billable hour. You spend time on proposals, invoicing,
            client emails, bookkeeping, marketing, professional development, and taking vacation.
            For most freelancers, only 60–70% of total working hours are actually billable to
            clients.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Where non-billable hours go</h4>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-slate-700">Admin & Operations</p>
                <ul className="text-slate-500 space-y-1">
                  <li>Invoicing and bookkeeping</li>
                  <li>Client emails and calls</li>
                  <li>Contract review</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-slate-700">Business Development</p>
                <ul className="text-slate-500 space-y-1">
                  <li>Writing proposals</li>
                  <li>Networking and outreach</li>
                  <li>Social media and content</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-slate-700">Time Off</p>
                <ul className="text-slate-500 space-y-1">
                  <li>Vacation (unpaid)</li>
                  <li>Sick days</li>
                  <li>Holidays</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            A common benchmark: plan for 1,300 billable hours per year. That's 65% of a standard
            2,000-hour work year—and it's a realistic number for a full-time freelancer who takes
            some vacation and invests time in business development. Early-stage freelancers may be
            closer to 50–60% as they're spending more time on sales and onboarding.
          </p>
        </section>

        {/* Section 5 — The Formula */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">
            The Formula: Your Minimum Hourly Rate
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Once you have your total annual cost figure and your realistic billable hours, the math is
            straightforward:
          </p>

          {/* Formula Box */}
          <div className="rounded-2xl border-2 border-emerald-600 bg-emerald-600/5 p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">
              The Rate Formula
            </p>
            <p className="text-2xl font-black text-slate-900">
              (Target Income + Taxes + Benefits + Expenses)
            </p>
            <p className="text-2xl font-black text-slate-900">÷ Billable Hours</p>
            <div className="h-px bg-emerald-600/30 my-2" />
            <p className="text-2xl font-black text-emerald-600">= Minimum Hourly Rate</p>
          </div>

          <p className="text-slate-600 leading-relaxed">
            This is your <strong className="text-slate-900">floor</strong>—the rate below which you
            cannot sustainably operate. Charge less than this and you will eventually burn through
            savings or burn out. Your actual rate should sit above this floor based on market
            positioning, expertise, and demand.
          </p>
        </section>

        {/* Section 6 — Day Rate */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">
            Day Rate = Hourly Rate × Hours (but Choose Wisely)
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Once you have your minimum hourly rate, your day rate is a simple multiplication—but
            the multiplier matters.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The obvious choice is 8 hours (a full workday). But most experienced freelancers
            quote day rates based on a <strong className="text-slate-900">7-hour billable day</strong>,
            reserving the eighth hour for client communication, status updates, and the inevitable
            context-switching that comes with any engagement. A 7-hour day rate also gives you
            built-in buffer for work that runs longer than scoped.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-sm text-slate-500 mb-1">8-Hour Day Rate</p>
              <p className="text-xl font-bold text-slate-900">Hourly Rate × 8</p>
              <p className="text-xs text-slate-400 mt-2">Standard calculation</p>
            </div>
            <div className="rounded-xl border-2 border-emerald-600 bg-emerald-600/5 p-5 text-center">
              <p className="text-sm text-slate-500 mb-1">7-Hour Day Rate (Recommended)</p>
              <p className="text-xl font-bold text-emerald-600">Hourly Rate × 7</p>
              <p className="text-xs text-slate-400 mt-2">Accounts for overhead within the day</p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            When negotiating with clients, lead with the day rate—not the hourly rate. Day rates
            feel more concrete, create less anxiety for clients about watching the clock, and often
            result in higher total earnings because clients aren't scrutinizing hours line by line.
          </p>
        </section>

        {/* Worked Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">
            Worked Example: Targeting $150,000/Year
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Here's how the formula plays out for a freelancer targeting $150,000 in take-home income.
          </p>

          <div className="rounded-2xl border-2 border-emerald-600 bg-emerald-600/5 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-600" />
              <h4 className="font-bold text-emerald-600 text-lg">Full Rate Calculation</h4>
            </div>

            {/* Cost Breakdown Table */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Annual Cost Breakdown
              </p>
              <div className="rounded-xl overflow-hidden border border-emerald-200">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-emerald-100">
                      <td className="px-4 py-3 text-slate-700">Target annual income</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        $150,000
                      </td>
                    </tr>
                    <tr className="border-b border-emerald-100 bg-white/60">
                      <td className="px-4 py-3 text-slate-700">
                        Self-employment tax (~14% after deduction)
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        +$21,000
                      </td>
                    </tr>
                    <tr className="border-b border-emerald-100">
                      <td className="px-4 py-3 text-slate-700">
                        Health insurance ($1,000/month)
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        +$12,000
                      </td>
                    </tr>
                    <tr className="border-b border-emerald-100 bg-white/60">
                      <td className="px-4 py-3 text-slate-700">Solo 401(k) contributions</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        +$23,500
                      </td>
                    </tr>
                    <tr className="border-b border-emerald-100">
                      <td className="px-4 py-3 text-slate-700">
                        Business expenses (software, equipment, accounting)
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        +$8,000
                      </td>
                    </tr>
                    <tr className="bg-emerald-600/10">
                      <td className="px-4 py-3 font-bold text-slate-900">Total gross needed</td>
                      <td className="px-4 py-3 text-right font-black text-emerald-600 text-base">
                        $214,500
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Billable Hours */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Billable Hours Calculation
              </p>
              <div className="rounded-xl border border-emerald-200 bg-white/60 p-4 space-y-1 text-sm text-slate-700">
                <p>2,000 total working hours/year</p>
                <p>× 65% billable utilization rate</p>
                <p className="font-bold text-slate-900 border-t border-emerald-200 pt-2 mt-2">
                  = 1,300 billable hours/year
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-emerald-600 bg-white p-5 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Minimum Hourly Rate
                </p>
                <p className="text-3xl font-black text-emerald-600">~$165</p>
                <p className="text-xs text-slate-400 mt-1">$214,500 ÷ 1,300 hours</p>
              </div>
              <div className="rounded-xl border-2 border-slate-900 bg-white p-5 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Day Rate (7-hour day)
                </p>
                <p className="text-3xl font-black text-slate-900">~$1,155</p>
                <p className="text-xs text-slate-400 mt-1">$165 × 7 hours</p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              These are your minimums. If the market supports $200/hour for your skills—charge
              $200/hour. The formula tells you the floor; your positioning sets the ceiling.
            </p>
          </div>
        </section>

        {/* Section 7 — Market Rate */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">
            Market Rate Check: Don't Price in a Vacuum
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Your minimum rate is the floor. But the market determines whether that floor is
            achievable—and how far above it you can go.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Research compensation across multiple sources before finalizing your rate:
          </p>

          <ul className="space-y-3 ml-1">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">LinkedIn and Glassdoor contractor postings</strong>
                <p className="text-slate-500 text-sm">
                  Many job postings for contract roles include rate ranges. Filter for "contract"
                  roles in your specialty and location to see what companies are budgeting.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Freelance platforms (Upwork, Toptal, Contra)</strong>
                <p className="text-slate-500 text-sm">
                  Browse profiles of freelancers with similar experience and read their published
                  rates. Toptal and Expert360 skew toward premium rates—useful benchmarks for
                  senior professionals.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Direct conversations with peers</strong>
                <p className="text-slate-500 text-sm">
                  The most accurate data comes from other freelancers in your niche. Freelance
                  communities on Slack, Reddit (r/freelance), and Discord often have rate
                  transparency threads.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Staffing agency published rates</strong>
                <p className="text-slate-500 text-sm">
                  Staffing agencies markup contractor rates by 30–50%. If an agency bills your
                  skill set at $200/hour, the underlying market rate is probably $130–$150/hour
                  direct.
                </p>
              </div>
            </li>
          </ul>

          <p className="text-slate-600 leading-relaxed">
            If your minimum rate is significantly higher than market rate, you either need to
            reduce costs, target higher-value clients, or develop skills that command premium
            pricing. If your minimum is well below market rate—congratulations, you have pricing
            upside. Raise your rate to the market and pocket the difference.
          </p>

          <p className="text-slate-600 leading-relaxed">
            Use our{" "}
            <Link
              href="https://solofi.io/tools/rate-calculator"
              className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
            >
              freelance rate calculator
            </Link>{" "}
            to model your own numbers quickly.
          </p>
        </section>

        {/* Section 8 — When to Raise Rates */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">
            When to Raise Your Rates
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Most freelancers raise rates too infrequently—or never. Here are the clearest signals
            that it's time:
          </p>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 flex gap-4">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Annually—at minimum</h4>
                <p className="text-slate-600 text-sm">
                  Inflation erodes your purchasing power every year you don't raise rates. Build an
                  annual rate review into your calendar every January. Even a 5–8% increase keeps
                  you whole against rising costs and signals to clients that you're growing, not
                  stagnating.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 flex gap-4">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  After three back-to-back client acceptances
                </h4>
                <p className="text-slate-600 text-sm">
                  If the last three prospects you quoted accepted your rate without pushback, you're
                  priced below market. The market has just told you: demand exceeds your current
                  price. Raise it on the next proposal by 15–20% and watch the response.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 flex gap-4">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  After adding high-value skills or certifications
                </h4>
                <p className="text-slate-600 text-sm">
                  A new certification, a specialized tool proficiency, or experience in a niche
                  domain (AI integration, regulatory compliance, enterprise security) can justify a
                  step-change increase in rate—not just a modest bump. Retool your positioning and
                  reprice accordingly.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 flex gap-4">
              <div className="w-10 h-10 bg-slate-300 text-slate-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  When your costs increase materially
                </h4>
                <p className="text-slate-600 text-sm">
                  Health insurance premium increases, a move to a higher cost-of-living city, or
                  increased retirement contribution targets all shift your minimum rate upward.
                  Recalculate the formula and adjust. Your clients are running businesses—they
                  understand that costs go up.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-500/10 p-5 flex gap-3">
            <TrendingUp className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">
              <strong className="text-slate-900">Practical tip:</strong> Raise rates for new
              clients first. Existing clients on long-term retainers get 60–90 days' notice before
              their rate increases. Frame it as a standard annual adjustment, not a negotiation—
              because it isn't one.
            </p>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Key Takeaways</h2>
          <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6 space-y-3">
            <p className="text-slate-700 leading-relaxed">
              Your freelance rate is not your employee salary divided by 2,000. It's your target
              income plus self-employment taxes, health insurance, retirement contributions, and
              business expenses—divided by the number of hours you can realistically bill. For most
              full-time freelancers, that's around 1,300 billable hours per year.
            </p>
            <p className="text-slate-700 leading-relaxed">
              The formula gives you a floor. Market research tells you how far above the floor
              you can go. Your job is to price at or above market—never below your minimum—and
              raise rates consistently over time as your skills, reputation, and leverage grow.
            </p>
            <p className="text-slate-700 leading-relaxed">
              If you're targeting $150K in take-home income, your minimum hourly rate is around
              $165/hour and your day rate lands near $1,155–$1,320 depending on whether you bill
              seven or eight hours per day. Most freelancers charging less than this are quietly
              subsidizing their clients.
            </p>
          </div>
        </section>

        {/* Internal Links */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Read next</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Related articles
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="https://solofi.io/articles/become-self-employed-freelancer-2026"
                    className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                  >
                    How to Become a Self-Employed Freelancer in 2026
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://solofi.io/articles/tax-strategies-2026-self-employed"
                    className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                  >
                    Tax Strategies in 2026 for Self-Employed Workers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Free tools
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="https://solofi.io/tools/rate-calculator"
                    className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                  >
                    Freelance Rate Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://solofi.io/tools"
                    className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                  >
                    All Free Tools
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-pink-500/20 to-emerald-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Track what you actually earn</h3>
          <p className="text-slate-500 mb-6">
            SoloFI helps self-employed professionals track income, net worth, and retirement
            progress—all in one place.
          </p>
          <Link href="https://app.solofi.io/dashboard">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <TrendingUp className="mr-2 h-4 w-4" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
