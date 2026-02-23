import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology | SoloFI Documentation",
  description: "How SoloFI calculates retirement projections, FIRE numbers, tax estimates, and more.",
};

const sections = [
  {
    id: "fire-number",
    title: "FIRE Number & FI Progress",
    content: [
      {
        heading: "FIRE Number",
        body: `Your FIRE number is the portfolio size needed to sustain your lifestyle indefinitely using investment returns. SoloFI uses the **25× rule**: multiply your annual expenses by 25. This is derived from the 4% Safe Withdrawal Rate, which historical research (the Trinity Study) shows has a high success rate over 30-year retirement periods.

**Formula:** FIRE Number = Annual Expenses × 25

If you spend $60,000/year, your FIRE number is $1,500,000.`,
      },
      {
        heading: "FI Progress Percentage",
        body: `FI Progress = (Current Net Worth ÷ FIRE Number) × 100

This measures how far along you are toward full financial independence. At 100%, your portfolio is theoretically large enough to sustain your current lifestyle without earned income.`,
      },
      {
        heading: "Years to FI",
        body: `Calculated using the Shockley formula, which accounts for investment growth on existing assets plus ongoing contributions:

**Years to FI** = ln((FI Number × r + savings_rate) ÷ (net_worth × r + savings_rate)) ÷ ln(1 + r)

Where r is the assumed real annual return rate (default: 7%). This formula is more accurate than simple linear projection because it accounts for compound growth on both existing assets and new contributions.`,
      },
    ],
  },
  {
    id: "quarterly-taxes",
    title: "Quarterly Estimated Taxes",
    content: [
      {
        heading: "Self-Employment Tax",
        body: `Self-employed individuals pay both the employee and employer portions of FICA taxes, totaling 15.3% on net self-employment income.

**SE Tax = Net SE Income × 0.9235 × 0.153**

The 0.9235 multiplier (= 1 - 0.0765) accounts for the fact that the tax is computed on 92.35% of net earnings, which represents the "employer's share" deduction.

The first $168,600 (2024) of net SE income is subject to the full 15.3%. Income above that threshold is subject only to the Medicare component (2.9%).`,
      },
      {
        heading: "Federal Income Tax Estimate",
        body: `Federal income tax is calculated using IRS progressive tax brackets. SoloFI applies the correct brackets for each filing status (Single, Married Filing Jointly, Head of Household).

**Taxable income** = Gross Income − Business Expenses − ½ SE Tax Deduction − Standard Deduction

The ½ SE Tax Deduction accounts for the IRS-allowed deduction of 50% of self-employment tax from gross income, reducing your federal income tax base.

**Standard Deductions (2024):** Single: $14,600 · MFJ: $29,200 · HOH: $21,900`,
      },
      {
        heading: "Safe Harbor Rules",
        body: `To avoid IRS underpayment penalties, your quarterly estimated payments must satisfy one of:

1. **90% rule:** Pay at least 90% of the current year's tax liability
2. **100%/110% rule:** Pay 100% of last year's tax liability (110% if prior year AGI > $150,000)

The safer approach for high earners with variable income is to pay 110% of prior year tax, which guarantees penalty protection regardless of current-year income fluctuations.`,
      },
    ],
  },
  {
    id: "retirement-calc",
    title: "Retirement Calculator",
    content: [
      {
        heading: "Portfolio Projection",
        body: `SoloFI projects retirement portfolio growth using compound interest:

**Future Value = PV × (1 + r)^n + PMT × ((1 + r)^n − 1) ÷ r**

Where PV is current portfolio value, r is the expected annual return rate, n is years to retirement, and PMT is annual contributions.

Default assumptions: 7% nominal return (approximately 5% real after 2% inflation). We recommend users test sensitivity across 5–9% to understand the range of outcomes.`,
      },
      {
        heading: "Withdrawal Sustainability",
        body: `After retirement, portfolio sustainability is tested using historical return sequences. SoloFI uses the **sequence-of-returns** framework: the same average return can produce very different outcomes depending on whether poor returns occur early (devastating) or late (manageable) in retirement.

The Withdrawal Stress Test runs **Monte Carlo simulations** with 10,000 random return sequences drawn from historical distributions, reporting the percentage of scenarios in which the portfolio survives the full retirement horizon.`,
      },
    ],
  },
  {
    id: "roth-conversion",
    title: "Roth Conversion Break-Even",
    content: [
      {
        heading: "How the Model Works",
        body: `A Roth conversion trades taxes today for tax-free growth later. The break-even analysis determines when the tax-free compounding benefit exceeds the upfront tax cost.

**Step 1:** Calculate the tax owed on the converted amount at today's marginal rate.
**Step 2:** Project both the Roth account (tax-free growth) and the equivalent Traditional account (tax-deferred growth, future withdrawals taxed at projected future rate) over the investment horizon.
**Step 3:** Find the crossover year where the Roth's after-tax value exceeds the Traditional's after-tax value.

Conversions are most advantageous when: your current marginal rate is lower than your projected retirement rate, you're in a low-income year (early retirement, career transition), or you expect tax rates to rise.`,
      },
    ],
  },
  {
    id: "net-worth",
    title: "Net Worth Tracking",
    content: [
      {
        heading: "Asset Categories",
        body: `SoloFI tracks six asset classes:
- **Stocks:** Public equity (brokerage, retirement accounts)
- **Bonds:** Fixed income
- **Cash:** Checking, savings, money market
- **Real Estate:** Property value (market value minus mortgage)
- **Points:** Credit card and travel rewards (converted to dollar value)
- **Other:** Business equity, collectibles, other assets

**Net Worth = Total Assets − Total Liabilities**

Liabilities (mortgage, student loans, credit card balances) are tracked separately and subtracted.`,
      },
      {
        heading: "Momentum & Velocity",
        body: `Net worth velocity = the monthly rate of change, expressed as an annualized trend. SoloFI fits a linear regression to your last 12 months of data to smooth month-to-month noise and estimate your true wealth-building velocity.

A positive, accelerating velocity indicates strong wealth momentum. A flat or declining velocity signals that income is being consumed rather than accumulated.`,
      },
    ],
  },
  {
    id: "geo-arb",
    title: "Geo Arbitrage Calculator",
    content: [
      {
        heading: "Methodology",
        body: `The geo arbitrage tool uses Purchasing Power Parity (PPP) and cost-of-living indices to compare what a given lifestyle costs across different countries.

**Adjusted FIRE Number** = US Annual Expenses × COL Ratio × 25

If US expenses are $80,000/year but your target country's COL ratio is 0.45 (45% of US cost), your adjusted annual need is $36,000, giving a FIRE number of $900,000 instead of $2,000,000.

COL ratios are sourced from Numbeo and updated periodically. Exchange rate risk is not modeled — maintain income in USD for best results.`,
      },
    ],
  },
];

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Documentation</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Methodology</h1>
        <p className="text-slate-600 leading-relaxed">
          How SoloFI calculates its estimates — the formulas, assumptions, and reasoning behind each tool.
        </p>
      </div>

      {/* Table of contents */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-10">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">On this page</p>
        <div className="space-y-1.5">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block text-sm text-emerald-700 hover:text-emerald-800 font-medium"
            >
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-14">
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 mb-5 pb-3 border-b border-slate-200">
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.content.map((item) => (
                <div key={item.heading}>
                  <h3 className="text-base font-semibold text-slate-800 mb-2">{item.heading}</h3>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    {item.body.split("\n\n").map((para, i) => {
                      // Handle bold markdown
                      const parts = para.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={i}>
                          {parts.map((part, j) =>
                            part.startsWith("**") && part.endsWith("**") ? (
                              <strong key={j} className="font-semibold text-slate-800">
                                {part.slice(2, -2)}
                              </strong>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-5">
        <p className="text-sm font-semibold text-amber-900 mb-1">Not financial advice</p>
        <p className="text-sm text-amber-800">
          SoloFI is a planning and modeling tool. All projections are estimates based on assumptions that may not reflect your actual circumstances. Consult a qualified CPA or financial planner for personalized advice.
        </p>
      </div>

      {/* Footer nav */}
      <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center text-sm">
        <Link
          href="/learn"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Overview
        </Link>
        <Link
          href="/learn/glossary"
          className="flex items-center gap-1.5 text-emerald-700 font-medium hover:text-emerald-800"
        >
          Glossary
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
