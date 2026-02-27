import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, AlertTriangle, CheckCircle2, DollarSign, FileText, RefreshCw, Building2, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "The Self-Employed Health Insurance Deduction: How to Claim It and What Qualifies | SoloFI",
  description: "Self-employed? You can deduct 100% of your health insurance premiums as an above-the-line deduction. Here's exactly what qualifies, what doesn't, how to calculate it, and how it interacts with ACA subsidies.",
  openGraph: {
    title: "The Self-Employed Health Insurance Deduction: How to Claim It and What Qualifies",
    description: "Self-employed? You can deduct 100% of your health insurance premiums as an above-the-line deduction. Here's exactly what qualifies, what doesn't, how to calculate it, and how it interacts with ACA subsidies.",
    url: "https://solofi.io/articles/self-employed-health-insurance-deduction",
    siteName: "SoloFI",
    images: [
      {
        url: "https://solofi.io/api/og?title=The%20Self-Employed%20Health%20Insurance%20Deduction&category=Taxes",
        width: 1200,
        height: 630,
        alt: "The Self-Employed Health Insurance Deduction",
      },
    ],
    type: "article",
  },
  alternates: {
    canonical: "https://solofi.io/articles/self-employed-health-insurance-deduction",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Self-Employed Health Insurance Deduction: How to Claim It and What Qualifies",
  description: "Self-employed? You can deduct 100% of your health insurance premiums as an above-the-line deduction. Here's exactly what qualifies, what doesn't, how to calculate it, and how it interacts with ACA subsidies.",
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
  url: "https://solofi.io/articles/self-employed-health-insurance-deduction",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://solofi.io/articles/self-employed-health-insurance-deduction",
  },
};

export default function SelfEmployedHealthInsuranceDeductionArticle() {
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

      {/* Hero */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop"
          alt="Self-employed health insurance deduction"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-purple-500 px-3 py-1 rounded-full">Taxes</span>
          <h1 className="text-3xl md:text-4xl font-medium text-white mt-3">
            The Self-Employed Health Insurance Deduction: How to Claim It and What Qualifies
          </h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              February 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              8 min read
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-8">

        {/* Intro */}
        <p className="text-xl text-slate-600 leading-relaxed">
          Health insurance is one of the biggest line items in any freelancer's budget. But there's a powerful tax break hiding in plain sight: the self-employed health insurance deduction lets you write off 100% of your premiums directly against your income—before you even calculate your tax bill. Most self-employed professionals know this deduction exists, but far fewer understand exactly what qualifies, what doesn't, and the tricky interactions with ACA subsidies and S-Corp structures.
        </p>

        {/* Disclaimer */}
        <div className="rounded-xl border border-slate-200 bg-yellow-500/10 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-slate-800">Disclaimer</h4>
            <p className="text-sm text-slate-500">This article is for educational purposes only and does not constitute tax advice. Tax rules change frequently. Consult a qualified CPA or tax professional for guidance specific to your situation.</p>
          </div>
        </div>

        {/* Section 1: What the Deduction Is */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">1. What the Self-Employed Health Insurance Deduction Actually Is</h2>
          <p className="text-slate-600 leading-relaxed">
            If you're self-employed—a sole proprietor, single-member LLC, partner in a partnership, or S-Corp shareholder owning more than 2%—you can deduct 100% of health insurance premiums paid for yourself, your spouse, and your dependents. This deduction is taken on Schedule 1 of Form 1040 (line 17), making it an <strong>above-the-line deduction</strong>.
          </p>
          <p className="text-slate-600 leading-relaxed">
            "Above-the-line" is tax jargon for a deduction that reduces your Adjusted Gross Income (AGI) directly, regardless of whether you itemize or take the standard deduction. This is significant: it reduces not just your income tax bill but also your AGI, which affects eligibility for other tax benefits, ACA subsidies, and more.
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6">
            <h4 className="font-semibold mb-4 text-emerald-600 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Where it lives on your return
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Schedule C / K-1</p>
                <p className="text-slate-500 mt-1">Your net self-employment income (the income limit)</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Form 7206</p>
                <p className="text-slate-500 mt-1">Calculates the allowable deduction amount (2026)</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-emerald-600">Schedule 1, Line 17</p>
                <p className="text-slate-500 mt-1">Where the deduction flows to on Form 1040</p>
              </div>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Unlike a business expense deduction on Schedule C, this deduction does <em>not</em> reduce your self-employment tax base. You're still paying SE tax on your full net earnings from self-employment. But it does reduce your federal and state income tax liability, which for most freelancers in the 22–24% bracket translates to meaningful savings.
          </p>
        </section>

        {/* Section 2: What Qualifies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">2. What Qualifies for the Deduction</h2>
          <p className="text-slate-600 leading-relaxed">
            The IRS defines qualifying coverage broadly. The following premiums count toward the deduction:
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6 space-y-3">
            <h4 className="font-semibold text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              What qualifies
            </h4>
            <ul className="space-y-2 text-slate-700">
              {[
                { label: "Medical insurance premiums", detail: "ACA marketplace plans, private individual plans, and other medical coverage for yourself, your spouse, and dependents." },
                { label: "Dental insurance premiums", detail: "Standalone dental plans or dental riders included in your health policy." },
                { label: "Vision insurance premiums", detail: "Standalone vision plans or vision riders. Both adult and dependent coverage qualify." },
                { label: "Long-term care insurance premiums", detail: "Eligible premiums are deductible up to age-based IRS limits (e.g., $5,880 for ages 61–70 in 2026). Premiums above the limit don't count." },
                { label: "Medicare premiums (if 65+)", detail: "If you're 65 or older and self-employed, Medicare Part B and Part D premiums, as well as Medicare Advantage premiums, qualify. This is a significant benefit for older freelancers." },
              ].map(({ label, detail }) => (
                <li key={label} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">{label}: </span>
                    <span className="text-slate-600">{detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Coverage for children under age 27 also qualifies, even if the child is not your tax dependent. This was expanded under the Affordable Care Act and remains in effect for 2026.
          </p>
        </section>

        {/* Section 3: What Does NOT Qualify */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">3. What Does NOT Qualify</h2>
          <p className="text-slate-600 leading-relaxed">
            The deduction is powerful, but the IRS draws clear lines around two major disqualifying situations. Getting these wrong is one of the most common self-employed tax mistakes.
          </p>

          <div className="rounded-xl border border-red-200 bg-red-500/10 p-6 space-y-3">
            <h4 className="font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              What does NOT qualify
            </h4>
            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Premiums paid through a spouse's employer plan: </span>
                  <span className="text-slate-600">If you were added to your spouse's employer-sponsored plan, you cannot claim this deduction—even if you reimburse your spouse out of your own funds. The deduction only applies to coverage you purchased independently as a self-employed person.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Months you were eligible for employer-subsidized coverage: </span>
                  <span className="text-slate-600">The deduction is calculated month by month. If you were eligible (not just enrolled, but <em>eligible</em>) for employer-sponsored health coverage at any point during the year—through a job, a spouse's employer, or your own business if you have employees—you cannot claim the deduction for those specific months. This catches people who go part-year self-employed or take a short-term contract role mid-year.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Premiums already deducted as a business expense: </span>
                  <span className="text-slate-600">You cannot double-dip. If you deducted premiums as an employee benefit on Schedule C, you cannot also claim the Schedule 1 deduction for the same premiums.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-500/10 p-5 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">The eligibility trap</h4>
              <p className="text-sm text-slate-600">
                "Eligible" is the key word—not "enrolled." If your spouse's employer offers family coverage and you chose not to enroll, the IRS still considers you ineligible for the deduction during those months. The test is whether you had access to subsidized coverage, not whether you used it.
              </p>
            </div>
          </div>
        </section>

        {/* Image break */}
        <div className="rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=1200&h=400&fit=crop"
            alt="Tax forms and financial planning"
            className="w-full object-cover h-48"
          />
        </div>

        {/* Section 4: How to Calculate */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">4. How to Calculate the Deduction (IRS Form 7206)</h2>
          <p className="text-slate-600 leading-relaxed">
            Starting with tax year 2023, the IRS introduced <strong>Form 7206</strong> to consolidate the calculation of the self-employed health insurance deduction. In prior years, this was done on a worksheet in the Form 1040 instructions. For 2026 returns, Form 7206 is the official document you complete before carrying the result to Schedule 1, line 17.
          </p>

          <div className="space-y-3">
            {[
              {
                step: "1",
                label: "Gather total premiums paid",
                detail: "Add up all premiums paid during the year for qualifying coverage—medical, dental, vision, long-term care (within limits), and Medicare if applicable. Include coverage for yourself, spouse, dependents, and children under 27.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                step: "2",
                label: "Identify disqualified months",
                detail: "Review each month of the year. For any month where you or your spouse were eligible for employer-sponsored coverage, mark that month as ineligible. Allocate premiums proportionally across eligible months only.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                step: "3",
                label: "Apply the income limitation",
                detail: "The deduction cannot exceed your net profit from self-employment (after deducting 50% of SE tax). Form 7206 performs this comparison automatically.",
                color: "bg-amber-100 text-amber-700",
              },
              {
                step: "4",
                label: "Account for ACA premium tax credits",
                detail: "If you received advance premium tax credits on your ACA plan, the deductible amount is reduced. Form 7206 walks through this adjustment—see Section 6 below for details.",
                color: "bg-emerald-100 text-emerald-700",
              },
              {
                step: "5",
                label: "Carry result to Schedule 1, line 17",
                detail: "The final calculated amount flows from Form 7206 directly onto Schedule 1, reducing your AGI.",
                color: "bg-slate-100 text-slate-600",
              },
            ].map(({ step, label, detail, color }) => (
              <div key={step} className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <span className="text-base font-bold">{step}</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{label}</h3>
                  <p className="text-sm text-slate-600">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Income Limitation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">5. The Net Income Limitation</h2>
          <p className="text-slate-600 leading-relaxed">
            The deduction cannot exceed your <strong>net self-employment income</strong>—specifically, the profit reported on Schedule C (or your share of partnership income from Schedule K-1), minus the deductible portion of self-employment tax (50% of SE tax). If your business runs at a loss or near breakeven, this limitation bites hard.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Example: Income limitation in practice
            </h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-slate-700 mb-3">Scenario A: No limitation</p>
                <div className="flex justify-between">
                  <span className="text-slate-600">Net Schedule C profit</span>
                  <span className="font-semibold">$90,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Less: 50% of SE tax</span>
                  <span className="font-semibold">($6,358)</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-600">Net SE income for limit</span>
                  <span className="font-semibold text-emerald-600">$83,642</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Annual premiums paid</span>
                  <span className="font-semibold">$14,400</span>
                </div>
                <div className="flex justify-between bg-emerald-50 rounded-lg p-2 mt-2">
                  <span className="text-emerald-700 font-bold">Deductible amount</span>
                  <span className="text-emerald-700 font-bold">$14,400</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-slate-700 mb-3">Scenario B: Limitation applies</p>
                <div className="flex justify-between">
                  <span className="text-slate-600">Net Schedule C profit</span>
                  <span className="font-semibold">$12,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Less: 50% of SE tax</span>
                  <span className="font-semibold">($849)</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-600">Net SE income for limit</span>
                  <span className="font-semibold text-amber-600">$11,151</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Annual premiums paid</span>
                  <span className="font-semibold">$14,400</span>
                </div>
                <div className="flex justify-between bg-amber-50 rounded-lg p-2 mt-2">
                  <span className="text-amber-700 font-bold">Deductible amount (capped)</span>
                  <span className="text-amber-700 font-bold">$11,151</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            The unclaimed portion in Scenario B isn't lost entirely—it may be deductible as an itemized medical expense on Schedule A (subject to the 7.5% AGI floor), though most freelancers won't exceed that threshold.
          </p>
        </section>

        {/* Section 6: ACA Subsidies Interaction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">6. How It Interacts with ACA Subsidies</h2>
          <p className="text-slate-600 leading-relaxed">
            This is where things get genuinely complex. If you purchased insurance through the ACA marketplace and received <strong>Advance Premium Tax Credits (APTC)</strong>—where the government paid part of your premium directly to the insurer each month—your deductible amount is reduced to only the net out-of-pocket portion you actually paid.
          </p>
          <p className="text-slate-600 leading-relaxed">
            You cannot deduct premiums that were covered by a premium tax credit. That would be double-dipping: getting a tax credit <em>and</em> a deduction for the same dollar.
          </p>

          <div className="rounded-xl border border-purple-200 bg-purple-500/10 p-6 space-y-4">
            <h4 className="font-semibold text-purple-700 flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              The circular calculation problem
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              Here's where it gets circular: the self-employed health insurance deduction reduces your AGI, which reduces your MAGI (Modified Adjusted Gross Income), which the ACA uses to calculate your premium tax credit eligibility and amount. A larger deduction means more subsidy. But a larger subsidy means a smaller deduction. These two numbers feed into each other.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              The IRS acknowledges this circular dependency and provides an iterative calculation method in Form 7206 instructions. In practice, most tax software handles this automatically. If you're calculating manually, the IRS provides a worksheet that approximates the solution through iteration—typically converging in 2–3 rounds.
            </p>
            <div className="bg-white/60 rounded-lg p-4 text-sm">
              <p className="font-semibold text-slate-800 mb-2">Practical implication</p>
              <p className="text-slate-600">If you receive ACA subsidies, don't try to calculate this by hand. Use tax software (TurboTax, TaxAct, FreeTaxUSA) that handles the circular calculation automatically, or work with a CPA. Errors here can result in either under-claiming your deduction or under-reconciling your premium tax credit—both of which trigger IRS notices.</p>
            </div>
          </div>
        </section>

        {/* Image break */}
        <div className="rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop"
            alt="Business and corporate planning"
            className="w-full object-cover h-48"
          />
        </div>

        {/* Section 7: S-Corp Special Rules */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">7. S-Corp Owners: The Special Rules</h2>
          <p className="text-slate-600 leading-relaxed">
            If you operate as an S-Corp and own more than 2% of the shares, the deduction process is different—and requires an extra step that many S-Corp owners miss, leading to either missed deductions or payroll compliance issues.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              S-Corp health insurance deduction flow
            </h4>
            <div className="space-y-3">
              {[
                {
                  step: "Step 1",
                  label: "S-Corp pays or reimburses the premiums",
                  detail: "The S-Corp must either pay the premiums directly or reimburse you (the shareholder-employee) for premiums you paid. The company deducts this as a compensation expense.",
                  color: "border-purple-200 bg-purple-50",
                  textColor: "text-purple-700",
                },
                {
                  step: "Step 2",
                  label: "Premiums are added to your W-2 Box 1 wages",
                  detail: "The health insurance premiums must be reported as additional wages in Box 1 of your W-2. They do NOT appear in Boxes 3 or 5 (Social Security and Medicare wages), so no FICA tax is owed on the premium amount.",
                  color: "border-blue-200 bg-blue-50",
                  textColor: "text-blue-700",
                },
                {
                  step: "Step 3",
                  label: "Claim the Schedule 1 deduction",
                  detail: "With the premiums now showing in W-2 Box 1 income, you claim the corresponding Schedule 1, line 17 deduction on your personal Form 1040. The income and deduction effectively net to zero, but you've correctly reported the compensation.",
                  color: "border-emerald-200 bg-emerald-50",
                  textColor: "text-emerald-700",
                },
              ].map(({ step, label, detail, color, textColor }) => (
                <div key={step} className={`rounded-xl border p-4 ${color}`}>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${textColor}`}>{step}</p>
                  <h5 className="font-semibold text-slate-800 mb-1">{label}</h5>
                  <p className="text-sm text-slate-600">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-500/10 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-700 mb-1">Common S-Corp mistake</h4>
              <p className="text-sm text-slate-600">If the S-Corp pays premiums but fails to include them in W-2 Box 1, the shareholder-employee cannot claim the Schedule 1 deduction. This is a W-2 reporting requirement—it cannot be fixed at tax time. If you operate as an S-Corp, verify with your payroll provider that health insurance premiums are being correctly added to Box 1 wages before year-end.</p>
            </div>
          </div>
        </section>

        {/* Section 8: Stacking with HSA */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">8. Stacking with an HSA for Maximum Benefit</h2>
          <p className="text-slate-600 leading-relaxed">
            The self-employed health insurance deduction pairs exceptionally well with a Health Savings Account (HSA) if you're enrolled in a qualifying High Deductible Health Plan (HDHP). These two benefits stack: you deduct your premiums <em>and</em> get an above-the-line deduction for your HSA contributions—creating a compounding tax advantage that employees on employer plans rarely access to the same degree.
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-600/10 p-6">
            <h4 className="font-semibold text-emerald-600 mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5" />
              The stacked deduction in practice (2026 example)
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-emerald-200">
                <span className="text-slate-600">Annual HDHP premium (family)</span>
                <span className="font-semibold text-slate-800">$12,000</span>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-200">
                <span className="text-slate-600">HSA family contribution (2026 limit)</span>
                <span className="font-semibold text-slate-800">$8,550</span>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-200">
                <span className="text-slate-600">Total above-the-line deductions</span>
                <span className="font-semibold text-emerald-700">$20,550</span>
              </div>
              <div className="flex justify-between py-2 bg-emerald-50 rounded-lg px-3 mt-1">
                <span className="text-emerald-800 font-bold">Tax savings at 32% effective rate</span>
                <span className="text-emerald-800 font-bold">~$6,576</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-lg font-bold text-emerald-600">$4,300</p>
              <p className="text-slate-500 mt-1">2026 HSA individual limit</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-lg font-bold text-emerald-600">$8,550</p>
              <p className="text-slate-500 mt-1">2026 HSA family limit</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-lg font-bold text-slate-600">+$1,000</p>
              <p className="text-slate-500 mt-1">Catch-up contribution (age 55+)</p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Beyond the immediate tax savings, the HSA offers a unique benefit for self-employed professionals: unused balances roll over indefinitely, grow tax-free, and after age 65 can be withdrawn for any reason (taxed as ordinary income). This makes the HSA function as a supplemental retirement account if you stay healthy. Freelancers who max their HSA every year for 20+ years often accumulate $200,000+ in tax-free medical funds by retirement.
          </p>

          <p className="text-slate-600 leading-relaxed">
            For more on building an HSA strategy as a freelancer, see our deep-dive guide: <Link href="https://solofi.io/articles/hsa-strategy-freelancers-2026" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">HSA Strategy for Freelancers: The Triple Tax Advantage Explained</Link>.
          </p>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Key Takeaways</h2>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 p-6">
            <ul className="space-y-3">
              {[
                "The self-employed health insurance deduction lets you write off 100% of premiums above-the-line on Schedule 1, line 17—reducing your AGI regardless of whether you itemize.",
                "Medical, dental, vision, long-term care (within IRS limits), and Medicare premiums (age 65+) all qualify. Deductions are available for your spouse and dependents too.",
                "You cannot claim the deduction for months when you or your spouse were eligible for employer-sponsored coverage, or for any premiums covered by ACA premium tax credits.",
                "Use Form 7206 to calculate your deduction for 2026. If you receive ACA subsidies, the calculation is circular—use tax software or a CPA.",
                "The deduction is capped at your net self-employment income (after deducting 50% of SE tax). Low-income years may limit how much you can claim.",
                "S-Corp owners must have premiums added to W-2 Box 1 wages before year-end or they lose the deduction entirely.",
                "Stacking this deduction with a maxed-out HSA (up to $8,550 for families in 2026) can eliminate $15,000–$25,000 of taxable income, saving thousands at typical freelancer tax rates.",
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold flex-shrink-0">{i + 1}.</span>
                  <span className="text-slate-700">{point}</span>
                </li>
              ))}
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
                <li>
                  <Link href="https://solofi.io/articles/health-insurance-for-freelancers-2026" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    Health Insurance for Freelancers: Your Complete 2026 Options Guide
                  </Link>
                </li>
                <li>
                  <Link href="https://solofi.io/articles/hsa-strategy-freelancers-2026" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    HSA Strategy for Freelancers: The Triple Tax Advantage Explained
                  </Link>
                </li>
                <li>
                  <Link href="https://solofi.io/articles/tax-strategies-2026-self-employed" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    Tax Strategies in 2026 for Self-Employed Workers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Free resources</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="https://solofi.io/handbooks/self-employed-tax-handbook" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    Self-Employed Tax Handbook
                  </Link>
                </li>
                <li>
                  <Link href="https://solofi.io/tools" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    Tax Savings Calculator
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-500/10 to-emerald-500/10 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">See your full financial picture</h3>
          <p className="text-slate-500 mb-6">SoloFI helps self-employed professionals model tax scenarios, track net worth, and plan for retirement—all in one place built specifically for freelancers and consultants.</p>
          <Link href="https://solofi.io/dashboard">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Get Started Free
            </Button>
          </Link>
        </div>

      </div>
    </article>
  );
}
