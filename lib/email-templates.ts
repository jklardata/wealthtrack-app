export function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SoloFI</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border:2px solid #000000;border-radius:2px;max-width:580px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:2px solid #000000;">
              <span style="font-size:20px;font-weight:900;color:#000000;letter-spacing:-0.5px;">SoloFI</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:2px solid #000000;">
              <p style="margin:0;font-size:12px;color:#666666;line-height:1.5;">
                SoloFI · Built for self-employed professionals<br />
                <a href="https://solofi.io" style="color:#000000;">solofi.io</a> ·
                <a href="{{unsubscribe_url}}" style="color:#666666;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function p(text: string): string {
  return `<p style="margin:0 0 18px;font-size:16px;color:#111111;line-height:1.65;">${text}</p>`
}

function signature(name: string = 'Justin'): string {
  return `
    <p style="margin:24px 0 0;font-size:16px;color:#111111;line-height:1.65;">
      ${name}<br />
      <span style="color:#666666;font-size:14px;">Founder, SoloFI</span>
    </p>
  `
}

function ctaButton(text: string, url: string): string {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#000000;border-radius:2px;">
          <a href="${url}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-0.2px;">${text}</a>
        </td>
      </tr>
    </table>
  `
}

// ---- Lead Magnet: Self Employment Checklist ----
export function freelanceChecklistWelcomeHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Here\'s your Self Employment Financial Checklist—30+ tasks to get your finances set up the right way when going self-employed.')}
    ${ctaButton('Open the Checklist →', 'https://solofi.io/tools/freelance-checklist')}
    ${p('It covers everything: business structure, banking, taxes, retirement, insurance, and your first 90 days. Work through it in order and you won\'t miss a thing.')}
    ${p('I\'ll also send you a couple more tips over the next week on the financial side of self-employment—things most people figure out too late.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet: Freelancer Banking Setup Guide ----
export function bankingSetupWelcomeHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Here\'s your personalized Freelancer Banking Setup Guide—the exact accounts to open, in the right order, so your money is always in the right place.')}
    ${ctaButton('View Your Banking Plan →', 'https://solofi.io/tools/banking-setup')}
    ${p('Most freelancers use one account for everything and wonder why they always feel broke before tax time. A simple 3-account system fixes that permanently.')}
    ${p('I\'ll send a couple more tips this week on managing cash flow and taxes when self-employed.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet: Financial Independence Calculator ----
export function fiCalculatorWelcomeHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Your FI comparison is ready—including your FI number, current trajectory, and the scenarios that could get you there faster.')}
    ${ctaButton('View Your FI Comparison →', 'https://solofi.io/tools/fi-calculator')}
    ${p('The biggest levers for self-employed folks are usually the same: savings rate, tax optimization, and income growth. The comparison shows you exactly which one moves the needle most for your situation.')}
    ${p('I\'ll follow up with a few more tips on building wealth as a self-employed professional.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet: Roth Conversion Ladder Calculator ----
export function rothConversionWelcomeHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Your Roth conversion ladder strategy is ready. This is one of the most powerful tools self-employed people have for accessing retirement funds early—and most people never use it.')}
    ${ctaButton('View Your Strategy →', 'https://solofi.io/tools/roth-conversion')}
    ${p('The key is starting conversions early enough for the 5-year clock to work in your favor. The calculator shows you exactly when and how much to convert each year.')}
    ${p('I\'ll send more tips on tax-efficient retirement planning for self-employed professionals this week.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet: Tax Savings Calculator ----
export function taxSavingsWelcomeHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Your tax savings breakdown is ready. If the number surprised you, you\'re not alone—most self-employed people significantly overpay in taxes before they know the right moves.')}
    ${ctaButton('View Your Tax Breakdown →', 'https://solofi.io/tools/tax-savings')}
    ${p('The biggest opportunities are usually: Solo 401k contributions, S-Corp election (if income is high enough), and the QBI deduction. The breakdown shows which apply to your situation.')}
    ${p('I\'ll follow up with more on how to actually implement these savings.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet: Net Worth Quiz ----
export function netWorthQuizWelcomeHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Your net worth tracking results are in. Wherever you scored, the next step is building a system that makes tracking automatic—so you always know where you stand.')}
    ${ctaButton('See Your Results →', 'https://solofi.io/tools/net-worth-quiz')}
    ${p('SoloFI tracks your net worth over time with no bank linking required—just your numbers, updated when you want. It takes about 5 minutes to set up.')}
    ${ctaButton('Track Your Net Worth →', 'https://solofi.io/dashboard')}
    ${p('I\'ll send a couple of tips this week on building wealth as a self-employed professional.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet: S-Corp Decision Calculator ----
export function scorpCalculatorWelcomeHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Your S-Corp analysis is ready. Whether it recommended S-Corp status or not, the decision comes down to one number: does the self-employment tax savings exceed the added compliance costs?')}
    ${ctaButton('View Your S-Corp Analysis →', 'https://solofi.io/tools/scorp-calculator')}
    ${p('If S-Corp was recommended, the next step is figuring out a reasonable salary and setting up payroll. If not, revisit the calculator when your net profit crosses $80K—that\'s usually the inflection point.')}
    ${p('I\'ll send more on S-Corp strategy and self-employed tax optimization this week.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet: FEIE Eligibility Checker ----
export function feieCheckerWelcomeHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Your FEIE eligibility results are ready. The Foreign Earned Income Exclusion can shelter over $126K of income from US taxes—but the rules are strict and the paperwork matters.')}
    ${ctaButton('View Your Eligibility Results →', 'https://solofi.io/tools/feie-checker')}
    ${p('If you qualified: file Form 2555 with your return and make sure your documentation of physical presence or bona fide residence is solid. If you\'re borderline: track your exact travel dates carefully—days count.')}
    ${p('I\'ll follow up with more on the tax side of working internationally as a self-employed professional.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet: Quarterly Tax Estimator ----
export function quarterlyTaxWelcomeHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Your quarterly tax estimate is ready. Missing these payments—or underpaying—triggers IRS penalties that compound fast. This breakdown tells you exactly what to set aside.')}
    ${ctaButton('View Your Quarterly Breakdown →', 'https://solofi.io/tools/quarterly-tax')}
    ${p('The safest approach: put your estimated amount into a dedicated tax reserve account immediately when income comes in. That way it\'s never "spent" by accident.')}
    ${p('The due dates to remember: April 15, June 15, September 15, January 15.')}
    ${p('I\'ll send more tips on managing taxes as a self-employed professional this week.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet: Freelance Rate Calculator ----
export function rateCalculatorWelcomeHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Your freelance rate breakdown is ready. Most freelancers undercharge because they only think about hourly income—not taxes, benefits, downtime, and overhead. This calculator accounts for all of it.')}
    ${ctaButton('View Your Rate Breakdown →', 'https://solofi.io/tools/rate-calculator')}
    ${p('If the minimum viable rate feels high, remember: you\'re paying self-employment tax (15.3%), your own health insurance, retirement, and covering unpaid time. The math is real.')}
    ${p('I\'ll send more on pricing strategy and the financial side of freelancing this week.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Email 1: Day 0 — Welcome ----
export function email1Html(firstName: string | null): string {
  const name = firstName || 'there'
  const body = `
    ${p(`Hey ${name},`)}
    ${p('Welcome to SoloFI. You signed up because you want clarity on your finances, not more noise. So let\'s start with your asset allocation breakdown.')}
    ${p('Update your details and SoloFI can optimize your portfolio automatically.')}
    ${ctaButton('Update your asset allocation →', 'https://solofi.io/dashboard')}
    ${p('It takes 5 minutes. No bank linking. No permissions. Just your numbers.')}
    ${p('Want to understand the numbers behind your finances? The <a href="https://solofi.io/learn" style="color:#000000;font-weight:700;">Learn</a> section has guides on taxes, S-Corps, retirement, and more—written for self-employed professionals, not accountants.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Email 2: Day 3 — Self-Employed Financial Checklist ----
export function email2Html(firstName: string | null): string {
  const name = firstName || 'there'
  const body = `
    ${p(`Hey ${name},`)}
    ${p('Most people go self-employed and wing the financial side. They pick up a business account here, figure out taxes later, and hope it all works out.')}
    ${p('It usually doesn\'t—at least not efficiently.')}
    ${p('The Self-Employed Financial Checklist walks you through exactly what to set up: business banking, tax accounts, retirement, insurance, and more. In the right order, so nothing falls through the cracks.')}
    ${ctaButton('Get the Checklist →', 'https://solofi.io/freelance-checklist')}
    ${p('Takes 10 minutes to read. Saves you from the mistakes most freelancers make in year one.')}
    ${p('Want to go deeper on taxes? Read the <a href="https://app.solofi.io/handbooks/self-employed-tax-handbook" style="color:#000000;font-weight:700;">Self-Employed Tax Handbook</a>—covers everything from quarterly estimates to deductions to S-Corp strategy.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Email 3: Day 7 — Soft sell / Trajectory ----
export function email3Html(firstName: string | null): string {
  const name = firstName || 'there'
  const body = `
    ${p(`Hey ${name},`)}
    ${p('Most self-employed professionals have no idea if they\'re actually building wealth—or just staying busy.')}
    ${p('SoloFI\'s Trajectory tool shows you exactly where you\'re headed based on your current net worth, savings rate, and timeline. No guesswork.')}
    ${ctaButton('Check your trajectory →', 'https://solofi.io/dashboard')}
    ${p('If the number looks off, that\'s usually a signal to look at three things: your tax setup, your retirement contributions, and your rate.')}
    ${p('We cover all three inside SoloFI. Some tools are free, and Pro unlocks the deeper modeling if you ever need it.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet Nurture: Day 3 (source-aware) ----

// freelance_checklist — cash flow / 3-account system
export function leadMagnetDay3FreelanceChecklistHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Quick one—the most common financial mistake I see self-employed people make in year one:')}
    ${p('They treat all income as take-home pay.')}
    ${p('No tax reserve. No retirement contributions. No buffer for slow months. Just revenue hitting a checking account and going right back out.')}
    ${p('By the time quarterly taxes are due, the money is gone.')}
    ${p('The fix is simple: three accounts, automatic transfers, done once.')}
    ${p('<strong>Operating account</strong> — your "business checking." All revenue comes in here.<br /><strong>Tax reserve</strong> — auto-transfer 28–30% of every payment immediately.<br /><strong>Personal pay</strong> — pay yourself a fixed amount monthly, like a salary.')}
    ${p('That structure alone eliminates 90% of the cash flow stress freelancers deal with.')}
    ${p('SoloFI tracks all of it in one place—net worth, savings rate, trajectory—so you always know where you stand. Free to start, no bank linking required.')}
    ${ctaButton('Try SoloFI free →', 'https://solofi.io/sign-up')}
    ${signature()}
  `
  return emailWrapper(body)
}

// banking_setup — skip the 3-account system (they know it), talk quarterly taxes
export function leadMagnetDay3BankingSetupHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Now that your banking structure is set up, the next thing to get right: quarterly taxes.')}
    ${p('The IRS expects self-employed people to pay taxes four times a year—April 15, June 15, September 15, January 15. Miss them and you get hit with underpayment penalties on top of whatever you owe.')}
    ${p('The easiest way to stay compliant: the safe harbor rule. Pay at least 100% of last year\'s total tax bill (110% if you earned over $150K), split across four payments. Do that and you\'re penalty-proof regardless of what you earn this year.')}
    ${p('If your income is variable—which it usually is when you\'re self-employed—estimate each quarter based on actual earnings rather than guessing. SoloFI\'s quarterly tax estimator does the math for you.')}
    ${ctaButton('Estimate your quarterly taxes →', 'https://solofi.io/tools/quarterly-tax')}
    ${signature()}
  `
  return emailWrapper(body)
}

// fi_calculator — savings rate is the biggest lever
export function leadMagnetDay3FiCalculatorHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('You ran your FI numbers, so you\'ve seen the projections. Here\'s the thing most people miss when they look at those numbers:')}
    ${p('Income matters less than savings rate.')}
    ${p('A person earning $80K and saving 40% will reach FI faster than someone earning $200K and saving 10%. The math is unambiguous.')}
    ${p('For self-employed people, the savings rate lever is actually more powerful than for employees—because you control both sides. You can raise your income <em>and</em> optimize your tax bill at the same time.')}
    ${p('The two biggest tax moves that directly increase your savings rate:<br /><strong>Solo 401k</strong> — contribute up to $70K/year as both employer and employee. Reduces taxable income dollar for dollar.<br /><strong>S-Corp election</strong> — split income between salary and distributions to cut self-employment tax. Worth ~$5–15K/year for most people earning over $80K net.')}
    ${p('SoloFI models both scenarios so you can see the actual impact on your trajectory.')}
    ${ctaButton('Model your trajectory →', 'https://solofi.io/sign-up')}
    ${signature()}
  `
  return emailWrapper(body)
}

// roth_conversion_calculator — the 5-year rule and why starting early matters
export function leadMagnetDay3RothConversionHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('If you\'re building a Roth conversion ladder, there\'s one rule that catches most people off guard:')}
    ${p('Every conversion starts its own 5-year clock.')}
    ${p('That means money you convert today can\'t be withdrawn penalty-free until 5 years from now. It\'s not one rolling 5-year window—it\'s a separate clock for every conversion you do.')}
    ${p('The practical implication: you need to start conversions at least 5 years before you plan to access the money. Most people wait until they\'re already retired and then realize they\'re locked out for another five years.')}
    ${p('The other thing worth knowing: the best years to convert are low-income years—before Social Security kicks in, before RMDs start, or during any gap year in your career. Those are the windows where you can convert at the lowest tax rates.')}
    ${p('SoloFI\'s Roth ladder calculator maps your conversion schedule year by year so you can see exactly when each tranche becomes accessible.')}
    ${ctaButton('Plan your Roth ladder →', 'https://solofi.io/tools/roth-conversion')}
    ${signature()}
  `
  return emailWrapper(body)
}

// tax_calculator_lead_magnet — QBI deduction and S-Corp
export function leadMagnetDay3TaxSavingsHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('You\'ve seen your potential tax savings number. Here\'s how most self-employed people actually capture it:')}
    ${p('<strong>1. The QBI deduction</strong> — if you\'re a sole proprietor or single-member LLC, you may qualify to deduct up to 20% of your qualified business income. No extra paperwork, no entity change required. This alone is worth thousands for most freelancers.')}
    ${p('<strong>2. Solo 401k contributions</strong> — you can contribute as both the employee (up to $23,500) and the employer (up to 25% of net self-employment income), for a combined limit of $70,000 in 2025. Every dollar reduces your taxable income.')}
    ${p('<strong>3. S-Corp election</strong> — once your net profit consistently exceeds $80K, electing S-Corp status lets you split income between a W-2 salary and distributions. Only the salary portion is subject to self-employment tax (15.3%). The savings compound fast.')}
    ${p('Most people implement these in that order as their income grows. SoloFI models all three and shows you the combined impact.')}
    ${ctaButton('See your full tax picture →', 'https://solofi.io/sign-up')}
    ${signature()}
  `
  return emailWrapper(body)
}

// net_worth_quiz — why tracking net worth monthly changes behavior
export function leadMagnetDay3NetWorthQuizHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Here\'s something counterintuitive about net worth tracking:')}
    ${p('The act of measuring it regularly changes your financial behavior—even if you don\'t do anything differently.')}
    ${p('It\'s the same reason people who weigh themselves daily lose more weight than people who don\'t. Visibility creates accountability.')}
    ${p('For self-employed people specifically, monthly net worth tracking does something else: it smooths out the emotional volatility of variable income. A bad revenue month feels less catastrophic when you can see that your overall net worth is still trending up.')}
    ${p('The practical setup: pick the same day each month, update your assets and liabilities, log it. Takes 10 minutes. SoloFI stores the history and shows the trend over time—no bank linking, just your numbers.')}
    ${ctaButton('Start tracking your net worth →', 'https://solofi.io/sign-up')}
    ${signature()}
  `
  return emailWrapper(body)
}

// scorp_calculator — reasonable compensation and how to set your salary
export function leadMagnetDay3ScorpCalculatorHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('If your S-Corp analysis came back positive, the next question is the one that determines how much you actually save:')}
    ${p('What\'s your reasonable compensation?')}
    ${p('The IRS requires S-Corp owner-employees to pay themselves a "reasonable salary" before taking distributions. Too low and you\'re audit bait. Too high and you lose the tax advantage entirely.')}
    ${p('A rough rule of thumb: your salary should reflect what you\'d pay someone else to do the work you do. For most solo consultants, that\'s 40–60% of net profit. So if you net $150K, a salary in the $60–90K range is generally defensible.')}
    ${p('The savings come from the distribution portion—that amount avoids self-employment tax (15.3%). On a $50K distribution, that\'s $7,650 back in your pocket every year.')}
    ${p('SoloFI\'s S-Corp optimizer models different salary levels so you can find the right balance between tax savings and audit risk.')}
    ${ctaButton('Optimize your S-Corp salary →', 'https://solofi.io/sign-up')}
    ${signature()}
  `
  return emailWrapper(body)
}

// feie_checker — Form 2555 and what to document
export function leadMagnetDay3FeieCheckerHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('If you qualified for the FEIE, here\'s what to actually do with that result:')}
    ${p('The exclusion doesn\'t apply automatically—you have to elect it by filing <strong>Form 2555</strong> with your US tax return. First-time filers often miss this.')}
    ${p('Two things to document carefully:<br /><strong>Physical presence test</strong> — you need 330 full days outside the US in any 12-month period. Keep a travel log with entry/exit dates. Passport stamps help but aren\'t enough on their own.<br /><strong>Bona fide residence</strong> — requires establishing actual residency in a foreign country for a full tax year. More durable but harder to prove.')}
    ${p('One thing most people don\'t realize: the FEIE excludes earned income but not self-employment tax. You still owe SE tax on the excluded income unless you also live in a country with a US totalization agreement (which eliminates double Social Security contributions).')}
    ${p('SoloFI models the full picture—FEIE, SE tax, and geo-arbitrage scenarios—so you can see the actual after-tax impact of where you live.')}
    ${ctaButton('Model your expat tax scenario →', 'https://solofi.io/sign-up')}
    ${signature()}
  `
  return emailWrapper(body)
}

// quarterly_tax_estimator — safe harbor and avoiding penalties
export function leadMagnetDay3QuarterlyTaxHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('Now that you have your quarterly estimate, here\'s the most important thing to know about actually paying it:')}
    ${p('You don\'t have to be exact—you just have to clear the safe harbor threshold.')}
    ${p('The IRS won\'t penalize you for underpaying this year\'s taxes as long as you pay at least <strong>100% of last year\'s total tax liability</strong> (110% if your AGI was over $150K). Split that number across four equal payments and you\'re penalty-proof.')}
    ${p('This is useful when income is unpredictable. Instead of trying to guess what you\'ll earn this year, just look at last year\'s tax bill, divide by four, and pay that. Adjust at filing.')}
    ${p('The other thing to set up: a dedicated tax reserve account. Auto-transfer 28–30% of every payment you receive into it immediately. That way the money is always there when quarterly deadlines hit.')}
    ${p('SoloFI tracks your income, estimates your quarterly liability, and shows how it affects your overall financial trajectory.')}
    ${ctaButton('Track your full financial picture →', 'https://solofi.io/sign-up')}
    ${signature()}
  `
  return emailWrapper(body)
}

// rate_calculator — the real cost of undercharging
export function leadMagnetDay3RateCalculatorHtml(): string {
  const body = `
    ${p('Hey,')}
    ${p('You\'ve seen your minimum viable rate. Here\'s why most freelancers charge less than that and what it actually costs them:')}
    ${p('When you undercharge, you can\'t afford to be selective. You take bad clients because you need the revenue. Bad clients take more time, create more stress, and leave less capacity for good work. It\'s a trap that compounds.')}
    ${p('The counterintuitive move: raise your rate before you feel ready. A higher rate filters out low-quality clients automatically. The ones who stay are usually easier to work with and more respectful of your time.')}
    ${p('A few things that make rate increases easier:<br /><strong>Anchor high in proposals</strong> — quote your target rate, then offer a scope reduction if needed. Never discount the rate itself.<br /><strong>Raise with new clients first</strong> — test the new rate on prospects before rolling it to existing clients.<br /><strong>Track utilization</strong> — if you\'re booked more than 80% of the time, you\'re underpriced.')}
    ${p('SoloFI tracks your net worth and savings rate so you can see in real time whether your rate is actually building wealth.')}
    ${ctaButton('Track your financial progress →', 'https://solofi.io/sign-up')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Lead Magnet Nurture: Day 7 — Direct CTA ----
export function leadMagnetDay7Html(): string {
  const body = `
    ${p('Hey,')}
    ${p('Last email from me for a while—wanted to make sure you actually know what SoloFI does before I go quiet.')}
    ${p('It\'s a financial dashboard built specifically for self-employed people. Here\'s what it tracks:')}
    ${p('<strong>Net worth</strong> — updated whenever you want, no bank linking<br /><strong>Trajectory</strong> — are you on track to retire when you want?<br /><strong>S-Corp optimizer</strong> — how much could you save in self-employment tax?<br /><strong>FEIE eligibility</strong> — do you qualify to exclude foreign earned income from US taxes?<br /><strong>Retirement tools</strong> — Roth ladder planning, geo-arbitrage modeling, Monte Carlo simulation<br /><strong>Tax tools</strong> — quarterly estimates, deduction tracking, savings calculator')}
    ${p('Most of it is free. Pro unlocks the deeper modeling if you want it.')}
    ${p('Takes about 5 minutes to set up. No accountant required.')}
    ${ctaButton('Get started free →', 'https://solofi.io/sign-up')}
    ${p('If you ever have questions, just reply to this email.')}
    ${signature()}
  `
  return emailWrapper(body)
}
