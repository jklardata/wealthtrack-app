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
          <Button variant="ghost" size="sm" className="gap-2 text-white/60 hover:text-white hover:bg-white/10">
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
          <span className="text-sm font-medium text-white bg-amber-500 px-3 py-1 rounded-full">Wealth Building</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">Why Tracking Your Net Worth Over Time is Useful</h1>
          <div className="flex items-center gap-4 mt-3 text-white/60 text-sm">
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
        <p className="text-xl text-white/70 leading-relaxed">
          Your net worth is the single most important number in personal finance. Here's why tracking it regularly can transform your financial life.
        </p>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">What Gets Measured Gets Managed</h2>
          <p className="text-white/70 leading-relaxed">
            This Peter Drucker principle applies perfectly to personal finance. When you track your net worth monthly, you naturally become more intentional about financial decisions.
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Spending becomes more conscious</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Saving becomes a visible, measurable goal</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Investment decisions are made with the big picture in mind</span>
            </li>
          </ul>
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
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">The Psychological Benefits</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <h4 className="font-semibold text-white">Progress Visibility</h4>
              </div>
              <p className="text-sm text-white/60">
                Day-to-day progress is invisible. Monthly tracking reveals the compound effect of your decisions over time.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-blue-400" />
                <h4 className="font-semibold text-white">Reduced Anxiety</h4>
              </div>
              <p className="text-sm text-white/60">
                Financial anxiety comes from uncertainty. Knowing where you stand enables informed decisions.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-purple-400" />
                <h4 className="font-semibold text-white">Goal Achievement</h4>
              </div>
              <p className="text-sm text-white/60">
                A net worth target is more actionable than vague aspirations like "save more."
              </p>
            </div>
          </div>
        </section>

        {/* Real Example */}
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h4 className="font-semibold text-green-400">Real Example</h4>
          </div>
          <p className="text-white/70">
            A consultant tracking net worth noticed their cash allocation was 40% of total assets—too high. By moving excess cash to index funds, they increased their return rate by ~4% annually, adding <strong className="text-white">$20K+</strong> to their net worth over 3 years.
          </p>
        </div>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">The Practical Benefits</h2>

          <h3 className="text-lg font-semibold text-white">1. Asset Allocation Awareness</h3>
          <p className="text-white/70 leading-relaxed">
            Tracking forces you to categorize your assets. You might discover:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Too much cash sitting idle</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Over-concentration in one asset class</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-white/70">Forgotten accounts that could be consolidated</span>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 text-white">2. Debt Visibility</h3>
          <p className="text-white/70 leading-relaxed">
            Seeing your debts as part of the net worth calculation changes your relationship with borrowing. That $30K car loan looks different when you see it reducing your net worth every month.
          </p>

          <h3 className="text-lg font-semibold mt-6 text-white">3. Long-Term Trend Analysis</h3>
          <p className="text-white/70 leading-relaxed">
            With historical data, you can answer questions like:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3">
              <BarChart3 className="h-4 w-4 text-amber-400 mt-1 flex-shrink-0" />
              <span className="text-white/70">How much did my net worth grow last year?</span>
            </li>
            <li className="flex items-start gap-3">
              <BarChart3 className="h-4 w-4 text-amber-400 mt-1 flex-shrink-0" />
              <span className="text-white/70">What's my average monthly growth rate?</span>
            </li>
            <li className="flex items-start gap-3">
              <BarChart3 className="h-4 w-4 text-amber-400 mt-1 flex-shrink-0" />
              <span className="text-white/70">When did my biggest gains/losses occur?</span>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">How Often Should You Track?</h2>
          <p className="text-white/70 leading-relaxed">
            Monthly is the sweet spot for most people:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-yellow-500/30 bg-white/5 p-5 text-center">
              <h4 className="font-semibold text-yellow-400">Weekly</h4>
              <p className="text-sm text-white/60 mt-2">Too frequent, not enough change to be meaningful</p>
            </div>
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center">
              <h4 className="font-semibold text-green-400">Monthly</h4>
              <p className="text-sm text-white/60 mt-2">Ideal balance of visibility and meaningful change</p>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-white/5 p-5 text-center">
              <h4 className="font-semibold text-blue-400">Quarterly</h4>
              <p className="text-sm text-white/60 mt-2">Works, but you might miss short-term trends</p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">What to Track</h2>
          <p className="text-white/70 leading-relaxed">
            At minimum, track these categories:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5">
              <h4 className="font-semibold text-green-400 mb-4">Assets</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-white/70">Cash and checking accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-white/70">Investment accounts (stocks, bonds, ETFs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-white/70">Retirement accounts (401k, IRA, HSA)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-white/70">Real estate equity</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-white/70">Other (crypto, collectibles, etc.)</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
              <h4 className="font-semibold text-red-400 mb-4">Liabilities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-white/70">Mortgage balance</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-white/70">Student loans</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-white/70">Credit card debt</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-white/70">Car loans</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-white/70">Other debt</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Getting Started</h2>
          <p className="text-white/70 leading-relaxed">
            The best time to start tracking was years ago. The second best time is today.
          </p>
          <ol className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span className="text-white/70">List all your accounts and current balances</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span className="text-white/70">Categorize them (this tool does it automatically)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span className="text-white/70">Set a monthly reminder to update</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span className="text-white/70">Watch the trend line over time</span>
            </li>
          </ol>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Key Takeaways</h2>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">1.</span>
                <span className="text-white/80">Net worth is the most important number in personal finance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">2.</span>
                <span className="text-white/80">What gets measured gets managed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">3.</span>
                <span className="text-white/80">Monthly tracking provides visibility without being overwhelming</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">4.</span>
                <span className="text-white/80">Historical data enables powerful trend analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">5.</span>
                <span className="text-white/80">Start today—your future self will thank you</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Ready to start tracking?</h3>
          <p className="text-white/60 mb-6">Take our quiz to see how well you're tracking your finances.</p>
          <Link href="/tools/net-worth-quiz">
            <Button className="bg-white text-black hover:bg-white/90">
              <PiggyBank className="mr-2 h-4 w-4" />
              Take the Quiz
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
