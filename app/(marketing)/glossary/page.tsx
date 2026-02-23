import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financial Glossary | SoloFI",
  description: "A plain-English glossary of financial terms for self-employed professionals, consultants, and independent contractors.",
};

const glossaryTerms = [
  // A
  { term: "Adjusted Gross Income (AGI)", definition: "Your total gross income minus specific deductions allowed by the IRS, such as self-employment tax deductions, retirement contributions, and health insurance premiums. AGI is the foundation for calculating your taxable income and many eligibility thresholds.", letter: "A" },
  { term: "Asset Allocation", definition: "The strategy of dividing your investment portfolio across different asset categories—such as stocks, bonds, real estate, and cash—to balance risk and reward based on your goals, risk tolerance, and time horizon.", letter: "A" },
  { term: "Asset Location", definition: "The practice of strategically placing investments into the most tax-efficient account types. For example, putting high-growth stocks in a Roth IRA (where growth is tax-free) and bonds in a taxable account.", letter: "A" },

  // B
  { term: "Barista FI", definition: "A form of semi-retirement where you achieve partial financial independence and cover basic expenses with investment income, then work part-time (often at a low-stress job) to cover remaining costs. Named for the idea of working a casual barista job.", letter: "B" },
  { term: "Basis (Cost Basis)", definition: "The original value of an asset for tax purposes, typically what you paid for it. When you sell an asset, your capital gain or loss is calculated as the difference between the sale price and your cost basis.", letter: "B" },
  { term: "Bracket Filling", definition: "A tax optimization strategy where you deliberately realize additional income (e.g., Roth conversions or capital gains) to fill up a lower tax bracket without pushing into the next one, effectively paying taxes at a lower rate than you might in the future.", letter: "B" },

  // C
  { term: "Capital Gains Tax", definition: "Tax on the profit from the sale of an asset. Short-term capital gains (assets held under 1 year) are taxed as ordinary income. Long-term capital gains (assets held over 1 year) receive preferential tax rates of 0%, 15%, or 20%.", letter: "C" },
  { term: "Coast FI", definition: "The point at which you have saved enough in retirement accounts that, without adding another dollar, compound growth will carry you to your retirement number by your target retirement age. Once you coast, you only need to cover current living expenses.", letter: "C" },
  { term: "Compound Interest", definition: "Earning interest on both your principal and your previously accumulated interest. Over long time horizons, compounding produces exponential growth—often described as 'the eighth wonder of the world.'", letter: "C" },

  // D
  { term: "Deduction (Tax)", definition: "An expense you can subtract from your gross income to reduce your taxable income. Common deductions for the self-employed include home office, health insurance premiums, retirement contributions, business travel, and equipment purchases.", letter: "D" },
  { term: "Diversification", definition: "Spreading investments across different asset classes, geographies, sectors, and securities to reduce risk. The idea is that different assets don't always move in the same direction, so losses in one area can be offset by gains in another.", letter: "D" },

  // E
  { term: "Effective Tax Rate", definition: "The average rate at which your income is taxed, calculated by dividing your total tax bill by your taxable income. Contrast with marginal tax rate, which is the rate applied to your last dollar of income.", letter: "E" },
  { term: "Emergency Fund", definition: "A reserve of liquid cash—typically 3–6 months of living expenses for employees, and 6–12 months for self-employed professionals with variable income—set aside to cover unexpected expenses without disrupting investments.", letter: "E" },
  { term: "Estimated Taxes (Quarterly)", definition: "Payments you make to the IRS four times a year to cover taxes on income not subject to withholding. Self-employed individuals typically must pay estimated taxes to avoid underpayment penalties.", letter: "E" },

  // F
  { term: "FEIE (Foreign Earned Income Exclusion)", definition: "An IRS provision allowing U.S. citizens working abroad to exclude up to $126,500 (2024) of foreign-earned income from U.S. federal taxes, provided they meet either the bona fide residence or physical presence test.", letter: "F" },
  { term: "FIRE (Financial Independence, Retire Early)", definition: "A movement and financial strategy centered on saving aggressively—often 50–70% of income—to accumulate a portfolio large enough to live off indefinitely, enabling early retirement well before traditional retirement age.", letter: "F" },
  { term: "FIRE Number", definition: "The total portfolio value needed to sustain your lifestyle indefinitely using the 4% safe withdrawal rate rule. Calculated as your annual expenses multiplied by 25.", letter: "F" },
  { term: "Filing Status", definition: "Your tax category as defined by the IRS, which determines your tax bracket and standard deduction. Options include Single, Married Filing Jointly, Married Filing Separately, Head of Household, and Qualifying Widow(er).", letter: "F" },

  // G
  { term: "Geo Arbitrage", definition: "The strategy of earning income in a high-cost country or currency while living in a lower-cost country, effectively stretching your purchasing power and accelerating financial independence.", letter: "G" },
  { term: "Gross Income", definition: "Your total income before any deductions, adjustments, or taxes are applied. For self-employed individuals, this includes all revenue earned from business activities.", letter: "G" },

  // H
  { term: "HSA (Health Savings Account)", definition: "A triple-tax-advantaged account for those with high-deductible health plans. Contributions are pre-tax, growth is tax-free, and withdrawals for qualified medical expenses are tax-free. After age 65, funds can be withdrawn for any purpose (taxed as ordinary income).", letter: "H" },

  // I
  { term: "Index Fund", definition: "A type of mutual fund or ETF designed to replicate the performance of a market index (e.g., S&P 500). Index funds offer broad diversification at low cost, and consistently outperform most actively managed funds over long periods.", letter: "I" },

  // L
  { term: "LLC (Limited Liability Company)", definition: "A business structure that provides personal liability protection (like a corporation) while allowing income to pass through to the owner's personal tax return (like a sole proprietorship). Popular among freelancers and consultants.", letter: "L" },

  // M
  { term: "Marginal Tax Rate", definition: "The tax rate applied to the last dollar of your income. Due to progressive taxation, higher income is taxed at higher rates, but only the portion that falls within each bracket is taxed at that bracket's rate.", letter: "M" },
  { term: "Monte Carlo Simulation", definition: "A computational technique that runs thousands of random scenarios based on historical data to estimate the probability of various outcomes. In retirement planning, it simulates different market return sequences to estimate the probability your portfolio lasts through retirement.", letter: "M" },

  // N
  { term: "Net Worth", definition: "Your total assets minus your total liabilities (debts). Net worth is the single most important measure of financial health—more meaningful than income—because it reflects accumulated wealth, not just current cash flow.", letter: "N" },

  // P
  { term: "Portfolio Rebalancing", definition: "The process of realigning the weightings of your portfolio to maintain your desired asset allocation. Over time, some assets outperform others and drift from target percentages; rebalancing restores the original risk profile.", letter: "P" },

  // Q
  { term: "Qualified Business Income (QBI) Deduction", definition: "A deduction allowing self-employed individuals and pass-through business owners to deduct up to 20% of their qualified business income from federal taxable income. Subject to income limits and business type restrictions.", letter: "Q" },
  { term: "Quarterly Estimated Taxes", definition: "See Estimated Taxes (Quarterly). IRS Form 1040-ES is used to calculate and submit these payments, which are due in April, June, September, and January.", letter: "Q" },

  // R
  { term: "Roth Conversion", definition: "The process of moving funds from a traditional IRA or 401(k) into a Roth IRA, paying income tax on the converted amount now in exchange for tax-free growth and withdrawals in the future.", letter: "R" },
  { term: "Roth IRA", definition: "A retirement account funded with after-tax dollars. Investments grow tax-free, and qualified withdrawals in retirement are tax-free. No required minimum distributions during the owner's lifetime.", letter: "R" },
  { term: "Rule of 55", definition: "An IRS provision allowing people who separate from their employer at or after age 55 to take penalty-free withdrawals from their 401(k) or 403(b) account. Does not apply to IRAs.", letter: "R" },

  // S
  { term: "S-Corp Election", definition: "An IRS tax election that allows a C-Corp or LLC to be taxed as an S-Corporation, avoiding double taxation by passing income directly to shareholders. For self-employed professionals, the key benefit is avoiding self-employment tax on the 'distribution' portion of income above a reasonable salary.", letter: "S" },
  { term: "Safe Harbor (Tax)", definition: "A method that guarantees you won't owe a penalty for underpaying estimated taxes. The IRS safe harbor requires paying either 100% of last year's tax liability (or 110% if AGI exceeded $150,000) or 90% of the current year's tax.", letter: "S" },
  { term: "Safe Withdrawal Rate (SWR)", definition: "The percentage of a portfolio you can withdraw annually while maintaining high confidence the portfolio will last throughout retirement. The commonly cited 4% rule (Trinity Study) suggests 4% is safe for a 30-year retirement horizon.", letter: "S" },
  { term: "Self-Employment Tax", definition: "The 15.3% tax that self-employed individuals pay to fund Social Security (12.4%) and Medicare (2.9%). Employees split this with their employer (7.65% each); the self-employed pay both sides. You can deduct half of SE tax from your AGI.", letter: "S" },
  { term: "SEP IRA (Simplified Employee Pension)", definition: "A retirement account for the self-employed allowing contributions of up to 25% of net self-employment income, or $69,000 (2024), whichever is less. Easy to set up and administer, but contributions are entirely employer-funded.", letter: "S" },
  { term: "Solo 401(k)", definition: "A retirement plan available to self-employed individuals with no full-time employees (other than a spouse). Allows both employee contributions (up to $23,000 in 2024) and employer contributions (up to 25% of net self-employment income), for a total of up to $69,000. Higher contribution limits than SEP IRA for many income levels.", letter: "S" },
  { term: "Standard Deduction", definition: "A flat dollar amount the IRS lets you deduct from your income regardless of actual expenses, simplifying your tax return. In 2024: $14,600 for single filers, $29,200 for married filing jointly.", letter: "S" },
  { term: "Step-Up in Basis", definition: "A tax provision that resets the cost basis of inherited assets to the fair market value at the date of the original owner's death. This effectively eliminates capital gains taxes on appreciation that occurred during the deceased's lifetime.", letter: "S" },
  { term: "Sequence of Returns Risk", definition: "The risk that poor market returns early in retirement can permanently impair a portfolio, even if long-term average returns are acceptable. Retiring during a market downturn forces you to sell assets at depressed prices to fund living expenses.", letter: "S" },

  // T
  { term: "Tax-Advantaged Account", definition: "An investment account that offers tax benefits—either deferred taxes (traditional IRA, 401k) or tax-free growth (Roth IRA, HSA). Maximizing these accounts before investing in taxable accounts is a core principle of tax-efficient investing.", letter: "T" },
  { term: "Tax Bracket", definition: "The range of taxable income subject to a specific tax rate. The U.S. uses a progressive system with 7 brackets (10%, 12%, 22%, 24%, 32%, 35%, 37%). Only the income within each bracket is taxed at that rate—being in a higher bracket doesn't mean all your income is taxed at the higher rate.", letter: "T" },
  { term: "Tax Drag", definition: "The reduction in investment returns caused by taxes on dividends, interest, and capital gains in taxable accounts. Minimizing tax drag through asset location, tax-loss harvesting, and buy-and-hold strategies is a significant source of long-term return enhancement.", letter: "T" },
  { term: "Tax-Loss Harvesting", definition: "Selling investments at a loss to offset capital gains and reduce taxes. Losses can offset gains dollar-for-dollar, and up to $3,000 of excess losses can be deducted against ordinary income per year.", letter: "T" },
  { term: "Traditional IRA", definition: "A retirement account funded with pre-tax dollars (if you qualify for the deduction), providing a tax deduction now and tax-deferred growth. Withdrawals in retirement are taxed as ordinary income. Required minimum distributions begin at age 73.", letter: "T" },

  // W
  { term: "W-2 vs 1099", definition: "W-2 employees receive wages from an employer who withholds taxes and pays half of payroll taxes. 1099 workers (self-employed) receive the full payment and are responsible for all taxes including self-employment tax. The difference significantly affects tax planning.", letter: "W" },
  { term: "Withdrawal Strategy", definition: "The plan for how you will distribute funds from various accounts in retirement to minimize taxes and maximize portfolio longevity. Optimal sequencing (taxable first, then tax-deferred, then Roth) can add years to a portfolio.", letter: "W" },
];

const letters = [...new Set(glossaryTerms.map(t => t.letter))].sort();

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-3">Reference</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Financial Glossary
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
            Plain-English definitions for the terms that matter most to self-employed professionals, consultants, and independent earners.
          </p>
        </div>
      </div>

      {/* Alphabet Nav */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-1 py-3">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {letters.map(letter => {
          const terms = glossaryTerms.filter(t => t.letter === letter);
          return (
            <div key={letter} id={`letter-${letter}`} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-slate-900">{letter}</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <div className="space-y-6">
                {terms.map(({ term, definition }) => (
                  <div key={term} className="group">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                      {term}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-base">
                      {definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Put these concepts to work
          </h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            SoloFI lets you model the tax strategies and retirement scenarios behind these terms with your actual numbers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Get started free
            </Link>
            <Link
              href="/quarterly-tax-calculator"
              className="inline-flex items-center justify-center border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Try a free tool
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <span>© 2026 SoloFI</span>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-slate-700">About</Link>
              <Link href="/contact" className="hover:text-slate-700">Contact</Link>
              <Link href="/blog" className="hover:text-slate-700">Resources</Link>
              <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
