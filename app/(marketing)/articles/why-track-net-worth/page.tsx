import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Tracking Your Net Worth Over Time is Useful - SoloFI",
  description: "Your net worth is the single most important number in personal finance. Here's why tracking it regularly can transform your financial life.",
};
import { Button } from "@/components/ui/button";
import { ArrowLeft, PiggyBank, Calendar, Clock, TrendingUp, Target, Brain, BarChart3 } from "lucide-react";

export default function WhyTrackNetWorthArticle() {
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
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop"
          alt="Tracking financial growth"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-emerald-600 px-3 py-1 rounded-full">Wealth Building</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-3">Why Tracking Your Net Worth Over Time is Useful</h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              January 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              8 min read
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">
        {/* Intro */}
        <p className="text-xl text-slate-600 leading-relaxed">
          Your net worth is the single most important number in personal finance. Here's why tracking it regularly can transform your financial life.
        </p>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">What Gets Measured Gets Managed</h2>
          <div className="space-y-3">
            <p className="text-slate-600 leading-relaxed">
              This Peter Drucker principle applies perfectly to personal finance. When you track your net worth monthly, you naturally become more intentional about every financial decision. The simple act of logging in to update your accounts creates awareness—you see that restaurant splurge as a number that directly reduced your net worth, not just money disappearing from your checking account. Spending becomes more conscious because you're not just tracking expenses, you're tracking impact.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Saving transforms from a vague aspiration ("I should save more") into a visible, measurable goal. Instead of wondering if you're making progress, you see the exact dollar amount your net worth increased this month. Investment decisions shift from reactive ("Should I buy this stock?") to strategic ("How does this fit my asset allocation, and will it move me toward my $500K net worth goal?"). The big picture becomes crystal clear when you're staring at a number that represents your entire financial life.
            </p>
          </div>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1000&h=400&fit=crop"
            alt="Financial charts and growth"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">The Psychological Benefits</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <h4 className="font-medium text-slate-900">Progress Visibility</h4>
              </div>
              <p className="text-sm text-slate-500">
                Day-to-day progress is invisible. Monthly tracking reveals the compound effect of your decisions over time.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-slate-600" />
                <h4 className="font-medium text-slate-900">Reduced Anxiety</h4>
              </div>
              <p className="text-sm text-slate-500">
                Financial anxiety comes from uncertainty. Knowing where you stand enables informed decisions.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-slate-600" />
                <h4 className="font-medium text-slate-900">Goal Achievement</h4>
              </div>
              <p className="text-sm text-slate-500">
                A net worth target is more actionable than vague aspirations like "save more."
              </p>
            </div>
          </div>
        </section>

        {/* Real Example */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h4 className="font-semibold text-emerald-600">Real Example</h4>
          </div>
          <p className="text-slate-600">
            A consultant tracking net worth noticed their cash allocation was 40% of total assets—too high. By moving excess cash to index funds, they increased their return rate by ~4% annually, adding <strong className="text-slate-900">$20K+</strong> to their net worth over 3 years.
          </p>
        </div>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">The Practical Benefits</h2>

          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">1. Asset Allocation Awareness</h3>
            <p className="text-slate-600 leading-relaxed">
              Tracking forces you to categorize your assets, and this exercise alone reveals optimization opportunities most people miss. You might discover you're holding 40% of your net worth in cash earning 0.01% interest when you could move it to a high-yield savings account earning 5%, or better yet, invest it for long-term growth. Or you might find dangerous over-concentration—80% of your net worth in your company's stock, creating massive risk if that company struggles. Forgotten 401(k) accounts from old employers, duplicate checking accounts charging fees, old savings bonds sitting in a drawer—tracking exposes all of it and creates natural urgency to consolidate and optimize.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Debt Visibility</h3>
            <p className="text-slate-600 leading-relaxed">
              Seeing your debts as part of the net worth calculation fundamentally changes your relationship with borrowing. When debt is just a monthly payment, it feels manageable—$450/month for that car loan doesn't seem terrible. But when you see that $30K car loan reducing your net worth every single month, the psychological impact is different. You viscerally understand that borrowing is moving backward, not standing still. This doesn't mean all debt is bad (mortgage debt on an appreciating asset can make sense), but it makes you far more intentional about which debts you take on and how aggressively you pay them off.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Long-Term Trend Analysis</h3>
            <p className="text-slate-600 leading-relaxed">
              With historical data, you unlock powerful insights that would be impossible without tracking. You can answer precise questions: How much did my net worth grow last year? ($87,000, a 22% increase.) What's my average monthly growth rate? ($5,800/month, driven by $4,000 savings + $1,800 investment returns.) When did my biggest gains occur? (March 2025, when I got that $15K bonus and invested it immediately.) When did losses happen? (November 2025, when the market dipped 8% but I kept investing.) These insights reveal patterns and help you optimize your strategy. If your net worth grew 15% annually for three years, you have data-driven proof your approach is working—no guessing required.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">How Often Should You Track?</h2>
          <p className="text-slate-600 leading-relaxed">
            Monthly is the sweet spot for most people:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <h4 className="font-semibold text-emerald-600">Weekly</h4>
              <p className="text-sm text-slate-500 mt-2">Too frequent, not enough change to be meaningful</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-5 text-center">
              <h4 className="font-semibold text-emerald-600">Monthly</h4>
              <p className="text-sm text-slate-500 mt-2">Ideal balance of visibility and meaningful change</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <h4 className="font-semibold text-slate-600">Quarterly</h4>
              <p className="text-sm text-slate-500 mt-2">Works, but you might miss short-term trends</p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">What to Track</h2>
          <p className="text-slate-600 leading-relaxed">
            At minimum, track these categories:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-5">
              <h4 className="font-semibold text-emerald-600 mb-4">Assets</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                  <span className="text-slate-600">Cash and checking accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                  <span className="text-slate-600">Investment accounts (stocks, bonds, ETFs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                  <span className="text-slate-600">Retirement accounts (401k, IRA, HSA)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                  <span className="text-slate-600">Real estate equity</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                  <span className="text-slate-600">Other (crypto, collectibles, etc.)</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
              <h4 className="font-semibold text-red-400 mb-4">Liabilities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-slate-600">Mortgage balance</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-slate-600">Student loans</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-slate-600">Credit card debt</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-slate-600">Car loans</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-slate-600">Other debt</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">Getting Started</h2>
          <p className="text-slate-600 leading-relaxed">
            The best time to start tracking was years ago. The second best time is today.
          </p>
          <ol className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-emerald-600 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span className="text-slate-600">List all your accounts and current balances</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-emerald-600 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span className="text-slate-600">Categorize them (this tool does it automatically)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-emerald-600 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span className="text-slate-600">Set a monthly reminder to update</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-emerald-600 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span className="text-slate-600">Watch the trend line over time</span>
            </li>
          </ol>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-3xl font-black border-b-2 border-black pb-3">Key Takeaways</h2>
          <div className="rounded-xl border border-amber-500/30 bg-emerald-600/10 p-6 space-y-3">
            <p className="text-slate-700 leading-relaxed">
              Net worth is the single most important number in personal finance because it's the only metric that captures your complete financial picture—assets minus liabilities, everything you own minus everything you owe. Income doesn't tell the story (you can earn $200K and be broke), and expenses don't either (you can spend $30K/year and be wealthy). Net worth is the scoreboard. What gets measured gets managed, and the simple act of tracking creates accountability and awareness that transforms decision-making.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Monthly tracking is the sweet spot—frequent enough to maintain visibility and catch problems early, but not so frequent that market volatility creates noise or tracking becomes overwhelming. With just 12 data points per year, you build a historical dataset that enables powerful trend analysis. After a year, you know your average monthly growth rate. After three years, you can calculate your compound annual growth rate and project your financial independence date with real data instead of guesses.
            </p>
            <p className="text-slate-700 leading-relaxed">
              The best time to start tracking was years ago; the second best time is today. Every month you delay is one more data point lost and one more month of living in financial uncertainty instead of clarity. Your future self—the one five years from now looking at a beautiful upward-trending chart—will thank you for starting today.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Ready to start tracking?</h3>
          <p className="text-slate-500 mb-6">Explore our free financial tools to help you track and optimize your wealth.</p>
          <Link href="/tools">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-slate-900">
              <PiggyBank className="mr-2 h-4 w-4" />
              Explore Free Tools
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
