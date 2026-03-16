import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, CheckSquare, AlertTriangle, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "The Freelancer's Financial Setup Guide | SoloFI",
  description: "From your first client to a complete financial system. Business banking, tax reserves, retirement accounts, health insurance, and protecting your income.",
  openGraph: {
    title: "The Freelancer's Financial Setup Guide",
    description: "From your first client to a complete financial system.",
    url: "https://solofi.io/handbooks/freelancer-financial-setup-guide",
    siteName: "SoloFI",
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/handbooks/freelancer-financial-setup-guide",
  },
};

export default function FreelancerFinancialSetupGuide() {
  return (
    <article>
      {/* Back Button */}
      <div className="mb-6">
        <Link href="https://solofi.io/blog">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            Back to Learn
          </Button>
        </Link>
      </div>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-violet-600 to-purple-700 p-10 md:p-14">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-violet-200" />
            <span className="text-sm font-medium text-violet-200 uppercase tracking-wide">Handbook</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">The Freelancer's Financial Setup Guide</h1>
          <p className="text-violet-100 text-lg max-w-2xl">
            From your first client to a complete financial system. Everything you need to set up banking, taxes, retirement, and income protection as a self-employed professional.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-64 opacity-10 bg-gradient-to-l from-white" />
      </div>

      <div className="space-y-10">
        {/* Table of Contents */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Contents</h2>
          <ol className="space-y-2 text-sm">
            {[
              "Step 1: Separate Your Finances Immediately",
              "Step 2: Business Banking Setup",
              "Step 3: Understanding Your Tax Obligations",
              "Step 4: The Tax Reserve System",
              "Step 5: Emergency Fund for Variable Income",
              "Step 6: Retirement Accounts for Freelancers",
              "Step 7: Health Insurance Options",
              "Step 8: Protecting Your Income",
            ].map((section, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600">
                <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                {section}
              </li>
            ))}
          </ol>
        </div>

        {/* Chapter 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">1. Separate Your Finances Immediately</h2>
          <p className="text-slate-600 leading-relaxed">
            Before anything else, open a separate business checking account. Mixing personal and business finances is the single biggest mistake new freelancers make. It creates tax nightmares, makes expense tracking nearly impossible, and can create legal liability issues.
          </p>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Why this matters</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2"><span className="text-violet-600 font-bold mt-0.5">→</span> Clean records mean clean taxes — your CPA will thank you and charge you less</li>
              <li className="flex items-start gap-2"><span className="text-violet-600 font-bold mt-0.5">→</span> Makes quarterly tax estimates straightforward since income is in one place</li>
              <li className="flex items-start gap-2"><span className="text-violet-600 font-bold mt-0.5">→</span> Looks professional if clients need bank details for payments</li>
              <li className="flex items-start gap-2"><span className="text-violet-600 font-bold mt-0.5">→</span> Protects you in audits — business expenses in a personal account look suspicious</li>
            </ul>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Do this on day one, even before you have your first client. Pay yourself a "salary" by transferring a set amount from business to personal on a schedule, rather than spending business funds directly on personal expenses.
          </p>
        </section>

        {/* Chapter 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">2. Business Banking Setup</h2>
          <p className="text-slate-600 leading-relaxed">
            You need at least two accounts: a business checking account for income and expenses, and a tax reserve savings account where you park money earmarked for quarterly taxes. Many freelancers add a third account for business savings or emergency reserves.
          </p>
          <div className="space-y-3">
            {[
              { account: "Business checking", purpose: "All client payments in, all business expenses out. This is your operating account.", recommended: "Mercury, Relay, or your local credit union (no monthly fees)" },
              { account: "Tax reserve savings", purpose: "Automatically transfer 25–30% of every payment received. Don't touch until quarterly tax due dates.", recommended: "High-yield savings account — Mercury, Ally, or similar (4–5% APY)" },
              { account: "Business savings (optional)", purpose: "3–6 months of business expenses. Buffer for slow months or unexpected costs.", recommended: "Same institution as checking for easy transfers" },
            ].map(({ account, purpose, recommended }) => (
              <div key={account} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900 mb-1">{account}</h3>
                <p className="text-sm text-slate-600 mb-2">{purpose}</p>
                <p className="text-xs text-slate-500"><strong>Recommended:</strong> {recommended}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Chapter 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">3. Understanding Your Tax Obligations</h2>
          <p className="text-slate-600 leading-relaxed">
            As a freelancer, you're responsible for taxes that employers normally handle. Here's what you owe and when.
          </p>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Self-Employment Tax (15.3%)</h3>
              <p className="text-sm text-slate-600">Covers Social Security (12.4%) and Medicare (2.9%). Applies to all net self-employment income up to $168,600. You deduct half of this from gross income before income tax — so the effective sting is somewhat reduced.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Federal Income Tax</h3>
              <p className="text-sm text-slate-600">Paid on your net profit (revenue minus expenses) plus any other income. Combined with SE tax, most freelancers earning $60–120K face an effective federal rate of 25–35%.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-2">State Income Tax</h3>
              <p className="text-sm text-slate-600">Varies by state. Nine states have no income tax (FL, TX, WA, NV, WY, SD, AK, TN, NH). California tops out at 13.3%. Factor this into your reserve rate.</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Quarterly Estimated Taxes</h3>
              <p className="text-sm text-slate-600">Due April 15, June 16, Sept 15, and January 15. Missing these means underpayment penalties. Use the safe harbor rule: pay 100% of last year's total tax (110% if income was over $150K) to avoid all penalties.</p>
            </div>
          </div>
        </section>

        {/* Chapter 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">4. The Tax Reserve System</h2>
          <p className="text-slate-600 leading-relaxed">
            The most reliable approach: every time money hits your business account, immediately transfer a percentage to your tax savings account. Treat it as money that was never yours.
          </p>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Recommended reserve rates</h3>
            <div className="space-y-3 text-sm">
              {[
                { scenario: "Under $50K net profit, no state income tax", rate: "20–22%" },
                { scenario: "Under $50K net profit, with state income tax", rate: "25–28%" },
                { scenario: "$50–100K net profit, no state income tax", rate: "25–28%" },
                { scenario: "$50–100K net profit, with state income tax", rate: "30–33%" },
                { scenario: "Over $100K net profit", rate: "33–38%" },
              ].map(({ scenario, rate }) => (
                <div key={scenario} className="flex items-center justify-between">
                  <span className="text-slate-600">{scenario}</span>
                  <span className="font-bold text-violet-700 ml-4 flex-shrink-0">{rate}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            These are conservative. Any surplus in your tax account after paying quarterly taxes becomes either a year-end tax payment buffer or gets swept to your business savings. Never run your tax account to zero.
          </p>
        </section>

        {/* Chapter 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">5. Emergency Fund for Variable Income</h2>
          <p className="text-slate-600 leading-relaxed">
            The standard advice for employees is 3–6 months of expenses. For freelancers with variable income, aim for 6–12 months. You need to cover not just personal expenses but also business fixed costs (subscriptions, insurance, equipment) during slow periods.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Personal emergency fund</h3>
              <p className="text-sm text-slate-600">6 months of personal living expenses in a high-yield savings account. This is separate from your business reserves.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Business emergency reserve</h3>
              <p className="text-sm text-slate-600">3–6 months of business fixed costs. Helps you weather a dry client stretch without touching personal savings.</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-blue-50 p-4">
            <p className="text-sm text-slate-700"><strong>Build these sequentially:</strong> tax reserve first (you need this immediately), then personal emergency fund, then business reserve. Don't try to fund all three at once — progress beats perfection.</p>
          </div>
        </section>

        {/* Chapter 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">6. Retirement Accounts for Freelancers</h2>
          <p className="text-slate-600 leading-relaxed">
            Self-employed workers have access to some of the most powerful retirement accounts available. Start contributing as early as possible — even small amounts in your first year create habits and reduce your tax bill.
          </p>
          <div className="space-y-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Solo 401(k) — Best for high earners</h3>
                  <p className="text-sm text-slate-600">Up to $70,000/year in contributions (2026). Best once you're earning $50K+ net. Must open by December 31st.</p>
                </div>
                <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full flex-shrink-0">Recommended</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-1">SEP-IRA — Simpler but smaller</h3>
              <p className="text-sm text-slate-600">Up to 25% of net SE income, max $69,000 (2026). Easier to open (can contribute up to tax filing deadline), but no employee contribution portion. Better for simpler situations.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-1">Roth IRA — Always worth considering</h3>
              <p className="text-sm text-slate-600">$7,000/year ($8,000 if 50+). Tax-free growth and withdrawals. Income limits apply for direct contributions ($161K single / $240K married in 2026), but backdoor Roth conversions are available above those thresholds.</p>
            </div>
          </div>
        </section>

        {/* Chapter 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">7. Health Insurance Options</h2>
          <p className="text-slate-600 leading-relaxed">
            Health insurance is often the biggest fixed cost for self-employed professionals and requires active management. You can't just pick a plan and forget it — premiums, subsidies, and deductibles all change annually.
          </p>
          <div className="space-y-3">
            {[
              { option: "ACA Marketplace", detail: "Best for most freelancers. Shop on Healthcare.gov each November during open enrollment. If your income is under 400% of the federal poverty level (~$60K for a single person), you'll likely qualify for premium subsidies." },
              { option: "COBRA", detail: "If you recently left an employer, you can continue their coverage for up to 18 months. Often expensive (you pay the full premium your employer was subsidizing), but useful as a bridge." },
              { option: "Spouse's plan", detail: "If your spouse has employer coverage, joining their plan is usually the most cost-effective option. A qualifying life event (like leaving employment) lets you join outside open enrollment." },
              { option: "Healthcare sharing ministries", detail: "Lower monthly costs but not traditional insurance. Coverage has exclusions and no guarantee of payment. Suitable only if you understand the risks and are in excellent health." },
            ].map(({ option, detail }) => (
              <div key={option} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900 mb-1">{option}</h3>
                <p className="text-sm text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-slate-700"><strong>Tax tip:</strong> 100% of health insurance premiums are deductible as a self-employed professional. This is an above-the-line deduction that reduces your AGI directly.</p>
          </div>
        </section>

        {/* Chapter 8 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">8. Protecting Your Income</h2>
          <p className="text-slate-600 leading-relaxed">
            As a freelancer, your income depends entirely on your ability to work. One injury or serious illness without proper protection can wipe out years of savings. This is the area most new freelancers skip — until they can't.
          </p>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Disability insurance (critical)</h3>
              <p className="text-sm text-slate-600">Replaces 60–70% of income if you become unable to work. Individual long-term disability policies are the gold standard — look for "own-occupation" coverage that pays if you can't do your specific work. Expect to pay 2–4% of your income in premiums. Worth every dollar.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Term life insurance (if others depend on you)</h3>
              <p className="text-sm text-slate-600">If you have dependents, a 20–30 year term policy for 10–12x your annual income is cheap and gives your family a runway if you die early. A healthy 30-year-old can get $1M of coverage for $30–50/month.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Professional liability / E&O insurance</h3>
              <p className="text-sm text-slate-600">If a client claims your work caused them financial harm, professional liability (Errors & Omissions) insurance covers your legal costs and settlements. Required by many contracts and clients. Costs $500–2,000/year for most consultants.</p>
            </div>
          </div>
        </section>

        {/* First-Year Checklist */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">First-Year Financial Checklist</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            {[
              { phase: "Month 1", items: ["Open business checking account", "Open tax reserve savings account", "Set up automatic 25-30% tax transfer on every payment", "Get an EIN from IRS.gov (free, takes 5 minutes)"] },
              { phase: "Month 1-3", items: ["Set up basic bookkeeping (Wave, QuickBooks, or spreadsheet)", "Research health insurance options and enroll", "Get a business credit card for expenses", "Make Q1 estimated tax payment if already earning"] },
              { phase: "Month 3-6", items: ["Build 3-month emergency fund", "Open a Solo 401(k) or SEP-IRA", "Consult a CPA about S-Corp election eligibility", "Review business structure for next tax year"] },
              { phase: "Month 6-12", items: ["Build toward 6-month emergency fund", "Review all insurance coverage", "Max out retirement contributions", "Plan year-end tax strategy with your CPA"] },
            ].map(({ phase, items }) => (
              <div key={phase}>
                <h3 className="text-sm font-semibold text-violet-700 uppercase tracking-wide mb-2">{phase}</h3>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckSquare className="h-4 w-4 text-violet-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 to-purple-50 p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-3">Start with a free tool</h3>
          <p className="text-slate-600 mb-6">Run through our freelance financial setup tools to build your personalized banking and tax plan.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools/banking-setup">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                <DollarSign className="mr-2 h-4 w-4" />
                Banking Setup Guide
              </Button>
            </Link>
            <Link href="/tools/freelance-checklist">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Freelance Checklist
              </Button>
            </Link>
          </div>
        </div>

        {/* Read Next */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Read next</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Related handbooks</p>
              <ul className="space-y-2">
                <li><Link href="/handbooks/self-employed-tax-handbook" className="text-emerald-600 hover:underline font-medium">The Self-Employed Tax Handbook</Link></li>
                <li><Link href="/handbooks/early-retirement-handbook" className="text-emerald-600 hover:underline font-medium">The Early Retirement Handbook</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Related articles</p>
              <ul className="space-y-2">
                <li><Link href="/articles/become-self-employed-freelancer-2026" className="text-emerald-600 hover:underline font-medium">How to Become a Self-Employed Freelancer in 2026</Link></li>
                <li><Link href="/articles/best-bank-accounts-for-consultants" className="text-emerald-600 hover:underline font-medium">Best Bank Accounts for Remote Workers and Consultants</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
