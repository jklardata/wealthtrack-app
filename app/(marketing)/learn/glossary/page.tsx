"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

type GlossaryTerm = {
  term: string;
  definition: string;
  letter: string;
  seeAlso?: string[];
  relatedTool?: { label: string; href: string };
};

const glossaryTerms: GlossaryTerm[] = [
  // A
  {
    term: "Adjusted Gross Income (AGI)",
    definition: "Your total gross income minus specific deductions allowed by the IRS, such as self-employment tax deductions, retirement contributions, and health insurance premiums. AGI is the foundation for calculating your taxable income and many eligibility thresholds.",
    letter: "A",
    seeAlso: ["Self-Employment Tax", "Standard Deduction", "Qualified Business Income (QBI) Deduction"],
    relatedTool: { label: "Tax Calculator", href: "/tax-calculator" },
  },
  {
    term: "Asset Allocation",
    definition: "The strategy of dividing your investment portfolio across different asset categories—stocks, bonds, real estate, and cash—to balance risk and reward based on your goals, risk tolerance, and time horizon.",
    letter: "A",
    seeAlso: ["Asset Location", "Portfolio Rebalancing", "Diversification"],
    relatedTool: { label: "Portfolio Optimizer", href: "/portfolio-optimizer" },
  },
  {
    term: "Asset Location",
    definition: "The practice of strategically placing investments into the most tax-efficient account types. For example, putting high-growth stocks in a Roth IRA (where growth is tax-free) and bonds in a taxable account.",
    letter: "A",
    seeAlso: ["Asset Allocation", "Tax Drag", "Roth IRA", "Traditional IRA"],
    relatedTool: { label: "Portfolio Optimizer", href: "/portfolio-optimizer" },
  },

  // B
  {
    term: "Barista FI",
    definition: "A form of semi-retirement where you achieve partial financial independence and cover basic expenses with investment income, then work part-time to cover remaining costs. Named for the idea of working a low-stress job while your portfolio continues growing.",
    letter: "B",
    seeAlso: ["FIRE (Financial Independence, Retire Early)", "Coast FI", "Safe Withdrawal Rate (SWR)"],
  },
  {
    term: "Basis (Cost Basis)",
    definition: "The original value of an asset for tax purposes, typically what you paid for it. When you sell an asset, your capital gain or loss is calculated as the difference between the sale price and your cost basis.",
    letter: "B",
    seeAlso: ["Capital Gains Tax", "Step-Up in Basis", "Tax-Loss Harvesting"],
  },
  {
    term: "Bracket Filling",
    definition: "A tax optimization strategy where you deliberately realize additional income (e.g., Roth conversions or capital gains) to fill up a lower tax bracket without pushing into the next one, effectively paying taxes at a lower rate than you might in the future.",
    letter: "B",
    seeAlso: ["Tax Bracket", "Roth Conversion", "Marginal Tax Rate"],
    relatedTool: { label: "Tax Bracket Filling", href: "/tax-bracket-filling" },
  },

  // C
  {
    term: "Capital Gains Tax",
    definition: "Tax on the profit from the sale of an asset. Short-term capital gains (assets held under 1 year) are taxed as ordinary income. Long-term capital gains (assets held over 1 year) receive preferential rates of 0%, 15%, or 20%.",
    letter: "C",
    seeAlso: ["Basis (Cost Basis)", "Tax-Loss Harvesting", "Effective Tax Rate"],
  },
  {
    term: "Coast FI",
    definition: "The point at which you have saved enough in retirement accounts that, without adding another dollar, compound growth will carry you to your retirement number by your target retirement age. Once you coast, you only need to cover current living expenses.",
    letter: "C",
    seeAlso: ["FIRE Number", "Compound Interest", "Barista FI"],
    relatedTool: { label: "Early Retirement", href: "/early-retirement" },
  },
  {
    term: "Compound Interest",
    definition: "Earning interest on both your principal and your previously accumulated interest. Over long time horizons, compounding produces exponential growth. A dollar invested at 7% doubles roughly every 10 years.",
    letter: "C",
    seeAlso: ["FIRE Number", "Coast FI"],
  },

  // D
  {
    term: "Deduction (Tax)",
    definition: "An expense you can subtract from your gross income to reduce your taxable income. Common deductions for the self-employed include home office, health insurance premiums, retirement contributions, business travel, and equipment purchases.",
    letter: "D",
    seeAlso: ["Standard Deduction", "Adjusted Gross Income (AGI)", "Qualified Business Income (QBI) Deduction"],
  },
  {
    term: "Diversification",
    definition: "Spreading investments across different asset classes, geographies, sectors, and securities to reduce risk. Different assets don't always move in the same direction, so losses in one area can be offset by gains in another.",
    letter: "D",
    seeAlso: ["Asset Allocation", "Portfolio Rebalancing"],
  },

  // E
  {
    term: "Effective Tax Rate",
    definition: "The average rate at which your income is taxed, calculated by dividing your total tax bill by your taxable income. Contrast with marginal tax rate, which is the rate applied to your last dollar of income.",
    letter: "E",
    seeAlso: ["Marginal Tax Rate", "Tax Bracket"],
    relatedTool: { label: "Tax Calculator", href: "/tax-calculator" },
  },
  {
    term: "Emergency Fund",
    definition: "A reserve of liquid cash set aside to cover unexpected expenses without disrupting investments. Typically 3–6 months of expenses for employees; 6–12 months for self-employed professionals with variable income.",
    letter: "E",
    seeAlso: ["Net Worth"],
  },
  {
    term: "Estimated Taxes (Quarterly)",
    definition: "Payments made to the IRS four times a year to cover taxes on income not subject to withholding. Self-employed individuals typically must pay estimated taxes to avoid underpayment penalties. Due in April, June, September, and January.",
    letter: "E",
    seeAlso: ["Safe Harbor (Tax)", "Self-Employment Tax", "Quarterly Estimated Taxes"],
    relatedTool: { label: "Quarterly Tax Calculator", href: "/quarterly-tax-calculator" },
  },

  // F
  {
    term: "FEIE (Foreign Earned Income Exclusion)",
    definition: "An IRS provision allowing U.S. citizens working abroad to exclude up to $126,500 (2024) of foreign-earned income from U.S. federal taxes, provided they meet either the bona fide residence or physical presence test.",
    letter: "F",
    seeAlso: ["Geo Arbitrage"],
    relatedTool: { label: "Geo Arbitrage", href: "/geo-arbitrage" },
  },
  {
    term: "FIRE (Financial Independence, Retire Early)",
    definition: "A movement and financial strategy centered on saving aggressively—often 50–70% of income—to accumulate a portfolio large enough to live off indefinitely, enabling early retirement well before traditional retirement age.",
    letter: "F",
    seeAlso: ["FIRE Number", "Safe Withdrawal Rate (SWR)", "Coast FI", "Barista FI"],
    relatedTool: { label: "Early Retirement", href: "/early-retirement" },
  },
  {
    term: "FIRE Number",
    definition: "The total portfolio value needed to sustain your lifestyle indefinitely using the 4% safe withdrawal rate rule. Calculated as your annual expenses multiplied by 25. If you spend $60,000/year, your FIRE number is $1,500,000.",
    letter: "F",
    seeAlso: ["Safe Withdrawal Rate (SWR)", "FIRE (Financial Independence, Retire Early)", "Coast FI"],
    relatedTool: { label: "Early Retirement", href: "/early-retirement" },
  },
  {
    term: "Filing Status",
    definition: "Your tax category as defined by the IRS, which determines your tax bracket and standard deduction. Options include Single, Married Filing Jointly, Married Filing Separately, Head of Household, and Qualifying Widow(er).",
    letter: "F",
    seeAlso: ["Tax Bracket", "Standard Deduction"],
  },

  // G
  {
    term: "Geo Arbitrage",
    definition: "The strategy of earning income in a high-cost country or currency while living in a lower-cost country, effectively stretching your purchasing power and accelerating financial independence.",
    letter: "G",
    seeAlso: ["FIRE Number", "FEIE (Foreign Earned Income Exclusion)"],
    relatedTool: { label: "Geo Arbitrage", href: "/geo-arbitrage" },
  },
  {
    term: "Gross Income",
    definition: "Your total income before any deductions, adjustments, or taxes are applied. For self-employed individuals, this includes all revenue earned from business activities.",
    letter: "G",
    seeAlso: ["Adjusted Gross Income (AGI)", "Net Worth"],
  },

  // H
  {
    term: "HSA (Health Savings Account)",
    definition: "A triple-tax-advantaged account for those with high-deductible health plans. Contributions are pre-tax, growth is tax-free, and withdrawals for qualified medical expenses are tax-free. After age 65, funds can be withdrawn for any purpose (taxed as ordinary income).",
    letter: "H",
    seeAlso: ["Tax-Advantaged Account", "Traditional IRA"],
  },

  // I
  {
    term: "Index Fund",
    definition: "A type of mutual fund or ETF designed to replicate the performance of a market index (e.g., S&P 500). Index funds offer broad diversification at low cost and consistently outperform most actively managed funds over long periods.",
    letter: "I",
    seeAlso: ["Diversification", "Asset Allocation", "Tax Drag"],
  },

  // L
  {
    term: "LLC (Limited Liability Company)",
    definition: "A business structure that provides personal liability protection while allowing income to pass through to the owner's personal tax return. Popular among freelancers and consultants for its simplicity and flexibility.",
    letter: "L",
    seeAlso: ["S-Corp Election", "Self-Employment Tax", "Qualified Business Income (QBI) Deduction"],
  },

  // M
  {
    term: "Marginal Tax Rate",
    definition: "The tax rate applied to the last dollar of your income. Due to progressive taxation, higher income is taxed at higher rates, but only the portion that falls within each bracket is taxed at that rate.",
    letter: "M",
    seeAlso: ["Effective Tax Rate", "Tax Bracket", "Bracket Filling"],
    relatedTool: { label: "Tax Calculator", href: "/tax-calculator" },
  },
  {
    term: "Monte Carlo Simulation",
    definition: "A computational technique that runs thousands of random scenarios based on historical data to estimate the probability of various outcomes. In retirement planning, it simulates different market return sequences to estimate the probability your portfolio lasts through retirement.",
    letter: "M",
    seeAlso: ["Sequence of Returns Risk", "Safe Withdrawal Rate (SWR)", "Withdrawal Strategy"],
    relatedTool: { label: "Withdrawal Stress Test", href: "/withdrawal-stress-test" },
  },

  // N
  {
    term: "Net Worth",
    definition: "Your total assets minus your total liabilities. Net worth is the single most important measure of financial health—more meaningful than income—because it reflects accumulated wealth, not just current cash flow.",
    letter: "N",
    seeAlso: ["FIRE Number", "Gross Income"],
    relatedTool: { label: "Net Worth Tracker", href: "/net-worth" },
  },

  // P
  {
    term: "Portfolio Rebalancing",
    definition: "The process of realigning the weightings of your portfolio to maintain your desired asset allocation. Over time, some assets outperform and drift from target percentages; rebalancing restores the original risk profile.",
    letter: "P",
    seeAlso: ["Asset Allocation", "Asset Location", "Tax-Loss Harvesting"],
    relatedTool: { label: "Portfolio Optimizer", href: "/portfolio-optimizer" },
  },

  // Q
  {
    term: "Qualified Business Income (QBI) Deduction",
    definition: "A deduction allowing self-employed individuals and pass-through business owners to deduct up to 20% of their qualified business income from federal taxable income. Subject to income limits and business type restrictions.",
    letter: "Q",
    seeAlso: ["Deduction (Tax)", "S-Corp Election", "Adjusted Gross Income (AGI)"],
  },
  {
    term: "Quarterly Estimated Taxes",
    definition: "IRS Form 1040-ES is used to calculate and submit quarterly tax payments, due in April, June, September, and January. See also: Estimated Taxes (Quarterly).",
    letter: "Q",
    seeAlso: ["Estimated Taxes (Quarterly)", "Safe Harbor (Tax)", "Self-Employment Tax"],
    relatedTool: { label: "Quarterly Tax Calculator", href: "/quarterly-tax-calculator" },
  },

  // R
  {
    term: "Roth Conversion",
    definition: "The process of moving funds from a traditional IRA or 401(k) into a Roth IRA, paying income tax on the converted amount now in exchange for tax-free growth and withdrawals in the future.",
    letter: "R",
    seeAlso: ["Roth IRA", "Traditional IRA", "Bracket Filling"],
    relatedTool: { label: "Roth Conversion", href: "/roth-conversion" },
  },
  {
    term: "Roth IRA",
    definition: "A retirement account funded with after-tax dollars. Investments grow tax-free, and qualified withdrawals in retirement are tax-free. No required minimum distributions during the owner's lifetime.",
    letter: "R",
    seeAlso: ["Traditional IRA", "Roth Conversion", "Asset Location"],
  },
  {
    term: "Rule of 55",
    definition: "An IRS provision allowing people who separate from their employer at or after age 55 to take penalty-free withdrawals from their 401(k) or 403(b) account. Does not apply to IRAs.",
    letter: "R",
    seeAlso: ["FIRE (Financial Independence, Retire Early)", "Withdrawal Strategy"],
  },

  // S
  {
    term: "S-Corp Election",
    definition: "An IRS tax election that allows an LLC to be taxed as an S-Corporation. For self-employed professionals, the key benefit is avoiding self-employment tax on the 'distribution' portion of income above a reasonable salary.",
    letter: "S",
    seeAlso: ["Self-Employment Tax", "LLC (Limited Liability Company)", "Qualified Business Income (QBI) Deduction"],
  },
  {
    term: "Safe Harbor (Tax)",
    definition: "A method that guarantees you won't owe a penalty for underpaying estimated taxes. The IRS safe harbor requires paying either 100% of last year's tax liability (110% if AGI exceeded $150,000) or 90% of the current year's tax.",
    letter: "S",
    seeAlso: ["Estimated Taxes (Quarterly)", "Quarterly Estimated Taxes"],
    relatedTool: { label: "Quarterly Tax Calculator", href: "/quarterly-tax-calculator" },
  },
  {
    term: "Safe Withdrawal Rate (SWR)",
    definition: "The percentage of a portfolio you can withdraw annually while maintaining high confidence the portfolio will last throughout retirement. The commonly cited 4% rule suggests 4% is safe for a 30-year retirement horizon.",
    letter: "S",
    seeAlso: ["FIRE Number", "Monte Carlo Simulation", "Sequence of Returns Risk", "Withdrawal Strategy"],
    relatedTool: { label: "Withdrawal Stress Test", href: "/withdrawal-stress-test" },
  },
  {
    term: "Self-Employment Tax",
    definition: "The 15.3% tax that self-employed individuals pay to fund Social Security (12.4%) and Medicare (2.9%). Employees split this with their employer (7.65% each); the self-employed pay both sides. You can deduct half of SE tax from your AGI.",
    letter: "S",
    seeAlso: ["S-Corp Election", "Adjusted Gross Income (AGI)", "Estimated Taxes (Quarterly)"],
    relatedTool: { label: "Tax Calculator", href: "/tax-calculator" },
  },
  {
    term: "SEP IRA (Simplified Employee Pension)",
    definition: "A retirement account for the self-employed allowing contributions of up to 25% of net self-employment income, or $69,000 (2024), whichever is less. Easy to set up and administer.",
    letter: "S",
    seeAlso: ["Solo 401(k)", "Tax-Advantaged Account"],
  },
  {
    term: "Solo 401(k)",
    definition: "A retirement plan for self-employed individuals with no full-time employees (other than a spouse). Allows both employee contributions (up to $23,000 in 2024) and employer contributions, for a total of up to $69,000. Higher limits than SEP IRA for many income levels.",
    letter: "S",
    seeAlso: ["SEP IRA (Simplified Employee Pension)", "Tax-Advantaged Account", "Roth IRA"],
  },
  {
    term: "Standard Deduction",
    definition: "A flat dollar amount the IRS lets you deduct from your income regardless of actual expenses. In 2024: $14,600 for single filers, $29,200 for married filing jointly, $21,900 for head of household.",
    letter: "S",
    seeAlso: ["Deduction (Tax)", "Filing Status", "Adjusted Gross Income (AGI)"],
  },
  {
    term: "Step-Up in Basis",
    definition: "A tax provision that resets the cost basis of inherited assets to fair market value at the date of the original owner's death, effectively eliminating capital gains taxes on appreciation that occurred during the deceased's lifetime.",
    letter: "S",
    seeAlso: ["Basis (Cost Basis)", "Capital Gains Tax"],
  },
  {
    term: "Sequence of Returns Risk",
    definition: "The risk that poor market returns early in retirement can permanently impair a portfolio, even if long-term average returns are acceptable. Retiring during a downturn forces you to sell assets at depressed prices to fund living expenses.",
    letter: "S",
    seeAlso: ["Monte Carlo Simulation", "Safe Withdrawal Rate (SWR)", "Withdrawal Strategy"],
    relatedTool: { label: "Withdrawal Stress Test", href: "/withdrawal-stress-test" },
  },

  // T
  {
    term: "Tax-Advantaged Account",
    definition: "An investment account that offers tax benefits — either deferred taxes (traditional IRA, 401k) or tax-free growth (Roth IRA, HSA). Maximizing these before investing in taxable accounts is a core principle of tax-efficient investing.",
    letter: "T",
    seeAlso: ["Roth IRA", "Traditional IRA", "HSA (Health Savings Account)", "Solo 401(k)"],
  },
  {
    term: "Tax Bracket",
    definition: "The range of taxable income subject to a specific tax rate. The U.S. uses a progressive system with 7 brackets (10%, 12%, 22%, 24%, 32%, 35%, 37%). Only the income within each bracket is taxed at that rate.",
    letter: "T",
    seeAlso: ["Marginal Tax Rate", "Effective Tax Rate", "Bracket Filling"],
    relatedTool: { label: "Tax Bracket Filling", href: "/tax-bracket-filling" },
  },
  {
    term: "Tax Drag",
    definition: "The reduction in investment returns caused by taxes on dividends, interest, and capital gains in taxable accounts. Minimizing tax drag through asset location and tax-loss harvesting significantly enhances long-term returns.",
    letter: "T",
    seeAlso: ["Asset Location", "Tax-Loss Harvesting", "Index Fund"],
  },
  {
    term: "Tax-Loss Harvesting",
    definition: "Selling investments at a loss to offset capital gains and reduce taxes. Losses offset gains dollar-for-dollar, and up to $3,000 of excess losses can be deducted against ordinary income per year.",
    letter: "T",
    seeAlso: ["Capital Gains Tax", "Basis (Cost Basis)", "Tax Drag"],
  },
  {
    term: "Traditional IRA",
    definition: "A retirement account funded with pre-tax dollars (if you qualify for the deduction), providing a tax deduction now and tax-deferred growth. Withdrawals in retirement are taxed as ordinary income. Required minimum distributions begin at age 73.",
    letter: "T",
    seeAlso: ["Roth IRA", "Roth Conversion", "Asset Location"],
  },

  // W
  {
    term: "W-2 vs 1099",
    definition: "W-2 employees receive wages with taxes withheld and the employer pays half of payroll taxes. 1099 workers (self-employed) receive the full payment and are responsible for all taxes including self-employment tax.",
    letter: "W",
    seeAlso: ["Self-Employment Tax", "S-Corp Election"],
  },
  {
    term: "Withdrawal Strategy",
    definition: "The plan for distributing funds from various accounts in retirement to minimize taxes and maximize portfolio longevity. Optimal sequencing (taxable first, then tax-deferred, then Roth) can add years to a portfolio.",
    letter: "W",
    seeAlso: ["Safe Withdrawal Rate (SWR)", "Sequence of Returns Risk", "Roth IRA", "Traditional IRA"],
    relatedTool: { label: "Withdrawal Stress Test", href: "/withdrawal-stress-test" },
  },
];

const letters = [...new Set(glossaryTerms.map((t) => t.letter))].sort();

export default function LearnGlossaryPage() {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? glossaryTerms.filter(
        (t) =>
          t.term.toLowerCase().includes(search.toLowerCase()) ||
          t.definition.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const displayLetters = filtered
    ? [...new Set(filtered.map((t) => t.letter))].sort()
    : letters;

  const getTerms = (letter: string) =>
    (filtered ?? glossaryTerms).filter((t) => t.letter === letter);

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Documentation</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Glossary</h1>
        <p className="text-slate-600 leading-relaxed">
          Plain-English definitions for the terms that matter most to self-employed professionals and independent earners.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Alphabet nav (hide when searching) */}
      {!search && (
        <div className="flex flex-wrap gap-1 mb-8">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-7 h-7 flex items-center justify-center text-xs font-semibold text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 rounded transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      )}

      {/* Terms */}
      <div className="space-y-10">
        {displayLetters.map((letter) => {
          const terms = getTerms(letter);
          if (terms.length === 0) return null;
          return (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-16">
              {!search && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-slate-900">{letter}</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              )}
              <div className="space-y-5">
                {terms.map((item) => (
                  <div
                    key={item.term}
                    id={`term-${item.term.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`}
                    className="rounded-xl border border-slate-200 p-4 scroll-mt-16"
                  >
                    <h3 className="text-base font-semibold text-slate-900 mb-1.5">{item.term}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{item.definition}</p>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* See Also */}
                      {item.seeAlso && item.seeAlso.length > 0 && (
                        <>
                          <span className="text-xs text-slate-400 font-medium">See also:</span>
                          {item.seeAlso.map((related) => {
                            const relatedTerm = glossaryTerms.find((t) => t.term === related);
                            const anchor = related.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
                            return relatedTerm ? (
                              <a
                                key={related}
                                href={`#term-${anchor}`}
                                className="text-xs bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 px-2 py-1 rounded-md font-medium transition-colors"
                              >
                                {related}
                              </a>
                            ) : null;
                          })}
                        </>
                      )}

                      {/* Related tool */}
                      {item.relatedTool && (
                        <Link
                          href={item.relatedTool.href}
                          className="ml-auto text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md font-medium transition-colors flex-shrink-0"
                        >
                          Try: {item.relatedTool.label} →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filtered && filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">No terms found for "{search}"</p>
        </div>
      )}

      {/* Footer nav */}
      <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-sm">
        <Link
          href="/learn/methodology"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Methodology
        </Link>
        <Link
          href="/sign-up"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Get started free →
        </Link>
      </div>
    </div>
  );
}
